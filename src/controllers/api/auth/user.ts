import { Context } from 'koa';
import { Personnel } from '../../../db/entity/User';
import { Repository, getManager } from 'typeorm';
import { validate, ValidationError } from 'class-validator';

import * as jsonwebtoken from 'jsonwebtoken';

import { APIconfig } from '../../../config';

import respCtx from '../../../model/api/response';

import { loginRequest, updateProfile} from '../../../model/api/auth';


export default class UserController {

    public static async getUser(ctx: Context) {
        const userRepository: Repository<Personnel>  = getManager().getRepository(Personnel);
        const requestInfo = <loginRequest>ctx.request.body;
        const user = await userRepository.find({
            where: {
                name: requestInfo.name,
                password: requestInfo.password
            }
        });
        if (user && user.length) {
            let tokePlayload = {
                getTime: Date.now(),
                userId: user[0].id
            };
            ctx.status = 200;
            ctx.body = <respCtx>{
                statusCode: 1,
                data: {},
                token: jsonwebtoken.sign(tokePlayload, APIconfig.token.tokenSecret, {
                    expiresIn: APIconfig.token.expiration
                })
            };
        } else {
            ctx.status = 403;
            ctx.body = <respCtx>{
                statusCode: -1,
                data: {},
                errorMessage: ['用户名或密码错误']
            };
        }
    }

    public static async createUser(ctx: Context) {
        const userRepository: Repository<Personnel> = getManager().getRepository(Personnel);
        const signUser: Personnel = new Personnel();
        const requestInfo = <Personnel>ctx.request.body;
        signUser.name = requestInfo.name;
        signUser.email = requestInfo.email;
        signUser.password = requestInfo.password;

        const errors: ValidationError[] = await validate(signUser);

        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = <respCtx>{
                statusCode: -1,
                data: {},
                errorMessage: JSON.parse(JSON.stringify(errors))
            };
        } else if (await userRepository.findOne({ name: signUser.name })) {
            ctx.status = 400;
            ctx.body = <respCtx>{
                statusCode: -1,
                data: {},
                errorMessage: ['用户名已经被占用']
            };
        } else {
            const user = await userRepository.save(signUser);
            ctx.status = 201;
            ctx.body = <respCtx>{
                statusCode: 1,
                data: user,
                message: ['创建成功']
            };
        }
    }

    public static async updateUser(ctx: Context) {
        const userRepository: Repository<Personnel> = getManager().getRepository(Personnel);
        const requestInfo = <updateProfile>ctx.request.body;
        let userProfile = await userRepository.find({
            where: {
                id: requestInfo.id
            }
        });
        if (userProfile && userProfile.length) {
            try {
                userProfile[0].name = requestInfo.name;
                userProfile[0].description = requestInfo.description;
                await userRepository.save(userProfile[0]);
                ctx.status = 200;
                ctx.body = <respCtx>{
                    statusCode: 1,
                    data: {},
                    message: ['修改成功']
                }
            }  catch (e) {
                console.log(JSON.stringify(e));
                ctx.body = <respCtx>{
                    statusCode: -1,
                    data: {},
                    errorMessage: ['更新失败']
                }
            }
        } else {
            ctx.status = 404;
            ctx.body = <respCtx>{
                statusCode: -2,
                data: {},
                errorMessage: ['未找到该用户']
            }
        }
    }

    public static async disableUser(ctx: Context) {
    }
};