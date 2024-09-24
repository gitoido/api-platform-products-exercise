# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=16

# "common" stage
FROM node:${NODE_VERSION}-alpine AS api_platform_pwa_common

RUN npm i -g @vue/cli @vue/cli-service-global

EXPOSE 3000

WORKDIR /usr/src/pwa

# prevent the reinstallation of node modules at every changes in the source code
COPY package.json package-lock.json ./

RUN npm install

COPY . ./

VOLUME /usr/src/pwa/node_modules


# "development" stage
# depends on the "common" stage above
FROM api_platform_pwa_common AS api_platform_pwa_dev

ENV NODE_ENV development

COPY --from=api_platform_pwa_common /usr/src/pwa/node_modules /usr/src/pwa/node_modules

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
RUN chmod +rwx /usr/src/pwa

CMD ["npm", "run", "dev"]
