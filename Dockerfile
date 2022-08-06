FROM node:lts-alpine

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

RUN apk add --no-cache --virtual .build-deps alpine-sdk python3
RUN mkdir -p /var/www/admission
WORKDIR /var/www/admission
ADD . /var/www/admission
RUN npm install
CMD npm run start:dev