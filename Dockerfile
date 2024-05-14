FROM node:16.20.2 as builder
WORKDIR /build

COPY package.json .
RUN npm install

COPY src/ src/
COPY tsconfig.json .
COPY .env .

RUN npm run build

FROM node:16.20.2 as runner
WORKDIR /app

COPY --from=builder build/package.json .
COPY --from=builder build/.env .
COPY --from=builder build/node_modules node_modules/
COPY --from=builder build/build build/

CMD ["npm","run","start"]
