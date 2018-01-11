FROM ubuntu

RUN apt-get -y update &&\
    apt-get install -y\
        python3\
        python3-pip\
        nginx\
        build-essential

RUN pip3 install uwsgi

EXPOSE 80

COPY ./ /opt/repo

RUN pip3 install -e /opt/repo/web

CMD ["/usr/bin/python3", "-u", "/opt/repo/web/start.py"]
