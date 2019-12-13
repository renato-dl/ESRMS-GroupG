
import StudentAttendance from '../src/database/models/studentAttendance';
import User from '../src/database/models/user';
import Student from '../src/database/models/student';
import moment from 'moment';
import Class from '../src/database/models/class';
import uuid from 'uuid';
import db from '../src/database'
import {config} from '../src/config';

describe("Tests about the visualization of parent's child attendance ", () => {

    test("It should show the parent's child attendance correctly", async () => {
        
        //first insert student with parent data
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';
    
        //parent data
        const testParent = await User.insertParentData(
          'Name',
          'Lastname',
          'parent1@parents.com',
          'FFLPSL33H68A698Z',
          'Password1'
        );
        expect(testParent).toMatchObject({id: expect.anything()});
    
        const insertStudent = await Student.insertStudent(
          testFirstName,
          testLastName,
          testSSN,
          testGender,
          testBirthDate,
          testParent.id,
          null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});

        //insert entry teacher
        const insertEntryTeacher = await User.insertInternalAccountData( 
            'Joe', 
            'Kernel', 
            'joekernel@gmail.com', 
            'LRNMRC79A02L219A', 
            'EasYPass1',
            true,
            false,
            false
        );

        expect(insertEntryTeacher).toEqual({
        id: expect.anything()
        });

         //insert entry teacher
         const insertExitTeacher = await User.insertInternalAccountData( 
            'Teacher', 
            'teacher', 
            'joekernel2@gmail.com', 
            'LRNMRC79A02L219E', 
            'EasYPass1',
            true,
            false,
            false
        );

        expect(insertExitTeacher).toEqual({
        id: expect.anything()
        });

        //insert attendance record
        const date = new Date('2019-11-03T00:00:00.000Z');
        const time = "10:00:00";
        
        const insertAttendance = await StudentAttendance.create({
            "StudentId" : insertStudent.id,
            "Date" : date,
            "LateEntry" : "1h",
            "EntryTeacherId" : insertEntryTeacher.id,
            "EarlyExit" : time,
            "ExitTeacherId" : insertExitTeacher.id
        }
       );

       const checkChildAttendance = await StudentAttendance.findByStudentId(insertStudent.id, {});
       expect(checkChildAttendance).not.toBeNull();
       expect(checkChildAttendance).toHaveLength(1);
       expect(checkChildAttendance).toEqual(
        expect.arrayContaining(
            [
                expect.objectContaining(
                    {
                        "ID": expect.anything(),
                        "Date": date,
                        "LateEntry": "1h",
                        "EntryTeacherId": insertEntryTeacher.id,
                        "EarlyExit": time,
                        "ExitTeacherId": insertExitTeacher.id,
                        "EntryTeacherName": "Joe Kernel",
                        "ExitTeacherName": "Teacher teacher"
                    }
   )]));
        //clean db for future tests
       await StudentAttendance.remove(insertAttendance);
       await User.remove(insertEntryTeacher.id);
       await User.remove(insertExitTeacher.id);
       await Student.remove(insertStudent.id);
       await User.remove(testParent.id);
        
    });

    test("It should show the parent's child attendance correctly within the specified range", async () => {
        
        //first insert student with parent data
        const testFirstName = 'Antonio';
        const testLastName = 'De Giovanni';
        const testSSN = 'TBKHSA93A02F494U';
        const testBirthDate = moment().utc().subtract(13, 'years');
        const testGender = 'M';
    
        //parent data
        const testParent = await User.insertParentData(
          'Name',
          'Lastname',
          'parent1@parents.com',
          'FFLPSL33H68A698Z',
          'Password1'
        );
        expect(testParent).toMatchObject({id: expect.anything()});
    
        const insertStudent = await Student.insertStudent(
          testFirstName,
          testLastName,
          testSSN,
          testGender,
          testBirthDate,
          testParent.id,
          null
        );
        expect(insertStudent).toMatchObject({id: expect.anything()});

        //insert entry teacher
        const insertEntryTeacher = await User.insertInternalAccountData( 
            'Joe', 
            'Kernel', 
            'joekernel@gmail.com', 
            'LRNMRC79A02L219A', 
            'EasYPass1',
            true,
            false,
            false
        );

        expect(insertEntryTeacher).toEqual({
        id: expect.anything()
        });

         //insert entry teacher
         const insertExitTeacher = await User.insertInternalAccountData( 
            'Teacher', 
            'teacher', 
            'joekernel2@gmail.com', 
            'LRNMRC79A02L219E', 
            'EasYPass1',
            true,
            false,
            false
        );

        expect(insertExitTeacher).toEqual({
        id: expect.anything()
        });

        //insert attendance record
        const date1 = new Date('2019-11-03T00:00:00.000Z');
        const date2 = new Date('2019-11-04T00:00:00.000Z');
        const time1 = "10:00:00";
        const time2 = "11:30:00";
        
        const insertAttendance1 = await StudentAttendance.create({
            "StudentId" : insertStudent.id,
            "Date" : date1,
            "LateEntry" : "1h",
            "EntryTeacherId" : insertEntryTeacher.id,
            "EarlyExit" : time1,
            "ExitTeacherId" : insertExitTeacher.id
        }
       );


       const insertAttendance2 = await StudentAttendance.create({
        "StudentId" : insertStudent.id,
        "Date" : date2,
        "LateEntry" : "1h",
        "EntryTeacherId" : insertEntryTeacher.id,
        "EarlyExit" : time2,
        "ExitTeacherId" : insertExitTeacher.id
    }
   );

       const checkChildAttendance = await StudentAttendance.findByStudentId(
           insertStudent.id, {date1,date2});

       expect(checkChildAttendance).not.toBeNull();
       expect(checkChildAttendance).toHaveLength(2);
       expect(checkChildAttendance).toEqual(
        expect.arrayContaining(
            [
                expect.objectContaining(
                    {
                        "ID": expect.anything(),
                        "Date": date1,
                        "LateEntry": "1h",
                        "EntryTeacherId": insertEntryTeacher.id,
                        "EarlyExit": time1,
                        "ExitTeacherId": insertExitTeacher.id,
                        "EntryTeacherName": "Joe Kernel",
                        "ExitTeacherName": "Teacher teacher",
                    },
                    {
                        "ID": expect.anything(),
                        "Date": date2,
                        "LateEntry": "2h",
                        "EntryTeacherId": insertEntryTeacher.id,
                        "EarlyExit": time2,
                        "ExitTeacherId": insertExitTeacher.id,
                        "EntryTeacherName": "Joe Kernel",
                        "ExitTeacherName": "Teacher teacher"
                    }
                    
   )]));
        //clean db for future tests
       await StudentAttendance.remove(insertAttendance1);
       await StudentAttendance.remove(insertAttendance2);
       await User.remove(insertEntryTeacher.id);
       await User.remove(insertExitTeacher.id);
       await Student.remove(insertStudent.id);
       await User.remove(testParent.id);
        
    });

    test("It should show an empty list when passed student Id has not any attendance record", async () => {
       const checkChildAttendance = await StudentAttendance.findByStudentId(
           "notExistingStudentID", {});
       expect(checkChildAttendance).not.toBeNull();
       expect(checkChildAttendance).toHaveLength(0);
       
    });

    test('It should throw an error when the passed studentId is missing or invalid', async () =>{
        try{
            await StudentAttendance.findByStudentId();

        }catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid studentId');
        }
    });

});

