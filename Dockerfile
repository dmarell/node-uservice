FROM node:argon

COPY models/ /server/models/
COPY node_modules/ /server/node_modules/
COPY *.js /server
COPY package.json /server

WORKDIR /server
RUN pwd && ls -l

EXPOSE 8080
CMD ["npm", "start"]