import {BaseAPIService} from './base';

export class AuthAPIService extends BaseAPIService {
  test() {
    return this.get('/test');
  }
//?????????????????
  /* login(data) {
    return this.post(`/login`, data);
  } */
}
