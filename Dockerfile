FROM node:11-alpine

# The following line needs to be here otherwise bcrypt package wont work.
RUN apk add --no-cache --update g++ python2 make

WORKDIR /app

COPY package*.json /app/

RUN npm install --production

COPY . /app/

ENV NODE_ENV=production

RUN chown -R node:node /app/*
USER node

CMD node src/app