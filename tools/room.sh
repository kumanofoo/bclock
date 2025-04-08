#!/usr/bin/env bash
set -ue

config_file=${ROOM_CONFIG_FILE-"/opt/bclock/tools/room.conf"}
typeset -A config
config=(
    [host]=localhost
    [port]=1883
    [topic]=
    [filename]=''
)

function usage() {
    cat <<EOS
Usage: $(basename $0)

Create the configuration file '$config_file' that contains 'host', 'port', 'topic' and 'filename' parameters.
You can specify the configuration file using the environment variable 'ROOM_CONFIG_FILE'.

Example '$config_file':

host=localhost
port=1883
topic=living/air
filename=room.json

The MQTT message that this script receive have to contain three values separated by spaces.
These values represent temperature (in ℃), humidtiy (in %) and carbon dioxide concentration (in ppm):
'25.4 43.3 512'

EOS
}

if [ "$#" -gt 0 ]; then
    usage
    exit 1
fi

while read line
do
    if echo $line | grep -F = &>/dev/null
    then
        varname=$(echo "$line" | cut -d '=' -f 1)
        config[$varname]=$(echo "$line" | cut -d '=' -f 2-)
    fi
done < $config_file

if [ -z "${config[topic]}" ]; then
    echo "no 'topic' specified."
    exit 1
fi
url="mqtt://${config[host]}:${config[port]}/${config[topic]}"
mosquitto_sub -L "$url" | while read -r line
do
    timestamp=$(date +%s)
    value=($line)
    temperature="${value[0]}"
    humidity="${value[1]}"
    co2="${value[2]}"
    
    output='{"timestamp":'$timestamp','
    output=$output'"topic":"'${config[topic]}'",'
    output=$output'"temperature_deg_c":'$temperature','
    output=$output'"humidity_percent":'$humidity','
    output=$output'"co2_ppm":'$co2'}'

    if [ -n "${config[filename]}" ]; then
        printf "$output\n" > "${config[filename]}"
    else
        printf "$output\n"
    fi
done
