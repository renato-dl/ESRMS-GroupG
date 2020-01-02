import CommunicationModel from '../src/database/models/communication';
import moment from 'moment';

describe("Tests about communications", () => {
    const date = moment.utc().format('YYYY-MM-DD 00:00:00');

    test('It should return the list of all communications', async () => {
        const communications = await CommunicationModel.findAll();
        expect(communications).not.toBeNull();
        
        if (communications.length) {
            expect(communications[0].Title).toBeTruthy();
            expect(communications[0].Title.length).toBeLessThan(255);
            expect(communications[0].Description).toBeTruthy();
            expect(communications[0].DueDate).toBeTruthy();
        }
    });

    test('It should return the list of all active communications', async () => {
        const communications = await CommunicationModel.findAllActive();
        expect(communications).not.toBeNull();
        
        if (communications.length) {
            expect(communications[0].Title).toBeTruthy();
            expect(communications[0].Title.length).toBeLessThan(255);
            expect(communications[0].Description).toBeTruthy();
            expect(communications[0].DueDate).toBeTruthy();
            expect(moment(communications[0].DueDate).startOf('day').unix()).toBeGreaterThanOrEqual(moment().startOf('day').unix());
        }
    });


    test('It should should create a new communication', async () => {
        const title = "New test communication";
        const description = "New test description";

        const communication = await CommunicationModel.add(title, description, true, date);
        expect(communication).not.toBeNull();
        expect(communication.Title).toEqual(title);
        expect(communication.Description).toEqual(description);
        expect(moment.utc(communication.DueDate).format('YYYY-MM-DD 00:00:00').toString()).toEqual(date.toString());
        expect(communication.IsImportant).toEqual(1);

        await CommunicationModel.remove(communication.ID);
    });

    test('It should throw Error with message \'Please provide a valid title and description.\' when an invalid title or description is passed when adding a new communication', async () => {
        const title = "New test communication";
        const description = "";
        try {
            const communication = await CommunicationModel.add(title, description, false, date);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Please provide a valid title and description.');
        }
    });

    test('It should throw Error with message \'Invalid title.\' when a title string with length > 255 is passed when adding a new communication', async () => {
        const title = "Really really Really really Really really Really really Really really Really really Really really Really really Really really Really really Really really Really really Really really Really really  Really really Really really Really really Really really Long title";
        const description = "Test description";
        try {
            const communication = await CommunicationModel.add(title, description, true, date);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Invalid title.');
        }
    });

    test('It should should update a communication', async () => {
        let title = "New test communication";
        let description = "New test description";

        const communication = await CommunicationModel.add(title, description, true, date);

        title += " updated";
        description += " updated";
        const updatedCommunication = await CommunicationModel.update(communication.ID, title, description, true, date);
        expect(updatedCommunication).not.toBeNull();
        expect(updatedCommunication.ID).toEqual(communication.ID);
        expect(updatedCommunication.Title).toEqual(title);
        expect(updatedCommunication.IsImportant).toEqual(1);
        expect(moment.utc(updatedCommunication.DueDate).format('YYYY-MM-DD 00:00:00').toString()).toEqual(date.toString());
        expect(updatedCommunication.Description).toEqual(description);
        
        await CommunicationModel.remove(updatedCommunication.ID);
    });

    test('It should throw Error with message \'Please provide a valid title and description.\' when an invalid title or description is passed when updating a communication', async () => {
        const title = "New test communication";
        const description = "New description";
        const communication = await CommunicationModel.add(title, description, true, date);

        try {
            const updatedCommunication = await CommunicationModel.update(communication.ID, title, "", true, date);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Please provide a valid title and description.');
            await CommunicationModel.remove(communication.ID)
        }
    });

    test('It should throw Error with message \'Invalid title.\' when a title string with length > 255 is passed when updating a communication', async () => {
        const title = "Test communication";
        const updatedTitle = "Really really Really really Really really Really really Really really Really really Really really Really really Really really Really really Really really Really really Really really Really really  Really really Really really Really really Really really Long title";
        const description = "Test description";
        const communication = await CommunicationModel.add(title, description, false, date);

        try {
            const updatedCommunication = await CommunicationModel.update(communication.ID, updatedTitle, description, false, date);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Invalid title.');
            await CommunicationModel.remove(communication.ID)
        }
    });

    test('It should throw Error with message \'Please provide a valid id.\' when an invalid id is passed when updating a communication', async () => {
        const title = "Test communication";
        const description = "Test description";

        try {
            const updatedCommunication = await CommunicationModel.update(null, title, description, false, date);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Please provide a valid id.');
        }
    });

    test('It should throw Error with message \'Please provide a valid id.\' when an invalid id is passed when updating a communication', async () => {
        const title = "Test communication";
        const description = "Test description";

        try {
            const updatedCommunication = await CommunicationModel.update(null, title, description, null, date);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Please provide a valid id.');
        }
    });

    test('It should should delete a communication', async () => {
        let title = "New test communication";
        let description = "New test description";
        
        const communication = await CommunicationModel.add(title, description, true, date); 
        const beforeDeleteCommunicationsLength = (await CommunicationModel.findAll()).length;
        await CommunicationModel.remove(communication.ID);
        const afterDeleteCommunicationsLength = (await CommunicationModel.findAll()).length;

        expect(beforeDeleteCommunicationsLength).toBe(afterDeleteCommunicationsLength + 1);
    });

    test('It should throw Error with message \'Please provide a valid id.\' when an invalid id is passed when deleting a communication', async () => {
        try {
            await CommunicationModel.remove(null);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Please provide a valid id.');
        }
    });
    
})