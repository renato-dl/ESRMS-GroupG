import express from 'express';
import path from 'path';
import logger from 'morgan';
import indexRouter from './routes/index';
import parentRouter from './routes/parent';
import teacherRouter from './routes/teacher';
import adminRouter from './routes/admin';
import timetableRouter from './routes/timetable';
import communicationRouter from './routes/communication';
import subjectRouter from './routes/subject'
import {config} from './config';
import cors from 'cors';
import { AuthenticationService } from './services/authenticationService';

const Authentication = AuthenticationService();

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

    this.startServer();
  }

  /**
   * General express middlewares + custom middlewares 
   * 
   */
  setMiddlewares() {
    this.app.use(cors());
    this.app.use(Authentication.init());
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

  setRoutes() {
    this.app.use(`${config.env.api_prefix}/`, indexRouter);
    this.app.use(`${config.env.api_prefix}/parent`, Authentication.authenticate(), parentRouter);
    this.app.use(`${config.env.api_prefix}/teacher`, Authentication.authenticate(), teacherRouter);
    this.app.use(`${config.env.api_prefix}/admin`, Authentication.authenticate(), adminRouter);
    this.app.use(`${config.env.api_prefix}/communication`, Authentication.authenticate(), communicationRouter);
    this.app.use(`${config.env.api_prefix}/subject`, Authentication.authenticate(), subjectRouter);
    this.app.use(`${config.env.api_prefix}/timetable`, Authentication.authenticate(), timetableRouter);
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
