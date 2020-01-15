import User from '../src/database/models/user';
import Class from '../src/database/models/class';
import Student from '../src/database/models/student';
import Note from '../src/database/models/note';
import TCS from '../src/database/models/teacherClassSubject';
import moment from 'moment';
import db from '../src/database';
import uuid from 'uuid';

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
      if(dayOfWeek == 6){
        date.add(2, 'days'); 
      }

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

      let date1 = moment().utc().set({
          "hour": 0,
          "minute": 0, 
          "second": 0, 
          "millisecond": 0
      });

      while (date1.isoWeekday() == 6 || date1.isoWeekday() == 7) {
          date1.subtract(1, 'days');
      }
      let date2 = date1.clone().subtract(1, 'days');
      while (date2.isoWeekday() == 6 || date2.isoWeekday() == 7) {
          date2.subtract(1, 'days');
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
          {from: date2, from: date1}, 
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

describe("Tests about insertion of a student's note by a teacher", () =>{

    test("It should add correctly a note", async() =>{
        const title = "Test title";
        const description ="Test description"
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        const insertNote = await Note.addNote(
          title,
          description,
          insertStudent.id,
          insertTeacher.id,
          date.format(),
        );
    
        expect(insertNote.id).not.toBeNaN();
        const testResult = await Note.findById(insertNote.id);
        expect(testResult).toMatchObject({
            ID: insertNote.id,
            Title : title,
            Description : description,
            IsSeen: 0,
            Date : date.toDate()
        });

        //clean db for future tests
        await Note.remove(insertNote.id);
        await User.remove(insertTeacher.id);
        await Student.remove(insertStudent.id);
        await User.remove(insertParent.id);

    });

    test("It should throw an error when title is missing or invalid", async() =>{

        const description ="Test description"
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        try{
            await Note.addNote(
            undefined,
            description,
            insertStudent.id,
            insertTeacher.id,
            date.format(),
            );

        }catch(error){
            
            expect(error).toHaveProperty("message", "Missing or invalid title");
            
            //clean db for future tests
            await User.remove(insertTeacher.id);
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });

    test("It should throw an error when description is missing or invalid", async() =>{

        const title ="Test title"
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        try{
            await Note.addNote(
            title,
            undefined,
            insertStudent.id,
            insertTeacher.id,
            date.format(),
            );

        }catch(error){
            expect(error).toHaveProperty("message", "Missing or invalid description");
            
            //clean db for future tests
            await User.remove(insertTeacher.id);
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });

    test("It should throw an error when studentId is missing or invalid", async() =>{
        const title ="Test title";
        const description = "Test description";

        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add new teacher
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

        //insert note
        try{
            await Note.addNote(
            title,
            description,
            undefined,
            insertTeacher.id,
            date.format(),
            );

        }catch(error){
            expect(error).toHaveProperty("message", "Missing or invalid student id");

            //clean db for future tests
            await User.remove(insertTeacher.id);
        }

    });

    test("It should throw an error when teacherId is missing or invalid", async() =>{
        const title ="Test title";
        const description = "Test description";
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
        //insert note
        try{
            await Note.addNote(
            title,
            description,
            insertStudent.id,
            undefined,
            date.format(),
            );

        }catch(error){
            expect(error).toHaveProperty("message", "Missing or invalid teacher id");

            //clean db for future tests
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });

    test("It should throw an error when date is missing or invalid", async() =>{
        const title = "Test title";
        const description ="Test description";

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        try{
            await Note.addNote(
            title,
            description,
            insertStudent.id,
            insertTeacher.id,
            undefined,
            );

        }catch(error){
            expect(error).toHaveProperty("message", "Missing or invalid note date");

            //clean db for future tests
            await User.remove(insertTeacher.id);
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });

    test("It should throw an error when date has invalid format", async() =>{
        const title = "Test title";
        const description ="Test description";

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        try{
            await Note.addNote(
            title,
            description,
            insertStudent.id,
            insertTeacher.id,
            "notvalidDate",
            );

        }catch(error){
            expect(error).toHaveProperty("message", "Invalid note date");

            //clean db for future tests
            await User.remove(insertTeacher.id);
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });

    test("It should throw an error when date is future", async() =>{
        const title = "Test title";
        const description ="Test description";

        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        date.add(1, 'days');

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        try{
            await Note.addNote(
            title,
            description,
            insertStudent.id,
            insertTeacher.id,
            date.format(),
            );

        }catch(error){
            expect(error).toHaveProperty("message", "Invalid note date");

            //clean db for future tests
            await User.remove(insertTeacher.id);
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });


});

describe("findByStudentId", () => {

  test("It should show the notes", async() =>{

    // Create teacher/parent
    const userId = uuid.v4();
    await User.create({
      id: userId,
      eMail: 'abc@cba.ab',
      SSN: 'SCIWWN72A14H620P',
      Password: 'pass',
      FirstName: 'Teach',
      LastName: 'Er',
      IsTeacher: 1,
      IsParent: 1
    });

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    // Create student
    const studentId = uuid.v4();
    await Student.create({
      ID: studentId,
      FirstName: 'AAA',
      LastName: 'AAA',
      SSN: 'ZZGSCD71A54Z325N',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'M'
    });

    //notes
    const title1 = 'Note1';
    const desc1 = 'Description of note 1';
    const date1 = moment.utc('2019-12-10T00:00:00.000Z');
    const note1 = await Note.create({
      Title: title1,
      Description: desc1,
      StudentId: studentId,
      TeacherId: userId,
      Date: date1.format(db.getDateFormatString())
    });

    const title2 = 'Note2';
    const desc2 = 'Description of note 2';
    const date2 = moment.utc('2019-12-12T00:00:00.000Z');
    const note2 = await Note.create({
      Title: title2,
      Description: desc2,
      StudentId: studentId,
      TeacherId: userId,
      Date: date2.format(db.getDateFormatString())
    });

    const result = await Note.findByStudentId(studentId);

    expect([...result]).toEqual(
      [
        {
          ID: note1,
          Title: title1,
          IsSeen: 0,
          Date: date1.toDate(),
          FirstName: 'Teach',
          LastName: 'Er'
        },
        {
          ID: note2,
          Title: title2,
          IsSeen: 0,
          Date: date2.toDate(),
          FirstName: 'Teach',
          LastName: 'Er'
        }
      ]
    );

    await Note.remove(note2);
    await Note.remove(note1);
    await Student.remove(studentId);
    await Class.remove(classId);
    await User.remove(userId);
  
  });

  test("Invalid student id", async() =>{

    try {
      await Note.findByStudentId(undefined);
    } catch (error) {
      expect(error).toHaveProperty("message", "Missing or invalid studentId");
    }
  });
});

describe("Tests about edition of a note by a teacher", () =>{

    test("It should update correctly a note", async() =>{
        const title = "Test title";
        const description ="Test description"
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert assignment
        const insertNote = await Note.addNote(
          title,
          description,
          insertStudent.id,
          insertTeacher.id,
          date.format(),
        );
    
        expect(insertNote.id).not.toBeNaN();

        //then update the note
        const updateNote = await Note.updateNote(
            insertNote.id,
            "new title",
            "new description",
            date.format()
        )

        expect(updateNote).toBe(true);

        //clean db for future tests
        await Note.remove(insertNote.id);
        await User.remove(insertTeacher.id);
        await Student.remove(insertStudent.id);
        await User.remove(insertParent.id);

    });
    
    test("It should throw an error when noteId is missing or invalid", async() =>{
        const title = "Test title";
        const description ="Test description";
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }
        
        //update note
        try{
            await Note.updateNote(
                undefined,
                title,
                description,
                date.format()
            )

        }catch(error){
            expect(error).toHaveProperty("message", "Missing or invalid note id");
        }

    });

    test("It should throw an error when title is missing or invalid", async() =>{
        const title = "Test title";
        const description ="Test description";
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        const insertNote = await Note.addNote(
            title,
            description,
            insertStudent.id,
            insertTeacher.id,
            date.format(),
        );

        expect(insertNote).toEqual({
                id: expect.anything()
        });

        //update note
        try{
            await Note.updateNote(
                insertNote.id,
                undefined,
                "new description",
                date.format()
            )

        }catch(error){
            expect(error).toHaveProperty("message", "Missing or invalid title");

            //clean db for future tests
            await Note.remove(insertNote.id);
            await User.remove(insertTeacher.id);
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });

    test("It should throw an error when description is missing or invalid", async() =>{
        const title = "Test title";
        const description ="Test description";
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }
        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        const insertNote = await Note.addNote(
            title,
            description,
            insertStudent.id,
            insertTeacher.id,
            date.format(),
        );

        expect(insertNote).toEqual({
                id: expect.anything()
        });

        //update note
        try{
            await Note.updateNote(
                insertNote.id,
                "new title",
                undefined,
                date.format()
            )

        }catch(error){
            expect(error).toHaveProperty("message", "Missing or invalid description");

            //clean db for future tests
            await Note.remove(insertNote.id);
            await User.remove(insertTeacher.id);
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });

    test("It should throw an error when date is missing or invalid", async() =>{
        const title = "Test title";
        const description ="Test description";
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        const insertNote = await Note.addNote(
            title,
            description,
            insertStudent.id,
            insertTeacher.id,
            date.format(),
        );

        expect(insertNote).toEqual({
                id: expect.anything()
        });

        //update note
        try{
            await Note.updateNote(
                insertNote.id,
                "new title",
                "new description",
                undefined
            )

        }catch(error){
            expect(error).toHaveProperty("message", "Missing or invalid note date");

            //clean db for future tests
            await Note.remove(insertNote.id);
            await User.remove(insertTeacher.id);
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });

    test("It should throw an error when date has invalid format", async() =>{
        const title = "Test title";
        const description ="Test description";
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        const insertNote = await Note.addNote(
            title,
            description,
            insertStudent.id,
            insertTeacher.id,
            date.format(),
        );

        expect(insertNote).toEqual({
                id: expect.anything()
        });

        //update note
        try{
            await Note.updateNote(
                insertNote.id,
                "new title",
                "new description",
                "notvaliddate"
            )

        }catch(error){
            expect(error).toHaveProperty("message", "Invalid note date");

            //clean db for future tests
            await Note.remove(insertNote.id);
            await User.remove(insertTeacher.id);
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });

    test("It should throw an error when date is future", async() =>{
        const title = "Test title";
        const description ="Test description";
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        const insertNote = await Note.addNote(
            title,
            description,
            insertStudent.id,
            insertTeacher.id,
            date.format(),
        );

        expect(insertNote).toEqual({
            id: expect.anything()
        });

        //update note
        date.add(1, 'days');

        try{
            await Note.updateNote(
                insertNote.id,
                "new title",
                "new description",
                date.format(),
                
            )

        }catch(error){
            expect(error).toHaveProperty("message", "Invalid note date");

            //clean db for future tests
            await Note.remove(insertNote.id);
            await User.remove(insertTeacher.id);
            await Student.remove(insertStudent.id);
            await User.remove(insertParent.id);
        }

    });


});

describe('Test weather a teacher is authorized to access a given note', () => {

    test('It should return true', async () => {
        const title = "Test title";
        const description ="Test description"
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        const insertNote = await Note.addNote(
          title,
          description,
          insertStudent.id,
          insertTeacher.id,
          date.format(),
        );
        expect(insertNote.id).not.toBeNaN();

        const testResult = await Note.checkIfNoteIsFromTeacher(
            insertNote.id,
            insertTeacher.id
        )
        expect(testResult).toBe(true);

        //clean db for future tests
        await Note.remove(insertNote.id);
        await User.remove(insertTeacher.id);
        await Student.remove(insertStudent.id);
        await User.remove(insertParent.id);

    });
  
    test('It should return false', async () => {

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        const testResult = await Note.checkIfNoteIsFromTeacher(
            100000,
            insertTeacher.id
        )
        expect(testResult).toBe(false);

        //clean db for future tests
        await User.remove(insertTeacher.id);
        await Student.remove(insertStudent.id);
        await User.remove(insertParent.id);


    });

    test('It throw an error about missing or invalid teacher id', async () => {
        const title = "Test title";
        const description ="Test description"
        let date = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        const dayOfWeek = date.isoWeekday();

        if(dayOfWeek == 6){
            date.subtract(1, 'days'); 
        }

        if(dayOfWeek == 7){
            date.subtract(2, 'days'); 
        }

        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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

        //insert note
        const insertNote = await Note.addNote(
          title,
          description,
          insertStudent.id,
          insertTeacher.id,
          date.format(),
        );
        expect(insertNote.id).not.toBeNaN();

        try {
        await Note.checkIfNoteIsFromTeacher(insertNote.id, null);
      } catch(error) {
        expect(error).toHaveProperty('message', 'Missing or invalid teacher id');
        
        //clean db for future tests
        await Note.remove(insertNote.id);
        await User.remove(insertTeacher.id);
        await Student.remove(insertStudent.id);
        await User.remove(insertParent.id);

      }
    });
  
    test('It throw an error about missing or invalid note id', async () => {
        
        //first add the student with parent
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';

        const insertParent = await User.insertParentData(
            'Name',
            'Lastname',
            'parent1@parents.com',
            'FFLPSL33H68A698Z',
            'Password1'
        );
        expect(insertParent).toMatchObject({id: expect.anything()});
        const insertStudent = await Student.insertStudent(
            testFirstName,
            testLastName,
            testSSN,
            testGender,
            testBirthDate,
            insertParent.id,
            null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});
        
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
            
        try {
          await Note.checkIfNoteIsFromTeacher(null, insertTeacher.id);
        } catch(error) {
          expect(error).toHaveProperty('message', 'Missing or invalid note id');
          
          //clean db for future tests
          await User.remove(insertTeacher.id);
          await Student.remove(insertStudent.id);
          await User.remove(insertParent.id);

        }
      });
    
});

