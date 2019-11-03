import { Request, Response } from 'express';
import { HttpError } from '../helpers/util';
import * as path from 'path';

import { initLogger } from '../helpers/logger';
const logger = initLogger(__filename);


//The node library I am using to run the ML/FastText model does not have typescript bindings, very little documentation, and is very brittle.
//The code below initializes the library sets up few functions used in the handlers. Unlike the library the functions have proper types.
//An alternative would be to define a type file for the lib but given how brittle the lib is I decided to just wrap it.
//It should probably be moved to different file but I left it here for clarity.
let predict: (text:string)=>Promise<Array<{label: string, value: number}>>;
let nearestNeighbor: (text:string)=>Promise<Array<{label: string, value: number}>>;
{
    //The ML model was trained with some basic sanitization. We need to replicate to use the model.
    function cleanTextForML(text:string):string{
        text = text.replace(/[,./<>?;:\"!@#$%^&*()=\[\]{}()]/gi, ' ');
        text = text.replace(/[ \t]{2,}/gi, ' ').toLowerCase();
        text = text.replace(/(.)\1\1+/gi, '$1$1$1')
        return text;
    }
    //init lib and define functions
    const fasttext:any = require('fasttext');
    const modelPath = process.env.MODEL_PATH || '/opt/sentiment_analysis/model.bin'
    const query = new fasttext.Query(modelPath);
    nearestNeighbor = function fasttext(text:string):Promise<SentimentResults>{
        return query.nn(cleanTextForML(text), 10)
    }
    const classifier = new fasttext.Classifier(modelPath);
    predict = function predict(text: string):Promise<SentimentResults>{
        return classifier.predict(cleanTextForML(text), 5)
    }
}

export type SentimentResults = Array<{label: string, value: number}>


export async function health(req: Request, res: Response) {
    res.json({webserver:true});
}

export async function sentimentAnalysis(req: Request, res: Response) {
    let body: {text:string} = req.body;
    if(!body.text) throw new HttpError(400, "must supply the 'text` parameter in body")
    logger.info(`predicting text "${body.text}"`)
    const prediction = await predict(body.text);
    prediction.forEach((p)=>p.label=p.label.replace('__label__', '')) //cleanup response from lib a little
    res.json(prediction)
}

export async function nearestWordNeighbors(req: Request, res: Response) {
    let body: {text:string} = req.body;
    if(!body.text) throw new HttpError(400, "must supply the 'text` parameter in body")
    body.text = body.text.trim()
    if(/\s/.test(body.text)) throw new HttpError(400, "text must be a single word")
    logger.info(`nearestWordNeighbors text "${body.text}"`)
    const nearestNeighbors = await nearestNeighbor(body.text)
    res.json(nearestNeighbors)
}
