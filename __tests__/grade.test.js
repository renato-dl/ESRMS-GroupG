import moment from 'moment';
import Grade from '../src/database/models/grade';
import db from '../src/database';
import Student from '../src/database/models/student';

describe('Grades tests related to parent', () => {

  test('It should retrive the grades of a given student', async () => {
      const testStudent = '266667153e975bbf735b89d4b03d9f93';
      const testParent = '9d64fa59c91d9109b11cd9e05162c675';
      const related = await Student.checkIfRelated(testStudent, testParent);
      expect(related).toBe(true);
        
      const grades = await Grade.findByStudentId(testStudent); 
      expect(grades).not.toBeNull();
      expect(grades).toHaveLength(2);

      const gradeDate1 = new Date('2019-11-03T00:00:00.000Z');
      const gradeDate2 = new Date('2019-10-29T00:00:00.000Z');

      expect(grades).toEqual(
          expect.arrayContaining(
              [
                  expect.objectContaining(
                      {
                          "Name": "Mathematics",
                          "Grade": 8.5,
                          "GradeDate": gradeDate1,
                          "Type" : "Written"
                      },
                      {
                          "Name": "English",
                          "Grade": 6.75,
                          "GradeDate": gradeDate2,
                          "Type" : "Oral"
                      }
     )]));
  });

  test('should throw Error with message \'Entity not found\' when the passed parent Id does not exist', async () => {
      try{
          const grades = await Grade.findByStudentId("9e64fa59c91d9109b11cd9e05162c675", "266667153e975bbf735b89d4b03d9f93"); 
      }
      catch(error){
          expect(error).toBeInstanceOf(Error);
          expect(error).toHaveProperty('message', 'Entity not found');
      }
  });


  test('should throw Error with message \'Entity not found\' when the passed student Id does not exist', async () => {
      try{
          const grades = await Grade.findByStudentId("9d64fa59c91d9109b11cd9e05162c675", "267667153e975bbf735b89d4b03d9f93"); 
      }
      catch(error){
          expect(error).toBeInstanceOf(Error);
          expect(error).toHaveProperty('message', 'Entity not found');
      }
  });

  test('should throw Error with message \'Entity not found\' when missmatching between parent and student', async () => {
      try{
          const grades = await Grade.findByStudentId("32d905eaa2770b66baf20282dff09191", "266667153e975bbf735b89d4b03d9f93"); 
      }
      catch(error){
          expect(error).toBeInstanceOf(Error);
          expect(error).toHaveProperty('message', 'Entity not found');
      }
  });
});

