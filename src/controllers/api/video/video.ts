import { Context, Response } from 'koa';
import { fs } from 'mz';

export default class VideoController {
	public static async getVideo(ctx: Context) {
		const filePath = `${process.cwd()}/media/DJI_20181126_141625.mp4`;
		const status = fs.statSync(filePath);
		const fileSize = status.size;
		const range = ctx.request.headers.range;

		if (range) {
			console.log('parts');
			let parts = range.replace(/bytes=/, '').split('-');
			let start = parseInt(parts[0], 10);
			let end = parts[1] ? parseInt(parts[1], 10): start + 999999;

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
			console.log('all');
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