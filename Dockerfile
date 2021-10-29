# Build Stage
FROM node:17-bullseye-slim AS build-stage

LABEL app="build-sentiment_analysis"

ADD . /opt/sentiment_analysis
WORKDIR /opt/sentiment_analysis

RUN npm install --unsafe-perm=true && \
  npm run build && \
  rm -r node_modules && \
  npm install --only=prod

# Final Stage
FROM node:17-bullseye-slim

#ARG GIT_COMMIT
LABEL GIT_COMMIT=$GIT_COMMIT

RUN apt-get update && DEBIAN_FRONTEND="noninteractive" apt-get install -y wget
  && rm -rf /var/lib/apt/lists/*

COPY --from=build-stage /opt/sentiment_analysis /opt/sentiment_analysis
WORKDIR /opt/sentiment_analysis

CMD ["node", "--max-old-space-size=4096", "dist/app.js"]
