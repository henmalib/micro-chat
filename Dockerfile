FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt update
RUN apt install protobuf-compiler -y


FROM base AS build
COPY package.json pnpm-lock.yaml /usr/src/app/
WORKDIR /usr/src/app
RUN corepack install

# TODO: copy only package.json
COPY . /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter "./shared/**" --filter "micro-chat" --frozen-lockfile

RUN sh /usr/src/app/scripts/generate-types.sh
RUN cd /usr/src/app/shared/database && pnpm build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN node /usr/src/app/scripts/build.js

RUN pnpm deploy --filter=gateway --prod /prod/gateway --legacy
RUN pnpm deploy --filter=auth --prod /prod/auth --legacy

FROM base AS gateway
COPY --from=build /prod/gateway /prod/gateway
WORKDIR /prod/gateway
CMD [ "npm", "run", "start" ]

FROM base AS auth
COPY --from=build /prod/auth /prod/auth
WORKDIR /prod/auth
CMD [ "npm", "run", "start" ]
