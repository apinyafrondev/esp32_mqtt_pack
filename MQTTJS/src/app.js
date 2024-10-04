const mqtt = require("mqtt");
// Get the client
const mysql = require('mysql2');
// sqlite
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const NodeCache = require("node-cache");
const CacheMem = new NodeCache();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Create the connection to database
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  port: process.env.PORT,
  password: process.env.PASSWORD,
});
const Influx = require('influx');
const influx = new Influx.InfluxDB({
  host: '192.168.x.x',
  port: 8087,
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
connection.addListener('error', (err) => {
  console.log(err);
});

const options = {
  host: '192.168.x.x',
  port: 1883,
  username: 'xxx',
  password: 'xxx',
  clientId: 'esp32_' + Math.random().toString(8).substring(2, 11)
};
// example data for test only
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


const client = mqtt.connect(options);

const UpdateStatusOnOff = async (id, status) => {
  let UpdateQueryState = 0;
  const sql = `UPDATE OnOffWaterPumps SET status = ${status} WHERE OnOffWaterPumps.id = ${id};`;
  connection.query(
    {
      sql,
      // ... other options
    },
    (err, result, fields) => {
      if (err instanceof Error) {
        console.log(err);
        return UpdateQueryState = 0;
      }
      if (result != null) {
        return UpdateQueryState = 1;
      }
      if (err) {
        console.log(err);
        return UpdateQueryState = 0;
      }
    });
  return UpdateQueryState;
}

const UpdateStatusOnOffFan = async (id, status) => {
  let UpdateQueryState = 0;
  const sql = `UPDATE OnOffFan SET status = ${status} WHERE OnOffFan.id = ${id};`;
  connection.query(
    {
      sql,
      // ... other options
    },
    (err, result, fields) => {
      if (err instanceof Error) {
        console.log(err);
        return UpdateQueryState = 0;
      }
      if (result != null) {
        return UpdateQueryState = 1;
      }
      if (err) {
        console.log(err);
        return UpdateQueryState = 0;
      }
    });
  return UpdateQueryState;
}

const UpdateSetPoint = async (id, numberpoint) => {
  console.log(id, numberpoint)
  let UpdateQueryState = 0;
  let UpdateQueryState2 = 0;
  let UpdateQueryState3 = 0;
  const sql = `UPDATE setPoint SET num = ${numberpoint} WHERE setPoint.id = ${id}`;
  connection.query(
    {
      sql,
      // ... other options
    },
    (err, result, fields) => {
      if (err instanceof Error) {
        console.log(err);
        return UpdateQueryState = 0;
      }
      if (result != null) {
        newSetPoint = { setPoint: numberpoint };
        success = CacheMem.set("setpoint_for_fan", newSetPoint);
        return UpdateQueryState = 1;
      }
      if (err) {
        console.log(err);
        return UpdateQueryState = 0;
      }
    });
  // return UpdateQueryState2;
}

const FanCheck = () => {
  const value = CacheMem.get("setpoint_for_fan");
  if (value == undefined) {
    // handle miss!
    console.log('not found set point cache!');
  }
  queryLatestRecordTempHumdimariaDB().then(
    (data) => {
      // newSetTempC = { setPoint: data[0].temp1c};
      // success = CacheMem.set("last_temp", newSetTempC);
      console.log('Fetched data:', data[0]);
      if (value.setPoint >= data[0].temp1c) {
        console.log("temp down: "+data[0].temp1c)
        const sql = `UPDATE OnOffFan SET status = ${false} WHERE OnOffFan.id in(1,2,3,4)`;
        connection.query(
          {
            sql,
            // ... other options
          },
          (err, result, fields) => {
            if (err instanceof Error) {
              console.log(err);
              //return UpdateQueryState = 0;
            }
            if (result != null) {
              // return UpdateQueryState = 1;
            }
            if (err) {
              console.log(err);
              //return UpdateQueryState = 0;
            }
          });
      }
      else if (value.setPoint <= data[0].temp1c) {
        console.log("temp up: "+data[0].temp1c)
        //console.log(value)
        const sql = `UPDATE OnOffFan SET status = ${true} WHERE OnOffFan.id in(1,2,3,4)`;
        connection.query(
          {
            sql,
            // ... other options
          },
          (err, result, fields) => {
            if (err instanceof Error) {
              console.log(err);
              //return UpdateQueryState = 0;
            }
            if (result != null) {
              //return UpdateQueryState = 1;
            }
            if (err) {
              console.log(err);
              //return UpdateQueryState = 0;
            }
          });
      } else {
        console.log('condition to change fan error!');
      }
    }
  ).catch(
    (error) => {
      console.log('Cannot fetch last data in db', error);
    }
  );
  // else {
  //   numberpoint = value.setPoint;
  // }
  // fan conditions
 
}
const queryLatestRecordTempHumdiInflux = async () => {
  try {
    const result = await influx.query(`
      SELECT * FROM humiditytemp
      ORDER BY time DESC
      LIMIT 1
    `);
    return new Promise((resolve, reject) => {
      result.forEach((row) => {
        if (row != null) {
          resolve(row)
        }
        else {
          reject("error!!!");
        }
      });
    })
  } catch (error) {
    console.error('Error querying data:', error);
  }
};

const queryLatestRecordTempHumdimariaDB = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM `humiditytemp` ORDER BY id DESC LIMIT 1', (err, results) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(results);
      }
    });
  });
};

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

