FROM node:18.12.1-alpine

WORKDIR /opt/app

COPY . /opt/app

RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]
