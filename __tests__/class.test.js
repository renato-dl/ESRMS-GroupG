import Class from '../src/database/models/class';
import moment from 'moment';
import User from '../src/database/models/user';
import Student from '../src/database/models/student';
import db from '../src/database';

describe('Tests about assignment of student to a class', () =>{

  
  test('It should assign correctly a student to a class', async () => {

    const testFirstName = 'TestName';
    const testLastName = 'TestSurname';
    const testSSN = 'TBKHSA93A02F494U';
    const testBirthDate = moment().utc().subtract(13, 'years');
    const testGender = 'M';

    //parent1
    const testParent1 = await User.insertParentData(
      'Name',
      'Lastname',
      'parent1@parents.com',
      'FFLPSL33H68A698Z',
      'Password1'
    );
    expect(testParent1).toMatchObject({id: expect.anything()});

    //parent2
    const testParent2 = await User.insertParentData(
      'NameTwo',
      'LastnameTwo',
      'parent2@parents.com',
      'ZGIJMW64B22B275T',
      'Password2'
    );
    expect(testParent2).toMatchObject({id: expect.anything()});


    const result = await Student.insertStudent(
      testFirstName,
      testLastName,
      testSSN,
      testGender,
      testBirthDate,
      testParent1.id,
      testParent2.id
    );
    expect(result).toMatchObject({id: expect.anything()});

    const assignmentResult = await Class.assignStudentsToClass(1, [result.id]); 
    expect(assignmentResult).not.toBeNull();
    expect(assignmentResult).toEqual(
                  expect.objectContaining(
                    {
                        Success:true,
                        Message: "Students associated successfully."
                    }
       ));

    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  });

  test('It should assign correctly more students to a class', async () => {

    const testFirstName1 = 'TestNamePrimo';
    const testLastName1 = 'TestSurnamePrimo';
    const testSSN1 = 'TBKHSA93A02F494U';
    const testBirthDate1 = moment().utc().subtract(13, 'years');
    const testGender1 = 'M';

    const testFirstName2 = 'TestNameSecondo';
    const testLastName2 = 'TestSurnameSecondo';
    const testSSN2 = 'TBKHSA94B02F494U';
    const testBirthDate2 = moment().utc().subtract(13, 'years');
    const testGender2 = 'M';


    //parent1
    const testParent1 = await User.insertParentData(
      'Name',
      'Lastname',
      'parent1@parents.com',
      'FFLPSL33H68A698Z',
      'Password1'
    );
    expect(testParent1).toMatchObject({id: expect.anything()});

    //parent2
    const testParent2 = await User.insertParentData(
      'NameTwo',
      'LastnameTwo',
      'parent2@parents.com',
      'ZGIJMW64B22B275T',
      'Password2'
    );
    expect(testParent2).toMatchObject({id: expect.anything()});


    const result1 = await Student.insertStudent(
      testFirstName1,
      testLastName1,
      testSSN1,
      testGender1,
      testBirthDate1,
      testParent1.id,
      testParent2.id
    );
    expect(result1).toMatchObject({id: expect.anything()});

    const result2 = await Student.insertStudent(
      testFirstName2,
      testLastName2,
      testSSN2,
      testGender2,
      testBirthDate2,
      testParent1.id,
      testParent2.id
    );
    expect(result2).toMatchObject({id: expect.anything()});

    const assignmentResult = await Class.assignStudentsToClass(1, [result1.id , result2.id]); 
    expect(assignmentResult).not.toBeNull();
    expect(assignmentResult).toEqual(
                  expect.objectContaining(
                    {
                        Success:true,
                        Message: "Students associated successfully."
                    }
       ));

    await Student.remove(result1.id);
    await Student.remove(result2.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  });

  test('It should return a message saying something went wrong when studentId does not exist', async () => {

    const testFirstName = 'TestName';
    const testLastName = 'TestSurname';
    const testSSN = 'TBKHSA93A02F494U';
    const testBirthDate = moment().utc().subtract(13, 'years');
    const testGender = 'M';

    //parent1
    const testParent1 = await User.insertParentData(
      'Name',
      'Lastname',
      'parent1@parents.com',
      'FFLPSL33H68A698Z',
      'Password1'
    );
    expect(testParent1).toMatchObject({id: expect.anything()});

    //parent2
    const testParent2 = await User.insertParentData(
      'NameTwo',
      'LastnameTwo',
      'parent2@parents.com',
      'ZGIJMW64B22B275T',
      'Password2'
    );
    expect(testParent2).toMatchObject({id: expect.anything()});


    const result = await Student.insertStudent(
      testFirstName,
      testLastName,
      testSSN,
      testGender,
      testBirthDate,
      testParent1.id,
      testParent2.id
    );
    expect(result).toMatchObject({id: expect.anything()});
    const assignmentResult = await Class.assignStudentsToClass(1, ['notExistingId']); 
    expect(assignmentResult).not.toBeNull();
    expect(assignmentResult).toEqual(
        expect.objectContaining(
          {
              Success:false,
              Message: "Something went wrong."
          }
  ));

    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);

  });
});

