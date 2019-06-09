import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { Settings } from 'ew-internals';
import Cache from './cache';
import ConnectionManager from './database/connection-manager';
import SchemaProvider from './schema-provider';

import attachGraphQLMiddleware from './apollo';
import attachHomeAPI from '../api/home';
import attachSyncAPI from '../api/sync';
import attachSchemaAPI from '../api/schema';

export default class Application {
    static async make() {
        const instance = new this();

        // pre-init something
        const app = express();
        const settings = new Settings();
        const cache = await Cache.make({ settings });
        const connectionManager = new ConnectionManager({ settings });
        const schemaProvider = new SchemaProvider();

        // migrate
        const sysConn = await connectionManager.getSystem();
        await sysConn.runMigrations();

        instance.attachErrorHandler(app);

        const host = await settings.get('network.host', 'localhost');
        const port = await settings.get('network.port', 3000);

        app.set('host', host);
        app.set('port', port);
        // // increase the default parse depth of a query string and disable allowPrototypes
        // app.set('query parser', query => {
        //   return qs.parse(query, { allowPrototypes: false, depth: 10 });
        // });

        this.attachCORS(app, settings);

        app.use(helmet());
        // turn on JSON parser for REST services
        app.use(express.json());
        // turn on URL-encoded parser for REST services
        app.use(
            express.urlencoded({
                extended: true,
            }),
        );

        attachGraphQLMiddleware(app, {
            settings,
            cache,
            schemaProvider,
            connectionManager,
        });
        attachHomeAPI(app, { cache });
        attachSchemaAPI(app, { cache, connectionManager });
        attachSyncAPI(app, {
            cache,
            schemaProvider,
            connectionManager,
        }); // todo: temporary endpoint

        instance._express = app;

        // logger.info('Application initialized');

        return instance;
    }

    attachErrorHandler(app) {
        // catching async unhandled rejections
        process
            .on('unhandledRejection', err => {
                logger.error('Unhandled rejection', err);
            })
            .on('uncaughtException', err => {
                logger.error('Uncaught exception', err);
            });

        // catching normal unhandled exceptions
        app.use((err, req, res, next) => {
            logger.error('Uncaught exception', err);
            res.send('Nasty error'); // todo: explain here
        });
    }

    static attachCORS(app, settings) {
        const parameters = {
            origin: (origin, cb) => {
                // allow requests with no origin, like mobile apps or curl requests
                if (!origin) {
                    return cb(null, true);
                }

                // in devel mode everything is allowed
                if (__DEV__) {
                    return cb(null, true);
                }

                // get cors settings on each hit, to be able to change it at the run-time
                settings
                    .get('network.cors', null)
                    .then(corsSettings => {
                        const origins = _.isne(corsSettings)
                            ? corsSettings.split(',').map(x => x.trim())
                            : [];

                        let match = false;
                        if (_.iane(origins)) {
                            // we have CORS settings
                            match = origins.indexOf(origin) >= 0;
                        }

                        if (match) {
                            return cb(null, true);
                        } else {
                            return cb(new Error('CORS mismatch'), false); // todo: throw 403
                        }
                    })
                    .catch(error => {
                        logger.error(
                            'Error occurred when checking CORS',
                            error,
                        );
                        return cb(new Error('CORS error'), false); // todo: throw 500
                    });
            },
        };

        app.use(cors(parameters));
    }

    async listen() {
        const port = this._express.get('port');
        const hostname = this._express.get('host');

        return new Promise(resolve => {
            this._server = this._express.listen({ port }, () => {
                logger.info(
                    `🚀 API server is ready at http://${hostname}:${port}`,
                    !__TEST__,
                );
                resolve();
            });
        });
    }

    async launch() {
        await this.listen();
    }

    async shutdown() {
        if (this._server) {
            return new Promise(resolve => {
                this._server.close(resolve);
            });
        }
    }

    getExpress() {
        return this._express;
    }
}
