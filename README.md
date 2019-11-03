Sentiment Analysis API
====

## Background

Sentiment analysis attempts to extract the sentiment/mood from a section of text. In this case it attempts to label the text as negative or positive. This project is a simple REST API utilizing a [FastText](https://fasttext.cc/) model to do sentiment analysis.

FastText is unsupervised and only understands words and phrases in the context of it's training data. For example, when finding a word's nearest neighbors, the model will be useless for words that don't correlate with mood. Also, as with most ML, it will preform poorly when it encounters text dissimilar from what it was trained on.

## Usage

The **[live demo](https://sentiment.jollybit.com/)** explains how to use the API including example curls and responses.

For reference, an example curl for both of the endpoints exposed by the REST API.
```
curl -X POST -H "Content-Type: application/json" -d '{"text":"broke after 2 days"}' 'https://sentiment.jollybit.com/api/sentiment'
curl -X POST -H "Content-Type: application/json" -d '{"text":"bad"}' 'https://sentiment.jollybit.com/api/nearestneighbors'
```

## Todo / Would Do:

* Running the ML model is CPU intensive and the FastText library is not great. I would definitely improve the devops, run more node processes, and audit the library.
* Redo the he frontend demo page. It is rubbish. It is a modified bootstrap example and some jQuery.
* Add Yelp reviews to the model. I scraped all Yelp locations in the US and have a hundred thousand review to make model better (was out of scope for this demo).

## Notes

* I started with a [TS/Node.js starter project](https://github.com/thingless/typescript-skeleton) I maintain for one off project exactly like this.
* I am using an ML model I trained a while back. You can [read more about it](https://github.com/freethenation/sentimental_nlp).

## Developing

### Setup / Install

1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Run `./scripts/install_model.sh` **NOTE: This file is about 2GB**
5. Run `docker-compose up`

### Run Tests

Run `npm run build_and_test`

### Build and start web for local development

Run `npm run build; npm run startdev;`
