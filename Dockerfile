FROM node:6.10.1

WORKDIR /server

COPY package.json /server/
RUN npm install

COPY app/ /server/app/

EXPOSE 8080
CMD ["npm", "start"]