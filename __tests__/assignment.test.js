import Assignment from '../src/database/models/assignment';
import Student from '../src/database/models/student';
import User from '../src/database/models/user';
import Class from '../src/database/models/class'
import TCS from '../src/database/models/teacherClassSubject';
import Subject from '../src/database/models/subject';
import File from '../src/database/models/file';
import moment from 'moment';
import fs from 'fs';
import util from 'util';
import path from 'path';

describe("Tests about visualization of assignments by a parent", () => {

  test('It should return the list of all assignments', async () => {
      const testStudent = '266667153e975bbf735b89d4b03d9f93';
      const testParent = '9d64fa59c91d9109b11cd9e05162c675';
      const related = await Student.checkIfRelated(testStudent, testParent);
      expect(related).toBe(true);

      const assignments = await Assignment.findByStudentId(testStudent, {}, {});
      expect(assignments).not.toBeNull();
      expect(assignments).toHaveLength(3);
      const date1 = new Date("2019-12-17T00:00:00.000Z");
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

  test('Should throw Error with message \'Missing or invalid student id\' when passing student id is missing or invalid', async () => {
    try {
        await Assignment.findByStudentId(
            null,
            {}, 
            {}
        );
    } catch(error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Missing or invalid student id');
    }
});

});

describe("Tests about visualization of assignments by a teacher", () => {

    test('It should return the list of assignments of a teacher for a given class and subject', async () => {
        const subjectId = 1;
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
        }
        
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
            SubjectId : subjectId,
            ClassId : createClass.id,
            TeacherId : insertTeacher.id
        });

        //insert assignment
        const insertAssignment = await Assignment.addAssignment(
          subjectId,
          createClass.id,
          title,
          description,
          dueDate.format(),
          null
        );
    
        expect(insertAssignment.id).not.toBeNaN();
        const testResult = await Assignment.findByClassAndSubject(
            createClass.id,
            subjectId,
            {}, 
            {}
        );
        expect(testResult).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        ID : insertAssignment.id,
                        Title : title,
                        Description : description,
                        DueDate : expectDate
                    }
                    )
                ])
        );
    
        //clean db for future tests
        await Assignment.remove(insertAssignment.id);
        await TCS.remove(insertRelation)
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);

    });

    test('It should return the list of assignments of a teacher for a given class and subject in a given due date range', async () => {
        const subjectId = 1;
        const title1 = "Test title";
        const description1 ="Test description"
        const title2 = "Test title 2";
        const description2 = "Test description 2";

        const dueDate1 = moment().utc().add(1, 'days').set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond": 0
        }); //tomorrow
        while (dueDate1.isoWeekday() == 6 || dueDate1.isoWeekday() == 7) {
            dueDate1.add(1, 'days');
        }
        const dueDate2 = dueDate1.clone().add(1, 'days');
        while (dueDate2.isoWeekday() == 6 || dueDate2.isoWeekday() == 7) {
            dueDate2.add(1, 'days');
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

        //create new class
        const createClass = await Class.createClass(insertTeacher.id);
        expect(createClass).toEqual({
            id: createClass.id
        });

        //assign teacher, class, subject
        const insertRelation = await TCS.create({
            SubjectId : subjectId,
            ClassId : createClass.id,
            TeacherId : insertTeacher.id
        });

        //insert assignment 1
        const insertAssignment1 = await Assignment.addAssignment(
          subjectId,
          createClass.id,
          title1,
          description1,
          dueDate1,
          null
        );
    
        expect(insertAssignment1.id).not.toBeNaN();

        //insert assignment 2
        const insertAssignment2 = await Assignment.addAssignment(
            subjectId,
            createClass.id,
            title2,
            description2,
            dueDate2,
            null
          );
      
        expect(insertAssignment2.id).not.toBeNaN();

        const testResult = await Assignment.findByClassAndSubject(
            createClass.id,
            subjectId,
            {from: dueDate1, from: dueDate2}, 
            {}
        );
        expect(testResult).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        "Description": "Test description", 
                        "ID": insertAssignment1.id, 
                        "Title": "Test title",
                        "DueDate": dueDate1.toDate()
                    }
                ),
                expect.objectContaining(
                    {
                        "Description": "Test description 2", 
                        "ID": insertAssignment2.id, 
                        "Title": "Test title 2",
                        "DueDate": dueDate2.toDate()
                    }
                )
            ])
        );
        //clean db for future tests
        await Assignment.remove(insertAssignment1.id);
        await Assignment.remove(insertAssignment2.id);
        await TCS.remove(insertRelation)
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);

    });

    test('It should return an empty list of assignments', async () => {
        
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
        
        const testResult = await Assignment.findByClassAndSubject(
            createClass.id,
            100,
            {}, 
            {}
        );
        expect(testResult.length).toBe(0);
        await TCS.remove(insertRelation)
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);

    });

    test('Should throw Error with message \'Missing or invalid class id\'', async () => {
        try {
            await Assignment.findByClassAndSubject(
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

    test('Should throw Error with message \'Missing or invalid subject id\'', async () => {

        const subjectId = 1;

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
            SubjectId : subjectId,
            ClassId : createClass.id,
            TeacherId : insertTeacher.id
        });

        try {
            await Assignment.findByClassAndSubject(
                createClass.id,
                undefined,
                {}, 
                {}
            );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid subject id');
            await TCS.remove(insertRelation)
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);
        }
    });
});
  

