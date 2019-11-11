import {BaseAPIService} from './base';

export class ParentAPIService extends BaseAPIService {
  
  getChilds(parentID) {
    return this.get(`/parents/${parentID}/students`);
  }

  selectChid(parentID, studentID) {
    return this.get(`/parents/${parentID}/students/${studentID}`);
  }

}
