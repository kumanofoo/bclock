#!/usr/bin/env python3

import csv
import urllib.request
import urllib.parse
url = "https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as res:
    body = res.read().decode('ShiftJIS').split("\n")
    csv = csv.reader(body)

with open("holidays.js", "w") as f:
    print("const HOLIDAYS = {", file=f)
    for line in csv:
        if len(line) == 2 and len(line[0].split("/")) == 3:
            print(f'    "{line[0]}": "{line[1]}",', file=f)
    print("};", file=f)
