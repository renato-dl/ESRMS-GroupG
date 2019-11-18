import {BaseAPIService} from './base';

export class MarksAPIService extends BaseAPIService {
  
  getMarks() {
    return this.get(`/marks/`);
  }

  selectMarks(studentid) {
    return this.get(`/marks/`);
  }

}