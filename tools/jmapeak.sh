#!/usr/bin/env bash
set -eu

verbose=false
while getopts "v" opt; do
    case ${opt} in
	v ) verbose=true ;;
	* ) printf "Usage: $0 [-v] <office_code> <AMeDAS_site_code>\n"; exit 1 ;;
    esac
done
shift $((OPTIND -1))
if [ "$#" -ne 2 ]; then
    printf "usage: $0 [-v] <office_code> <AMeDAS_site_code>\n"
    exit 1
fi

office="$1"
amedas="$2"

url=$(printf "https://www.jma.go.jp/bosai/forecast/data/forecast/%s.json" $office)
FORECAST_JSON=$(curl -s $url)

time_define=$(jq -r '.[0].timeSeries[2].timeDefines[]' <<< $FORECAST_JSON)
area=$(jq -r '.[0].timeSeries[2].areas[] | select(.area.code == "'$amedas'")' <<< $FORECAST_JSON)
area_name=$(jq -r '.area.name' <<< $area)
area_temps=$(jq -r '.temps[]' <<< $area)

time_define_arr=($time_define)
area_temps_arr=($area_temps)
current_ts=$(date +%s)
lowest=""
highest=""
for i in "${!time_define_arr[@]}"; do
    temp_ts=$(date -d "${time_define_arr[i]}" +%s)
    if [ "$current_ts" -lt "$temp_ts" ]; then
	if [ "$(date -d "${time_define_arr[i]}" +%H)" -lt 9 ]; then
	    lowest=${area_temps_arr[i]}
	    lowest_dt=${time_define_arr[i]}
	else
	    highest=${area_temps_arr[i]}
	    highest_dt=${time_define_arr[i]}
	fi
    fi
    if [ -n "$lowest" ] && [ -n "$highest" ]; then
	break
    fi
done

if [ "$verbose" = true ]; then
    printf "{ \"area_name\": \"$area_name\", "
    printf "\"lowest_dt\": \"$lowest_dt\", "
    printf "\"lowest\": $lowest, "
    printf "\"highest_dt\": \"$highest_dt\", "
    printf "\"highest\": $highest }\n"
else
    printf "{ \"lowest\": $lowest, \"highest\": $highest }\n"
fi
