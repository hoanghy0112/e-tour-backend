FROM node:lts-alpine

ARG MONGO_URL

# ENV MONGO_URL=mongodb+srv://hoanghy:01122003@data.nylr2.mongodb.net/etour

ENV NODE_ENV=development
ENV PORT=80
ENV CORS_URL=*
ENV LOG_DIR=logs
ENV MONGO_URL=mongodb+srv://hoanghy:01122003@data.nylr2.mongodb.net/etour
ENV TZ=UTC
ENV DB_MIN_POOL_SIZE=2
ENV DB_MAX_POOL_SIZE=5
ENV ACCESS_TOKEN_VALIDITY_SEC=172800
ENV REFRESH_TOKEN_VALIDITY_SEC=604800
ENV TOKEN_ISSUER=etour.com
ENV TOKEN_AUDIENCE=etour.com

USER node

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
# CMD [ "npm", "run", "watch" ]