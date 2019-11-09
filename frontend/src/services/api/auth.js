import {BaseAPIService} from './base';

export class AuthAPIService extends BaseAPIService {
  test() {
    this.get('/api/test');
  }
}