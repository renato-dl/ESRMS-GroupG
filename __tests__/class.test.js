import Class from '../src/database/models/class';
import moment from 'moment';
import User from '../src/database/models/user';
import Student from '../src/database/models/student';

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



