FROM node
ENV MONGO_DB_USERNAME=admin \
    MONGO_DEB_PWD=secret
RUN mkdir -p /home/app
COPY . /home/app
WORKDIR /home/app
EXPOSE 3000
CMD ["npm","run","start"]
