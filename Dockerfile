FROM --platform=linux/amd64 node:16

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 3000

RUN npx prisma generate

CMD ["npm", "start"]
