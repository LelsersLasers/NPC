FROM node:18.12.1-slim

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "."]