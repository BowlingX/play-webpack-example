FROM nginx:alpine

RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN mkdir -p /var/lib/nginx/cache
COPY nginx.template /etc/nginx/conf.d/ngnix.template
