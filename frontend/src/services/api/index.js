import { AuthAPIService } from './auth';

class Api {
  constructor() {
    this.auth = new AuthAPIService();
  }

}

export const api = new Api();
