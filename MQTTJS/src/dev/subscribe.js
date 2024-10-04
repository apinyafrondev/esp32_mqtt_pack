const mqtt = require("mqtt");
const mysql = require('mysql2');
const Influx = require('influx');
require('dotenv').config();
const options = {
  host: '192.168.xx.xx',
  port: 1883,
  username: 'mqtt_xxx',
  password: 'xxx',
  clientId: 'esp32_' + Math.random().toString(8).substring(2, 11)
};
const influx = new Influx.InfluxDB({
  host: '192.168.3.39',
  port: 8086,
  database: 'weather_data',
  username: 'admin',
  password: '99tgerfusdjkhf',

  schema: [
    {
      measurement: 'response_times',
      fields: {
        path: Influx.FieldType.STRING,
        duration: Influx.FieldType.INTEGER
      },
      tags: [
        'host'
      ]
    }
  ]
});
const client = mqtt.connect(options);
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
const InsertLogs = async (data) => {
  // OperationToMaria(10,'nodedata_logs',data);
  //console.log(result[0][0])
  //const sql = 'INSERT INTO `nodedata_logs` (`topic`,`temp1`, `temp2`, `humi1`,`humi2`,`pump1`,`pump2`,`fan`,`power`,`node_id`) VALUES ' + `('esp32/node1',${parseFloat(data.temp1)},${parseFloat(data.temp2)},${parseFloat(data.humid1)},${parseFloat(data.humid2)},${parseInt(data.pump1)},${parseInt(data.pump2)},'${JSON.stringify(data.fan)}',${parseFloat(data.power)},'node1')`;
  const sql = 'INSERT INTO `nodedata_logs` (`topic`,`temp1`, `temp2`, `humi1`,`humi2`,`pump1`,`pump2`,`fan`,`power`,`node_id`) VALUES ' + `('esp32/node1',${parseFloat(data.temp1)},${parseFloat(data.temp2)},${parseFloat(data.humid1)},${parseFloat(data.humid2)},${parseInt(data.pump1)},${parseInt(data.pump2)},'${JSON.stringify(data.fan)}',${parseFloat(data.power)},'node1')`;
  connection.query(
    {
      sql,
      // ... other options
    },
    (err, result, fields) => {
      if (err instanceof Error) {
        console.log(err);
        return;
      }
      if (result != null) {
        console.log("insert ok!");
      }
      if (err) {
        console.log(err);
      }
      // console.log(result);
      // console.log(fields);
    }
  );
}
const InsertTempHumidMariaDB = async (data) => {
  console.log(data);
  // OperationToMaria(10,'nodedata_logs',data);
  //console.log(result[0][0])
  //const sql = 'INSERT INTO `nodedata_logs` (`topic`,`temp1`, `temp2`, `humi1`,`humi2`,`pump1`,`pump2`,`fan`,`power`,`node_id`) VALUES ' + `('esp32/node1',${parseFloat(data.temp1)},${parseFloat(data.temp2)},${parseFloat(data.humid1)},${parseFloat(data.humid2)},${parseInt(data.pump1)},${parseInt(data.pump2)},'${JSON.stringify(data.fan)}',${parseFloat(data.power)},'node1')`;
  const sql = 'INSERT INTO `humiditytemp` (`id`, `topic`,`temp1c`,`temp2c`, `temp1f`, `temp2f`,`humidity1`,`humidity2`) VALUES ' + `(NULL,NULL,${data.temp1c},${data.temp2c},${data.temp1f},${data.temp2f},${data.humid1},${data.humid2})`;
  connection.query(
    {
      sql,
      // ... other options
    },
    (err, result, fields) => {
      if (err instanceof Error) {
        console.log(err);
        return;
      }
      if (result != null) {
        console.log("insert humiditytemp ok!");
      }
      if (err) {
        console.log(err);
      }
    }
  );
}
const SaveToInfluxDbOn_humiditytemp = async (data) => {
  //console.log(data);
  influx.writePoints([
    {
      measurement: 'humiditytemp',
      tags: { topic: 'ESP32/NODE1/uplink/temphumid' },
      //   fields: { duration: 123, path: '/example/path' },
      fields: { temp1c: data.temp1c, temp2c: data.temp2c, temp1f: data.temp1f, temp2f: data.temp2f, humidity1: data.humid1, humidity2: data.humid2 },
    }
  ]).catch((error) => {
    console.error(`Error saving data to InfluxDB! ${error.stack}`)
  });
}
client.on("connect", async () => {
  client.subscribe("ESP32/NODE1/data");
  client.subscribe("ESP32/NODE1/uplink/temphumid");
})
client.on('message', async (topic, message) => {
  //console.log(topic);
  if (topic == 'ESP32/NODE1/uplink/temphumid') {
    const SourceData = JSON.parse(message.toString());
    //console.log(SourceData)
    //
    InsertTempHumidMariaDB(SourceData);
    // SaveToInfluxDbOn_humiditytemp(SourceData);
    // console.log("into influx"+SourceData)
  }

  if (topic == 'ESP32/NODE1/data') {
    const SourceData2 = JSON.parse(message.toString());
    console.log(SourceData2)
  }

});
//   client.end(true, () => {
//     // Optional: Handle any logic after disconnection
//     console.log('Disconnected from MQTT broker');
//   });
// Handle graceful disconnect
client.on('error', (err) => {
  console.error('Error:', err);
});