describe('Tests about classes', () => {


  test('It should not throw errors while getting the list of classes', async () => {
    expect(Class.getClasses()).resolves.not.toThrow();
  });

  test('It should return the correct class data', async () => {
    // TODO: retest this after we have a method to create classes
    const classes = await Class.getClasses();
    expect(classes).not.toBeNull();
    expect(classes.length).toBeGreaterThanOrEqual(3);
    expect(classes).toEqual(
      expect.arrayContaining(
        [
          expect.objectContaining(
            {
              "ID": 1,
              "CreationYear": 2019,
              "Name": "1A",
              "Coordinator": "Giulia Tesori"
            },
            {
              "ID": 2,
              "CreationYear": 2019,
              "Name": "1B",
              "Coordinator": "Paola De Paola"
            },
            {
              "ID": 3,
              "CreationYear": 2019,
              "Name": "1C",
              "Coordinator": "Luca De Luca"
            }
          )
        ]
      )
    );
  });

});

describe('Tests about creation of classes', () =>{
  test('It should perform the creation correctly', async () =>{
    
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

    const createClass = await Class.createClass(insertTeacher.id);

    expect(createClass).toEqual({
      id: createClass.id
    });

    //clean db for future tests
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);

  });


  test('It should throw an error when coordinatorId is missing or invalid', async () =>{
    try{
      await Class.createClass();

    }catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid coordinatorId");
    }
  });


  test('It should throw an error when a coordinatorId is not a valid teacher', async () =>{
    try{
      await Class.createClass("notValidTeacherId");

    }catch(error){
      expect(error).toHaveProperty("message", "Coordinator is not a valid teacher");
    }
  });

  test('It should throw an error when a coordinatorId is not a valid teacher', async () =>{
    try{
      await Class.createClass("notValidTeacherId");

    }catch(error){
      expect(error).toHaveProperty("message", "Coordinator is not a valid teacher");
    }
  });

  test('It should throw an error when choosing as coordinator a teacher who is already a coordinator in one other class', async () =>{
    
    //first insert a new teacher
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    //fist create teacher user
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

    //then assign teacher user as the coordinator of a class
    const connection = await db.getConnection();
    
    const assignCoordinator = await connection.query(
      `INSERT INTO Classes (CreationYear, Name, CoordinatorId)
      VALUES (2019, 'Z', ?)`,
      [insertTeacher.id]

    );
    connection.release();

    try{
      await Class.createClass(insertTeacher.id);

    }catch(error){
      expect(error).toHaveProperty("message", "Selected teacher is already a class coordinator");
      
      //clean db for future tests
      await Class.remove(assignCoordinator.insertId);
      await User.remove(insertTeacher.id);
    }
  });



});

