# 'room.sh' MQTT Client for Room Air Quality
`room.sh` receives a text message via MQTT and stores the data in JSON format.
The message contains three space-separated values: room temperature, humidity, and carbon dioxide concentration.

An example of the message is:
```
27.5 27.8 649
```
And `room.sh` outputs JSON:
```json
{
    "timestamp":1744003284,
    "topic":"your/subscribe/topic",
    "temperature_deg_c":27.5,
    "humidity_percent":27.8,
    "co2_ppm":649
}
```


## Requirements

- `Bash`
- `mosquitto` client
- MQTT broker and publisher

## Installing

### mosquitto client
```console
sudo apt-get install mosquitto-clients
```

### room.sh
1. Copy the files.
```console
sudo cp room.sh room.service /opt/bclock/tools
sudo cp room-example.conf /opt/bclock/tools/room.conf
```

2. Edit the configuration file `room.conf`.
```
host=localhost
port=1883
topic=your/subscribe/topic
filename=/opt/bclock/html/air_quality.json
```

3. Enable and start the service unit.
```
sudo systemctl enable /opt/bclock/tools/room.service
sudo systemctl start room.service
```