describe("getDailyAttendanceByClassId",() => {
  /*
    * Ok
    * invalid ClassId
    * missing date
    * ivalid date
    *  
    */

  test("It should show the correct attendance data for a class", async () => {
    /*
     * create teacher/parent
     * create class
     * create students
     * create attendance
     */

    // Create teacher/parent
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

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    // Create students
    const s1Id = uuid.v4();
    await Student.create({
      ID: s1Id,
      FirstName: 'AAA',
      LastName: 'AAA',
      SSN: 'ZZGSCD71A54Z325N',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'M'
    });

    const s2Id = uuid.v4();
    await Student.create({
      ID: s2Id,
      FirstName: 'BBB',
      LastName: 'BBB',
      SSN: 'CXCNBB97T28G770L',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'F'
    });

    const s3Id = uuid.v4();
    await Student.create({
      ID: s3Id,
      FirstName: 'CCC',
      LastName: 'CCC',
      SSN: 'GMJVSO74A65D854Q',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'M'
    });

    const s4Id = uuid.v4();
    await Student.create({
      ID: s4Id,
      FirstName: 'DDD',
      LastName: 'DDD',
      SSN: 'CMWJMZ69C45C301Q',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'F'
    });

    // Create attendance
    const date = moment().utc().format(db.getDateFormatString());

    // S1 present

    // S2 present with late entry 2h
    const a1 = await StudentAttendance.create({
      StudentId: s2Id,
      Date: date,
      LateEntry: '2h',
      EntryTeacherId: userId,
      EarlyExit: null,
      ExitTeacherId: null
    });

    // S3 present with early exit
    const a2 = await StudentAttendance.create({
      StudentId: s3Id,
      Date: date,
      LateEntry: null,
      EntryTeacherId: null,
      EarlyExit: '12:30:00',
      ExitTeacherId: userId
    });

    // S4 absent
    const a3 = await StudentAttendance.create({
      StudentId: s4Id,
      Date: date,
      LateEntry: null,
      EntryTeacherId: userId,
      EarlyExit: null,
      ExitTeacherId: null
    });

    const result = await StudentAttendance.getDailyAttendanceByClassId(classId, moment().utc().format());
    expect(result).toHaveLength(4);
    expect(result).toEqual([
      {
        StudentId: s1Id,
        FirstName: 'AAA',
        LastName: 'AAA',
        Present: true,
      },
      {
        StudentId: s2Id,
        FirstName: 'BBB',
        LastName: 'BBB',
        Present: true,
        LateEntry: '2h',
      },
      {
        StudentId: s3Id,
        FirstName: 'CCC',
        LastName: 'CCC',
        Present: true,
        EarlyExit: '12:30:00'
      },
      {
        StudentId: s4Id,
        FirstName: 'DDD',
        LastName: 'DDD',
        Present: false
      }
    ]);
    
    
    // remove attendance
    await StudentAttendance.remove(a3);
    await StudentAttendance.remove(a2);
    await StudentAttendance.remove(a1);

    // remove students
    await Student.remove(s4Id);
    await Student.remove(s3Id);
    await Student.remove(s2Id);
    await Student.remove(s1Id);

    // remove class
    await Class.remove(classId);

    // remove user
    await User.remove(userId);

  });

  test("It should throw an error about ClassId", async () => {
    try {
      const date = moment().utc().format(db.getDateFormatString());
      await StudentAttendance.getDailyAttendanceByClassId(null, moment().utc().format());
    } catch (error) {
      expect(error).toHaveProperty('message', 'Missing or invalid ClassId');
    }
  });

  test("It should throw an error about missing date", async () => {
    try {
      await StudentAttendance.getDailyAttendanceByClassId(1, null);
    } catch (error) {
      expect(error).toHaveProperty('message', 'Missing or invalid date');
    }
  });

  test("It should throw an error about invalid date", async () => {
    try {
      await StudentAttendance.getDailyAttendanceByClassId(1, 'lsdjf');
    } catch (error) {
      expect(error).toHaveProperty('message', 'Invalid date');
    }
  });

});

