import User from '../src/database/models/user';
import Class from '../src/database/models/class';
import ClassAttendance from '../src/database/models/classAttendance';
import moment from 'moment';


describe("Tests about the checking status of roll calls in a class for a given date ", () => {

  test("It should check that a roll call has been already done in a class for a date", async () =>{
    
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

    //choose a correct date, no Sunday
    let date = moment.utc().set({
      "hour": 0,
      "minute": 0, 
      "second": 0, 
      "millisecond" : 0
    });

    const dayOfWeek = date.isoWeekday();  
    if(dayOfWeek == 7){
        date.add(1, 'days'); 
    }

    //insert new row in classAttendance table
    const insertRollCall = await ClassAttendance.create({
      ClassId: createClass.id,
      Date : date.format(ClassAttendance.db.getDateFormatString())
    });

    const checkRollCall = await ClassAttendance.hasAttendanceBeenRegistered(
      createClass.id,
      date.format()
    );

    expect(checkRollCall).toBe(true);
  
    //clean db for future tests
    await ClassAttendance.remove(insertRollCall);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);

  });

  test("It should check that a roll class has not been already done in a class for a date", async () =>{
    
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

    //choose a correct date, no Sunday
    let date = moment.utc().set({
      "hour": 0,
      "minute": 0, 
      "second": 0, 
      "millisecond" : 0
    });

    const dayOfWeek = date.isoWeekday();  
    if(dayOfWeek == 7){
        date.add(1, 'days'); 
    }

    const checkRollCall = await ClassAttendance.hasAttendanceBeenRegistered(
      createClass.id,
      date.format()
    );

    expect(checkRollCall).toBe(false);
  
    //clean db for future tests
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);

  });

  test("It should throw an error when class id is missing", async () =>{
    //choose correct date, no Sunday
    let date = moment.utc().set({
      "hour": 0,
      "minute": 0, 
      "second": 0, 
      "millisecond" : 0
    });

    const dayOfWeek = date.isoWeekday();  
    if(dayOfWeek == 7){
        date.add(1, 'days'); 
    }

    try{ 

      await ClassAttendance.hasAttendanceBeenRegistered(
        undefined,
        date.format());
      }
      catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid ClassId");
    }

  });

  test("It should throw an error when date is missing", async () =>{
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

    try{ 
      await ClassAttendance.hasAttendanceBeenRegistered(
        createClass.id,
        undefined
        );
      }
      catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid date");
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
    }


  });

  test("It should throw an error when date is invalid", async () =>{
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

    try{ 
      await ClassAttendance.hasAttendanceBeenRegistered(
        createClass.id,
        "invalidDate"
        );
      }
      catch(error){
      expect(error).toHaveProperty("message", "Invalid date");
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
    }
  });



});

describe("Tests about registering roll calls in a class for a given date ", () => {

  test("It should perform correctly the registration", async () =>{
    
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

    //choose a correct date, no Sunday
    let date = moment.utc().set({
      "hour": 0,
      "minute": 0, 
      "second": 0, 
      "millisecond" : 0
    });

    const dayOfWeek = date.isoWeekday();  
    if(dayOfWeek == 7){
        date.add(1, 'days'); 
    }

    //insert new row in classAttendance table
    const insertRollCall = await ClassAttendance.registerAttendanceForToday(createClass.id);

    const checkRollCall = await ClassAttendance.findById(insertRollCall.id);

    expect(checkRollCall).toMatchObject({
      ClassId: createClass.id,
      Date: new Date(date)
    });
  
    //clean db for future tests
    await ClassAttendance.remove(insertRollCall.id);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);

  });

  test("It should throw an error when a roll call has been done for a class in a date", async () =>{
    
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

    //choose a correct date, no Sunday
    let date = moment.utc().set({
      "hour": 0,
      "minute": 0, 
      "second": 0, 
      "millisecond" : 0
    });

    const dayOfWeek = date.isoWeekday();  
    if(dayOfWeek == 7){
        date.add(1, 'days'); 
    }

    //insert new row in classAttendance table
    const insertRollCall = await ClassAttendance.create({
      ClassId: createClass.id,
      Date : date.format(ClassAttendance.db.getDateFormatString())
  });
    try{
      await ClassAttendance.registerAttendanceForToday(createClass.id);

    }catch(error){
      expect(error).toHaveProperty("message", "Attendance already registered for specified class and date")
      
      //clean db for future tests
      await ClassAttendance.remove(insertRollCall);
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
    }
  });

  test("It should throw an error when class id is missing", async () =>{
    //choose correct date, no Sunday
    let date = moment.utc().set({
      "hour": 0,
      "minute": 0, 
      "second": 0, 
      "millisecond" : 0
    });

    const dayOfWeek = date.isoWeekday();  
    if(dayOfWeek == 7){
        date.add(1, 'days'); 
    }
    
    try{ 
      await ClassAttendance.registerAttendanceForToday(undefined)
      }
      catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid classId");
    }
  });
});

