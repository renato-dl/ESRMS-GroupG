FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install -g serve
RUN npm install
RUN npm run build

EXPOSE 3000

CMD serve -s build -p 3000
