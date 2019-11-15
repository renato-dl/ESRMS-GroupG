import {Model} from './base';

class Admin extends Model {
  constructor() {
    super('Admin');
  }
  async insertParentData(ID, FirstName, LastName, eMail, SSN, Password) {
      //todo
  }
}