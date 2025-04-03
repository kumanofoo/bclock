# Peak Temperature Fetcher (Bash Script)

This script fetches the maximum and minimum temperatures for tomorrow from the [Open-meteo](https://open-meteo.com/) API based on the provided location (latitude and longitude) or the [JMA](https://www.jma.go.jp)(Japan Meteorological Agency) based on the provided JMA area codes using `curl` and `jq`.

## Requirements

- Bash
- `curl`
- `jq`

You can install `curl` and `jq` using the following command:

```sh
sudo apt-get install curl jq
```

## ompeak.sh
The `ompeak.sh` is a bash script that interacts with the Open-meteo API.

### Usage

Run the script from the command line with the location specified in the format `latitude:longitude`.

```sh
bash tools/ompeak.sh <location>
```

### Example

To get the maximum and minimum temperatures for Tokyo (latitude: 35.6895, longitude: 139.6917), run:

```sh
$ bash tools/ompeak.sh 35.6895:139.6917
{ "highest": 15.1, "lowest": 6.2 }

```

## jmapeak.sh
The `jmapeak.sh` is a utility that interacts with the JMA API. It requires an Office code and an Area code (AMeDAS observation site code) as inputs. First, we use `jmacode.sh` to retrieve the corresponding Office and Area codes from a given city name. Then, we pass these codes to `jmapeak.sh` to obtain the highest and lowest temperatures.

### Usage
jmapeak.sh:
```sh
bash tools/jmacode.sh <CITY_NAME>
```

jmapeak.sh:
```sh
jmapeak.sh [-v] <office_code>  <AMeDAS_site_code>
```

### Example
Search Office and Area code.
```console
$ bash tools/jmacode.sh yokohama 
keyword: yokohama

# 横浜町 Yokohama Town
# 青森県 八戸
020000 31602

# 横浜市 Yokohama City
# 神奈川県 横浜
140000 46106

$ bash tools/jmapeak.sh 140000 46106
{ "lowest": 9, "highest": 15 }

```

## Setting Up a Cron Job

To run this script every 3 hours and output the result to `/opt/bclock/peak.json`, follow these steps:

1. Open the crontab file for editing:

    ```sh
    crontab -e
    ```

2. Add the following line to the crontab file:

    ```sh
    0 */3 * * * /usr/bin/bash /opt/bclock/tools/ompeak.sh 35.6895:139.6917 > /opt/bclock/peak.json

    # OR

    0 */3 * * * /usr/bin/bash /opt/bclock/tools/jmapeak.sh 140000 46106 > /opt/bclock/peak.json
    ```

    This line schedules the script to run every 3 hours and redirects the output to `/opt/bclock/peak.json`. Make sure to replace `/usr/bin/bash` with the path to your Bash interpreter if it's different.

3. Save and close the crontab file.

Now, the script will run every 3 hours and update `/opt/bclock/peak.json` with the latest maximum and minimum temperatures.
