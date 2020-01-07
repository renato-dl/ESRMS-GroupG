import User from '../src/database/models/user';
import Student from '../src/database/models/student';
import teacherClassSubject from '../src/database/models/teacherClassSubject';
import Class from '../src/database/models/class';
import Subject from '../src/database/models/subject';
import db from '../src/database';
import moment from 'moment';
import ClassModel from '../src/database/models/class';


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

  test('It should throw an error when isAssigned parameter is invalid', async () => {
    try {
      const result = await Student.getStudentsData();
      
    } catch(err) {
      expect(err).toHaveProperty('message', 'No students found!');
    } 
  });

  test('It should visualize the data of a student who is assigned to a parent by classId', async () => {
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

    const students = await Student.getStudentsDataByClassId(1);
    
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

  test('It should throw an error when class Id is invalid', async () => {
    try {
      const result = await Student.getStudentsDataByClassId();
      
    } catch(err) {
      expect(err).toHaveProperty('message', 'Invalid class id parameters!');
    } 
  });

  test('It should throw an error when no students are found for that class', async () => {
    try {
      const result = await Student.getStudentsDataByClassId(1000);
      
    } catch(err) {
      expect(err).toHaveProperty('message', 'No students found!');
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

describe('Tests about retreiving student data', () => {

  test('It should retrive the student of a given parent', async () => {
      const students = await Student.findByParentId("9d64fa59c91d9109b11cd9e05162c675");
      expect(students).not.toBeNull();
      expect(students).toHaveLength(1);
      const date = new Date('2005-05-19T00:00:00.000Z');
      expect(students).toEqual(
          expect.arrayContaining(
              [
                  expect.objectContaining(
                  {
                      "ID": "266667153e975bbf735b89d4b03d9f93",
                      "FirstName": "Sara",
                      "LastName": "Lorenzini",
                      "SSN": "LRNSRA05E59L219Q",
                      "BirthDate": date
                  }
     )]));
  });

  test('It should retrive the students of a given parent', async () => {
      const students = await Student.findByParentId("32d905eaa2770b66baf20282dff09191");
      expect(students).not.toBeNull();
      expect(students).toHaveLength(2);

      const date = new Date('2005-06-01T00:00:00.000Z');
      expect(students).toEqual(
          expect.arrayContaining(
              [
                  expect.objectContaining(
                      {
                          "ID": "7460aba98f7291ee69fcfdd17274c3a1",
                          "FirstName": "Martina",
                          "LastName": "Menzi",
                          "Gender": "F",
                          "SSN": "MNZMTN05H41L219C",
                          "BirthDate": date
                      },
                      

     ),
                  expect.objectContaining(
                      {
                          "ID": "868d6ec1dfc8467f6d260c48b5620543",
                          "FirstName": "Gianluca",
                          "LastName": "Menzi",
                          "Gender": "M",
                          "SSN": "MNZGLC05H01L219X",
                          "BirthDate": date
                      }
                  )
  ]));
  });

  test('should throw Error with message \'Entity not found\' when the passed Id does not exist', async () => {
      try{
          const students = await Student.findByParentId("32e905eaa2770b66baf20282dff09191");
      }
      catch(error){
          expect(error).toBeInstanceOf(Error);
          expect(error).toHaveProperty('message', 'Entity not found');
      }
  });

});

describe("Tests about getting the students based on subject and class", () => {

  test('It should return an empty list of students when teacher passes a subject that he/she doesnt teach', async () => {

      //first insert a new teacher
      const insertTeacher = await User.insertInternalAccountData( 
        'Joe', 
        'Kernel', 
        'joekernel@gmail.com', 
        'LRNMRC79A02L219A', 
        'EasYPass1',
        true,
        false,
        false
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

      const students = await Student.getStudentsDataByClassIdAndSubjectId(
        insertTeacher.id, 
        createClass.id,
        subjectId
      );

      expect(students).not.toBeNull();
      expect(students).toHaveLength(0);

      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
      await Subject.remove(subjectId);

  });

  test('It should return the list of students for the subject that the teacher teaches in a class', async () => {
       //first insert a new teacher
       const insertTeacher = await User.insertInternalAccountData( 
        'Joe', 
        'Kernel', 
        'joekernel@gmail.com', 
        'LRNMRC79A02L219A', 
        'EasYPass1',
        true,
        false,
        false
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

      const students = await Student.getStudentsDataByClassIdAndSubjectId(
        insertTeacher.id,
        createClass.id,
        subjectId
      );

      expect(students).not.toBeNull();
      expect(students).toEqual(
          expect.arrayContaining([
              expect.objectContaining(
                  {
                      "ID": insertStudent.id,
                      "FirstName": "Antonio",
                      "LastName": "De Giovanni",
                      "Gender": "M"
                  }
              )
          ])
      );

      await Student.remove(insertStudent.id);
      await User.remove(insertParent.id);
      await teacherClassSubject.remove(insertRelation);
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
      await Subject.remove(subjectId);
  });

  test('It should throw an error teacherId is invalid', async () => {
   
    //first insert a new teacher
    const insertTeacher = await User.insertInternalAccountData( 
        'Joe', 
        'Kernel', 
        'joekernel@gmail.com', 
        'LRNMRC79A02L219A', 
        'EasYPass1',
        true,
        false,
        false
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
      await Student.getStudentsDataByClassIdAndSubjectId(null, createClass.id, subjectId);
    }catch(error){
      expect(error).toHaveProperty("message", "Invalid parameters!");
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
      await Subject.remove(subjectId);
    }
  });

  test('It should throw an error classId is invalid', async () => {
   
    //first insert a new teacher
    const insertTeacher = await User.insertInternalAccountData( 
        'Joe', 
        'Kernel', 
        'joekernel@gmail.com', 
        'LRNMRC79A02L219A', 
        'EasYPass1',
        true,
        false,
        false
    );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    //create a new subject
    const subjectId = await Subject.create({
      Name: "Test Subject"
    });

    try{
      await Student.getStudentsDataByClassIdAndSubjectId(insertTeacher.id, null, subjectId);
    }catch(error){
      expect(error).toHaveProperty("message", "Invalid parameters!");
      await User.remove(insertTeacher.id);
      await Subject.remove(subjectId);
    }
  });

  test('It should throw an error subjectId is invalid', async () => {
   
    //first insert a new teacher
    const insertTeacher = await User.insertInternalAccountData( 
        'Joe', 
        'Kernel', 
        'joekernel@gmail.com', 
        'LRNMRC79A02L219A', 
        'EasYPass1',
        true,
        false,
        false
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
      await Student.getStudentsDataByClassIdAndSubjectId(insertTeacher.id, createClass.id, null);
    }catch(error){
      expect(error).toHaveProperty("message", "Invalid parameters!");
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
    }
  });


});

describe("Tests on getStudentsDataByClassId", () => {

  test('It should return the list of students of that class', async () => {

      //first insert a new teacher
      const insertTeacher = await User.insertInternalAccountData( 
        'Joe', 
        'Kernel', 
        'joekernel@gmail.com', 
        'LRNMRC79A02L219A', 
        'EasYPass1',
        true,
        false,
        false
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

      const students = await Student.getStudentsDataByClassId(
        createClass.id
      );

      expect(students).not.toBeNull();
      expect(students).toEqual(
          expect.arrayContaining([
              expect.objectContaining(
                  {
                      "ID": insertStudent.id,
                      "FirstName": "Antonio",
                      "LastName": "De Giovanni",
                      "Gender": "M"
                  }
              )
          ])
      );
      await Student.remove(insertStudent.id);
      await User.remove(insertParent.id);
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
  });

  test('It should throw an error classId is invalid', async () => {
    try{
      await Student.getStudentsDataByClassId(undefined);
    }catch(error){
      expect(error).toHaveProperty("message", "Invalid class id parameters!");
    }
  });

});

describe("Tests on findBySSN", () => {

  test('It should return the student data with that SSN', async () => {

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

      const student = await Student.findBySSN("TBKHSA93A02F494U");
      expect(student).not.toBeNull();

      expect(student).not.toBeNull();
        expect(student).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        "ID": insertStudent.id,
                        "FirstName": "Antonio",
                        "LastName": "De Giovanni",
                        "Gender": "M"
                    }
                )
            ])
    );
      await Student.remove(insertStudent.id);
      await User.remove(insertParent.id);
  });

  test('It should throw an error when SSN is invalid', async () => {
    try{
      await Student.findBySSN(undefined);
    }catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid SSN");
    }
  });

});



