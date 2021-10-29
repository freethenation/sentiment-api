import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as handlers from './handlers/handlers';

import { initLogger } from './helpers/logger';
const logger = initLogger(__filename);

export const app = express();
app.enable('trust proxy'); //I usually run my node servers behind nginx as it is better at SSL & security in general. This option tells node to trust X-Forwarded-* headers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//Express does not support Promise handlers. This adds support. Casting is to make it play well with TS because 'express-promise-router' has no TS defs.
export const router = require('express-promise-router')() as express.Router;

app.use('', router);
router.get('/_health', handlers.health); //useful for monitoring
router.post('/api/sentiment', handlers.sentimentAnalysis)
router.post('/api/nearestneighbors', handlers.nearestWordNeighbors)

app.use(express.static('public')); //Anything in public folder will be served statically


//Setup how errors are returned to the user. NODE_ENV environment variable controls this behavior
if (app.get('env') === 'testing') {
    // Do not register any error handlers if we are in the tests
} else if (app.get('env') === 'development') {
    //express error handling
    app.use(function (err: any, req: express.Request, res: express.Response, next: any) {
        logger.error(`exception calling handler ${req.url}`, { err });
        res.status(err.status || 500);
        res.json({
            status: err.status || 500,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    });
} else {
    // production error handler... no stacktraces leaked to user
    app.use(function (err: any, req: express.Request, res: express.Response, next: any) {
        if (err.status !== 404) logger.error(`exception calling handler ${req.url}`, { err });
        res.status(err.status || 500); //duck typing for HttpError. If the error has `status` then it is assumed safe to show to user.
        res.json({
            status: err.status || 500,
            message: err.status ? err.message : 'Internal Error',
        });
    });
}

const PORT = process.env.WEB_PORT || 3000;
async function main() {
    const server = app.listen(PORT, async function mainApp() {
        logger.info(`Listening on port ${PORT}...`);
    });
    server.setTimeout(301 * 1000);
    process.on('SIGTERM', function shutDown() {
        logger.info('Received SIGTERM signal, shutting down gracefully');
        server.close(() => {
            logger.info('Closed out remaining connections');
            process.exit(0);
        });
    });
}

if (require.main === module) {
    main();
}
