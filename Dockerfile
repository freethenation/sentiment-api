# Build Stage
FROM node:10.10.0 AS build-stage

LABEL app="build-sentiment_analysis"

ADD . /opt/sentiment_analysis
WORKDIR /opt/sentiment_analysis

RUN npm install --unsafe-perm=true && npm run build

# Final Stage
FROM node:10.10.0

#ARG GIT_COMMIT
LABEL GIT_COMMIT=$GIT_COMMIT

COPY --from=build-stage /opt/sentiment_analysis/ /opt/sentiment_analysis

WORKDIR /opt/sentiment_analysis

CMD ["node", "--max-old-space-size=4096", "dist/app.js"]
