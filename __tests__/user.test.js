import User from '../src/database/models/user';
import Student from '../src/database/models/student';
import db from '../src/database';
import moment from 'moment';
import Class from '../src/database/models/class';
import uuid from 'uuid';

describe('getParentData', () =>{

  test('It should show the inserted parent data', async () => {

    const parents = await User.getParentData();

    expect(parents).not.toBeNull();
    expect(parents.length).toBeGreaterThan(0);
    expect(parents).toEqual(
            expect.arrayContaining(
                [
                  expect.objectContaining(
                    {
                        "FirstName": "Marco",
                        "LastName": "Lorenzini",
                        "SSN": "LRNMRC76A02L219A",
                        "eMail": "marco.lorenzini@gmail.com",
                        "CreatedOn": expect.anything()
                    },
                    {
                        "FirstName": "Nadia",
                        "LastName": "Rossi",
                        "SSN": "RSSNDA76A41L219U",
                        "eMail": "nadia.rossi@gmail.com",
                        "CreatedOn": expect.anything()
                    },
                    {
                        "FirstName": "Lucia",
                        "LastName": "Verdi",
                        "SSN": "VRDLCU75A41L219F",
                        "eMail": "lucia.verdi@gmail.com",
                        "CreatedOn": expect.anything()
                    }
       )]));
  });


});


describe('insertParentData', () => {

    /*
    * 1. Ok
    * 2. missing or invalid firstName
    * 3. missing or invalid lastName
    * 4. missing or invalid eMail
    * 5. missing or invalid SSN
    * 6. Exsisting user
    */

  test('It should perform the insertion', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';

    const result = await User.insertParentData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword
    );

    expect(result).toEqual({
      id: expect.anything()
    });

    const connection = await db.getConnection();

    const queryResult = await connection.query(
      `SELECT *
      FROM Users
      WHERE ID = ?`,
      [result.id]
    );

    connection.release();

    expect(queryResult.length).toBe(1);
    expect(queryResult[0].FirstName).toEqual(testFirstName);
    expect(queryResult[0].LastName).toEqual(testLastName);
    expect(queryResult[0].SSN).toEqual(testSSN);
    expect(queryResult[0].eMail).toEqual(testEmail);

    //delete result for future tests
    await User.remove(result.id);
  }); 
  
  test('It should throw Error with message \'Missing or invalid first name\'', async () => {

    const testFirstName = 'Joe2';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';

    try{
    const result = await User.insertParentData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword
    );
    }catch(error){
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Missing or invalid first name');
    
    }
  });
  
  test('It should throw Error with message \'Missing or invalid last name\'', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel2';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';

    try{
    const result = await User.insertParentData(
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword
    );
    }catch(error){
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Missing or invalid last name'); 
    }
  });

  test('It should throw Error with message \'Missing or invalid email\'', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernelgmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';

    try{
    const result = await User.insertParentData(  
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword
    );
    }catch(error){
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Missing or invalid email'); 
    }
  });

  test('It should throw Error with message \'Missing or invalid SSN\'', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L2191';
    const testPassword = 'EasYPass1';

    try{
    const result = await User.insertParentData(
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword
    );
    }catch(error){
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Missing or invalid SSN');
    }
  });

  test('It should throw Error with message \'Parent already in db\'', async () => {


    const testFirstName = 'Nome';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';

    const result = await User.insertParentData(
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword
    );

    try{
      await User.insertParentData(
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword
      );
    } catch(error){
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Parent already in db');

      //delete result for future tests
      const connection = await db.getConnection();
      const deleteResultFromUsers = await connection.query(
        `DELETE
        FROM Users
        WHERE ID = ?`,
        [result.id]
      );

      expect(deleteResultFromUsers.affectedRows).toBe(1);

      connection.release();
    }


    
  });

});

