#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    printf "Usage: $0 <CITY_NAME>\n"
    exit 1
fi

keyword="$1"
printf "keyword: $keyword\n\n"

AREA_JSON=$(curl -s https://www.jma.go.jp/bosai/common/const/area.json)
class20s_jp=$(jq -r '.class20s | to_entries | map(select(.value.name | test("'$keyword'")))' <<< $AREA_JSON)

keyword_lower=$(tr '[A-Z]' '[a-z]' <<< $keyword)
class20s_en=$(jq -r '.class20s | to_entries | map(select(.value.enName | ascii_downcase | test("'$keyword_lower'")))' <<< $AREA_JSON)

class20s=$(jq -n --argjson v1 "$class20s_jp" --argjson v2 "$class20s_en" '$v1 + $v2')
class20_keys=$(jq -r '.[].key' <<< $class20s)

FORECAST_AREA_JSON=$(curl -s https://www.jma.go.jp/bosai/forecast/const/forecast_area.json)
AMEDAS=$(curl -s https://www.jma.go.jp/bosai/amedas/const/amedastable.json)

for class20_key in ${class20_keys}; do
    class20=$(jq -r '.class20s."'$class20_key'"' <<< $AREA_JSON)
    class20_name=$(jq -r '.name' <<< $class20)
    class20_enname=$(jq -r '.enName' <<< $class20)
    printf "# %s %s\n" "$class20_name" "$class20_enname"
    class15_key=$(jq -r '.parent' <<< $class20)
    class10_key=$(jq -r '.class15s.'\"$class15_key\"'.parent' <<< $AREA_JSON)
    office_key=$(jq -r '.class10s."'$class10_key'".parent' <<< $AREA_JSON)
    office_name=$(jq -r '.offices."'$office_key'".name' <<< $AREA_JSON)
    amedas_site=$(jq '."'$office_key'"| .[] | select(.class10 == "'$class10_key'")' <<< $FORECAST_AREA_JSON)
    amedas_ids=$(jq -r .amedas[] <<< $amedas_site)

    for amedas_id in $amedas_ids; do
	amedas_site_name=$(jq -r '."'$amedas_id'".kjName' <<< $AMEDAS)
	printf "# $office_name $amedas_site_name\n"
	printf "$office_key $amedas_id\n"
	printf "\n"
    done
done
