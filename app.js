// 9Ij62MhBMOLIoZQ5

import express from 'express';
const app = express();
import cors from 'cors';
import mng from 'mongoose';
import bp from 'body-parser';
import userRouter from './server/user/userRouter.js';
import moneyRouter from './server/money/moneyRouter.js';
import adminRouter from './server/admin/adminRouter.js';
import quizRouter from './server/quiz/quizRouter.js';

const { set, connect } = mng;
const { json } = bp;

const port = process.env.PORT || 3000;
const MONGO_URL = `mongodb://qwerty:9Ij62MhBMOLIoZQ5@ac-ek4wj69-shard-00-00.jmt0gmm.mongodb.net:27017,ac-ek4wj69-shard-00-01.jmt0gmm.mongodb.net:27017,ac-ek4wj69-shard-00-02.jmt0gmm.mongodb.net:27017/?ssl=true&replicaSet=atlas-12rcvp-shard-0&authSource=admin&retryWrites=true&w=majority`

app.use(json());
app.use(cors());
app.use('/user', userRouter);
app.use('/money', moneyRouter);
app.use('/admin', adminRouter);
app.use('/quiz', quizRouter);

async function start() {
	try {
		set('strictQuery', true);
		await connect(MONGO_URL);
		app.listen(port, function () {
			console.log(`Server listens ${port}`);
		});
	} catch (error) {
		console.log(error);
	}
}

start();