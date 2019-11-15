import Topic from '../src/database/models/topic'

describe('Teacher test 1', () => {

    test('It should retrive the topics of inserted by a teacher for a subject in a given class', async () => {
        const topics = await Topic.findByTeacherClassSubject('6e5c9976f5813e59816b40a814e29899', 1,1);
        expect(topics).not.toBeNull();
        expect(topics).toHaveLength(3);

        const date1 = new Date('2019-10-21T00:00:00.000Z');
        const date2 = new Date('2019-10-14T00:00:00.000Z');
        const date3 = new Date('2019-10-07T00:00:00.000Z');


        expect(topics).toEqual(
            expect.arrayContaining(
                [
                    {
                        "Title": "Expressions",
                        "TopicDescription": "Part 3",
                        "TopicDate": date1
                    },
                    {
                        "Title": "Expressions",
                        "TopicDescription": "Part 2",
                        "TopicDate": date2
                    },
                    {
                        "Title": "Expressions",
                        "TopicDescription": "Part 1",
                        "TopicDate": date3
                    }
                ]
       ));
    });

    test('it should throw Error with message \'Entity not found\' when the passed subjectId does not exist', async () => {
        try{
            const topics = await Topic.findByTeacherClassSubject('6e5c9976f5813e59816b40a814e29899', 1,20);
        }
        catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Entity not found');
        }
    });

    test('it should throw Error with message \'Entity not found\' when the passed classId does not exist', async () => {
        try{
            const topics = await Topic.findByTeacherClassSubject('6e5c9976f5813e59816b40a814e29899', 20, 1);
        }
        catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Entity not found');
        }
    });

    test('it should throw Error with message \'Entity not found\' when the passed classId and subjectId do not exist', async () => {
        try{
            const topics = await Topic.findByTeacherClassSubject('6e5c9976f5813e59816b40a814e29899', 20, 20);
        }
        catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Entity not found');
        }
    });

    test('it should throw Error with message \'Entity not found\' when the passed teacherId does not exist', async () => {
        try{
            const topics = await Topic.findByTeacherClassSubject('6d5c9976f5813e59816b40a814e29899', 1, 1);
        }
        catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Entity not found');
        }
    });

    test('it should throw Error with message \'Entity not found\' when the passed teacherId and subjectId do not exist', async () => {
        try{
            const topics = await Topic.findByTeacherClassSubject('6d5c9976f5813e59816b40a814e29899', 1, 20);
        }
        catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Entity not found');
        }
    });

    test('it should throw Error with message \'Entity not found\' when the passed teacherId and classId do not exist', async () => {
        try{
            const topics = await Topic.findByTeacherClassSubject('6d5c9976f5813e59816b40a814e29899', 20, 1);
        }
        catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Entity not found');
        }
    });

    test('it should throw Error with message \'Entity not found\' when the passed teacherId, classId and subjectId do not exist', async () => {
        try{
            const topics = await Topic.findByTeacherClassSubject('6d5c9976f5813e59816b40a814e29899', 20, 20);
        }
        catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Entity not found');
        }
    });







});
