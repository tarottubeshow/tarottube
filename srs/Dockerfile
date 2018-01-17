FROM ubuntu

RUN apt-get -y update &&\
    apt-get install -y\
        build-essential\
        locales\
        git-core\
        unzip\
        ffmpeg\
        sudo\
        python-dev

ENV LANG C.UTF-8

RUN mkdir /opt/build &&\
    cd /opt/build &&\
    git clone https://github.com/ossrs/srs &&\
    cd srs/trunk &&\
    ./configure &&\
    make

COPY ./srs /opt/repo/srs

CMD ["bash", "/opt/repo/srs/start.sh"]
