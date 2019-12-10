import {Model} from './base';

class Communication extends Model {
  constructor() {
    super('Communications');
  }

  validteTitleAndDescription(title, description) {
    if (!title || !description) {
      throw new Error('Please provide a valid title and description.');
    }

    if (title.length > 255) {
      throw new Error('Invalid title.');
    }
  }

  async add(Title, Description) {
    this.validteTitleAndDescription(Title, Description);

    const communicationID = await this.create({ Title, Description });
    return await this.findById(communicationID);
  }

  async update(id, Title, Description) {
    if (!id) {
      throw new Error('Please provide a valid id.');
    }

    this.validteTitleAndDescription(Title, Description);

    const updated = await super.update(id, { Title, Description });
    
    if (updated) {
      return await super.findById(id);
    }

    return null;
  }

  async remove(id) {
    if (!id) {
      throw new Error('Please provide a valid id.');
    }

    return super.remove(id);
  }
}

export default new Communication();