import {BaseAPIService} from './base';

export class SysAdminAPIService extends BaseAPIService {
  
    getAddUsers() {
        return this.get(`/internal-accounts`);
    }

    createUser(data) {
        return this.post(`/internal-accounts`, data);
    }

}
