FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN npm ci --only=production

EXPOSE 5000

CMD ["npm", "run", "start:prod"]