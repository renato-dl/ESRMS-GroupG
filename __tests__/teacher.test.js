import Topic from "../src/database/models/topic";
import moment from "moment";
import db from '../src/database';


describe('Tests about topic insertion by teacher', () => {

    /*
    * 1. Ok
    * 2. missing classId
    * 3. missing subjectId
    * 4. missing topicTitle
    * 5. missing topicDate
    * 6. invalid topicDate
    * 7. Unauthorized teacherId
    * 8. Date previous week
    * 9. Future date 
    * 
    */

  test('It should perform the insertion', async () => {

    const testTeacherId = '6e5c9976f5813e59816b40a814e29899';
    const testClassId = 1;
    const testSubjectId = 1;
    const testTitle = 'Boring topic';
    const testTopicDescription = 'Lots and lots of useless and boring stuff';
    const testTopicDate = moment().utc(); //today

    const result = await Topic.insertNewTopic(
      testTeacherId,
      testClassId,
      testSubjectId,
      testTitle,
      testTopicDescription,
      testTopicDate
    );

    expect(result.id).not.toBeNaN();

    const connection = await db.getConnection();

    const testResult = await connection.query(
      `SELECT COUNT(*) AS count
      FROM Topics
      WHERE ID = ? AND Title = ? AND TopicDescription = ? AND TopicDate = ?;`,
      [result.id, testTitle, testTopicDescription, testTopicDate.format(db.getDateTimeFormatString())]
    );

    expect(testResult[0].count).toBe(1);
    
    const deleteResult = await connection.query(
      `DELETE
      FROM Topics
      WHERE ID = ?;`,
      [result.id]
    );

    connection.release();

    expect(deleteResult.affectedRows).toBe(1)

    
  });

  test('It should throw a classId error', async () => {

    const testTeacherId = '6e5c9976f5813e59816b40a814e29899';
    const testSubjectId = 1;
    const testTitle = 'Boring topic';
    const testTopicDescription = 'Lots and lots of useless and boring stuff';
    const testTopicDate = moment().utc(); //today

    try {
      const result = await Topic.insertNewTopic(
        testTeacherId,
        undefined,
        testSubjectId,
        testTitle,
        testTopicDescription,
        testTopicDate
      );
    } catch (error) {
      console.log(error);
      expect(error).toHaveProperty('message', 'Missing or invalid class id');
    }

  });

  test('It should throw a subjectId error', async () => {

    const testTeacherId = '6e5c9976f5813e59816b40a814e29899';
    const testClassId = 1;
    const testTitle = 'Boring topic';
    const testTopicDescription = 'Lots and lots of useless and boring stuff';
    const testTopicDate = moment().utc(); //today

    try {
      const result = await Topic.insertNewTopic(
        testTeacherId,
        testClassId,
        undefined,
        testTitle,
        testTopicDescription,
        testTopicDate
      );
    } catch (error) {
      console.log(error);
      expect(error).toHaveProperty('message', 'Missing or invalid subject id');
    }

  });

  test('It should throw a topicTitle error', async () => {

    const testTeacherId = '6e5c9976f5813e59816b40a814e29899';
    const testSubjectId = 1;
    const testClassId = 1;
    const testTopicDescription = 'Lots and lots of useless and boring stuff';
    const testTopicDate = moment().utc(); //today

    try {
      const result = await Topic.insertNewTopic(
        testTeacherId,
        testClassId,
        testSubjectId,
        undefined,
        testTopicDescription,
        testTopicDate
      );
    } catch (error) {
      console.log(error);
      expect(error).toHaveProperty('message', 'Missing or invalid topic title');
    }

  });

  test('It should throw a topicDate error (missing)', async () => {

    const testTeacherId = '6e5c9976f5813e59816b40a814e29899';
    const testSubjectId = 1;
    const testClassId = 1;
    const testTopicTitle = 'Boring topic';
    const testTopicDescription = 'Lots and lots of useless and boring stuff';

    try {
      const result = await Topic.insertNewTopic(
        testTeacherId,
        testClassId,
        testSubjectId,
        testTopicTitle,
        testTopicDescription,
        undefined
      );
    } catch (error) {
      console.log(error);
      expect(error).toHaveProperty('message', 'Missing or invalid topic date');
    }

  });

  test('It should throw a topicDate error (invalid)', async () => {

    const testTeacherId = '6e5c9976f5813e59816b40a814e29899';
    const testSubjectId = 1;
    const testClassId = 1;
    const testTopicTitle = 'Boring topic';
    const testTopicDescription = 'Lots and lots of useless and boring stuff';
    const testTopicDate = 'NOT A VALID DATE'

    try {
      const result = await Topic.insertNewTopic(
        testTeacherId,
        testClassId,
        testSubjectId,
        testTopicTitle,
        testTopicDescription,
        testTopicDate
      );
    } catch (error) {
      console.log(error);
      expect(error).toHaveProperty('message', 'Invalid topic date');
    }

  });

  test('It should throw a Unauthorized error', async () => {

    const testTeacherId = 'WRONG TEACHER ID';
    const testSubjectId = 1;
    const testClassId = 1;
    const testTopicTitle = 'Boring topic';
    const testTopicDescription = 'Lots and lots of useless and boring stuff';
    const testTopicDate = moment().utc(); //today

    try {
      const result = await Topic.insertNewTopic(
        testTeacherId,
        testClassId,
        testSubjectId,
        testTopicTitle,
        testTopicDescription,
        testTopicDate
      );
    } catch (error) {
      console.log(error);
      expect(error).toHaveProperty('message', 'Unauthorized');
    }

  });

  test('It should throw a not current week error', async () => {

    const testTeacherId = '6e5c9976f5813e59816b40a814e29899';
    const testSubjectId = 1;
    const testClassId = 1;
    const testTopicTitle = 'Boring topic';
    const testTopicDescription = 'Lots and lots of useless and boring stuff';
    const testTopicDate = moment().utc().day(-10);

    try {
      const result = await Topic.insertNewTopic(
        testTeacherId,
        testClassId,
        testSubjectId,
        testTopicTitle,
        testTopicDescription,
        testTopicDate
      );
    } catch (error) {
      console.log(error);
      expect(error).toHaveProperty('message', 'Only topics taught in the current week can be inserted');
    }

  });

  test('It should throw a future topic error', async () => {

    const testTeacherId = '6e5c9976f5813e59816b40a814e29899';
    const testSubjectId = 1;
    const testClassId = 1;
    const testTopicTitle = 'Boring topic';
    const testTopicDescription = 'Lots and lots of useless and boring stuff';
    const testTopicDate = moment().utc().day(+1);

    try {
      const result = await Topic.insertNewTopic(
        testTeacherId,
        testClassId,
        testSubjectId,
        testTopicTitle,
        testTopicDescription,
        testTopicDate
      );
    } catch (error) {
      console.log(error);
      expect(error).toHaveProperty('message', 'Future topics cannot be inserted');
    }

  });

});

describe('Teacher tests about visualization of the topics', () => {

    test('It should retrive the topics of inserted by a teacher for a subject in a given class', async () => {
        const topics = await Topic.findByTeacherClassSubject('6e5c9976f5813e59816b40a814e29899', 1,1);
        expect(topics).not.toBeNull();
        expect(topics.length).toBeGreaterThan(0);

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