#!/usr/bin/env bash

if [ "$1" = "--help" ]; then
    echo "Usage: $0 [targetdir]"
    echo "  targetdir: directory to install the files (default: /opt/bclock)"
    exit 0
fi
htmltargetdir="${1:-/opt/bclock}/html"
tooltargetdir="${1:-/opt/bclock}"
owner="root"
group="root"

examples="air_quality-example.json peak-example.json"
html="index.html favicon.ico"
font='Linefont[wdth,wght].woff2'
images="icon-192x192.png frost.jpg lava.jpg"
js="bcalendar.js bclock.js config.js holidays.js sw.js"
style="style.css"
tools_bin="ompeak.sh jmapeak.sh jmacode.sh room.sh"
tools_conf="room.service room-example.conf"

function copy_files() {
    files=$1
    dir=$2
    perm=${3-644}
    if [ -n "$2" ]; then
        target=$targetdir/$2
        dir=$2/
    else
        target=$targetdir
        dir=""
    fi
    for file in $files; do
        echo "  $target/$file"
        install -m $perm -D -o $owner -g $group -t $target $dir$file
    done
}

echo Installing to "'$targetdir'"...

targetdir="$htmltargetdir"
copy_files "$examples $html"
copy_files "$font" "font"
copy_files "$images" "images"
copy_files "$js" "js"
copy_files "$style" "style"

targetdir="$tooltargetdir"
copy_files "$tools_bin" "tools" 755
copy_files "$tools_conf" "tools"

echo done.
