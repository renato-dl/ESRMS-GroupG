
import {BaseAPIService} from './base';

export class AdminAPIService extends BaseAPIService {

    getAuthParentList() {
    return this.get(`/admin/parents`);
  }

  saveNewParent(adminId) {
    return this.post(`/admin/${adminId}/parent`);
  }

}