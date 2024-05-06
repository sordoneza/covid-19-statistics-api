FROM node:16.20.2
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
ENV ALLOWED_ORIGINS=http://18.224.40.9:4000
EXPOSE 4000
CMD ["npm","run","start"]
