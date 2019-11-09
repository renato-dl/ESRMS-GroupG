import express from 'express';
import path from 'path';
import logger from 'morgan';
import indexRouter from './routes/index';
import {config} from './config';
import cors from 'cors';
import createError from 'http-errors';
import {NOT_FOUND, SERVICE_UNAVAILABLE} from 'http-status';

export class Application {
  constructor() {
    this.app = express();
    this.app.disable('x-powered-by');
  }

  bootstrap() {
    this.setMiddlewares();
    this.setRoutes();
    
    if (config.env.type === 'production') {
      this.setClientFallback();
    }

    this.setErrorMiddleware();
    this.startServer();
  }

  /**
   * General express middlewares + custom middlewares 
   * 
   */
  setMiddlewares() {
    this.app.use(cors());
    this.app.use(logger('dev'));

    // To serve static frontend files
    if (config.env.type === 'production') {
      this.app.use(express.static(path.join(__dirname, '..', 'frontend/build')));
    } else {
      this.app.use(express.static(path.join(__dirname, '..', 'public')));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  /**
   * Error middleware when no route is matched
   */
  setErrorMiddleware() {
    // catch 404 and forward to error handler
    this.app.use(function(req, res, next) {
      next(createError(NOT_FOUND));
    });

    // error handler
    this.app.use(function(err, req, res, next) {
      res.status(NOT_FOUND).json({ message: err.message });
    });
  }

  setRoutes() {
    this.app.use(`${config.env.api_prefix}/`, indexRouter);
  }

  // sends back the index.html for the client if none of the routes is matched
  setClientFallback() {
    this.app.get('*', (req, res) => { 
      res.sendFile(path.resolve(__dirname, '..', 'frontend/build/index.html')) 
    });
  }

  startServer() {
    this.app.listen(config.env.port, () => {
      console.log(`Server started, listening at port ${config.env.port}`);
    });
  }
}