describe("Tests about insertion of an assignment by a teacher", () => {
    
    test("It should add correctly an assignment", async() => {
        const subjectId = 1;
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();

        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
        }
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
          dueDate.format(),
          null
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
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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
            dueDate.format(),
            null
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
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
        }

        try {    
            //insert assignment
            await Assignment.addAssignment(
                subjectId,
                undefined,
                title,
                description,
                dueDate.format(),
                null
            );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid class id');
        }
    });

    test("It should throw an error when passed title is missing or invalid", async() =>{
        const subjectId = 1;
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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
            dueDate.format(),
            null
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
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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
            dueDate.format(),
            null
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
            undefined,
            null
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

describe("Tests about edition of an assignment by a teacher", () => {
    
    test("It should update correctly an assignment", async() =>{
        const subjectId = 1;
        const title = "Test title";
        const description ="Test description"

        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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
          dueDate.format(),
          null
        );

        expect(insertAssignment.id).not.toBeNaN();

        //update assignment
        const testUpdate = await Assignment.updateAssignment(
            insertAssignment.id,
            "New title",
            "New description",
            dueDate.format(),
            null
            
        );

        expect(testUpdate).toBe(true);

        //clean db for future tests
        await Assignment.remove(insertAssignment.id);
        await TCS.remove(insertRelation)
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);

    });

    test("It should throw an error when passed assignment id is missing or invalid", async() =>{

        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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
        //update assignment
        await Assignment.updateAssignment(
            undefined,
            title,
            description,
            dueDate.format(),
            null
        );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid assignment id');
            
            //clean db for future tests
            await TCS.remove(insertRelation)
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);

        }
    });

    test("It should throw an error when passed tile is missing or invalid", async() =>{
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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
            1,
            createClass.id,
            title,
            description,
            dueDate.format(),
            null
        );
        expect(insertAssignment.id).not.toBeNaN();

        try {   
        //update assignment
        await Assignment.updateAssignment(
            insertAssignment.id,
            undefined,
            description,
            dueDate.format(),
            null
        );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid title');
            
            //clean db for future tests
            await Assignment.remove(insertAssignment.id);
            await TCS.remove(insertRelation)
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);
        }
    });

    test("It should throw an error when passed description is missing or invalid", async() =>{
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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
            1,
            createClass.id,
            title,
            description,
            dueDate.format(),
            null
        );
        expect(insertAssignment.id).not.toBeNaN();

        try {   
        //update assignment
        await Assignment.updateAssignment(
            insertAssignment.id,
            title,
            undefined,
            dueDate.format(),
            null
        );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid description');
            
            //clean db for future tests
            await Assignment.remove(insertAssignment.id);
            await TCS.remove(insertRelation)
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);
        }
    });

    test("It should throw an error when passed due date is missing or invalid", async() =>{
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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
            1,
            createClass.id,
            title,
            description,
            dueDate.format(),
            null
        );
        expect(insertAssignment.id).not.toBeNaN();

        try {   
        //update assignment
        await Assignment.updateAssignment(
            insertAssignment.id,
            title,
            description,
            undefined,
            null
        );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid due date');
            
            //clean db for future tests
            await Assignment.remove(insertAssignment.id);
            await TCS.remove(insertRelation)
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);
        }
    });

    test("It should throw an error when passed due date is invalid", async() =>{
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });

        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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
            1,
            createClass.id,
            title,
            description,
            dueDate.format(),
            null
        );
        expect(insertAssignment.id).not.toBeNaN();

        try {   
        //update assignment
        dueDate.subtract('1', 'days');
        await Assignment.updateAssignment(
            insertAssignment.id,
            title,
            description,
            dueDate.format(),
            null
        );
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Invalid assignment due date');
            
            //clean db for future tests
            await Assignment.remove(insertAssignment.id);
            await TCS.remove(insertRelation)
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);
        }
   
   
   
    });
});

