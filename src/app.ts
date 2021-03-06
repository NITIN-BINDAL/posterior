import express, { Response, Application} from 'express';
import mongoose from 'mongoose';

import passport from 'passport';

import config from './config';

import AuthRouter from './routers/auth.router';

import swaggerui from 'swagger-ui-express';

import swaggerJSDoc from 'swagger-jsdoc';

import def from './definitions.js';

const options = {
	definition: def,

	apis: ['./routers/auth.router.ts']
};

const swaggerSpec = swaggerJSDoc(options);

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use('/swagger', swaggerui.serve, swaggerui.setup(swaggerSpec));

app.listen(config.PORT, (err: any) => {
	if (err) {
		console.error(`Unable to start app. Found error: ${err.message}`);
		return;
	}
	console.error(`Server Running at PORT: ${config.PORT}`);
});

app.use('/api/auth', AuthRouter);

mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongoUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on(
	'error',
	console.error.bind(console, 'MongoDB Connection Error...')
);

app.use(function (err: any, res: Response) {
	res.status(err.status || 500);
	res.end(err.message);
});



module.exports = app;
