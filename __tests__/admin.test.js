import User from '../src/database/models/user';
import Student from '../src/database/models/student';
import crypto from 'crypto';
import db from '../src/database';
import moment from 'moment';
import ClassModel from '../src/database/models/class';
import student from '../src/database/models/student';


describe('Tests about the visualization of inserted parents', () =>{

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


describe('Tests about the insertion of parent data by admin', () => {

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
      const result = await User.insertParentData(
          testFirstName, 
          testLastName, 
          testEmail, 
          testSSN, 
          testPassword
      );
    } catch(error){
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Parent already in db');
    }


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
  });

});

describe('Tests about the insertion of internal account by admin', () => {

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

}); 


describe('Tests about the insertion of student data', () => {
  /*
   * 1. Ok with parent2
   * 2. Ok without parent2
   * 3. missing or invalid firstName
   * 4. missing or invalid lastName
   * 5. missing or invalid SSN
   * 6. missing or invalid gender
   * 7. missing or invalid date
   * 8. invalid parent1
   * 9. invalid parent2
   * 10. equal parents
   */

  // firstName, lastName, SSN, gender, birthDate, parent1, parent2

  test('It should perform the insertion', async () => {

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

    const connection = await db.getConnection();

    const testResult = await connection.query(
      `SELECT COUNT(*) AS count
      FROM Students
      WHERE ID = ? AND FirstName = ? AND LastName = ? AND SSN = ? AND Gender = ? AND BirthDate = ? AND Parent1 = ? AND Parent2 = ?;`,
      [result.id, testFirstName, testLastName, testSSN, testGender, testBirthDate.format(db.getDateFormatString()), testParent1.id, testParent2.id ]
    );
    
    connection.release();

    expect(testResult[0].count).toBe(1);

    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);

  });

  test('It should perform the insertion', async () => {

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
    expect(result).toMatchObject({id: expect.anything()});

    const connection = await db.getConnection();

    const testResult = await connection.query(
      `SELECT COUNT(*) AS count
      FROM Students
      WHERE ID = ? AND FirstName = ? AND LastName = ? AND SSN = ? AND Gender = ? AND BirthDate = ? AND Parent1 = ? AND Parent2 IS NULL;`,
      [result.id, testFirstName, testLastName, testSSN, testGender, testBirthDate.format(db.getDateFormatString()), testParent1.id]
    );

    connection.release();

    expect(testResult[0].count).toBe(1);

    await Student.remove(result.id);
    await User.remove(testParent1.id);

  });

  test('It should throw first name related error', async () => {

    const testFirstName = 'uesaf9@3w';
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

    //parent2
    const testParent2 = await User.insertParentData(
      'NameTwo',
      'LastnameTwo',
      'parent2@parents.com',
      'ZGIJMW64B22B275T',
      'Password2'
    );
    expect(testParent2).toMatchObject({id: expect.anything()});


    try {
      const result = await Student.insertStudent(
        testFirstName,
        testLastName,
        testSSN,
        testGender,
        testBirthDate,
        testParent1.id,
        testParent2.id
      );
    } catch(err) {
      expect(err).toHaveProperty('message', 'Missing or invalid first name');

      await User.remove(testParent1.id);
      await User.remove(testParent2.id);
    }
  });

  test('It should throw last name related error', async () => {

    const testFirstName = 'Antonio';
    const testLastName = '4324fkjasdklf';
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


    try {
      const result = await Student.insertStudent(
        testFirstName,
        testLastName,
        testSSN,
        testGender,
        testBirthDate,
        testParent1.id,
        testParent2.id
      );
    } catch(err) {
      expect(err).toHaveProperty('message', 'Missing or invalid last name');

      await User.remove(testParent1.id);
      await User.remove(testParent2.id);
    }
  });

  test('It should throw ssn related error', async () => {

    const testFirstName = 'Antonio';
    const testLastName = 'De Giovanni';
    const testSSN = '5345342jkljfaskjsd';
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


    try {
      const result = await Student.insertStudent(
        testFirstName,
        testLastName,
        testSSN,
        testGender,
        testBirthDate,
        testParent1.id,
        testParent2.id
      );
    } catch(err) {
      expect(err).toHaveProperty('message', 'Missing or invalid SSN');

      await User.remove(testParent1.id);
      await User.remove(testParent2.id);
    }
  });

  test('It should throw gender related error', async () => {

    const testFirstName = 'Antonio';
    const testLastName = 'De Giovanni';
    const testSSN = 'TBKHSA93A02F494U';
    const testBirthDate = moment().utc().subtract(13, 'years');
    const testGender = '7';

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


    try {
      const result = await Student.insertStudent(
        testFirstName,
        testLastName,
        testSSN,
        testGender,
        testBirthDate,
        testParent1.id,
        testParent2.id
      );
    } catch(err) {
      expect(err).toHaveProperty('message', 'Missing or invalid gender');

      await User.remove(testParent1.id);
      await User.remove(testParent2.id);
    }
  });

  test('It should throw date related error', async () => {

    const testFirstName = 'Antonio';
    const testLastName = 'De Giovanni';
    const testSSN = 'TBKHSA93A02F494U';
    const testBirthDate = 'slijfda'
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


    try {
      const result = await Student.insertStudent(
        testFirstName,
        testLastName,
        testSSN,
        testGender,
        testBirthDate,
        testParent1.id,
        testParent2.id
      );
    } catch(err) {
      expect(err).toHaveProperty('message', 'Invalid birth date');

      await User.remove(testParent1.id);
      await User.remove(testParent2.id);
    }
  });

  test('It should throw parent1 related error', async () => {

    const testFirstName = 'Antonio';
    const testLastName = 'De Giovanni';
    const testSSN = 'TBKHSA93A02F494U';
    const testBirthDate = moment().utc().subtract(13, 'years');
    const testGender = 'M';

    //parent1
    const testParent1ID = 'iìadsaf34'

    //parent2
    const testParent2 = await User.insertParentData(
      'NameTwo',
      'LastnameTwo',
      'parent2@parents.com',
      'ZGIJMW64B22B275T',
      'Password2'
    );
    expect(testParent2).toMatchObject({id: expect.anything()});


    try {
      const result = await Student.insertStudent(
        testFirstName,
        testLastName,
        testSSN,
        testGender,
        testBirthDate,
        testParent1ID,
        testParent2.id
      );
    } catch(err) {
      expect(err).toHaveProperty('message', 'Invalid parent1 id');

      await User.remove(testParent2.id);
    }
  });

  test('It should throw parent2 related error', async () => {

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

    const testParent2ID = 'fsakdjflka4234';


    try {
      const result = await Student.insertStudent(
        testFirstName,
        testLastName,
        testSSN,
        testGender,
        testBirthDate,
        testParent1.id,
        testParent2ID
      );
    } catch(err) {
      expect(err).toHaveProperty('message', 'Invalid parent2 id');

      await User.remove(testParent1.id);
    }
  });

  test('It should throw equal parents related error', async () => {

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

    
    try {
      const result = await Student.insertStudent(
        testFirstName,
        testLastName,
        testSSN,
        testGender,
        testBirthDate,
        testParent1.id,
        testParent1.id
      );
    } catch(err) {
      expect(err).toHaveProperty('message', 'Parents id must be different');

      await User.remove(testParent1.id);
    }
  });
});

