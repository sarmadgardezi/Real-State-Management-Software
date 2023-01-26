FROM node:16.18-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_BIN "/usr/bin/chromium-browser"

RUN apk --no-cache add build-base python3 chromium

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn .yarn
COPY services/common services/common
COPY services/pdfgenerator services/pdfgenerator

RUN corepack enable && \
    corepack prepare yarn@stable --activate

RUN yarn workspaces focus @microrealestate/pdfgenerator

RUN chown -R node:node /usr/app

USER node

CMD ["yarn", "workspace", "@microrealestate/pdfgenerator", "run", "dev"]