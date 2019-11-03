import * as assert from 'assert'
import * as request from 'supertest';
import { app } from '../app';
import { SentimentResults } from '../handlers/handlers'


import { initLogger } from '../helpers/logger';
const logger = initLogger(__filename);

describe('sentiment handlers', function(){
    it('should analyze sentiment', async function(){
        let ret:SentimentResults = (await request(app)
            .post('/api/sentiment')
            .send({text:"this place sucks"})
            .set('Accept', 'application/json')
            .expect(200)).body as SentimentResults

        assert.equal(ret.length, 2, 'should have only 2 results')
        assert.ok(ret.find(r=>r.label=="positive") , 'should have positive label')
        assert.ok(ret.find(r=>r.label=="negative") , 'should have negative label')
    })

    it('should find synonyms', async function(){
        let ret:SentimentResults = (await request(app)
            .post('/api/nearestneighbors')
            .send({text:"bad"})
            .set('Accept', 'application/json')
            .expect(200)).body as SentimentResults
        assert.equal(ret.length, 10, 'should have 10 results')
    })
})