describe('insertInternalAccountData', () => {

  /*
  * 1. Ok
  * 2. missing or invalid firstName
  * 3. missing or invalid lastName
  * 4. missing or invalid eMail
  * 5. missing or invalid SSN
  * 6. Exsisting user
  * 7. Both teacher and admin
  * 8. Both admin and principal
  * 9. No role
  */
  test('It should perform the insertion', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const result = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(result).toEqual({
      id: expect.anything()
    });

    const connection = await db.getConnection();

    const queryResult = await connection.query(
      `SELECT *
      FROM Users
      WHERE ID = ?`,
      [result.id]
    );

    connection.release();

    expect(queryResult.length).toBe(1);
    expect(queryResult[0].FirstName).toEqual(testFirstName);
    expect(queryResult[0].LastName).toEqual(testLastName);
    expect(queryResult[0].SSN).toEqual(testSSN);
    expect(queryResult[0].eMail).toEqual(testEmail);
    expect(queryResult[0].IsSysAdmin).toBeFalsy();
    expect(queryResult[0].IsTeacher).toBeTruthy();
    expect(queryResult[0].IsAdminOfficer).toBeFalsy();
    expect(queryResult[0].IsPrincipal).toBeFalsy();


    //delete result for future tests
    await User.remove(result.id);
  });

  test('Invalid first name', async () => {

    const testFirstName = '23423';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    try {
      await User.insertInternalAccountData( 
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword,
          testIsTeacher,
          testIsAdminOfficer,
          testIsPrincipal
      );
    }catch(error) {
      expect(error).toHaveProperty('message', 'Missing or invalid first name');
    }
    

   
  });

  test('Invalid last name', async () => {

    const testFirstName = 'Joe';
    const testLastName = null;
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    try {
      await User.insertInternalAccountData( 
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword,
          testIsTeacher,
          testIsAdminOfficer,
          testIsPrincipal
      );
    }catch(error) {
      expect(error).toHaveProperty('message', 'Missing or invalid last name');
    }



  });

  test('Invalid last eMail', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joe';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    try {
      await User.insertInternalAccountData( 
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword,
          testIsTeacher,
          testIsAdminOfficer,
          testIsPrincipal
      );
    }catch(error) {
      expect(error).toHaveProperty('message', 'Missing or invalid email');
    }



  });

  test('Invalid SSN', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'aaaa';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    try {
      await User.insertInternalAccountData( 
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword,
          testIsTeacher,
          testIsAdminOfficer,
          testIsPrincipal
      );
    }catch(error) {
      expect(error).toHaveProperty('message', 'Missing or invalid SSN');
    }



  });

  test('Exsisting user', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const result = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    try {
      await User.insertInternalAccountData( 
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword,
          testIsTeacher,
          testIsAdminOfficer,
          testIsPrincipal
      );
    } catch(error) {
      //delete result for future tests
      await User.remove(result.id);
      expect(error).toHaveProperty('message', 'User already in db');
    }
  });

  test('Cannot be teacher and admin', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = true;
    const testIsPrincipal = false;

    try {
      await User.insertInternalAccountData( 
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword,
          testIsTeacher,
          testIsAdminOfficer,
          testIsPrincipal
      );
    }catch(error) {
      expect(error).toHaveProperty('message', 'A user cannot be both teacher and admin officer');
    }



  });

  test('Cannot be Principal and AdminOfficer', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = false;
    const testIsAdminOfficer = true;
    const testIsPrincipal = true;

    try {
      await User.insertInternalAccountData( 
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword,
          testIsTeacher,
          testIsAdminOfficer,
          testIsPrincipal
      );
    }catch(error) {
      expect(error).toHaveProperty('message', 'A user cannot be both admin and principal');
    }



  });

  test('No role defined', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = false;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    try {
      await User.insertInternalAccountData( 
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword,
          testIsTeacher,
          testIsAdminOfficer,
          testIsPrincipal
      );
    }catch(error) {
      expect(error).toHaveProperty('message', 'A user must be at least admin officer, principal or teacher');
    }



  });

  test('Cannot insert more than one principal', async ()=>{
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = false;
    const testIsAdminOfficer = false;
    const testIsPrincipal = true;
    let insertPrincipal = null;

    const checkIfExistingPrincipal = await User.isThereAlreadyAPrincipal();
    if(!checkIfExistingPrincipal){

      insertPrincipal =  await User.insertInternalAccountData( 
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword,
          testIsTeacher,
          testIsAdminOfficer,
          testIsPrincipal
        );

      expect(insertPrincipal).toEqual({
          id: expect.anything()
      });

    }
    try {

      await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        "new@example.com", 
        "LRNMRC79A02L219E", 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
      );      
    }
    catch(error) {
      if(insertPrincipal) {
        await User.remove(insertPrincipal.id);
      }

      expect(error).toHaveProperty('message', 'There is already a principal');
    }
  }); 

}); 

