FROM node:12

WORKDIR /app

RUN apt-get update
RUN apt-get install -y default-jre libxinerama1 libdbus-1-dev libcups2-dev libx11-xcb-dev

#Installing LibreOffice_7.1.3
COPY LibreOffice_7.2.4_Linux_x86-64_deb.tar.gz LibreOffice_7.2.4_Linux_x86-64_deb.tar.gz
RUN tar -xvf LibreOffice_7.2.4_Linux_x86-64_deb.tar.gz
RUN dpkg -i LibreOffice_7.2.4.1_Linux_x86-64_deb/DEBS/*.deb

#Configuring SOFFICE client for terminal operations
RUN ln -s /opt/libreoffice7.2/program/soffice /usr/local/bin/libreoffice

RUN npm install pm2 -g


COPY dist dist
COPY backend backend
COPY repositorio repositorio
COPY help help


CMD ["pm2-runtime", "backend/server.bundle.js","--json"]
