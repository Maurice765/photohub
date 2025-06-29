FROM --platform=$BUILDPLATFORM node:22.16.0-bullseye-slim

RUN mkdir /project
WORKDIR /projectAdd commentMore actions

RUN npm install -g @angular/cli@20

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
CMD ["ng", "serve", "--host", "0.0.0.0"]
