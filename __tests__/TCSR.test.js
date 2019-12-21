import TCSR from '../src/database/models/teacherClassSubject'
import Class from '../src/database/models/class'
import User from '../src/database/models/user'
import uuid from 'uuid';
import teacherClassSubject from '../src/database/models/teacherClassSubject';
import moment from 'moment';

describe('Tests about getting the teaching classes of a teacher', () =>{
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

    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: 1,
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
  });

  test('It should throw an error when the passed teacher id is missing or invalid', async () =>{
    try{
      await TCSR.getTeachingClasses();

    }catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid teacher id");
    }
  });

});

describe('Tests about checking if teacher teaches a subject in a class', () =>{
  
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

    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: 1,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    });

    const checkTeaching = await TCSR.checkIfTeacherTeachesSubjectInClass(
      insertTeacher.id,
      1,
      createClass.id
    );

    expect(checkTeaching).toBe(true);

    //clean db for future tests
    await teacherClassSubject.remove(insertRelation);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);
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

    //assign that teacher to the class
    const insertRelation = await teacherClassSubject.create({
      SubjectId: 1,
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
      await TCSR.checkIfTeacherTeachesSubjectInClass(
        null,
        1,
        createClass.id
      );

    }catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid teacher id");
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
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
  
 try{
   await TCSR.checkIfTeacherTeachesSubjectInClass(
     insertTeacher.id,
     1,
     null
   );

 }catch(error){
   expect(error).toHaveProperty("message", "Missing or invalid class id");
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

    const result = await TCSR.createNew(userId, 3, classId);
    
    const check = await TCSR.findById(result);
    expect(check.ClassId).toEqual(classId);
    expect(check.SubjectId).toEqual(3);
    expect(check.TeacherId).toEqual(userId);

    await TCSR.remove(result);
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

    const first = await TCSR.createNew(userId, 3, classId);

    try{
      await TCSR.createNew(userId, 3, classId);
    } catch(error) {
      expect(error).toHaveProperty("message", "Teacher already teaches specified subject in specified class");
    } finally {
      await TCSR.remove(first);
      await Class.remove(classId);
      await User.remove(userId);
    }

  });

});