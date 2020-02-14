FROM node:12-alpine as build

ENV HOME=/home/app
COPY . $HOME/node/

WORKDIR $HOME/node
RUN npm ci -q

RUN npm run build
RUN npm prune --production

FROM nginx:stable-alpine

COPY --from=build /home/app/node/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
