FROM node:12.18.1

ARG FUNCTION_DIR="/opt/artyst/"
ARG NODE_ENV=production

WORKDIR ${FUNCTION_DIR}
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . ${FUNCTION_DIR}

CMD [ "node", "src/index.js" ]