describe('Test weather a teacher is authorized to access a given assignment', () => {

    test('It should return true', async () => {

        const subjectId = 1;
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();
        
        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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
          dueDate.format(),
          null
        );
    
        expect(insertAssignment.id).not.toBeNaN();

        const auth = await Assignment.checkIfAssignmentIsFromTeacher(insertAssignment.id, insertTeacher.id);
        expect(auth).toBe(true);
        
        //clean db for future tests
        await Assignment.remove(insertAssignment.id);
        await TCS.remove(insertRelation)
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);
    });
  
    test('It throw an error about invalid teacher id', async () => {
      try {
        await Assignment.checkIfAssignmentIsFromTeacher(1, null);
      } catch(error) {
        expect(error).toHaveProperty('message', 'Missing or invalid teacher id');
      }
    });
  
    test('It throw an error about invalid assignment id', async () => {
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
            await Assignment.checkIfAssignmentIsFromTeacher(undefined, insertTeacher.id);
        } catch(error) {
            expect(error).toHaveProperty('message', 'Missing or invalid assignment id');
            await TCS.remove(insertRelation);
            await Class.remove(createClass.id);
            await User.remove(insertTeacher.id);
        }
        });
    
    test('It should return false', async () => {
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

        const auth = await Assignment.checkIfAssignmentIsFromTeacher(1000, insertTeacher.id);
        expect(auth).toBe(false);
        await TCS.remove(insertRelation);
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);

    });
  
});

describe('Tests on getAttachments', () => {

    test('It throw an error when assignmentId is missing or invalid', async () => {
        try {
            await Assignment.getAttachments(null); 
        } catch(error) {
            expect(error).toHaveProperty('message', 'Missing or invalid assignment id');
        }
    });

    test('It should return the attachments of an assignment', async () => {
        const attachments = await Assignment.getAttachments(1); 

        if (attachments.length) {
            expect(attachments[0].ID).toBeGreaterThanOrEqual(1);
            expect(attachments[0].Key).toBeTruthy();
        }
    });

});

describe('Tests on addAttachments', () => {

    test('It throw an error when assignmentId is missing or invalid', async () => {
      try {
        const fileIds = [{ID: 213213142}];
        await Assignment.addAttachments(null, fileIds);
      } catch(error) {
        expect(error).toHaveProperty('message', 'Missing or invalid assignment id');
      }
    });
    
    test('It throw an error when fileIds parameter is missing or invalid', async () => {
        
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();

        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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

        //create new class
        const createClass = await Class.createClass(insertTeacher.id);
        expect(createClass).toEqual({
            id: createClass.id
        });

        const subjectId = await Subject.create({Name:"Test subject"});

        //assign teacher, class, subject
        const insertRelation = await TCS.create({
            SubjectId : subjectId,
            ClassId : createClass.id,
            TeacherId : insertTeacher.id
        });

        //insert assignment
        const insertAssignment = await Assignment.addAssignment(
          subjectId,
          createClass.id,
          title,
          description,
          dueDate.format(),
          null
        );
    
        expect(insertAssignment.id).not.toBeNaN();

        try {
          await Assignment.addAttachments(insertAssignment.id, null);
        } catch(error) {
          expect(error).toHaveProperty('message', 'Missing or invalid files');

          //clean db for future tests
          await Assignment.remove(insertAssignment.id);
          await TCS.remove(insertRelation);
          await Subject.remove(subjectId);
          await Class.remove(createClass.id);
          await User.remove(insertTeacher.id);
        }
    });

    test('It throw an error when fileIds parameter is not an array', async () => {
        
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();

        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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

        //create new class
        const createClass = await Class.createClass(insertTeacher.id);
        expect(createClass).toEqual({
            id: createClass.id
        });

        const subjectId = await Subject.create({Name:"Test subject"});

        //assign teacher, class, subject
        const insertRelation = await TCS.create({
            SubjectId : subjectId,
            ClassId : createClass.id,
            TeacherId : insertTeacher.id
        });

        //insert assignment
        const insertAssignment = await Assignment.addAssignment(
          subjectId,
          createClass.id,
          title,
          description,
          dueDate.format(),
          null
        );
    
        expect(insertAssignment.id).not.toBeNaN();
        
        try {
          const fileIds = {ID: 213213142};
          await Assignment.addAttachments(insertAssignment.id, fileIds);

        } catch(error) {
          expect(error).toHaveProperty('message', 'Files must be an array');

          //clean db for future tests
          await Assignment.remove(insertAssignment.id);
          await TCS.remove(insertRelation);
          await Subject.remove(subjectId);
          await Class.remove(createClass.id);
          await User.remove(insertTeacher.id);
        }
    });
  
    test('It should add attachments to a existing assignment', async () => {
        const subjectId = 1;
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();

        if(dayOfWeek == 7) {
            dueDate.add(1, 'days'); 
        }
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

        const testFiles = [
            { filename: 'testFile1', originalname: 'testFile1', size: 200, mimetype: 'app/test' },
            { filename: 'testFile2', originalname: 'testFile2', size: 200, mimetype: 'app/test' },
        ];
        const files = testFiles.map((file) => {
            return {
                Key: file.filename,
                Name: file.originalname,
                Size: file.size,
                Type: file.mimetype
            }
        });

        const fileIds = await File.createMany(files);
        const success = await Assignment.addAttachments(insertAssignment.id, fileIds);
        expect(success).toBeTruthy();
        const assignment = await Assignment.findOne({ ID: insertAssignment.id });

        expect(assignment).not.toBe(null);
        expect(assignment.ID).toBeTruthy();
        expect(assignment.Title).toEqual(title);
        expect(assignment.Description).toEqual(description);

        //clean db for future tests
        await Assignment.remove(insertAssignment.id);
        await TCS.remove(insertRelation)
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);
        await File.removeMany(fileIds);
    })
});

