import {Model} from './base';

class User extends Model {
  constructor() {
    super('users');
  }
}

export default new User();