describe('editInternalAccount', () => {

  /*
  * 1. Ok
  * 2. Same behaviour as insertion
  */
  test('Ok', async () => {

    // Perform insertion
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const insertResult = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertResult).toEqual({
      id: expect.anything()
    });

    // Edit the entry just inserted
    const editResult = await User.editInternalAccount(
      insertResult.id,
      'Norberto', 
      testLastName, 
      testEmail, 
      testSSN, 
      testIsTeacher,
      testIsAdminOfficer,
      true
    );
    
    expect(editResult).toBe(true);

    const queryResult = await User.findById(insertResult.id);

    expect(queryResult.FirstName).toEqual('Norberto');
    expect(queryResult.LastName).toEqual(testLastName);
    expect(queryResult.SSN).toEqual(testSSN);
    expect(queryResult.eMail).toEqual(testEmail);
    expect(queryResult.IsSysAdmin).toBeFalsy();
    expect(queryResult.IsTeacher).toBeTruthy();
    expect(queryResult.IsAdminOfficer).toBeFalsy();
    expect(queryResult.IsPrincipal).toBeTruthy();


    //delete result for future tests
    await User.remove(insertResult.id);
  }); 

  test('It should throw an error when removing the role of a teacher assigned to a class  ', async () => {

    // Perform insertion
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    //first insert a new teacher user
    const insertResult = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertResult).toEqual({
      id: expect.anything()
    });

    //then asign that teacher to a class
    
    const connection = await db.getConnection();
    const assignTeacherToClass = await connection.query(
      `INSERT INTO TeacherSubjectClassRelation (SubjectId, ClassId, TeacherId)
      VALUES (1, 1, ?)`,
      [insertResult.id]

    );

    // Edit the teacher role
   try{
      const editResult = await User.editInternalAccount(
        insertResult.id,
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        false,
        true,
        testIsPrincipal
      );

   }catch(error){
    expect(error).toHaveProperty('message', 'User has associated classes, teacher role cannot be removed');
    
    //delete result for future tests
    await connection.query(
      `DELETE FROM TeacherSubjectClassRelation
      WHERE ID = ?`,
      [assignTeacherToClass.insertId]
    );
    connection.release();
    await User.remove(insertResult.id);
   }
  });
  
  test('It should throw an error when removing the role of a teacher who is a coordinator', async () => {

    // Perform insertion
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    //first insert a new teacher user
    const insertResult = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(insertResult).toEqual({
      id: expect.anything()
    });

    //then assign teacher as a coordinator in a class
    const connection = await db.getConnection();
    const assignCoordinator = await connection.query(
      `INSERT INTO Classes (CreationYear, Name, CoordinatorId)
      VALUES (1, 1, ?)`,
      [insertResult.id]

    );
    connection.release();

  // Edit the teacher role
   try{
      const editResult = await User.editInternalAccount(
        insertResult.id,
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        false,
        true,
        testIsPrincipal
      );

   }catch(error){
    expect(error).toHaveProperty('message', 'User is class coordinator, teacher role cannot be removed');

    //delete result for future tests
    const connection = await db.getConnection();
    await connection.query(
      `DELETE FROM Classes
      WHERE ID = ?`,
      [assignCoordinator.insertId]
    );
    connection.release();
    await User.remove(insertResult.id);
   }
  });
  
  test('It should throw an error when adding an user with a principal role and there is already one principal', async () => {

    // Perform insertion
    const otherPrincipal = await User.isThereAlreadyAPrincipal();
    let insertResultFirst = null;
    let insertResultSecond = null;
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = false;
    const testIsAdminOfficer = false;
    const testIsPrincipal = true;
    
    if (!otherPrincipal) {  
      //first insert a new principal user
      insertResultFirst = await User.insertInternalAccountData( 
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword,
          testIsTeacher,
          testIsAdminOfficer,
          testIsPrincipal
      );

      expect(insertResultFirst).toEqual({
        id: expect.anything()
      });

      insertResultSecond = await User.insertInternalAccountData( 
        "new", 
        "user", 
        "newuser@example.com", 
        "LRNMRC79A02L219E", 
        testPassword,
        true,
        testIsAdminOfficer,
        false
    );

    expect(insertResultSecond).toEqual({
      id: expect.anything()
    });
  }

  // Edit the new user role to principal
   try{
      await User.editInternalAccount(
        insertResultSecond.id,
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        true,
        false,
        true
      );

   }catch(error){
    expect(error).toHaveProperty('message', 'There is already a principal');
    //delete result for future tests

    if(insertResultFirst && insertResultSecond){
      await User.remove(insertResultFirst.id);
      await User.remove(insertResultSecond.id);
    }
  }

  });

}); 

