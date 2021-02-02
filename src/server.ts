import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import statisticsRoutes from './routes/statisticsRoutes';
import syncRoutes from './routes/syncRoutes';
import authRoutes from './routes/authRoutes';
import { BASE_API } from './constants/endpoint';

const app: express.Application = express();

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
  })
);

// Handle logs in console during development
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

/************************************************************************************
 *                               Register all routes
 ***********************************************************************************/
app.get('/', (req, res) => res.status(200).json({ status: 'up' }));
app.use(BASE_API, authRoutes);
app.use(BASE_API, statisticsRoutes);
app.use(BASE_API, syncRoutes);

/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  return res.status(500).json({
    errorName: err.name,
    message: err.message,
  });
});

export default app;