describe("registerBulkAbsence",() => {
  /*
   * Ok
   * invalid teacherid
   * student already recorded
   */

  test("It should perform the insertion", async () => {
    /*
     * create teacher/parent
     * create class
     * create students
     * create attendance
     */

    // Create teacher/parent
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

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    // Create students
    const s1Id = uuid.v4();
    await Student.create({
      ID: s1Id,
      FirstName: 'AAA',
      LastName: 'AAA',
      SSN: 'ZZGSCD71A54Z325N',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'M'
    });

    const s2Id = uuid.v4();
    await Student.create({
      ID: s2Id,
      FirstName: 'BBB',
      LastName: 'BBB',
      SSN: 'CXCNBB97T28G770L',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'F'
    });

    const s3Id = uuid.v4();
    await Student.create({
      ID: s3Id,
      FirstName: 'CCC',
      LastName: 'CCC',
      SSN: 'GMJVSO74A65D854Q',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'M'
    });

    const s4Id = uuid.v4();
    await Student.create({
      ID: s4Id,
      FirstName: 'DDD',
      LastName: 'DDD',
      SSN: 'CMWJMZ69C45C301Q',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'F'
    });

    const result = await StudentAttendance.registerBulkAbsence(
      [s1Id, s2Id, s4Id],
      userId
    );
    expect(result).toEqual({newRecords: 3})

    const connection = await db.getConnection();
    let queryResult;
    try {
      queryResult = await connection.query(`
        SELECT *
        FROM StudentAttendance
        WHERE StudentId = '${s1Id}' OR StudentId = '${s2Id}' OR StudentId = '${s3Id}' OR StudentId = '${s4Id}'
      `);
    } finally {
      connection.release();
    }
    
    expect(queryResult).toHaveLength(3);
    queryResult.forEach(element => {
      expect(element.Student).not.toEqual(s3Id);
      expect(moment(element.Date).isSame(moment.utc(), 'day')).toBe(true);
      expect(element.LateEntry).toBeNull();
      expect(element.EntryTeacherId).toEqual(userId);
      expect(element.EarlyExit).toBeNull();
      expect(element.ExitTeacherId).toBeNull();
    });

    // remove attendance
    for (let i=0; i< queryResult.length; i++) {
      await StudentAttendance.remove(queryResult[i].ID);
    }
    
    // remove students
    await Student.remove(s4Id);
    await Student.remove(s3Id);
    await Student.remove(s2Id);
    await Student.remove(s1Id);

    // remove class
    await Class.remove(classId);

    // remove user
    await User.remove(userId);

  });

  test("It should throw an error about teacherId", async () => {
    try {
      await StudentAttendance.registerBulkAbsence(
        ['student1', 'student2'],
        null
      );
    } catch (error) {
      expect(error).toHaveProperty('message', 'Missing or invalid teacherId');
    }
  });

  test("It should throw an error about attendance already registered", async () => {
    /*
     * create teacher/parent
     * create class
     * create students
     * create attendance
     */

    // Create teacher/parent
   // Create teacher/parent
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

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    // Create students
    const s1Id = uuid.v4();
    await Student.create({
      ID: s1Id,
      FirstName: 'AAA',
      LastName: 'AAA',
      SSN: 'ZZGSCD71A54Z325N',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'M'
    });

    const s2Id = uuid.v4();
    await Student.create({
      ID: s2Id,
      FirstName: 'BBB',
      LastName: 'BBB',
      SSN: 'CXCNBB97T28G770L',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'F'
    });

    // Create attendance
    const date = moment().utc().format(db.getDateFormatString());

    // S1 present

    // S2 present with late entry 2h
    const a1 = await StudentAttendance.create({
      StudentId: s2Id,
      Date: date,
      LateEntry: '2h',
      EntryTeacherId: userId,
      EarlyExit: null,
      ExitTeacherId: null
    });
    
    try {
      await StudentAttendance.registerBulkAbsence(
        [s1Id, s2Id],
        userId
      );
    } catch (error) {
      expect(error).toHaveProperty('message', 'There is already a record for one or more students');
    } finally {
      // remove attendance
      await StudentAttendance.remove(a1);
      // remove students
      await Student.remove(s2Id);
      await Student.remove(s1Id);

      // remove class
      await Class.remove(classId);

      // remove user
      await User.remove(userId);
    }

  });

});