describe('Tests on updateAttachments', () => {

    test('It throw an error when assignmentId is missing or invalid', async () => {
      try {
        const arr = [{ID: 213213142}];
        await Assignment.updateAttachments(null, arr);
      } catch(error) {
        expect(error).toHaveProperty('message', 'Missing or invalid assignment id');
      }
    });
    
    test('It throw an error when updatedAttachments parameter is missing or invalid', async () => {
        
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();

        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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

        //create new class
        const createClass = await Class.createClass(insertTeacher.id);
        expect(createClass).toEqual({
            id: createClass.id
        });

        const subjectId = await Subject.create({Name:"Test subject"});

        //assign teacher, class, subject
        const insertRelation = await TCS.create({
            SubjectId : subjectId,
            ClassId : createClass.id,
            TeacherId : insertTeacher.id
        });

        //insert assignment
        const insertAssignment = await Assignment.addAssignment(
          subjectId,
          createClass.id,
          title,
          description,
          dueDate.format(),
          null
        );
    
        expect(insertAssignment.id).not.toBeNaN();

        try {
          await Assignment.updateAttachments(insertAssignment.id, null);
        } catch(error) {
          expect(error).toHaveProperty('message', 'Missing or invalid files');

          //clean db for future tests
          await Assignment.remove(insertAssignment.id);
          await TCS.remove(insertRelation);
          await Subject.remove(subjectId);
          await Class.remove(createClass.id);
          await User.remove(insertTeacher.id);
        }
    });

    test('It throw an error when updatedAttachments parameter is not an array', async () => {
        
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();

        if(dayOfWeek == 7){
            dueDate.add(1, 'days'); 
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

        //create new class
        const createClass = await Class.createClass(insertTeacher.id);
        expect(createClass).toEqual({
            id: createClass.id
        });

        const subjectId = await Subject.create({Name:"Test subject"});

        //assign teacher, class, subject
        const insertRelation = await TCS.create({
            SubjectId : subjectId,
            ClassId : createClass.id,
            TeacherId : insertTeacher.id
        });

        //insert assignment
        const insertAssignment = await Assignment.addAssignment(
          subjectId,
          createClass.id,
          title,
          description,
          dueDate.format(),
          null
        );
    
        expect(insertAssignment.id).not.toBeNaN();
        
        try {
          const arr = {ID: 213213142};
          await Assignment.updateAttachments(insertAssignment.id, arr);

        } catch(error) {
          expect(error).toHaveProperty('message', 'Files must be an array');

          //clean db for future tests
          await Assignment.remove(insertAssignment.id);
          await TCS.remove(insertRelation);
          await Subject.remove(subjectId);
          await Class.remove(createClass.id);
          await User.remove(insertTeacher.id);
        }
    });
  
    test('It should update attachments of an existing assignment and make it empty', async () => {
        const subjectId = 1;
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();

        if(dayOfWeek == 7) {
            dueDate.add(1, 'days'); 
        }
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

        const testFiles = [
            { filename: 'testFile1', originalname: 'testFile1', size: 200, mimetype: 'app/test' },
            { filename: 'testFile2', originalname: 'testFile2', size: 200, mimetype: 'app/test' },
        ];
        const files = testFiles.map((file) => {
            return {
                Key: file.filename,
                Name: file.originalname,
                Size: file.size,
                Type: file.mimetype
            }
        });

        const fileIds = await File.createMany(files);
        const success = await Assignment.addAttachments(insertAssignment.id, fileIds);
        expect(success).toBeTruthy();

        await Assignment.updateAttachments(insertAssignment.id, []);

        //clean db for future tests
        await Assignment.remove(insertAssignment.id);
        await TCS.remove(insertRelation)
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);
        await File.removeMany(fileIds);
    })

    test('It should update attachments of an existing assignment and replace some attachments', async () => {
        const subjectId = 1;
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();

        if(dayOfWeek == 7) {
            dueDate.add(1, 'days'); 
        }
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

        const testFiles = [
            { filename: 'testFile1', originalname: 'testFile1', size: 200, mimetype: 'app/test' },
            { filename: 'testFile2', originalname: 'testFile2', size: 200, mimetype: 'app/test' },
        ];
        const files = testFiles.map((file) => {
            return {
                Key: file.filename,
                Name: file.originalname,
                Size: file.size,
                Type: file.mimetype
            }
        });

        const fileIds = await File.createMany(files);
        const success = await Assignment.addAttachments(insertAssignment.id, fileIds);
        expect(success).toBeTruthy();

        const newTestFiles = [
            { filename: 'testFile21', originalname: 'testFile21', size: 300, mimetype: 'app/test' },
            { filename: 'testFile22', originalname: 'testFile22', size: 400, mimetype: 'app/test' },
        ];
        await Assignment.updateAttachments(insertAssignment.id, newTestFiles);

        //clean db for future tests
        await Assignment.remove(insertAssignment.id);
        await TCS.remove(insertRelation)
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);
        await File.removeMany(fileIds);
    })

});

