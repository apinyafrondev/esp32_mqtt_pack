const mqtt = require("mqtt");
const options = {
    host: '192.168.x.xx',
    port: 1883,
    username: 'mqtt_xx',
    password: 'xx',
    clientId: 'mqtt_' + Math.random().toString(8).substring(2, 11)
};
const client = mqtt.connect(options);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe("esp32/waterpump",(err)=>{
        if(!err){
            console.log("message topic ok!")
        }
        else{
            console.log("please publish device!")
        }
    })
});

client.on('message', (topic, message) => {
    console.log(topic, message.toString());
});

client.on('error', (err) => {
    console.error('Error:', err);
});
