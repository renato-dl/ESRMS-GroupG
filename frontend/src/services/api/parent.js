import {BaseAPIService} from './base';

export class ParentAPIService extends BaseAPIService {
  
  getChilds(parentID) {
    return this.get(`/parent/students`);
  }

  selectChid( studentID) {
    return this.get(`/parent/students/${studentID}`);
  }

  getChildMarks(studentID) {
    return this.get(`/parent/grades?studentId=${studentID}`);
  }

}
