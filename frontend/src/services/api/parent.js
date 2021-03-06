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

  getChildAssignments(studentID, from, to) {
    return this.get(`/parent/assignments?studentId=${studentID}&from=${from}&to=${to}`);
  }

  getChildAttendance(studentID, from, to) {
    return this.get(`/parent/attendance?studentId=${studentID}&fromDate=${from}&toDate=${to}`);
  }

  // assignment file
  getAssignmentFile(fileID) {
    return this.get(`/parent/assignment/file?ID=${fileID}`, null, 'arraybuffer');
  }

  getChildNotes(data) {
    return this.get(`/parent/notes`,data);
  }

  getChildNote(data) {
    return this.get(`/parent/note`,data);
  }

  getSubjectslist(){
    return this.get(`/subject/all`);
  }

  getSupportMaterials(studentID){
    return this.get(`/parent/support-material/${studentID}`);
  }
  
  getSupportMaterialFile(fileID) {
    return this.get(`/parent/support-material/file?ID=${fileID}`, null, 'arraybuffer');
  }
}
