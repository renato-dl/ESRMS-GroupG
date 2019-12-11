
import Attendance from '../src/database/models/attendance';
import User from '../src/database/models/user';
import Student from '../src/database/models/student';
import moment from 'moment';

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
        
        const insertAttendance = await Attendance.create({
            "StudentId" : insertStudent.id,
            "Date" : date,
            "LateEntry" : "1h",
            "EntryTeacherId" : insertEntryTeacher.id,
            "EarlyExit" : time,
            "ExitTeacherId" : insertExitTeacher.id
        }
       );

       const checkChildAttendance = await Attendance.findByStudentId(insertStudent.id, {});
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
       await Attendance.remove(insertAttendance);
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
        
        const insertAttendance1 = await Attendance.create({
            "StudentId" : insertStudent.id,
            "Date" : date1,
            "LateEntry" : "1h",
            "EntryTeacherId" : insertEntryTeacher.id,
            "EarlyExit" : time1,
            "ExitTeacherId" : insertExitTeacher.id
        }
       );


       const insertAttendance2 = await Attendance.create({
        "StudentId" : insertStudent.id,
        "Date" : date2,
        "LateEntry" : "1h",
        "EntryTeacherId" : insertEntryTeacher.id,
        "EarlyExit" : time2,
        "ExitTeacherId" : insertExitTeacher.id
    }
   );

       const checkChildAttendance = await Attendance.findByStudentId(
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
       await Attendance.remove(insertAttendance1);
       await Attendance.remove(insertAttendance2);
       await User.remove(insertEntryTeacher.id);
       await User.remove(insertExitTeacher.id);
       await Student.remove(insertStudent.id);
       await User.remove(testParent.id);
        
    });

    test("It should show an empty list when passed student Id has not any attendance record", async () => {
       const checkChildAttendance = await Attendance.findByStudentId(
           "notExistingStudentID", {});
       expect(checkChildAttendance).not.toBeNull();
       expect(checkChildAttendance).toHaveLength(0);
       
    });

    test('It should throw an error when the passed studentId is missing or invalid', async () =>{
        try{
            await Attendance.findByStudentId();

        }catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid studentId');
        }
    });

});