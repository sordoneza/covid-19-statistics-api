FROM node:16.20.2
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm","run","start"]
