import {BaseAPIService} from './base';

export class SysAdminAPIService extends BaseAPIService {
  
    getAddUsers() {
        return this.get(`/internal-accounts`);
    }

    createUser(data) {
        return this.post(`/internal-account`, data);
    }

    deleteUser(data){
        return this.delete(`/account`, data);
    }

}
