import {BaseAPIService} from './base';

export class AuthAPIService extends BaseAPIService {
  test() {
    return this.get('/test');
  }
}
