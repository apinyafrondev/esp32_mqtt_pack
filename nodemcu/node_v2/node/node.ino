#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <EEPROM.h>
// WiFi credentials
const char* ssid = "xxx";
const char* password = "xxx";

// MQTT Broker
const char* mqtt_server = "192.168.x.x";
const char* mqtt_username = "xxx";
const char* mqtt_pass = "xxx";
const char* topic = "xxx";

// DHT22
#define DHT22_PIN 13
DHT dht22(DHT22_PIN, DHT22);
WiFiClient espClient;
PubSubClient client(espClient);
String PumpsDataTemp;
long lastMsg = 0;
void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  //DHT22 Begin
  dht22.begin();
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  // Create a buffer to store the payload
  char message[length + 1];
  for (unsigned int i = 0; i < length; i++) {
    message[i] = (char)payload[i];
  }
  message[length] = '\0'; // Null-terminate the string
  Serial.println(message);

  // Allocate a temporary JsonDocument
  StaticJsonDocument<200> doc;

  // Deserialize the JSON document
  DeserializationError error = deserializeJson(doc, message);
  // Test if parsing succeeds
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  // Process the JSON data as needed
  // For example, if you have a key "value" in your JSON:
  if (doc.containsKey("value")) {
    int value = doc["value"];
    Serial.print("Value: ");
    Serial.println(value);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client", mqtt_username, mqtt_pass)) {
      Serial.println("connected");
      client.subscribe(topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
//void FanOnOff() {
// add soon function
//}
void TempHumidSensor(float &humid1,float &humid2,float &temp1c,float &temp1f,float &temp2c,float &temp2f) {
  humid1 = dht22.readHumidity();
  humid2 = dht22.readHumidity();
  temp1c = dht22.readTemperature();
  temp1f = dht22.readTemperature(true);
  temp1c = dht22.readTemperature();
  temp2f = dht22.readTemperature(true);
  if (isnan(humid1) || isnan(temp1c) || isnan(temp1c)) {
    Serial.println("Failed to read from DHT22 sensor!");
  } else {
    Serial.print("Humidity: ");
    Serial.print(humid1);
    Serial.print("% | ");
    Serial.print("Temperature: ");
    Serial.print(temp1c);
    Serial.print("°C ~ ");
    Serial.print(temp1f);
    Serial.println("°F");
  }
}
//void setConditionTemp() {
// add function soon
//}

void loop() {
  // this code show send more data key value to mqtt server :)
  const size_t capacity = JSON_OBJECT_SIZE(2) + 100; // Adjust capacity as needed
  char jsonBuffer[capacity];
  int FanData[] = {0, 0, 0, 0, 1, 1, 1, 1};
  int pump1Val = 1;
  int pump2Val = 0;
  JsonDocument doc;
  // Add an array.
  doc["pump1"] = 1;
  doc["pump2"] = 0;
  doc["temp1"] = 30.0;
  doc["temp2"] = 31.1;
  doc["humid1"] = 90.0;
  doc["humid2"] = 91.2;
  doc["node_id"] = "esp32_1";
  doc["power"] = 10;
  // add fan data
  int numFan = sizeof(FanData) / sizeof(FanData[0]);
  // Add data to array
  for (int i = 0; i < numFan; i++) {
    doc["fan"].add(FanData[i]);
  }
  // Serialize to a character buffer
  serializeJson(doc, jsonBuffer, capacity);
  // Now you have a char* pointer to the JSON data:
  char* jsonString = jsonBuffer;
  
  // temp humidity sensor set value and publish
  float humid1,humid2,temp1c,temp1f,temp2c,temp2f;
  TempHumidSensor(humid1,humid2,temp1c,temp1f,temp2c,temp2f);
  JsonDocument doc2;
  const size_t capacity2 = JSON_OBJECT_SIZE(2) + 100; // Adjust capacity as needed
  char jsonBuffer2[capacity2];
  doc2["temp1c"] = temp1c;
  doc2["temp1f"] = temp1f;
  doc2["temp2c"] = temp2c;
  doc2["temp2f"] = temp2f;
  doc2["humid1"] = humid1;
  doc2["humid2"] = humid2;
  serializeJson(doc2, jsonBuffer2, capacity2);
  char* JsonString2 = jsonBuffer2;
  
  if (!client.connected()) {
    reconnect();
  }
  
  Serial.println();
  client.loop();
  Serial.println(JsonString2);
  // nodemcu can publish and subscribe data :)
  client.publish("ESP32/NODE1/uplink/temphumid", JsonString2);
  client.subscribe("ESP32/NODE1/downlink/pumps");
  delay(1000);
}
