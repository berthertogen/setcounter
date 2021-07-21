# syntax=docker/dockerfile:1
FROM cypress/included:7.4.0 AS build
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci --ignore-scripts

COPY . .
RUN npm run test
RUN npm run start-and-wait
RUN npm run e2e

RUN npm run build:production

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/