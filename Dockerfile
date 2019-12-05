FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mv .env.production .env

EXPOSE 4000
CMD npm run prod