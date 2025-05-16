FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
ENV NODE_OPTIONS=--enable-source-maps
RUN corepack enable


FROM base AS build
RUN apt update
RUN apt install protobuf-compiler -y

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc /usr/src/app/
WORKDIR /usr/src/app
RUN corepack install

COPY apps/auth/package.json /usr/src/app/apps/auth/package.json
COPY apps/gateway/package.json /usr/src/app/apps/gateway/package.json
COPY apps/users/package.json /usr/src/app/apps/users/package.json

COPY shared/database/package.json /usr/src/app/shared/database/package.json
COPY shared/utils/package.json /usr/src/app/shared/utils/package.json
COPY shared/grpc/package.json /usr/src/app/shared/grpc/package.json

RUN pnpm fetch
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --offline -r

COPY . .

RUN pnpm -r build:utils
RUN pnpm build:packages

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=gateway --offline --prod /prod/gateway
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=auth --offline --prod /prod/auth
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=users --offline --prod /prod/users


FROM base AS gateway
COPY --from=build /prod/gateway /prod/gateway
WORKDIR /prod/gateway

EXPOSE 3000
CMD [ "npm", "run", "start" ]

FROM base AS auth
COPY --from=build /prod/auth /prod/auth
WORKDIR /prod/auth

EXPOSE 50052
CMD [ "npm", "run", "start" ]

FROM base AS users
COPY --from=build /prod/users /prod/users
WORKDIR /prod/users

EXPOSE 50053
CMD [ "npm", "run", "start" ]