describe('Tests about insertion of a grade by teacher', () => {

  test("It should add correctly a grade for a student", async() =>{
    const subjectId = "1";
    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const grade = "6.0";
    const type = "Oral";
    const date = moment.utc();

    try {
      const result = await Grade.addGrade(
        subjectId,
        studentId,
        grade,
        date.format(),
        type
      );

      expect(result.id).not.toBeNaN();

      const connection = await db.getConnection();
      const testResult = await connection.query(
        `SELECT COUNT(*) AS count
        FROM Grades
        WHERE ID = ?`,
        [result.id]
      );

      connection.release();
      expect(testResult[0].count).toBe(1);

      await Grade.remove(result.id);

    } catch(error) {
      expect(error).toHaveProperty('message', 'Invalid grade date')
    }


  });
  
  test("it should throw Error with message \'Missing or invalid subjectId' when the subjectId is not passed", async() =>{

    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const grade = "6.0";
    const type = "Oral";
    const date = moment.utc();
    
    try{
      const result = await Grade.addGrade(
        undefined,
        studentId,
        grade,
        date.format(),
        type
    );

  }catch(error){
    expect(error).toBeInstanceOf(Error);
    expect(error).toHaveProperty('message', 'Missing or invalid subject id');
  }
  
  });

  test("it should throw Error with message \'Missing or invalid studentId' when the studentId is not passed", async() =>{
    const subjectId = "1";
    const grade = "6.0";
    const type = "Oral";
    const date = moment.utc();
    
    try{
      const result = await Grade.addGrade(
        subjectId,
        undefined,
        grade,
        date.format(),
        type
    );

  }catch(error){
    expect(error).toBeInstanceOf(Error);
    expect(error).toHaveProperty('message', 'Missing or invalid student id');
  }

  });

  test("it should throw Error with message \'Missing or invalid grade' when the grade is not passed", async() =>{
    const subjectId = "1";
    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const type = "Oral";
    const date = moment.utc();
    
    try{
      const result = await Grade.addGrade(
        subjectId,
        studentId,
        undefined,
        date.format(),
        type
    );

    }catch(error){
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Missing or invalid grade');
    }
  });


  test("it should throw Error with message \'Missing or invalid grade date' when the grade is not passed", async() =>{
    const subjectId = "1";
    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const grade = "6.0"
    const type = "Oral";

    try{
      const result = await Grade.addGrade(
        subjectId,
        studentId,
        grade,
        undefined,
        type
    );

    }catch(error){
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Missing or invalid grade date');
    }
  });


  test("it should throw Error with message \'Invalid grade' when the grade is not valid", async() =>{
    const subjectId = "1";
    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const grade = 6.35;
    const type = "Oral";
    const date = moment.utc();
    
    try{
      const result = await Grade.addGrade(
        subjectId,
        studentId,
        grade,
        date.format,
        type
    );

    }catch(error){
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Invalid grade');
    }
  });

  test("it should throw Error with message \'Missing or invalid type' when the type is not passed", async() =>{
    const subjectId = "1";
    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const grade = "6.0";
    const date = moment.utc();
    
    try{
      const result = await Grade.addGrade(
        subjectId,
        studentId,
        grade,
        date.format,
        undefined
    );

    }catch(error){
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Missing or invalid type');
    }

  });

});

describe('Teacher tests about visualization of grades', () => {

  test('It should retrieve the grades of all the students in a given class for a given subject', async () => {
    const grades = await Grade.findByClassAndSubject(1,1);
    expect(grades).not.toBeNull();
    expect(grades.length).toBeGreaterThanOrEqual(3);

    const date1 = new Date('2019-11-03T00:00:00.000Z');
    const date2 = new Date('2019-11-03T00:00:00.000Z');
    const date3 = new Date('2019-11-03T00:00:00.000Z');

    expect(grades).toEqual(
      expect.arrayContaining(
        [
          {
            ID: expect.anything(),
            FirstName: "Gianluca",
            LastName: "Menzi",
            Grade: 9,
            GradeDate: date1,
            Type: "Written",
            StudentId: "868d6ec1dfc8467f6d260c48b5620543"
          },
          {
            ID: expect.anything(),        
            FirstName: "Martina",
            LastName: "Menzi",
            Grade: 7,
            GradeDate: date2,
            Type: "Oral",
            StudentId: "7460aba98f7291ee69fcfdd17274c3a1"
          },
          {
            ID: expect.anything(),          
            FirstName: "Sara",
            LastName: "Lorenzini",
            Grade: 8.5,
            GradeDate: date3,
            Type: "Written",
            StudentId: "266667153e975bbf735b89d4b03d9f93"
          }
        ]
      )
    );
  });

  test('It should throw a missing or invalid class id error', async () => {
    try {
      await Grade.findByClassAndSubject(null,8);
    } catch(error) {
      expect(error).toHaveProperty('message', 'Missing or invalid class id');
    }
  });

  test('It should throw a missing or invalid subject id error', async () => {
    try {
      await Grade.findByClassAndSubject(5,null);
    } catch(error) {
      expect(error).toHaveProperty('message', 'Missing or invalid subject id');
    }
  });

  
});

describe('Test wether a theacher is authorized to access a given grade', () => {

  test('It should return true', async () => {
    const auth = await Grade.checkIfGradeIsFromTeacher(1, '6e5c9976f5813e59816b40a814e29899');
    expect(auth).toBe(true);
  });

  test('It throw an error about invalid teacher id', async () => {
    try {
      await Grade.checkIfGradeIsFromTeacher(1, null);
    } catch(error) {
      expect(error).toHaveProperty('message', 'Missing or invalid teacher id');
    }
  });

  test('It throw an error about invalid teacher id', async () => {
    try {
      await Grade.checkIfGradeIsFromTeacher(undefined, '6e5c9976f5813e59816b40a814e29899');
    } catch(error) {
      expect(error).toHaveProperty('message', 'Missing or invalid grade id');
    }
  });

  test('It should return false', async () => {
    const auth = await Grade.checkIfGradeIsFromTeacher(7, '6e5c9976f5813e59816b40a814e29899');
    expect(auth).toBe(false);
  });

});

