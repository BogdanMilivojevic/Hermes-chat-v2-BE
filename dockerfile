FROM node:18.9

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

CMD if [ "$NODE_ENV" = "production" ]; \
    then npm run start; \
    else npm run dev; \
    fi
