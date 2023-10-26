FROM node:20.9.0-bookworm as base
WORKDIR /app

ARG GITHUB_SHA
ARG version
LABEL org.opencontainers.image.title="docker-browser" \
      org.opencontainers.image.description="docker-browser" \
      org.opencontainers.image.url="https://github.com/shibanet0/docker-browser" \
      org.opencontainers.image.source="https://github.com/shibanet0/docker-browser.git" \
      org.opencontainers.image.authors="shibanet0 <shibanet0@gmail.com>" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.revision="${GITHUB_SHA}"

ARG PLAYWRIGHT_VERSION=1.39.0
ENV PLAYWRIGHT_BROWSERS_PATH=/app/.cache/ms-playwright

RUN npm i -g pnpm@8 && \
pnpm add "playwright@$PLAYWRIGHT_VERSION" && pnpm exec playwright install-deps && pnpm exec playwright install && \
apt-get update && apt-get install -y curl dumb-init && apt-get clean && chown -R node:node /app

FROM base as builder
RUN apt-get install -y build-essential
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y

COPY package.json pnpm-lock.yaml ./
RUN source "/root/.cargo/env" && \
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true pnpm i --frozen-lockfile

COPY swagger.yaml /app/swagger.yaml
COPY src /app/src
COPY __tests__ /app/__tests__
COPY tsconfig.json /app

RUN pnpm run build && pnpm run test && pnpm prune --prod

RUN mkdir /app/tmp && \
mv /app/node_modules /app/tmp/node_modules && \
mv /app/package.json /app/tmp/package.json && \
mv /app/pnpm-lock.yaml /app/tmp/pnpm-lock.yaml && \
mv /app/dist /app/tmp/dist && \
mv /app/swagger.yaml /app/tmp/swagger.yaml && \
chown -R node:node /app/tmp

FROM base
COPY --from=builder /app/tmp /app
USER node
ENTRYPOINT [ "dumb-init", "--" ]
CMD [ "node", "--enable-source-maps", "./dist/index.js" ]
