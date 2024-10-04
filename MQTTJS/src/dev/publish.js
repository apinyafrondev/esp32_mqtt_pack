const mqtt = require("mqtt");
const mysql = require('mysql2');
require('dotenv').config()
const options = {
    host: '192.168.x.xx',
    port: 1883,
    username: 'mqtt_xxx',
    password: 'xxx',
    clientId: 'esp32_' + Math.random().toString(8).substring(2, 11)
  };
  const client = mqtt.connect(options);
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
  const GetOnOffPumps = () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM `OnOffWaterPumps`', (err, results) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(results);
        }
      });
    });
  }
  client.on("connect",async()=>{
   setInterval(() => {
     GetOnOffPumps().then((data) => {
         console.log(data)
         data.forEach(element => {
             const jsonString = {
                 id: element.id,
                 status: element.status
               };
             const sourceData = JSON.stringify(jsonString);
             client.publish("ESP32/NODE1/downlink/pumps",sourceData)
         });;
     }).catch(err => { console.log(err) });
   }, 2000);
  })
  client.on('message', async (topic, message) => {
    console.log(topic, message.toString());
  
  });
  client.on("close",async()=>{
    
  });
//   client.end(true, () => {
//     // Optional: Handle any logic after disconnection
//     console.log('Disconnected from MQTT broker');
//   });
  // Handle graceful disconnect
  client.on('error', (err) => {
    console.error('Error:', err);
  });