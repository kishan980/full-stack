FROM node:16-alpine3.13
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache make gcc g++
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
WORKDIR /app
COPY package.json ./
COPY ./ ./
RUN rm -rf ./.env.development
RUN yarn
RUN npm rebuild node-sass
CMD ["yarn","start"]