const GetOnOffFans = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM `OnOffFan`', (err, results) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(results);
      }
    });
  });
}
const GetSetPointData = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM `setPoint`', (err, results) => {

      if (err) {
        return reject(err);
      } else {
        // console.log(results[0])
        const newSetPoint = { setPoint: results[0].num };
        console.log(newSetPoint)
        const success = CacheMem.set("setpoint_for_fan", newSetPoint);
        return resolve(results);
      }
    });
  });
}

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
app.patch('/waterpump/api/onoff/v1/', async (req, res) => {
  const id = req.body.id;
  const status = req.body.status;
  const updateOk = await UpdateStatusOnOff(id, status);

  if (!updateOk) {
    GetOnOffPumps().then((data) => {
      console.log(data)
      data.forEach(element => {
        const jsonString = {
          id: element.id,
          status: element.status
        };
        const sourceData = JSON.stringify(jsonString);
        client.publish("ESP32/NODE1/downlink/pumps", sourceData)
      });;
    }).catch(err => { console.log(err) });
    res.send('update ok')
  }
  else {
    res.send('error to waterpump update!')
  }
})

app.patch('/fan/api/onoff/v1/', async (req, res) => {
  const id = req.body.id;
  const status = req.body.status;
  const updateOk = await UpdateStatusOnOffFan(id, status);

  if (!updateOk) {
    GetOnOffFans().then((data) => {
      console.log(data)
      data.forEach(element => {
        const jsonString = {
          id: element.id,
          status: element.status
        };
        const sourceData = JSON.stringify(jsonString);
        client.publish("ESP32/NODE1/downlink/fan", sourceData)
      });;
    }).catch(err => { console.log(err) });
    res.send('update fan status ok')
  }
  else {
    res.send('error to fan status update!')
  }
})

app.patch('/setpoint/api/v1/temp', async (req, res) => {
  const id = req.body.id;
  const numberpoint = req.body.num;
  const updateOk = await UpdateSetPoint(id, numberpoint);
  if (!updateOk) {
    GetSetPointData().then((data) => {
      console.log(data)
      data.forEach(element => {
        const jsonString = {
          id: element.id,
          status: element.status
        };
        const sourceData = JSON.stringify(jsonString);
        client.publish("ESP32/NODE1/downlink/setPoint", sourceData)
      });;
    }).catch(err => { console.log(err) });
    res.send('update setPoint value ok')
  }
  else {
    res.send('error to fan status update!')
  }
})

app.get('/waterpump/api/onoff/v1/state', async (req, res) => {
  //let data = mockUpDataDownlink;
  await GetOnOffPumps().then(data => {
    //console.log(data); // Handle the data here
    res.send(data)
  })
    .catch(error => {
      console.error(error); // Handle the error here
      res.send('err to query!')
    });
})
app.get('/fan/api/onoff/v1/state', async (req, res) => {
  //let data = mockUpDataDownlink;
  await GetOnOffFans().then(data => {
    //console.log(data); // Handle the data here
    res.send(data)
  })
    .catch(error => {
      console.error(error); // Handle the error here
      res.send('err to query!')
    });
})

app.get('/temp/api/query/v1/state', async (req, res) => {
  const dataTempHumdi = await queryLatestRecordTempHumdimariaDB().then(data =>
    res.status(200).send(data)).catch((err) =>
      console.log('can not fetch temp and humid!'));
})
setInterval(() => {
  GetSetPointData();
  setTimeout(() => {
    FanCheck();
  }, 2000)

}, 1000);
app.listen(3100, () => {
  console.log("server start")
});
