import TCSR from '../src/database/models/teacherClassSubject'
import Class from '../src/database/models/class'
import User from '../src/database/models/user'
import db from '../src/database';

describe('Tests about relation between teacher and class', () =>{
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

    //assign that teacher to a class
    const connection = await db.getConnection();

    const assignTeacherToClass = await connection.query(
      `INSERT INTO TeacherSubjectClassRelation (SubjectId, ClassId, TeacherId)
      VALUES (1, ?, ?)`,
      [createClass.id, insertTeacher.id]

    );
    connection.release();

    const getTeachingClasses = await TCSR.getTeachingClasses(insertTeacher.id);

    expect(getTeachingClasses).not.toBeNull();
    expect(getTeachingClasses).toHaveLength(1);
    

    //clean db for future tests
    const connection2 = await db.getConnection();
    await connection2.query(
      `DELETE FROM TeacherSubjectClassRelation
      WHERE TeacherId = ?`,
      [insertTeacher.id]
    );
    connection2.release();

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