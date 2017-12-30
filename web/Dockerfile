FROM debian:jessie

RUN apt-get -y update &&\
    apt-get install -y\
        python3\
        python3-pip\
        nginx

RUN pip3 install uwsgi

COPY ./web /opt/repo/web

RUN pip3 install -e /opt/repo/web

CMD ["/usr/bin/python3", "/opt/repo/web/start.py"]
