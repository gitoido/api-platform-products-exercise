# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=16

# "common" stage
FROM node:${NODE_VERSION}-alpine AS api_platform_pwa_dev

RUN npm i -g @vue/cli @vue/cli-service-global serve

EXPOSE 3000

WORKDIR /usr/src/pwa

# prevent the reinstallation of node modules at every changes in the source code
COPY package.json package-lock.json ./
RUN npm install

ENV NODE_ENV production
COPY . ./
RUN npm run build


CMD ["npm", "run", "serve"]
