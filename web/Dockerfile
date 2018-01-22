FROM ubuntu

RUN apt-get -y update &&\
    apt-get install -y\
        build-essential\
        locales\
        python3\
        python3-pip\
        nginx

ENV LANG C.UTF-8

RUN pip3 install --upgrade pip

RUN pip3 install uwsgi six

EXPOSE 80 443

COPY ./ /opt/repo

RUN pip3 install -e /opt/repo/web

CMD ["/usr/bin/python3", "-u", "/opt/repo/web/start.py"]
