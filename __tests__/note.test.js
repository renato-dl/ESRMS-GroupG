import Assignment from '../src/database/models/assignment';
import User from '../src/database/models/user';
import Class from '../src/database/models/class';
import Student from '../src/database/models/student';
import Note from '../src/database/models/note';
import TCS from '../src/database/models/teacherClassSubject';
import moment from 'moment';

describe("Tests about visualization of a class's notes by a teacher", () => {

  test('It should return the list of notes of a given class', async () => {
      
      const title = "Test title";
      const description ="Test description"
      let date = moment.utc().set({
          "hour": 0,
          "minute": 0, 
          "second": 0, 
          "millisecond" : 0
      });

      date.add(1, 'days'); 
      const dayOfWeek = date.isoWeekday();
      
      if(dayOfWeek == 7){
          date.add(1, 'days'); 
      }
      const expectDate = new Date(date);
      
      //first add the student
      const testFirstName = 'Antonio';
      const testLastName = 'De Giovanni';
      const testSSN = 'TBKHSA93A02F494U';
      const testBirthDate = moment().utc().subtract(13, 'years');
      const testGender = 'M';

      //parent
      const testParent = await User.insertParentData(
        'Name',
        'Lastname',
        'parent1@parents.com',
        'FFLPSL33H68A698Z',
        'Password1'
      );
      expect(testParent).toMatchObject({id: expect.anything()});
      const result = await Student.insertStudent(
        testFirstName,
        testLastName,
        testSSN,
        testGender,
        testBirthDate,
        testParent.id,
        null
      );
      expect(result).toMatchObject({id: expect.anything()});

      //then add new teacher
      const insertTeacher = await User.insertInternalAccountData( 
          "Joe", 
          "Kernel", 
          "joekernel@gmail.com", 
          "LRNMRC79A02L219A", 
          "EasyPass1",
          true,
          false,
          false
      );
  
      expect(insertTeacher).toEqual({
        id: expect.anything()
      });

      //create new class
      const createClass = await Class.createClass(insertTeacher.id);
      expect(createClass).toEqual({
          id: createClass.id
      });

      //assign teacher, class, subject
      const insertRelation = await TCS.create({
          SubjectId : 1,
          ClassId : createClass.id,
          TeacherId : insertTeacher.id
      });

      //insert note
      const insertNote = await Note.create({
        Title: title,
        Description: description,
        StudentId: result.id,
        TeacherId: insertTeacher.id,
        IsSeen: false,
        Date: date.format(Note.db.getDateFormatString())
        
      })
  
      const testResult = await Note.findByClassId(
          createClass.id,
          {}, 
          {}
      );
      expect(testResult).toEqual(
          expect.arrayContaining([
              expect.objectContaining(
                  {
                      ID : insertNote,
                      Title : title,
                      Description : description,
                      FirstName: testFirstName,
                      LastName: testLastName,
                      IsSeen: 0,
                      Date : expectDate
                  }
                  )
              ])
      );
  
      //clean db for future tests
      await Note.remove(insertNote);
      await TCS.remove(insertRelation)
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
      await Student.remove(result.id);
      await User.remove(testParent.id)

  });

  test('It should return the list of notes of a given class in a given date range', async () => {

      const title1 = "Test title";
      const description1 ="Test description"
      const title2 = "Test title 2";
      const description2 = "Test description 2";

      const date1 = moment().utc().add(1, 'days').set({
          "hour": 0,
          "minute": 0, 
          "second": 0, 
          "millisecond": 0
      }); //tomorrow
      while (date1.isoWeekday() == 6 || date1.isoWeekday() == 7) {
          date1.add(1, 'days');
      }
      const date2 = date1.clone().add(1, 'days');
      while (date2.isoWeekday() == 6 || date2.isoWeekday() == 7) {
          date2.add(1, 'days');
      }        

      //first add the student
      const testFirstName = 'Antonio';
      const testLastName = 'De Giovanni';
      const testSSN = 'TBKHSA93A02F494U';
      const testBirthDate = moment().utc().subtract(13, 'years');
      const testGender = 'M';

      //parent
      const testParent = await User.insertParentData(
        'Name',
        'Lastname',
        'parent1@parents.com',
        'FFLPSL33H68A698Z',
        'Password1'
      );
      expect(testParent).toMatchObject({id: expect.anything()});
      const result = await Student.insertStudent(
        testFirstName,
        testLastName,
        testSSN,
        testGender,
        testBirthDate,
        testParent.id,
        null
      );
      expect(result).toMatchObject({id: expect.anything()});

      //then add new teacher
      const insertTeacher = await User.insertInternalAccountData( 
          "Joe", 
          "Kernel", 
          "joekernel@gmail.com", 
          "LRNMRC79A02L219A", 
          "EasyPass1",
          true,
          false,
          false
      );
  
      expect(insertTeacher).toEqual({
        id: expect.anything()
      });

      //create new class
      const createClass = await Class.createClass(insertTeacher.id);
      expect(createClass).toEqual({
          id: createClass.id
      });

      //assign teacher, class, subject
      const insertRelation = await TCS.create({
          SubjectId : 1,
          ClassId : createClass.id,
          TeacherId : insertTeacher.id
      });

      //insert note 1
       const insertNote1 = await Note.create({
        Title: title1,
        Description: description1,
        StudentId: result.id,
        TeacherId: insertTeacher.id,
        IsSeen: false,
        Date: date1.format(Note.db.getDateFormatString())

      });

      const insertNote2 = await Note.create({
        Title: title2,
        Description: description2,
        StudentId: result.id,
        TeacherId: insertTeacher.id,
        IsSeen: false,
        Date: date2.format(Note.db.getDateFormatString())
        
      });

      const testResult = await Note.findByClassId(
          createClass.id,
          {from: date1, from: date2}, 
          {}
      );
      expect(testResult).toEqual(
          expect.arrayContaining([
              expect.objectContaining(
                  {
                    ID : insertNote1,
                    Title : title1,
                    Description : description1,
                    FirstName: testFirstName,
                    LastName: testLastName,
                    IsSeen: 0,
                    Date : date1.toDate()
                  }
              ),
              expect.objectContaining(
                  {
                    ID : insertNote2,
                    Title : title2,
                    Description : description2,
                    FirstName: testFirstName,
                    LastName: testLastName,
                    IsSeen: 0,
                    Date : date2.toDate()
                  }
              )
          ])
      );
      //clean db for future tests
      await Note.remove(insertNote1);
      await Note.remove(insertNote2);
      await TCS.remove(insertRelation)
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
      await Student.remove(result.id);
      await User.remove(testParent.id)
  });

  test('It should return an empty list of notes', async () => {
      
      const insertTeacher = await User.insertInternalAccountData( 
          "Joe", 
          "Kernel", 
          "joekernel@gmail.com", 
          "LRNMRC79A02L219A", 
          "EasyPass1",
          true,
          false,
          false
      );
  
      expect(insertTeacher).toEqual({
        id: expect.anything()
      });

      //create new class
      const createClass = await Class.createClass(insertTeacher.id);
      expect(createClass).toEqual({
          id: createClass.id
      });

      //assign teacher, class, subject
      const insertRelation = await TCS.create({
          SubjectId : 1,
          ClassId : createClass.id,
          TeacherId : insertTeacher.id
      });
      
      const testResult = await Note.findByClassId(
          createClass.id,
          {}, 
          {}
      );
      expect(testResult).toMatchObject({
        message: "Entity not found"
      });
      await TCS.remove(insertRelation)
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);

  });

  test('Should throw Error with message \'Missing or invalid class id\'', async () => {
      try {
          await Note.findByClassId(
              undefined,
              1,
              {}, 
              {}
          );
      } catch(error) {
          expect(error).toBeInstanceOf(Error);
          expect(error).toHaveProperty('message', 'Missing or invalid class id');
      }
  });
    
});