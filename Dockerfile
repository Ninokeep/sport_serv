FROM node:14-alpine

WORKDIR /api_running

COPY package.json package-lock.json ./

RUN npm install
RUN apk --no-cache add --virtual builds-deps build-base python


COPY . .

CMD [ "npm", "start" ]