describe("registerLateEntry",() => {
  /*
   * 1h (ok)
   * 2h (ok)
   * missing studentid
   * missing teacherid
   * outside of time range
   * student present
   * student present with late entry or early exit  
   */

  test("It should perform the update (1h)", async () => {
    //Setup school start time
    config.school.school_start = moment().utc().subtract(10, 'minutes').format('HH:mm');
    // Create teacher/parent
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

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    // Create student
    const s1Id = uuid.v4();
    await Student.create({
      ID: s1Id,
      FirstName: 'AAA',
      LastName: 'AAA',
      SSN: 'ZZGSCD71A54Z325N',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'M'
    });
    
    // Create absence
    const date = moment().utc().format(db.getDateFormatString());
    const attendance = await StudentAttendance.create({
      StudentId: s1Id,
      Date: date,
      LateEntry: null,
      EntryTeacherId: userId,
      EarlyExit: null,
      ExitTeacherId: null
    });

    const result = await StudentAttendance.registerLateEntry(s1Id, userId);
    expect(result.affectedRows).toBe(1);

    const query = `
      SELECT *
      FROM StudentAttendance
      WHERE StudentId = ? AND Date = ?
    `;
    const connection = await db.getConnection();
    let queryResult;
    try {
      queryResult = await connection.query(query, [s1Id, date]);
    } finally {
      connection.release();
    }

    expect(queryResult).toHaveLength(1);
    expect(queryResult[0].LateEntry).toEqual('1h');
    expect(queryResult[0].EntryTeacherId).toEqual(userId);
    expect(queryResult[0].EarlyExit).toBeNull();
    expect(queryResult[0].ExitTeacherId).toBeNull();

    // remove attendance
    await StudentAttendance.remove(attendance);

    // remove student
    await Student.remove(s1Id);

    // remove class
    await Class.remove(classId);

    // remove user
    await User.remove(userId);
  });

  test("It should perform the update (2h)", async () => {
    //Setup school start time
    config.school.school_start = moment().utc().subtract(80, 'minutes').format('HH:mm');
    // Create teacher/parent
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

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    // Create student
    const s1Id = uuid.v4();
    await Student.create({
      ID: s1Id,
      FirstName: 'AAA',
      LastName: 'AAA',
      SSN: 'ZZGSCD71A54Z325N',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'M'
    });

    // Create absence
    const date = moment().utc().format(db.getDateFormatString());
    const attendance = await StudentAttendance.create({
      StudentId: s1Id,
      Date: date,
      LateEntry: null,
      EntryTeacherId: userId,
      EarlyExit: null,
      ExitTeacherId: null
    });

    const result = await StudentAttendance.registerLateEntry(s1Id, userId);
    expect(result.affectedRows).toBe(1);

    const query = `
      SELECT *
      FROM StudentAttendance
      WHERE StudentId = ? AND Date = ?
    `;
    const connection = await db.getConnection();
    let queryResult;
    try {
      queryResult = await connection.query(query, [s1Id, date]);
    } finally {
      connection.release();
    }

    expect(queryResult).toHaveLength(1);
    expect(queryResult[0].LateEntry).toEqual('2h');
    expect(queryResult[0].EntryTeacherId).toEqual(userId);
    expect(queryResult[0].EarlyExit).toBeNull();
    expect(queryResult[0].ExitTeacherId).toBeNull();

    // remove attendance
    await StudentAttendance.remove(attendance);

    // remove student
    await Student.remove(s1Id);

    // remove class
    await Class.remove(classId);

    // remove user
    await User.remove(userId);
  });

  test("It should throw an error about studentId", async () => {
  
    try {
      await StudentAttendance.registerLateEntry(null, 'TeacherId');
    } catch (error) {
      expect(error).toHaveProperty('message', 'Missing or invalid studentId');
    }

    
  });

  test("It should throw an error about teacherId", async () => {

    try {
      await StudentAttendance.registerLateEntry('StudentId', undefined);
    } catch (error) {
      expect(error).toHaveProperty('message', 'Missing or invalid teacherId');
    }


  });

  test("It should throw an error about time", async () => {
    //Setup school start time
    config.school.school_start = moment().utc().subtract(3, 'hours').format('HH:mm');

    try {
      await StudentAttendance.registerLateEntry('StudentId', 'TeacherId');
    } catch (error) {
      expect(error).toHaveProperty('message', 'Attendance record editing is not permitted at this time');
    }


  }); 
  
  test("It should throw an error about student not being absent (present)", async () => {
    //Setup school start time
    config.school.school_start = moment().utc().subtract(10, 'minutes').format('HH:mm');
    // Create teacher/parent
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

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    // Create student
    const s1Id = uuid.v4();
    await Student.create({
      ID: s1Id,
      FirstName: 'AAA',
      LastName: 'AAA',
      SSN: 'ZZGSCD71A54Z325N',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'M'
    });

    //Student is present

    try {
      await StudentAttendance.registerLateEntry(s1Id, userId);
    } catch(error) {
      expect(error).toHaveProperty('message', 'Student is not registered as absent');
    } finally {
      // remove student
      await Student.remove(s1Id);

      // remove class
      await Class.remove(classId);

      // remove user
      await User.remove(userId);
    }
    
  });

  test("It should throw an error about student not being absent (late entry)", async () => {
    //Setup school start time
    config.school.school_start = moment().utc().subtract(10, 'minutes').format('HH:mm');
    // Create teacher/parent
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

    // Create class
    const classId = await Class.create({
      CreationYear: moment().utc().format('YYYY'),
      Name: 'ì',
      CoordinatorId: userId
    });

    // Create student
    const s1Id = uuid.v4();
    await Student.create({
      ID: s1Id,
      FirstName: 'AAA',
      LastName: 'AAA',
      SSN: 'ZZGSCD71A54Z325N',
      BirthDate: '2013-05-11',
      Parent1: userId,
      ClassId: classId,
      Gender: 'M'
    });

    //Student is present with late entry
    const date = moment().utc().format(db.getDateFormatString());
    const attendance = await StudentAttendance.create({
      StudentId: s1Id,
      Date: date,
      LateEntry: '1h',
      EntryTeacherId: userId,
      EarlyExit: null,
      ExitTeacherId: null
    });


    try {
      await StudentAttendance.registerLateEntry(s1Id, userId);
    } catch(error) {
      expect(error).toHaveProperty('message', 'Student is not registered as absent');
    } finally {
      // remove attendance
      await StudentAttendance.remove(attendance);

      // remove student
      await Student.remove(s1Id);

      // remove class
      await Class.remove(classId);

      // remove user
      await User.remove(userId);
    }

  });

});