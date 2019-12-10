import Assignment from '../src/database/models/assignment';
import Student from '../src/database/models/student';
import User from '../src/database/models/user';
import Class from '../src/database/models/class'
import TCS from '../src/database/models/teacherClassSubject'
import moment from 'moment';

describe("Tests about visualization of assignments by a parent", () => {

  test('It should return the list of all assignments', async () => {
      const testStudent = '266667153e975bbf735b89d4b03d9f93';
      const testParent = '9d64fa59c91d9109b11cd9e05162c675';
      const related = await Student.checkIfRelated(testStudent, testParent);
      expect(related).toBe(true);

      const assignments = await Assignment.findByStudentId(testStudent, {}, {});
      expect(assignments).not.toBeNull();
      expect(assignments).toHaveLength(3);
      const date1 = new Date("2019-12-15T00:00:00.000Z");
      const date2 = new Date("2019-12-18T00:00:00.000Z");
      expect(assignments).toEqual(
          expect.arrayContaining([
              expect.objectContaining(
                  {
                      "Name": "Physics",
                      "Title": "Kinematics problems",
                      "Description": "Exercises 15 to 19 page 87",
                      "DueDate": date1
                  },
                  {
                      "Name": "Physics",
                      "Title": "Kinematics",
                      "Description": "Chapter 3, paragraphs 4 to 8",
                      "DueDate": date1
                  },
                  {
                      "Name": "Mathematics",
                      "Title": "Geometry problems",
                      "Description": "Probblems # 15 to 22 page 145",
                      "DueDate": date2
                  }
              )
          ])
      );
  });

  test('Should throw Error with message \'There are no assignments for the chosen student!\' when passing dates where the students doesnt have assignments', async () => {
      try {
          await Assignment.findByStudentId(
              '266667153e975bbf735b89d4b03d9f93', 
              { from: "2019-02-15T00:00:00.000Z", to: "2019-02-15T00:00:00.000Z"}, 
              {}
          );
      } catch(error) {
          expect(error).toBeInstanceOf(Error);
          expect(error).toHaveProperty('message', 'There are no assignments for the chosen student!');
      }
  });

});

describe("Tests about insertion of an assignment by a teacher", () => {
    
    test("It should add correctly an assignment", async() =>{
        const subjectId = 1;
        const title = "Test title";
        const description ="Test description"
        const dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        const expectDate = new Date(dueDate);
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

        //insert assignment
        const insertAssignment = await Assignment.addAssignment(
          subjectId,
          createClass.id,
          title,
          description,
          dueDate.format()
        );
    
        expect(insertAssignment.id).not.toBeNaN();
        const testResult = await Assignment.findById(insertAssignment.id);
        expect(testResult).toMatchObject({
            SubjectId : subjectId,
            ClassId : createClass.id,
            Title : title,
            Description : description,
            DueDate : expectDate
        });

        //clean db for future tests
        await Assignment.remove(insertAssignment.id);
        await TCS.remove(insertRelation)
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);

    });

    test("It should throw an error when passed class id is missing or invalid", async() =>{

        const title = "Test title";
        const description ="Test description"
        const dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        const expectDate = new Date(dueDate);

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

        try {    
        //insert assignment
        await Assignment.addAssignment(
            undefined,
            createClass.id,
            title,
            description,
            expectDate
        );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid subject id');
            
            //clean db for future tests
            await TCS.remove(insertRelation)
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);

        }
    });

    test("It should throw an error when passed class id is missing or invalid", async() =>{
        const subjectId = 1;
        const title = "Test title";
        const description ="Test description"
        const dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        const expectDate = new Date(dueDate);
        
        try {    
            //insert assignment
            await Assignment.addAssignment(
                subjectId,
                undefined,
                title,
                description,
                expectDate
            );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid class id');
        }
    });

    test("It should throw an error when passed title is missing or invalid", async() =>{
        const subjectId = 1;
        const description ="Test description"
        const dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        const expectDate = new Date(dueDate);

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

        try {    
        //insert assignment
        await Assignment.addAssignment(
            subjectId,
            createClass.id,
            undefined,
            description,
            expectDate
        );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid title');
            
            //clean db for future tests
            await TCS.remove(insertRelation)
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);

        }
    });

    test("It should throw an error when passed description is missing or invalid", async() =>{
        const subjectId = 1;
        const title = "Test title";
        const dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        const expectDate = new Date(dueDate);

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

        try {    
        //insert assignment
        await Assignment.addAssignment(
            subjectId,
            createClass.id,
            title,
            undefined,
            expectDate
        );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid description');
            
            //clean db for future tests
            await TCS.remove(insertRelation)
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);

        }
    });

    test("It should throw an error when passed description is missing or invalid", async() =>{
        const subjectId = 1;
        const title = "Test title";
        const description = "Description";
        
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

        try {    
        //insert assignment
        await Assignment.addAssignment(
            subjectId,
            createClass.id,
            title,
            description,
            undefined
        );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid due date');
            
            //clean db for future tests
            await TCS.remove(insertRelation)
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);

        }
    });


});