describe('findInternalAccounts', () =>{
  test('It should receive only internal accounts', async () => {

    const result = await User.findInternalAccounts();
    expect(result.length).toBeGreaterThanOrEqual(1);
    result.forEach(element => {
      expect(element.IsTeacher || element.IsAdminOfficer || element.IsPrincipal).toBe(1);
    });
  });  
});

describe('deleteAccount', () =>{
  
  test('It should perform the deletion correctly', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const result = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(result).toEqual({
      id: expect.anything()
    });

    try{
      await User.deleteAccount(result.id);
      await User.findById(result.id);

    }catch(error){

      expect(error).toHaveProperty('message', 'Entity not found');

      //delete result for future tests
       await User.remove(result.id);
    }

  });

  test('It should throw an error when trying to delete an SysAdmin account', async () => {

    const sysAdminId = "205db8275d3c06e6ce3fe7a47b30e0fe";  
    try{
      await User.deleteAccount(sysAdminId);

    }catch(error){
      expect(error).toHaveProperty('message', 'Cannot delete SysAdmin');
    }

  });

  test('It should throw an error when trying to delete a not existing account', async () => {

    const sysAdminId = "notExistingId";  
    try{
      await User.deleteAccount(sysAdminId);

    }catch(error){
      expect(error).toHaveProperty('message', 'Account does not exist');
    }

  });

  test('It should throw an error when trying to delete a parent accout connected to a student one', async () => {

    const testFirstName = 'TestName';
    const testLastName = 'TestSurname';
    const testSSN = 'TBKHSA93A02F494U';
    const testBirthDate = moment().utc().subtract(13, 'years');
    const testGender = 'M';

    //parent1
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

    try{
      await User.deleteAccount(testParent.id);

    }catch(error){
      expect(error).toHaveProperty('message', 'Cannot delete user with associated students');
      await Student.remove(result.id);
      await User.remove(testParent.id);

    }
  
  });
  
  test('It should throw an error when trying to delete a teacher accout connected to a class', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const result = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(result).toEqual({
      id: expect.anything()
    });

    const connection = await db.getConnection();
    const assignTeacherToClass = await connection.query(
      `INSERT INTO TeacherSubjectClassRelation (SubjectId, ClassId, TeacherId)
      VALUES (1, 1, ?)`,
      [result.id]

    );

    try{
      await User.deleteAccount(result.id);

    }catch(error){

      expect(error).toHaveProperty('message', 'Cannot delete teachers associated to classes');

      //delete insertions for future tests
      
      const deleteClassAssignment = await connection.query(
        `DELETE FROM TeacherSubjectClassRelation
        WHERE ID = ?`,
        [assignTeacherToClass.insertId]
      );

      connection.release();

      await User.remove(result.id);
    }

  });

  test('It should throw an error when trying to delete a teacher accout who is also a coordinator', async () => {

    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const result = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(result).toEqual({
      id: expect.anything()
    });

    const connection = await db.getConnection();
    const assignCoordinator = await connection.query(
      `INSERT INTO Classes (CreationYear, Name, CoordinatorId)
      VALUES (2019, 'D', ?)`,
      [result.id]

    );

    try{
      await User.deleteAccount(result.id);

    }catch(error){

      expect(error).toHaveProperty('message', 'Cannot delete class coordinators');

      //delete insertions for future tests
      
      const deleteClassAssignment = await connection.query(
        `DELETE FROM Classes
        WHERE ID = ?`,
        [assignCoordinator.insertId]
      );

      connection.release();

      await User.remove(result.id);
    }

  });

});

describe('getTeachers', () => {

  test('It should show data of teachers who are not coordinators', async () =>{
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const result = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(result).toEqual({
      id: expect.anything()
    });

    const teachers = await User.getTeachers();
    expect(teachers).toEqual(
      expect.arrayContaining(
          [
              expect.objectContaining(
                  {
                      "ID": result.id,
                      "FirstName": testFirstName,
                      "LastName": testLastName,
                  }
      )]));

    //delete result for future tests
    await User.remove(result.id);

  });

  test('It should show data of all teachers', async () =>{
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;

    const result = await User.insertInternalAccountData( 
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword,
        testIsTeacher,
        testIsAdminOfficer,
        testIsPrincipal
    );

    expect(result).toEqual({
      id: expect.anything()
    });

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: result.id
    });

    const teachers = await User.getTeachers(true);
    expect(teachers).toEqual(
      expect.arrayContaining(
          [
              expect.objectContaining(
                  {
                      "ID": result.id,
                      "FirstName": testFirstName,
                      "LastName": testLastName,
                  }
      )]));

    //delete result for future tests
    await Class.remove(classId);
    await User.remove(result.id);

  });


});

