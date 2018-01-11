#!/bin/bash
exec ffmpeg -i rtmp://localhost:1935/src/$1\
    -c:a copy -c:v libx264\
    -tune:v zerolatency -preset:v ultrafast\
    -b:v 128k\
    -vf scale=iw/2:ih/2\
    -f flv rtmp://localhost:1935/shrink/$1_low
