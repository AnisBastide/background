FROM node:16

WORKDIR /back

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY back/.. .

CMD ["npm", "start"]