describe('getUserRolesById', () => {

  test('It should return correct roles for user', async () =>{
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;
    const testIsParent = true;

    const userId = uuid.v4();
    await User.create({
      id: userId,
      eMail: testEmail,
      SSN: testSSN,
      Password: testPassword,
      FirstName: testFirstName,
      LastName: testLastName,
      IsTeacher: testIsTeacher,
      IsParent: testIsParent,
      IsAdminOfficer: testIsAdminOfficer,
      IsPrincipal: testIsPrincipal
    });

    const roles = await User.getUserRolesById(userId);    
    
    expect(roles[0]).toEqual(
      { IsParent: 1,
      IsTeacher: 1,
      IsPrincipal: 0,
      IsAdminOfficer: 0,
      IsSysAdmin: 0 }
    );

    //delete result for future tests
    await User.remove(userId);

  });

});

describe('makeParentIfNotAlready', () => {

  test('Already parent', async () =>{
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;
    const testIsParent = true;

    const userId = uuid.v4();
    await User.create({
      id: userId,
      eMail: testEmail,
      SSN: testSSN,
      Password: testPassword,
      FirstName: testFirstName,
      LastName: testLastName,
      IsTeacher: testIsTeacher,
      IsParent: testIsParent,
      IsAdminOfficer: testIsAdminOfficer,
      IsPrincipal: testIsPrincipal
    });

    await User.makeParentIfNotAlready(userId);

    const roles = await User.getUserRolesById(userId);    
    
    expect(roles[0]).toEqual(
      { IsParent: 1,
      IsTeacher: 1,
      IsPrincipal: 0,
      IsAdminOfficer: 0,
      IsSysAdmin: 0 }
    );

    //delete result for future tests
    await User.remove(userId);

  });

  test('Becomes parent', async () =>{
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';
    const testIsTeacher = true;
    const testIsAdminOfficer = false;
    const testIsPrincipal = false;
    const testIsParent = false;

    const userId = uuid.v4();
    await User.create({
      id: userId,
      eMail: testEmail,
      SSN: testSSN,
      Password: testPassword,
      FirstName: testFirstName,
      LastName: testLastName,
      IsTeacher: testIsTeacher,
      IsParent: testIsParent,
      IsAdminOfficer: testIsAdminOfficer,
      IsPrincipal: testIsPrincipal
    });

    await User.makeParentIfNotAlready(userId);

    const roles = await User.getUserRolesById(userId);    

    expect(roles[0]).toEqual(
      { IsParent: 1,
      IsTeacher: 1,
      IsPrincipal: 0,
      IsAdminOfficer: 0,
      IsSysAdmin: 0 }
    );

    //delete result for future tests
    await User.remove(userId);

  });

  test('Invalid userId', async () =>{
    try {
      await User.makeParentIfNotAlready('A');
    } catch(error) {
      expect(error).toHaveProperty('message', 'Invalid userId');
    }
    
  });

});

describe('checkIfStillParent', () => {
  // Has children
  // No children but teacher
  // No children -> remove

  test('Still parent', async () =>{

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

    const s1Id = uuid.v4();
    await Student.create({
      ID: s1Id,
      FirstName: 'AAA',
      LastName: 'AAA',
      SSN: 'ZZGSCD71A54Z325N',
      BirthDate: '2013-05-11',
      Parent1: userId,
      Gender: 'M'
    });
    
    await User.checkIfStillParent(userId);
    const result = await User.findById(userId);
    expect(result.IsParent).toBe(1);

    await Student.remove(s1Id);
    await User.remove(userId);
  });

  test('Not parent anymore', async () =>{

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

    await User.checkIfStillParent(userId);
    const result = await User.findById(userId);
    expect(result.IsParent).toBe(0);

    await User.remove(userId);
  });

  test('User removed', async () =>{

    const userId = uuid.v4();
    await User.create({
      id: userId,
      eMail: 'abc@cba.ab',
      SSN: 'SCIWWN72A14H620P',
      Password: 'pass',
      FirstName: 'Teach',
      LastName: 'Er',
      IsTeacher: 0,
      IsParent: 1
    });

    await User.checkIfStillParent(userId);
    try {
      await User.findById(userId);
    } catch(error) {
      expect(error).toHaveProperty('message', 'Entity not found');
    }
  });


});

