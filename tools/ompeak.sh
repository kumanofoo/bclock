#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <latitude:longitude>"
    exit 1
fi

location=$1
lat=$(echo $location | cut -d':' -f1)
lon=$(echo $location | cut -d':' -f2)

# Determine the date to fetch based on the current time
hour=$(date +"%H")
if [ "$hour" -ge 0 ] && [ "$hour" -lt 5 ]; then
    date=$(date +"%Y-%m-%d")
else
    date=$(date -d "+1 day" +"%Y-%m-%d")
fi

url="https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&start_date=${date}&end_date=${date}&timezone=auto"

response=$(curl -s $url)

if [ $? -ne 0 ]; then
    echo "Failed to retrieve data from Open-Meteo API"
    exit 1
fi

max_temp=$(echo $response | jq '.daily.temperature_2m_max[0]')
min_temp=$(echo $response | jq '.daily.temperature_2m_min[0]')

if [ -z "$max_temp" ] || [ -z "$min_temp" ]; then
    echo "Failed to parse temperature data"
    exit 1
fi

result=$(jq -n --arg max "$max_temp" --arg min "$min_temp" '{highest: $max|tonumber, lowest: $min|tonumber}')
echo $result