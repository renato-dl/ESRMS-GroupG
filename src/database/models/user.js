import {Model} from './base';

class User extends Model {
  constructor() {
    super('user');
  }
}

export default new User();
