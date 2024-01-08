FROM node:latest as build
WORKDIR /usr/src/app


COPY package.json /app/
RUN npm install

COPY . /app/
RUN npm run build --prod


FROM nginx:latest
COPY --from=build /app/dist/devops_ms /usr/share/nginx/html