describe('Tests about visualization of students data', () => {
  
  test('It should visualize the data of a student who is not assigned to a parent', async () => {
    const testFirstName = 'TestFirstName';
    const testLastName = 'TestLastName';
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

    const students = await Student.getStudentsData(0);
    
    expect(students).not.toBeNull();
    expect(students.length).toBeGreaterThan(0);
    expect(students).toEqual(
            expect.arrayContaining(
                [
                  expect.objectContaining(
                    {
                        "ID" : result.id,
                        "FirstName": testFirstName,
                        "LastName": testLastName,
                        "Gender" : testGender      
            }
       )]));

    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);

  });

  test('It should visualize the data of a student who is assigned to a parent', async () => {
    const testFirstName = 'TestFirstName';
    const testLastName = 'TestLastName';
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

    const assignment = await ClassModel.assignStudentsToClass(1, [result.id]);

    const students = await Student.getStudentsData(1);
    
    expect(students).not.toBeNull();
    expect(students.length).toBeGreaterThan(0);
    expect(students).toEqual(
            expect.arrayContaining(
                [
                  expect.objectContaining(
                    {
                        "ID" : result.id,
                        "FirstName": testFirstName,
                        "LastName": testLastName,
                        "Gender" : testGender
                        
                }
       )]));

    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);

  });

  
  test('It should visualize the data of a student who is not assegned to a parent', async () => {
    try {
      const result = await Student.getStudentsData();
      
    } catch(err) {
      expect(err).toHaveProperty('message', 'Invalid parameter isAssigned!');
    } 
  });
});

