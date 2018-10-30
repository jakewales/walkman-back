import { Context } from 'koa';

import * as jsonwebtoke from 'jsonwebtoken';
import { APIconfig } from '../../config';
import respCtx from '../../model/api/response';

let tokenVail = (ctx: Context) => {
    const token: string = ctx.header.authorization;
    try {
        let playload = jsonwebtoke.verify(token.split(' ')[1], APIconfig.token.tokenSecret);
        if (playload.exp < Date.now()) {
            ctx.status = 403;
            ctx.body = <respCtx>{
               statusCode: -4,
               data: {},
               errorMessage: ['token 过期，请重新登陆']
            }
        } else {
            return true;
        }
    } catch (e) {
        ctx.status = 403;
        ctx.body = <respCtx>{
            statusCode: -4,
            data: {},
            errorMessage: ['无效token']
         }
    }
}
export default tokenVail;
