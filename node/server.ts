import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as path from 'path';

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(bodyParser.json());

dotenv.load({ path: '.env' });

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

mongoose.connection.on('connected', () => {
  console.log(`Connected to database ${process.env.MONGODB_URI}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Database error: ${err}`);
});

app.listen(app.get('port'), () => {
  console.log(`Server started on port ${app.get('port')}`);
});