describe('Tests about the edition of a student', () =>{

  
  test('It should do the edition of a student correctly', async () => {

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

    const editionResult = await Student.updateStudentData(
      result.id,
      'Mario',
      'Rossi',
      testSSN,
      testGender,
      testBirthDate,
      testParent1.id,
      testParent2.id
    );

    expect(editionResult).not.toBeNull();
    expect(editionResult).toEqual(
                  expect.objectContaining(
                    {
                        success:true,
                    }
       ));

    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  });

  test('It should throw Error with message \'Missing or invalid first name\'', async () => {

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

    try{
    const editionResult = await Student.updateStudentData(
      result.id,
      'Mario 1',
      'Rossi',
      testSSN,
      testGender,
      testBirthDate,
      testParent1.id,
      testParent2.id
    );

}catch(err){

    expect(err).toHaveProperty('message', 'Missing or invalid first name');
    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  }
  });

  test('It should throw Error with message \'Missing or invalid last name\'', async () => {

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

    try{
    const editionResult = await Student.updateStudentData(
      result.id,
      'Mario',
      'Rossi 2',
      testSSN,
      testGender,
      testBirthDate,
      testParent1.id,
      testParent2.id
    );

}catch(err){

    expect(err).toHaveProperty('message', 'Missing or invalid last name');
    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  }
  });
  
  test('It should throw Error with message \'Missing or invalid SSN\'', async () => {

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

    try{
    const editionResult = await Student.updateStudentData(
      result.id,
      'Mario',
      'Rossi',
      'notSSN',
      testGender,
      testBirthDate,
      testParent1.id,
      testParent2.id
    );

}catch(err){

    expect(err).toHaveProperty('message', 'Missing or invalid SSN');
    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  }
  });

  test('It should throw Error with message \'Missing or invalid gender\'', async () => {

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

    try{
    const editionResult = await Student.updateStudentData(
      result.id,
      'Mario',
      'Rossi',
      testSSN,
      'not specified',
      testBirthDate,
      testParent1.id,
      testParent2.id
    );

}catch(err){

    expect(err).toHaveProperty('message', 'Missing or invalid gender');
    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  }
  });


  test('It should throw Error with message \'Invalid birth date\'', async () => {

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

    try{
    const editionResult = await Student.updateStudentData(
      result.id,
      'Mario',
      'Rossi',
      testSSN,
      testGender,
      '20/11/2005',
      testParent1.id,
      testParent2.id
    );

}catch(err){

    expect(err).toHaveProperty('message', 'Invalid birth date');
    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  }
  });

  test('It should throw Error with message \'Future birth date\'', async () => {

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

    const birthDate = moment().utc().add(13, 'years'); 
    try{
    const editionResult = await Student.updateStudentData(
      result.id,
      'Mario',
      'Rossi',
      testSSN,
      testGender,
      birthDate,
      testParent1.id,
      testParent2.id
    );

}catch(err){

    expect(err).toHaveProperty('message', 'Future birth date');
    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  }
  });

  test('It should throw Error with message \'Missing or invalid parent1 id\'', async () => {

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

    try{
    const editionResult = await Student.updateStudentData(
      result.id,
      'Mario',
      'Rossi',
      testSSN,
      testGender,
      testBirthDate,
      undefined,
      testParent2.id
    );

}catch(err){

    expect(err).toHaveProperty('message', 'Missing or invalid parent1 id');
    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  }
  });


  test('It should throw Error with message \'Invalid parent1 id\'', async () => {

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

    try{
    const editionResult = await Student.updateStudentData(
      result.id,
      'Mario',
      'Rossi',
      testSSN,
      testGender,
      testBirthDate,
      'notExistingSSN',
      testParent2.id
    );

}catch(err){

    expect(err).toHaveProperty('message', 'Invalid parent1 id');
    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  }
  });

  test('It should throw Error with message \'Parents id must be different\'', async () => {

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

    try{
    const editionResult = await Student.updateStudentData(
      result.id,
      'Mario',
      'Rossi',
      testSSN,
      testGender,
      testBirthDate,
      testParent1.id,
      testParent1.id
    );

}catch(err){

    expect(err).toHaveProperty('message', 'Parents id must be different');
    await Student.remove(result.id);
    await User.remove(testParent1.id);
    await User.remove(testParent2.id);
  }
  });

});

describe('Tests about the visualisation of internal accounts by SysAdmin', () =>{
  test('It should receive only internal accounts', async () => {

    const result = await User.findInternalAccounts();
    expect(result.length).toBeGreaterThanOrEqual(1);
    result.forEach(element => {
      expect(element.IsTeacher || element.IsAdminOfficer || element.IsPrincipal).toBe(1);
    });
  });  
});