describe("Tests about updating grades", () => {

  test('Teacher should be able to updated grade successfully', async () => {
    const subjectId = 1;
    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const grade = "6.0";
    const type = "Oral";
    const date = moment.utc().weekday() == 0 ? moment.utc().subtract(1, 'days') : moment.utc();

    const result = await Grade.addGrade(
      subjectId,
      studentId,
      grade,
      date.format(),
      type
    );

    expect(result.id).not.toBeNaN();
    
    const gradeID = result.id;
    const updateResult = await Grade.updateGrade(gradeID, 7, 'Written');
    expect(updateResult).toBeTruthy();

    const connection = await db.getConnection();
    const testResult = await connection.query(
      `SELECT COUNT(*) AS count
      FROM Grades
      WHERE ID = ?`,
      [result.id]
    );

    connection.release();
    expect(testResult[0].count).toBe(1);
    await Grade.remove(result.id);
  });


  test('It should throw an error when grade id is missing or invalid', async () => {
    const subjectId = 1;
    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const grade = "6.0";
    const type = "Oral";
    const date = moment.utc().weekday() == 0 ? moment.utc().subtract(1, 'days') : moment.utc();

    const result = await Grade.addGrade(
      subjectId,
      studentId,
      grade,
      date.format(),
      type
    );

    expect(result.id).not.toBeNaN();
    
    
    try{
      const updateResult = await Grade.updateGrade(undefined, 7.0, 'Written');   
    }
    catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid grade id");
      await Grade.remove(result.id);
    }
  });



  test('It should throw an error when grade is missing or invalid', async () => {
    const subjectId = 1;
    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const grade = "6.0";
    const type = "Oral";
    const date = moment.utc().weekday() == 0 ? moment.utc().subtract(1, 'days') : moment.utc();

    const result = await Grade.addGrade(
      subjectId,
      studentId,
      grade,
      date.format(),
      type
    );

    expect(result.id).not.toBeNaN();
    
    const gradeID = result.id;
      try{
        const updateResult = await Grade.updateGrade(gradeID, undefined, 'Written');   
      }
      catch(error){
        expect(error).toHaveProperty("message", "Missing or invalid grade");
        await Grade.remove(result.id);
      }
  });

  

  test('It should throw an error when grade is not valid', async () => {
    const subjectId = 1;
    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const grade = "6.0";
    const type = "Oral";
    const date = moment.utc().weekday() == 0 ? moment.utc().subtract(1, 'days') : moment.utc();

    const result = await Grade.addGrade(
      subjectId,
      studentId,
      grade,
      date.format(),
      type
    );

    expect(result.id).not.toBeNaN();
    
    const gradeID = result.id;
      try{
        const updateResult = await Grade.updateGrade(gradeID, 6.47, 'Written');   
      }
      catch(error){
        expect(error).toHaveProperty("message", "Invalid grade");
        await Grade.remove(result.id);
      }
  });

  test('It should throw an error when type is missing or invalid', async () => {
    const subjectId = 1;
    const studentId = "868d6ec1dfc8467f6d260c48b5620543"
    const grade = "6.0";
    const type = "Oral";
    const date = moment.utc().weekday() == 0 ? moment.utc().subtract(1, 'days') : moment.utc();

    const result = await Grade.addGrade(
      subjectId,
      studentId,
      grade,
      date.format(),
      type
    );

    expect(result.id).not.toBeNaN();
    
    const gradeID = result.id;
      try{
        const updateResult = await Grade.updateGrade(gradeID, 6.0, undefined);   
      }
      catch(error){
        expect(error).toHaveProperty("message", "Missing or invalid type");
        await Grade.remove(result.id);
      }
  });


});