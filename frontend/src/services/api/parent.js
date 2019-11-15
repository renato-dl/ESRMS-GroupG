import {BaseAPIService} from './base';

export class ParentAPIService extends BaseAPIService {
  
  getChilds(parentID) {
    return this.get(`/parent/${parentID}/students`);
  }

  selectChid(parentID, studentID) {
    return this.get(`/parent/${parentID}/students/${studentID}`);
  }

  getChildMarks(parentID, studentID) {
    return this.get(`/parent/${parentID}/grades?studentId=${studentID}`);
  }

}
