FROM node:latest
MAINTAINER tvkkpt

RUN mkdir /code
ADD . /code

WORKDIR /code
RUN yarn install