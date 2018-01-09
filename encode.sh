#!/bin/bash
ffmpeg -re -i rtmp://localhost:1935/src/$1\
    -c:a copy -c:v libx264\
    -tune:v zerolatency -preset:v ultrafast\
    -b:v 128k\
    -vf scale=iw/3:ih/3\
    -f flv rtmp://localhost:1935/shrink/$1_low
