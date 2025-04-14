#!/usr/bin/env bash
set -eu

verbose=false
while getopts "v" opt; do
    case ${opt} in
	v ) verbose=true ;;
	* ) printf "Usage: $0 [-v] <office_code> <AMeDAS_site_code>\n" 1>&2; exit 1 ;;
    esac
done
shift $((OPTIND -1))
if [ "$#" -ne 2 ]; then
    printf "Usage: $0 [-v] <office_code> <AMeDAS_site_code>\n" 1>&2
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
if [ "${#time_define_arr[@]}" -ne "${#area_temps_arr[@]}" ]; then
    printf "The sizes of the 'timeDefines' and 'temps' arrays do not match.\n" 1>&2
    exit 1
fi

current_hour=$(date +%H)
if [ "$current_hour" -lt 5 ]; then
    # night
    if [ "${#time_define_arr[@]}" -lt 2 ]; then
	printf "There is not enough night data.\n" 1>&2
	exit 1
    fi
    low_i=0
    high_i=1
elif [ "$current_hour" -lt 17 ]; then
    # day
    if [ "${#time_define_arr[@]}" -lt 3 ]; then
	printf "There is not enough daytime data.\n" 1>&2
	exit 1
    fi
    low_i=2
    high_i=0
else
    # night
    if [ "${#time_define_arr[@]}" -lt 2 ]; then
	printf "There is not enough evening data.\n" 1>&2
	exit 1
    fi
    low_i=0
    high_i=1
fi
lowest=${area_temps_arr[$low_i]}
lowest_dt=${time_define_arr[low_i]}
highest=${area_temps_arr[$high_i]}
highest_dt=${time_define_arr[high_i]}

if [ "$verbose" = true ]; then
    printf "{ \"current_dt\": \"$(date --iso-8601=seconds)\", "
    printf "\"area_name\": \"$area_name\", "
    printf "\"lowest_dt\": \"$lowest_dt\", "
    printf "\"lowest\": $lowest, "
    printf "\"highest_dt\": \"$highest_dt\", "
    printf "\"highest\": $highest }\n"
else
    printf "{ \"lowest\": $lowest, \"highest\": $highest }\n"
fi
