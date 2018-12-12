import * as Router from 'koa-router';

import UserController from './controllers/api/auth/user';
import AudioController from './controllers/api/audio/audio';
import VideoController from './controllers/api/video/video';

export const router: Router = new Router();

// User

router.post('/signup', UserController.createUser);

router.post('/login', UserController.getUser);

router.post('/updateInfo', UserController.updateUser);

router.post('/delete', UserController.disableUser);

// Audio

router.post('/createAudio', AudioController.createAudio);

router.post('/uploadAudio', AudioController.uploadAudio);

router.post('/collection', AudioController.collectionAudio);

router.get('/audioList', AudioController.getAudioList);

router.get('/audioInfo/:id', AudioController.getAudioInfo);

router.get('/audio/:id', AudioController.getAudio);

router.get('/lyrics/:id', AudioController.getLyrics)

// Video

router.get('/video/:id&:type&:device', VideoController.getVideo);
