FROM node:14.16.1
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm","run","start"]
