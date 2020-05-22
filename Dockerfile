FROM node:12.16.3-alpine

WORKDIR /app
COPY package.json /app
RUN yarn

COPY . /app

RUN yarn build
