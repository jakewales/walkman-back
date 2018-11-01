import * as Koa from 'koa';
import * as bodyParse from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import "reflect-metadata";

import * as cors from '@koa/cors';

import { createConnection } from 'typeorm';

import { router } from './router';
import { DBconfig, APIconfig } from './config';

// const ormConfig = JSON.stringify(fs.readFileSync('db/ormconfig.json'));

(async()=> {
    let connecton = await createConnection(DBconfig);

    const app: Koa = new Koa();

    app.use(bodyParse());
    
    app.use(cors());

    app.use(async(ctx, next) => {
        return next().catch((err) => {
            if (401 === err.status) {
                ctx.status = 401;
                ctx.body = 'Protected resource, use Authorization header to get access\n';
            } else {
                throw err;
            }
        });
    });

    app.use(async(ctx, next) => {
        if (ctx.url.match(/^\/welcome/)) {
            ctx.body = 'unprotected\n';
        } else {
            return next();
        }
    });

    app.use(jwt({
        secret: APIconfig.token.tokenSecret
    }).unless({
        path: [/^\/login/, /^\/signup/]
    }));
    

    app.use(router.routes());

    app.listen(3000);
    console.log('app run at port 3000');
})();
