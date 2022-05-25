FROM node
ENV MONGO_DB_USERNAME=admin \
    MONGO_DEB_PWD=secret
WORKDIR /home/app
RUN mkdir -p /home/app
COPY ./dist ./dist
COPY ./package.json ./package.json
RUN npm install --omit=dev
EXPOSE 3000
CMD ["npm","run","start"]
