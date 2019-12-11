import {BaseAPIService} from './base';

export class CommunicationAPIService extends BaseAPIService {
  list() {
    return this.get('/communication');
  }

  add(title, description, isImportant, dueDate) {
    return this.post('/communication', { title, description, isImportant, dueDate });
  }

  update(ID, title, description, isImportant, dueDate) {
    return this.patch(`/communication/${ID}`, { title, description, isImportant, dueDate });
  }

  remove(ID) {
    return this.delete(`/communication/${ID}`);
  }
}
