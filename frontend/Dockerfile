FROM nginx:alpine

RUN apk add --update nodejs npm

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN cp -r dist/* /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]