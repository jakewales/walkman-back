import { Context, Response } from 'koa';
import { Repository, getManager } from 'typeorm';
import { ValidationError, validate } from 'class-validator';
import { fs } from 'mz';
import * as getRawBody from 'raw-body';
import * as audioMetadata from 'audio-metadata';

import respCtx from '../../../model/api/response';

import { PlayList } from '../../../db/entity/PlayList';
import { Audio } from '../../../db/entity/Audio';
import { Personnel } from '../../../db/entity/User';

interface audioInfo {
    name: string;
    desc?: string;
    singer?: string;
    timeLength: number;
    album?: string;
    url: string;
}

interface collectionInfo {
    userId: number;
    audioId: number;
}

export default class AudioController {
    public static async createAudio(ctx: Context) {
        const audioRepository: Repository<Audio> = getManager().getRepository(Audio);
        const audio: Audio = new Audio();
        const requestInfo = <audioInfo>ctx.request.body;
        
        audio.name = requestInfo.name;
        audio.desc = requestInfo.desc ? requestInfo.desc : '';
        audio.singer = requestInfo.singer ? requestInfo.singer : '';
        audio.timeLength = requestInfo.timeLength ? requestInfo.timeLength : null;
        audio.album = requestInfo.album ? requestInfo.album : '';
        audio.url = requestInfo.url;

        const errors: ValidationError[] = await validate(audio);

        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = <respCtx>{
                statusCode: -1,
                data: {},
                errorMessage: JSON.parse(JSON.stringify(errors))
            };
        } else if (await audioRepository.findOne({ name: audio.name })) {
            ctx.status = 400;
            ctx.body = <respCtx>{
                statusCode: -1,
                data: {},
                errorMessage: ['存在同名歌曲']
            };
        } else {
            const audioFeedback = await audioRepository.save(audio);
            ctx.status = 201;
            ctx.body = <respCtx>{
                statusCode: 1,
                data: audioFeedback,
                message: ['创建成功']
            };
        }
    }

    public static async uploadAudio(ctx: Context) {

    }

    public static async collectionAudio(ctx: Context) {
        const audioRepository: Repository<Audio> = getManager().getRepository(Audio);
        const userRepository: Repository<Personnel> = getManager().getRepository(Personnel);
        const collectionRepository: Repository<PlayList> = getManager().getRepository(PlayList);
        const collection: PlayList = new PlayList();
        const collectionRequest = <collectionInfo>ctx.request.body;
        
        if (await collectionRepository.findOne({userId: collectionRequest.userId, audioId: collectionRequest.audioId})) {
            ctx.status = 401;
            ctx.body = <respCtx> {
                statusCode: -1,
                data: {},
                errorMessage: ['不要重复收藏']
            };
            return;
        }
        try {
            const audio = await audioRepository.findOne({id: collectionRequest.audioId});
            collection.audioId = audio.id;
        } catch (e) {
            ctx.status = 401;
            ctx.body = <respCtx> {
                statusCode: -1,
                data: {},
                errorMessage: ['收藏歌曲不存在']
            };
            return;
        }
        
        try {
            const user = await userRepository.findOne({id: collectionRequest.userId});
            collection.userId = user.id;
        } catch (e) {
            ctx.status = 401;
            ctx.body = <respCtx> {
                statusCode: -1,
                data: {},
                errorMessage: ['收藏用户不存在']
            };
            return;
        }
        
        const errors: ValidationError[] = await validate(collection);

        if (errors && errors.length) {
            ctx.status = 400;
            ctx.body = <respCtx>{
                statusCode: -1,
                data: {},
                errorMessage: JSON.parse(JSON.stringify(errors))
            };
        } else {
            try {
                await collectionRepository.save(collection);
                ctx.status = 200;
                ctx.body = <respCtx> {
                    statusCode: 1,
                    data: {},
                    message: ['收藏成功']
                }
            } catch (e) {
                ctx.status = 500;
                ctx.body = <respCtx>{
                    statusCode: -1,
                    data: {},
                    errorMessage: ['收藏失败']
                }
            }
        }
    }

    public static async getAudioList(ctx: Context) {

    }

    public static async getAudioInfo(ctx: Context) {

    }

    public static async getAudio(ctx: Context) {
        const audioRepository: Repository<Audio> = getManager().getRepository(Audio);
        const audioId = ctx.params.id;
        try {
            const audio: Audio = await audioRepository.findOne({id: audioId});
            const fileName: string = audio.url;
            const fileStream = fs.createReadStream(`${process.cwd()}/media/${fileName}`);
            let fileBuffer: Buffer = await getRawBody(fileStream);
            ctx.set('Content-type', 'arraybuffer');
            ctx.body = fileBuffer;
        } catch(e) {
            ctx.status = 404;
            ctx.body = <respCtx>{
                statusCode: -1,
                data: {},
                errorMessage: ['未找到对应音乐']
            }
        }
    }


    public static async getLyrics(ctx: Context) {
        
    }

    public static toArrayBuffer(buffer: Buffer) {
        let ab = new ArrayBuffer(buffer.length);
        let view = new Uint8Array(ab);
        for (let i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
        }
        return ab;
    }
}

