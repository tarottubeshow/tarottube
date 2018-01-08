FROM ubuntu

RUN apt-get -y update &&\
    apt-get install -y\
        python3\
        python3-pip

RUN apt-get -y update; \
    apt-get -y install software-properties-common dpkg-dev git; \
    add-apt-repository -y ppa:nginx/stable; \
    sed -i '/^#.* deb-src /s/^#//' /etc/apt/sources.list.d/nginx-ubuntu-stable-xenial.list; \
    apt-get -y update; \
    apt-get -y source nginx; \
    cd $(find . -maxdepth 1 -type d -name "nginx*") && \
    ls -ahl && \
    git clone https://github.com/arut/nginx-rtmp-module.git && \
    sed -i "s|common_configure_flags := \\\|common_configure_flags := \\\--add-module=$(cd  nginx-rtmp-module && pwd) \\\|" debian/rules && \
    cat debian/rules && echo "^^" && \
    apt-get -y build-dep nginx && \
    dpkg-buildpackage -b && \
    cd .. && ls -ahl && \
    dpkg --install $(find . -maxdepth 1 -type f -name "nginx-common*") && \
    dpkg --install $(find . -maxdepth 1 -type f -name "libnginx*") && \
    dpkg --install $(find . -maxdepth 1 -type f -name "nginx-full*"); \
    apt-get -y remove software-properties-common dpkg-dev git; \
    apt-get -y install aptitude; \
    aptitude -y markauto $(apt-cache showsrc nginx | sed -e '/Build-Depends/!d;s/Build-Depends: \|,\|([^)]*),*\|\[[^]]*\]//g'); \
    apt-get -y autoremove; \
    apt-get -y remove aptitude; \
    apt-get -y autoremove; \
    rm -rf ./*nginx*

RUN apt-get -y update &&\
    apt-get install -y\
        build-essential\
        ffmpeg

RUN pip3 install uwsgi

EXPOSE 80

COPY ./ /opt/repo

RUN pip3 install -e /opt/repo/web

CMD ["/usr/bin/python3", "-u", "/opt/repo/web/start.py"]
