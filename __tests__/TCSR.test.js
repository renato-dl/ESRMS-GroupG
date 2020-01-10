import TCSR from '../src/database/models/teacherClassSubject'
import Class from '../src/database/models/class'
import User from '../src/database/models/user'
import Student from '../src/database/models/student'
import Subject from '../src/database/models/subject'
import uuid from 'uuid';
import teacherClassSubject from '../src/database/models/teacherClassSubject';
import moment from 'moment';
import db from '../src/database';

describe('getTeachingClasses', () =>{
  test('It should return the classes of a teacher', async () =>{

    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });

    //create a new subject
    const subjectId = await Subject.create({
      Name: "Test Subject"
    });

    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: subjectId,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    });

    const getTeachingClasses = await TCSR.getTeachingClasses(insertTeacher.id);

    expect(getTeachingClasses).not.toBeNull();
    expect(getTeachingClasses).toHaveLength(1);
    
    //clean db for future tests
    await teacherClassSubject.remove(insertRelation);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);
    await Subject.remove(subjectId);
  });

  test('It should throw an error when the passed teacher id is missing or invalid', async () =>{
    try{
      await TCSR.getTeachingClasses();

    }catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid teacher id");
    }
  });

});

describe('checkIfTeacherTeachesSubjectInClass', () =>{
  
  test('It should return true', async () =>{

    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });

    //create a new subject
    const subjectId = await Subject.create({
      Name: "Test Subject"
    });
    
    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: subjectId,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    });

    const checkTeaching = await TCSR.checkIfTeacherTeachesSubjectInClass(
      insertTeacher.id,
      subjectId,
      createClass.id
    );

    expect(checkTeaching).toBe(true);

    //clean db for future tests
    await teacherClassSubject.remove(insertRelation);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);
    await Subject.remove(subjectId);
  });

  test('It should return false', async () =>{

    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });

    //create a new subject
    const subjectId = await Subject.create({
      Name: "Test Subject"
    });

    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: subjectId,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    });

    const checkTeaching = await TCSR.checkIfTeacherTeachesSubjectInClass(
      insertTeacher.id,
      100,
      createClass.id
    );

    expect(checkTeaching).toBe(false);

    //clean db for future tests
    await teacherClassSubject.remove(insertRelation);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);
    await Subject.remove(subjectId);
  });

  test('It should throw an error when the passed teacher id is missing or invalid', async () =>{
    
     //first insert a new teacher
     const testFirstName = 'Joe';
     const testLastName = 'Kernel';
     const testEmail = 'joekernel@gmail.com';
     const testSSN = 'LRNMRC79A02L219A';
     const testPassword = 'EasYPass1';
     const testIsTeacher = true;
     const testIsAdminOfficer = false;
     const testIsPrincipal = false;
 
     const insertTeacher = await User.insertInternalAccountData( 
         testFirstName, 
         testLastName, 
         testEmail, 
         testSSN, 
         testPassword,
         testIsTeacher,
         testIsAdminOfficer,
         testIsPrincipal
     );
 
     expect(insertTeacher).toEqual({
       id: expect.anything()
     });
 
     //then insert a new class
     const createClass = await Class.createClass(insertTeacher.id);
     expect(createClass).toEqual({
       id: createClass.id
     });

     //create a new subject
    const subjectId = await Subject.create({
      Name: "Test Subject"
    });
     
    try{
      await TCSR.checkIfTeacherTeachesSubjectInClass(
        null,
        subjectId,
        createClass.id
      );

    }catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid teacher id");
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
      await Subject.remove(subjectId);
    }
  });

  test('It should throw an error when the passed subject id is missing or invalid', async () =>{
    
    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });
    
   try{
     await TCSR.checkIfTeacherTeachesSubjectInClass(
       insertTeacher.id,
       null,
       createClass.id
     );

   }catch(error){
     expect(error).toHaveProperty("message", "Missing or invalid subject id");
     await Class.remove(createClass.id);
     await User.remove(insertTeacher.id);
   }
  });

  test('It should throw an error when the passed class id is missing or invalid', async () =>{
    
  //first insert a new teacher
  const testFirstName = 'Joe';
  const testLastName = 'Kernel';
  const testEmail = 'joekernel@gmail.com';
  const testSSN = 'LRNMRC79A02L219A';
  const testPassword = 'EasYPass1';
  const testIsTeacher = true;
  const testIsAdminOfficer = false;
  const testIsPrincipal = false;

  const insertTeacher = await User.insertInternalAccountData( 
      testFirstName, 
      testLastName, 
      testEmail, 
      testSSN, 
      testPassword,
      testIsTeacher,
      testIsAdminOfficer,
      testIsPrincipal
  );

  expect(insertTeacher).toEqual({
    id: expect.anything()
  });

  //then insert a new class
  const createClass = await Class.createClass(insertTeacher.id);
  expect(createClass).toEqual({
    id: createClass.id
  });
  
  //create a new subject
  const subjectId = await Subject.create({
    Name: "Test Subject"
  });

 try{
   await TCSR.checkIfTeacherTeachesSubjectInClass(
     insertTeacher.id,
     subjectId,
     null
   );

 }catch(error){
   expect(error).toHaveProperty("message", "Missing or invalid class id");
   await Class.remove(createClass.id);
   await User.remove(insertTeacher.id);
   await Subject.remove(subjectId);
 }
  });

});

