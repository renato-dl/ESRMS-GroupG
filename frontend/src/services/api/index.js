import { AuthAPIService } from './auth';
import { ParentAPIService } from './parent';

class Api {
  
  constructor() {
    this.auth = new AuthAPIService();
    this.parent = new ParentAPIService();
  }

}

export const api = new Api();
