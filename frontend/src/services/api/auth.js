import {BaseAPIService} from './base';

export class AuthAPIService extends BaseAPIService {
  test() {
    return this.get('/test');
  }
  login(data) {
    return this.post(`/login`, data);
  }
  changePassword(data) {
    return this.patch(`/password`, data);
  } 
}