describe('Tests about deletion of classes', () =>{
  test('It should perform the deletion correctly', async () =>{
    
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

    const createClass = await Class.createClass(insertTeacher.id);

    expect(createClass).toEqual({
      id: createClass.id
    });

    await Class.deleteClass(createClass.id);

    try{  
      await Class.findById(createClass.id)
    }
    catch(error){
      expect(error).toHaveProperty("message", "Entity not found");
     
      //clean db for future tests
      await User.remove(insertTeacher.id);
    }

  });

  test('It should throw an error when classId is missing', async () =>{
    try{
      await Class.deleteClass();  
    }
    catch(error){
      expect(error).toHaveProperty("message", "Missing classId");
    }
  });

  test('It should throw an error when deleting a class with students', async () =>{
    
    //first insert a new teacher
    const teacherTestFirstName = 'Joe';
    const teacherTestLastName = 'Kernel';
    const teacherTestEmail = 'joekernel@gmail.com';
    const teacherTestSSN = 'LRNMRC79A02L219A';
    const teacherTestPassword = 'EasYPass1';
    const teacherTestIsTeacher = true;
    const teacherIsAdminOfficer = false;
    const teacherTestIsPrincipal = false;

    const insertTeacher = await User.insertInternalAccountData( 
        teacherTestFirstName, 
        teacherTestLastName, 
        teacherTestEmail, 
        teacherTestSSN, 
        teacherTestPassword,
        teacherTestIsTeacher,
        teacherIsAdminOfficer,
        teacherTestIsPrincipal
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //then insert a new student
    const testFirstName = 'Antonio';
    const testLastName = 'De Giovanni';
    const testSSN = 'TBKHSA93A02F494U';
    const testBirthDate = moment().utc().subtract(13, 'years');
    const testGender = 'M';

    //parent1
    const testParent1 = await User.insertParentData(
      'Name',
      'Lastname',
      'parent1@parents.com',
      'FFLPSL33H68A698Z',
      'Password1'
    );
    expect(testParent1).toMatchObject({id: expect.anything()});

    const result = await Student.insertStudent(
      testFirstName,
      testLastName,
      testSSN,
      testGender,
      testBirthDate,
      testParent1.id,
      null
    );
    
    //then create the class
    const createClass = await Class.createClass(insertTeacher.id);
    expect(createClass).toEqual({
        id: createClass.id
    });

    //then assign student to that class
    await Class.assignStudentsToClass(createClass.id, [result.id]); 

    try{
      await Class.deleteClass(createClass.id);  
    }
    catch(error){
      expect(error).toHaveProperty("message", "Cannot delete a class with students");
     
      //clean db for future tests
      await Student.remove(result.id);
      await User.remove(testParent1.id);
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
    }

  });

  test('It should throw an error when deleting not the most recent created class', async () =>{
    
    //first insert the coordinator teachers
    const teacherTestFirstName1 = 'Joe';
    const teacherTestLastName1 = 'Kernel';
    const teacherTestEmail1 = 'joekernel@gmail.com';
    const teacherTestSSN1 = 'LRNMRC79A02L219A';
    const teacherTestPassword1 = 'EasYPass1';

    const teacherTestFirstName2 = 'New';
    const teacherTestLastName2 = 'Teacher';
    const teacherTestEmail2 = 'joekernel2@gmail.com';
    const teacherTestSSN2 = 'LRNMRC79A03L219E';
    const teacherTestPassword2 = 'EasYPass2';

    const teacherTestIsTeacher = true;
    const teacherIsAdminOfficer = false;
    const teacherTestIsPrincipal = false;

    const insertTeacher1 = await User.insertInternalAccountData( 
        teacherTestFirstName1, 
        teacherTestLastName1, 
        teacherTestEmail1, 
        teacherTestSSN1, 
        teacherTestPassword1,
        teacherTestIsTeacher,
        teacherIsAdminOfficer,
        teacherTestIsPrincipal
    );

    expect(insertTeacher1).toEqual({
      id: expect.anything()
    });

    const insertTeacher2 = await User.insertInternalAccountData( 
      teacherTestFirstName2, 
      teacherTestLastName2, 
      teacherTestEmail2, 
      teacherTestSSN2, 
      teacherTestPassword2,
      teacherTestIsTeacher,
      teacherIsAdminOfficer,
      teacherTestIsPrincipal
  );

    expect(insertTeacher2).toEqual({
      id: expect.anything()
    });

    //then create the classes
    const createClass1 = await Class.createClass(insertTeacher1.id);
    expect(createClass1).toEqual({
        id: createClass1.id
    });

    const createClass2 = await Class.createClass(insertTeacher2.id);
    expect(createClass2).toEqual({
        id: createClass2.id
    });

    try{
      await Class.deleteClass(createClass1.id);  
    }
    catch(error){
      expect(error).toHaveProperty("message", "Only the most recently created class can be deleted");
      await Class.remove(createClass2.id);
      await User.remove(insertTeacher2.id);
      await Class.remove(createClass1.id);
      await User.remove(insertTeacher1.id);  
    }

  });

  
});



