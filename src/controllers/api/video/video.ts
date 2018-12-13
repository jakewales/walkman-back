import { Context, Response } from 'koa';
import { fs } from 'mz';

export default class VideoController {
	public static async getVideo(ctx: Context) {
		const videoId = ctx.params.id;
		const streamType = ctx.params.type;
		const device = ctx.params.device;
		const filePath = `${process.cwd()}/media/demo2.mp4`;
		const status = fs.statSync(filePath);
		const fileSize = status.size;
		const range = ctx.request.headers.range ? ctx.request.headers.range : 'bytes=0-';
		if (streamType === 'range') {
			let parts = range.replace(/bytes=/, '').split('-');
			let start = parseInt(parts[0], 10);
			const chunkStep = device === 'Android' ? Math.ceil((fileSize - start) / 3 > 1048575 ? (fileSize - start) / 3 : 1048575) : 524287;
			let end = parts[1] ? parseInt(parts[1], 10): start + chunkStep;

			end = end > fileSize - 1 ? fileSize - 1 : end;

			let chunksize = (end - start) + 1;
			let file = fs.createReadStream(filePath, {start, end});
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Range': 'bytes',
				'Content-Length': String(chunksize),
				'Content-Type': 'video/mp4'
			};
			ctx.set(head);
			ctx.status = 206;
			ctx.body = file;
		} else {
			let head = {
				'content-Length': String(fileSize),
				'Content-Type': 'video/mp4'
			};
			ctx.set(head);
			ctx.status = 200;
			try {
				ctx.body = fs.createReadStream(filePath);
			} catch(e) {
				console.log(e);
			}
		}
	}
}