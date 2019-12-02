import {BaseAPIService} from './base';

export class SysAdminAPIService extends BaseAPIService {
  
    getAddUsers() {
        return this.get(`/admin/internal-accounts`);
    }

    createUser(data) {
        return this.post(`/admin/internal-account`, data);
    }

    deleteUser(data){
        return this.delete(`/admin/account`, data);
    }

}
