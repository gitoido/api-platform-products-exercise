# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=20

# "common" stage
FROM node:${NODE_VERSION}-alpine AS api_platform_pwa_common

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

CMD ["npm", "run", "dev"]


# "build" stage
# depends on the "common" stage above
FROM api_platform_pwa_common AS api_platform_pwa_prod

COPY --from=api_platform_pwa_common /usr/src/pwa/node_modules /usr/src/pwa/node_modules

ENV NODE_ENV production
ARG NEXT_PUBLIC_ENTRYPOINT

RUN set -eux; \
	npm run build

CMD ["npm", "run", "preview"]
