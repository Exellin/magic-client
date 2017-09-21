import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as path from 'path';

import setRoutes from './config/routes';

const app = express();

dotenv.load({ path: '.env' });

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

mongoose.connection.on('connected', () => {
  console.log(`Connected to database ${process.env.MONGODB_URI}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Database error: ${err}`);
});

setRoutes(app);

app.listen(app.get('port'), () => {
  console.log(`Server started on port ${app.get('port')}`);
});
