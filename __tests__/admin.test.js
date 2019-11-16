import Admin from '../src/database/models/admin';
import crypto from 'crypto';
import db from '../src/database';

describe('Tests about the insertion of parent data by admin', () => {

    /*
    * 1. Ok
    * 2. missing or invalid firstName
    * 3. missing or invalid lastName
    * 4. missing or invalid eMail
    * 5. missing or invalid SSN
    * 6. missing or invalid password
    * 7. Unauthorized adminId 
    */

  test('It should perform the insertion', async () => {

    const testAdminId = '205db8275d3c06e6ce3fe7a47b30e0fe';
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';

    const result = await Admin.insertParentData(
        testAdminId,  
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword
    );

    const hashEmail = crypto.createHash('sha256').update(testEmail).digest('hex');

    expect(result).toEqual({id: hashEmail});

    //delete result for future tests
    const connection = await db.getConnection();
    const deleteResultFromParent = await connection.query(
        `DELETE
        FROM Parents
        WHERE ID = ?`,
        [hashEmail]
      );

    const deleteResultFromUsers = await connection.query(
      `DELETE
      FROM Users
      WHERE ID = ?`,
      [hashEmail]
    );
   
    expect(deleteResultFromParent.affectedRows).toBe(1);
    expect(deleteResultFromUsers.affectedRows).toBe(1);

    connection.release();
  }); 
  

  test('It should throw Error with message \'Missing or invalid first name\'', async () => {

    const testAdminId = '205db8275d3c06e6ce3fe7a47b30e0fe';
    const testFirstName = 'Joe2';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';

    try{
    const result = await Admin.insertParentData(
        testAdminId,  
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

    const testAdminId = '205db8275d3c06e6ce3fe7a47b30e0fe';
    const testFirstName = 'Joe';
    const testLastName = 'Kernel2';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';

    try{
    const result = await Admin.insertParentData(
        testAdminId,  
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

    const testAdminId = '205db8275d3c06e6ce3fe7a47b30e0fe';
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernelgmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';

    try{
    const result = await Admin.insertParentData(
        testAdminId,  
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

    const testAdminId = '205db8275d3c06e6ce3fe7a47b30e0fe';
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L2191';
    const testPassword = 'EasYPass1';

    try{
    const result = await Admin.insertParentData(
        testAdminId,  
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

  test('It should throw Error with message \'Missing or invalid password\'', async () => {

    const testAdminId = '205db8275d3c06e6ce3fe7a47b30e0fe';
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'easyPass';

    try{
    const result = await Admin.insertParentData(
        testAdminId,  
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword
    );
    }catch(error){
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Missing or invalid password');
    }
  });

  test('It should throw Error with message \'Unauthorized\'', async () => {

    const testAdminId = '225db8275d3c06e6ce3fe7a47b30e0fe';
    const testFirstName = 'Joe';
    const testLastName = 'Kernel';
    const testEmail = 'joekernel@gmail.com';
    const testSSN = 'LRNMRC79A02L219A';
    const testPassword = 'EasYPass1';

    try{
    const result = await Admin.insertParentData(
        testAdminId,  
        testFirstName, 
        testLastName, 
        testEmail, 
        testSSN, 
        testPassword
    );
    }catch(error){
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Unauthorized');
    }
  });
});