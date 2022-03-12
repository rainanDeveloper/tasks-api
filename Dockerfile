FROM node:16

WORKDIR /usr/src/task-app

# Install all the packages used on project
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD npm run start:prod