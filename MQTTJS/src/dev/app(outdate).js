const mqtt = require("mqtt");
const mysql = require('mysql2');
const Database = require('better-sqlite3');
require('dotenv').config()
//node cache
const NodeCache = require("node-cache");
const myCache = new NodeCache();

// Create the connection to database
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    port: process.env.PORT,
    password: process.env.PASSWORD,
});

connection.addListener('error', (err) => {
    console.log(err);
});

const options = {
    host: '192.168.3.41',
    port: 1883,
    username: 'admin',
    password: '123456789',
    clientId: 'esp32_' + Math.random().toString(8).substring(2, 11)
};
const client = mqtt.connect(options);

// for test only
const mockUpDataDownlink = [
    {
        "id": 1,
        "waterpump_name": "waterpump1",
        "status": 1,
        "details": "ปั้มน้ำ 1",
    },
    {
        "id": 2,
        "waterpump_name": "waterpump2",
        "status": 0,
        "details": "ปั้มน้ำ 2",
    },
]

const DownLinkFunc = () => {
    client.subscribe("test/downlink", (err) => {
        if (!err) {
            client.publish("test/downlink", "donwlink data ok!");
        }
    });
}
const GetOnOffPumps = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM `OnOffWaterPumps`', (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results)

            }
        });
    });

}

client.on("connect", async () => {
    setInterval( () => {
        GetOnOffPumps().then((data) => {
            //console.log(data)
            data.forEach(element => {
                const jsonString = {
                    id: element.id,
                    status: element.status
                  };
                const sourceData = JSON.stringify(jsonString);
                client.publish("ESP32/NODE2",sourceData)
            });;
        }).catch(err => { console.log(err) });
    }, 1000);
});
client.on("message", (topic, message) => {
    // message is Buffer
    console.log(message.toString());
    client.end();
});