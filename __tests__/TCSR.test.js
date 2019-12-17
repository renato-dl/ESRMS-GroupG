import TCSR from '../src/database/models/teacherClassSubject'
import Class from '../src/database/models/class'
import User from '../src/database/models/user'
import db from '../src/database';
import teacherClassSubject from '../src/database/models/teacherClassSubject';

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