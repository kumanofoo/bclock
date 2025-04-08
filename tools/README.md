# Peak Temperature and Air Quality Fetcher Tools

## Peak Temperature Fetcher

This script fetches the maximum and minimum temperatures for tomorrow from the [Open-meteo](https://open-meteo.com/) API based on the provided location (latitude and longitude) or the [JMA](https://www.jma.go.jp)(Japan Meteorological Agency) based on the provided JMA area codes using `curl` and `jq`.

> [!NOTE]
> For more details, please refer to the [PEAK.md](PEAK.md).

### ompeak.sh - Fetching Peak Temperature from [Open-meteo](https://open-meteo.com/) 

To get the maximum and minimum temperatures for Tokyo (latitude: 35.6895, longitude: 139.6917), run:

```sh
$ ./ompeak.sh 35.6895:139.6917
{ "highest": 15.1, "lowest": 6.2 }

```

### jmapeak.sh - Fetching Peak Temperature from [Japan Meteorological Agency](https://www.jma.go.jp/)

To get the maximum and minimum temperatures for Yokohama City, run:

```console
$ ./jmacode.sh yokohama 
keyword: yokohama

# 横浜町 Yokohama Town
# 青森県 八戸
020000 31602

# 横浜市 Yokohama City
# 神奈川県 横浜
140000 46106

$ ./jmapeak.sh 140000 46106
{ "lowest": 9, "highest": 15 }

```

## Air Quality Fetcher 

### room.sh - MQTT Client for Room Air Quality
`room.sh` receives a text message via MQTT and stores the data in JSON format.
The message contains three space-separated values: room temperature, humidity, and carbon dioxide concentration.

> [!NOTE]
> For more details, please refer to the [ROOM.md](ROOM.md).

An example of the MQTT message is:
```
27.5 27.8 649
```
And `room.sh` outputs JSON to a file:
```json
{
    "timestamp":1744003284,
    "topic":"your/subscribe/topic",
    "temperature_deg_c":27.5,
    "humidity_percent":27.8,
    "co2_ppm":649
}
```