describe('checkIfTeacherTeachesInClass', () =>{
  
  test('It should return true', async () =>{

    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });

    //create a new subject
    const subjectId = await Subject.create({
      Name: "Test Subject"
    });

    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: subjectId,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    });

    const checkTeaching = await TCSR.checkIfTeacherTeachesInClass(
      insertTeacher.id,
      createClass.id
    );

    expect(checkTeaching).toBe(true);

    //clean db for future tests
    await teacherClassSubject.remove(insertRelation);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);
    await Subject.remove(subjectId);
  });

  test('It should return false', async () =>{

    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });

    const checkTeaching = await TCSR.checkIfTeacherTeachesInClass(
      insertTeacher.id,
      createClass.id
    );

    expect(checkTeaching).toBe(false);

    //clean db for future tests
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);
  });

  test('It should throw an error when the passed teacher id is missing or invalid', async () =>{
    
     //first insert a new teacher
     const testFirstName = 'Joe';
     const testLastName = 'Kernel';
     const testEmail = 'joekernel@gmail.com';
     const testSSN = 'LRNMRC79A02L219A';
     const testPassword = 'EasYPass1';
     const testIsTeacher = true;
     const testIsAdminOfficer = false;
     const testIsPrincipal = false;
 
     const insertTeacher = await User.insertInternalAccountData( 
         testFirstName, 
         testLastName, 
         testEmail, 
         testSSN, 
         testPassword,
         testIsTeacher,
         testIsAdminOfficer,
         testIsPrincipal
     );
 
     expect(insertTeacher).toEqual({
       id: expect.anything()
     });
 
     //then insert a new class
     const createClass = await Class.createClass(insertTeacher.id);
     expect(createClass).toEqual({
       id: createClass.id
     });
     
    try{
      await TCSR.checkIfTeacherTeachesInClass(
        null,
        createClass.id
      );

    }catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid teacher id");
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
    }
  });

  test('It should throw an error when the passed class id is missing or invalid', async () =>{
    
  //first insert a new teacher
  const testFirstName = 'Joe';
  const testLastName = 'Kernel';
  const testEmail = 'joekernel@gmail.com';
  const testSSN = 'LRNMRC79A02L219A';
  const testPassword = 'EasYPass1';
  const testIsTeacher = true;
  const testIsAdminOfficer = false;
  const testIsPrincipal = false;

  const insertTeacher = await User.insertInternalAccountData( 
      testFirstName, 
      testLastName, 
      testEmail, 
      testSSN, 
      testPassword,
      testIsTeacher,
      testIsAdminOfficer,
      testIsPrincipal
  );

  expect(insertTeacher).toEqual({
    id: expect.anything()
  });

 try{
   await TCSR.checkIfTeacherTeachesInClass(
     insertTeacher.id,
     null
   );

 }catch(error){
   expect(error).toHaveProperty("message", "Missing or invalid class id");
   await User.remove(insertTeacher.id);
 }

});

});

