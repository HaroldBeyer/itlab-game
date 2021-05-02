import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as logger from 'morgan';

import { connectServerWithDB } from './config/db';

/**
 * Creating application
 */
export const app = express();

/**
 * With this, we can free the service's access
 */
app.use(cors());

/**
 * Allows JSON exchange
 */
app.use(bodyParser.json());

/**
 * Log config
 */
app.use(logger('dev'));

/**
 * DB connection
 */
connectServerWithDB();