describe('Tests on findOneByfile', () => {

    test('It throw an error when fileID is missing or invalid', async () => {
        try {
            await Assignment.findOneByfile(null);
        } catch(error) {
            expect(error).toHaveProperty('message', 'Missing or invalid file id');
        }
    });

    test('It should return an assignment based on file id', async () => {
        const subjectId = 1;
        const title = "Test title";
        const description ="Test description"
        let dueDate = moment.utc().set({
            "hour": 0,
            "minute": 0, 
            "second": 0, 
            "millisecond" : 0
        });
        dueDate.add(1, 'days'); 
        const dayOfWeek = dueDate.isoWeekday();

        if(dayOfWeek == 7) {
            dueDate.add(1, 'days'); 
        }
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

        const testFiles = [
            { filename: 'test_file_file', originalname: 'testFile', size: 200, mimetype: 'app/test' },
            { filename: 'testFile1', originalname: 'testFile1', size: 200, mimetype: 'app/test' },
            { filename: 'testFile2', originalname: 'testFile2', size: 200, mimetype: 'app/test' },
            { filename: 'testFile2', originalname: 'testFile2', size: 200, mimetype: 'app/test' },
        ];
        const files = testFiles.map((file) => {
            return {
                Key: file.filename,
                Name: file.originalname,
                Size: file.size,
                Type: file.mimetype
            }
        });

        const createFileAsync = util.promisify(fs.writeFile);
        await createFileAsync(path.join(__dirname, '../', "uploads", testFiles[0].filename), "Test Content");

        const fileIds = await File.createMany(files);
        const success = await Assignment.addAttachments(insertAssignment.id, fileIds);
        expect(success).toBeTruthy();
        const assignment = await Assignment.findOneByfile(fileIds[0]);

        expect(assignment).not.toBe(null);
        expect(assignment.ID).toBeTruthy();
        expect(assignment.Title).toEqual(title);
        expect(assignment.Description).toEqual(description);

        //clean db for future tests
        await Assignment.remove(insertAssignment.id);
        await TCS.remove(insertRelation)
        await Class.remove(createClass.id);
        await User.remove(insertTeacher.id);
        await File.remove(fileIds[0]);
        await File.removeMany(fileIds.slice(1));
    });

});