describe('checkIfTeacherTeachesToStudent', () =>{
  
  test('It should return true, subject null case', async () =>{

    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });

    //insert a new student with parent
    const insertParent = await User.insertParentData(
    'Name',
    'Lastname',
    'parent1@parents.com',
    'FFLPSL33H68A698Z',
    'Password1'
  );
   expect(insertParent).toMatchObject({id: expect.anything()});

   const insertStudent = await Student.insertStudent(
     "Antonio",
     "De Giovanni",
     "TBKHSA93A02F494U",
     "M",
     moment().utc().subtract(13, 'years'),
     insertParent.id,
     null
   );
    expect(insertStudent).toMatchObject({id: expect.anything()});

    //assign student to class
    await Class.assignStudentsToClass(createClass.id, [insertStudent.id]);

    //create a new subject
    const subjectId = await Subject.create({
      Name: "Test Subject"
    })
    
    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: subjectId,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    });

    const checkTeaching = await TCSR.checkIfTeacherTeachesToStudent(
      insertTeacher.id,
      insertStudent.id
    );

    expect(checkTeaching).toBe(true);

    //clean db for future tests
    await Student.remove(insertStudent.id);
    await User.remove(insertParent.id);
    await teacherClassSubject.remove(insertRelation);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);
    await Subject.remove(subjectId);
  });

  test('It should return false, subject null case', async () =>{

    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });

    //insert a new student with parent
    const insertParent = await User.insertParentData(
    'Name',
    'Lastname',
    'parent1@parents.com',
    'FFLPSL33H68A698Z',
    'Password1'
  );
   expect(insertParent).toMatchObject({id: expect.anything()});

   const insertStudent = await Student.insertStudent(
     "Antonio",
     "De Giovanni",
     "TBKHSA93A02F494U",
     "M",
     moment().utc().subtract(13, 'years'),
     insertParent.id,
     null
   );
    expect(insertStudent).toMatchObject({id: expect.anything()});

    //create a new subject
    const subjectId = await Subject.create({
      Name: "Test Subject"
    })
    
    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: subjectId,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    });

    const checkTeaching = await TCSR.checkIfTeacherTeachesToStudent(
      insertTeacher.id,
      insertStudent.id
    );

    expect(checkTeaching).toBe(false);

    //clean db for future tests
    await Student.remove(insertStudent.id);
    await User.remove(insertParent.id);
    await teacherClassSubject.remove(insertRelation);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);
    await Subject.remove(subjectId);
  });

  test('It should return true, subject selected case', async () =>{

    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });

    //insert a new student with parent
    const insertParent = await User.insertParentData(
    'Name',
    'Lastname',
    'parent1@parents.com',
    'FFLPSL33H68A698Z',
    'Password1'
  );
   expect(insertParent).toMatchObject({id: expect.anything()});

   const insertStudent = await Student.insertStudent(
     "Antonio",
     "De Giovanni",
     "TBKHSA93A02F494U",
     "M",
     moment().utc().subtract(13, 'years'),
     insertParent.id,
     null
   );
    expect(insertStudent).toMatchObject({id: expect.anything()});

    //assign student to class
    await Class.assignStudentsToClass(createClass.id, [insertStudent.id]);

    //create a new subject
    const subjectId = await Subject.create({
      Name: "Test Subject"
    })
    
    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: subjectId,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    });

    const checkTeaching = await TCSR.checkIfTeacherTeachesToStudent(
      insertTeacher.id,
      insertStudent.id,
      subjectId
    );

    expect(checkTeaching).toBe(true);

    //clean db for future tests
    await Student.remove(insertStudent.id);
    await User.remove(insertParent.id);
    await teacherClassSubject.remove(insertRelation);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);
    await Subject.remove(subjectId);
  });

  test('It should return false, subject selected case', async () =>{

    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });

    //insert a new student with parent
    const insertParent = await User.insertParentData(
    'Name',
    'Lastname',
    'parent1@parents.com',
    'FFLPSL33H68A698Z',
    'Password1'
  );
   expect(insertParent).toMatchObject({id: expect.anything()});

   const insertStudent = await Student.insertStudent(
     "Antonio",
     "De Giovanni",
     "TBKHSA93A02F494U",
     "M",
     moment().utc().subtract(13, 'years'),
     insertParent.id,
     null
   );
    expect(insertStudent).toMatchObject({id: expect.anything()});

    //create a new subject
    const subjectId = await Subject.create({
      Name: "Test Subject"
    })
    
    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: subjectId,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    });

    const checkTeaching = await TCSR.checkIfTeacherTeachesToStudent(
      insertTeacher.id,
      insertStudent.id,
      subjectId
    );

    expect(checkTeaching).toBe(false);

    //clean db for future tests
    await Student.remove(insertStudent.id);
    await User.remove(insertParent.id);
    await teacherClassSubject.remove(insertRelation);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);
    await Subject.remove(subjectId);
  });

  test('It should throw an error when the passed teacher id is missing or invalid', async () =>{
    
     //first insert a new teacher
     const testFirstName = 'Joe';
     const testLastName = 'Kernel';
     const testEmail = 'joekernel@gmail.com';
     const testSSN = 'LRNMRC79A02L219A';
     const testPassword = 'EasYPass1';
     const testIsTeacher = true;
     const testIsAdminOfficer = false;
     const testIsPrincipal = false;
 
     const insertTeacher = await User.insertInternalAccountData( 
         testFirstName, 
         testLastName, 
         testEmail, 
         testSSN, 
         testPassword,
         testIsTeacher,
         testIsAdminOfficer,
         testIsPrincipal
     );
 
     expect(insertTeacher).toEqual({
       id: expect.anything()
     });
 
     //then insert a new class
     const createClass = await Class.createClass(insertTeacher.id);
     expect(createClass).toEqual({
       id: createClass.id
     });

     //insert a new student with parent
     const insertParent = await User.insertParentData(
        'Name',
        'Lastname',
        'parent1@parents.com',
        'FFLPSL33H68A698Z',
        'Password1'
     );
     expect(insertParent).toMatchObject({id: expect.anything()});

     const insertStudent = await Student.insertStudent(
       "Antonio",
       "De Giovanni",
       "TBKHSA93A02F494U",
       "M",
       moment().utc().subtract(13, 'years'),
       insertParent.id,
       null
     );
      expect(insertStudent).toMatchObject({id: expect.anything()});

      //assign student to class
      await Class.assignStudentsToClass(createClass.id, [insertStudent.id]);
     
    try{
      await TCSR.checkIfTeacherTeachesToStudent(
        null,
        insertStudent.id
      );

    }catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid teacher id");
      await Student.remove(insertStudent.id);
      await User.remove(insertParent.id);
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
      
    }
  });

  test('It should throw an error when the passed student id is missing or invalid', async () =>{
    
    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
      id: createClass.id
    });

   try{
     await TCSR.checkIfTeacherTeachesToStudent(
       insertTeacher.id,
       null
     );

   }catch(error){
     expect(error).toHaveProperty("message", "Missing or invalid student id");
     await Class.remove(createClass.id);
     await User.remove(insertTeacher.id);
   }
 });

});


