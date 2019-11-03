sentiment_analysis
====

# Developing

## Setup /Install

1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Run `docker-compose up`

## Tasks

All the commands below are for local development and assume you have ran `docker-compose up`

### Run Tests

Run `npm run build_and_test`

Note: this command does not rely on the web container as the tests run outside the container. It does depend on the `test-sentiment_analysis` DB

### Build and restart web

Run `npm run build_and_restart`


### Creating a migration

Run `./scripts/create_migration.sh MIGRATION_NAME`