describe('createNew', () => {

  test('It should make the insertion', async () =>{
    // Create teacher
    const userId = uuid.v4();
    await User.create({
      id: userId,
      eMail: 'abc@cba.ab',
      SSN: 'SCIWWN72A14H620P',
      Password: 'pass',
      FirstName: 'Teach',
      LastName: 'Er',
      IsTeacher: 1,
    });

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    const result = await TCSR.createNew(userId, [{classId, subjectId: 3}]);

    expect(result.newRecords).toBe(1);
    
    const query = 'SELECT * FROM TeacherSubjectClassRelation WHERE TeacherId = ?'
    const connection = await db.getConnection();
    let check;
    try {
      check = await connection.query(query, [userId]);
    } finally {
      connection.release();
    }
    expect(check).toHaveLength(1);
    expect(check[0].ClassId).toEqual(classId);
    expect(check[0].SubjectId).toEqual(3);
    expect(check[0].TeacherId).toEqual(userId);

    await TCSR.remove(check[0].ID);
    await Class.remove(classId);
    await User.remove(userId);


  });

  test('It should make multiple insertions', async () =>{
    // Create teacher
    const userId = uuid.v4();
    await User.create({
      id: userId,
      eMail: 'abc@cba.ab',
      SSN: 'SCIWWN72A14H620P',
      Password: 'pass',
      FirstName: 'Teach',
      LastName: 'Er',
      IsTeacher: 1,
    });

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    const result = await TCSR.createNew(userId, [
      {classId, subjectId: 3},
      {classId, subjectId: 4},
    ]);

    expect(result.newRecords).toBe(2);

    const query = 'SELECT * FROM TeacherSubjectClassRelation WHERE TeacherId = ?'
    const connection = await db.getConnection();
    let check;
    try {
      check = await connection.query(query, [userId]);
    } finally {
      connection.release();
    }
    expect(check).toHaveLength(2);
    expect(check[0].ClassId).toEqual(classId);
    expect(check[0].SubjectId).toEqual(3);
    expect(check[0].TeacherId).toEqual(userId);
    expect(check[1].ClassId).toEqual(classId);
    expect(check[1].SubjectId).toEqual(4);
    expect(check[1].TeacherId).toEqual(userId);


    await TCSR.remove(check[0].ID);
    await TCSR.remove(check[1].ID);
    await Class.remove(classId);
    await User.remove(userId);


  });

  test('It should throw an error about relation already exsisting', async () =>{
    // Create teacher
    const userId = uuid.v4();
    await User.create({
      id: userId,
      eMail: 'abc@cba.ab',
      SSN: 'SCIWWN72A14H620P',
      Password: 'pass',
      FirstName: 'Teach',
      LastName: 'Er',
      IsTeacher: 1,
    });

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    const first = await TCSR.createNew(userId, [
      {classId, subjectId: 3},
      {classId, subjectId: 4},
    ]);


    try{
      await TCSR.createNew(userId, [
        {classId, subjectId: 2},
        {classId, subjectId: 4},
      ]);
    } catch(error) {
      expect(error).toHaveProperty("message", "Teacher already teaches specified subject in specified class");
    } finally {
      const query = 'SELECT * FROM TeacherSubjectClassRelation WHERE TeacherId = ?'
      const connection = await db.getConnection();
      let check;
      try {
        check = await connection.query(query, [userId]);
      } finally {
        connection.release();
      }
      expect(check).toHaveLength(2);
      await TCSR.remove(check[0].ID);
      await TCSR.remove(check[1].ID);
      await Class.remove(classId);
      await User.remove(userId);
    }

  });

});

describe('findAll', () => {

  test('It should return all the relations', async () =>{
    const fn = 'Teach';
    const ln = 'Er';
    // Create teacher
    const userId = uuid.v4();
    await User.create({
      id: userId,
      eMail: 'abc@cba.ab',
      SSN: 'SCIWWN72A14H620P',
      Password: 'pass',
      FirstName: fn,
      LastName: ln,
      IsTeacher: 1,
    });

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });
    const className = await Class.getClassNameById(classId);

    await TCSR.createNew(userId, [
      {classId, subjectId: 3},
      {classId, subjectId: 4},
    ]);

    const result = await TCSR.findAll();
    expect(result).toEqual(
      expect.arrayContaining([
        {
          ID: expect.anything(),
          LastName: ln,
          FirstName: fn,
          Subject: "Physics",
          ClassName: className
        },
        {
          ID: expect.anything(),
          LastName: ln,
          FirstName: fn,
          Subject: "History",
          ClassName: className
        }
      ])
    );
    
    await Promise.all(result.map(async element => {
      if (element.ClassName == className) {
        await TCSR.remove(element.ID);
      }
    }));
    await Class.remove(classId);
    await User.remove(userId);


  });

});