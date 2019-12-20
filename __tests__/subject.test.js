import Class from '../src/database/models/class';
import Subject from '../src/database/models/subject';
import TCSR from '../src/database/models/teacherClassSubject'

describe('Teacher tests about visualization of the subjects', () => {
  test("It should retrieve the subjects of a given teacher", async() =>{
    const subjects = await Subject.findByTeacherId('6e5c9976f5813e59816b40a814e29899');
    expect(subjects).not.toBeNull();
    expect(subjects).toHaveLength(2);
    expect(subjects).toEqual(
      expect.arrayContaining(
          [
            expect.objectContaining(
              {
                  "ID": 1,
                  "Name": "Mathematics",
                  "classid": 1
              },
              {
                  "ID": 3, 
                  "Name": "Physics", 
                  "classid": 1
              }
            )
          ]
        )
     );
    }
  );

  test("It should retrieve the class name by its id", async() =>{
    const classObj = await Class.getClassNameById(1);
    expect(classObj).not.toBeNull();
    expect(classObj).toHaveLength(2);
    expect(classObj).toEqual("1A");
    }
  );
});

describe("Tests about the visualization of the subjects of a parent's child", () =>{

  test("It should visualize correctly all the subjects of a student", async () =>{

    const testFirstName = 'Antonio';
    const testLastName = 'De Giovanni';
    const testSSN = 'TBKHSA93A02F494U';
    const testBirthDate = moment().utc().subtract(13, 'years');
    const testGender = 'M';

    //insert parent data
    const testParent = await User.insertParentData(
      'Name',
      'Lastname',
      'parent1@parents.com',
      'FFLPSL33H68A698Z',
      'Password1'
    );
    expect(testParent).toMatchObject({id: expect.anything()});

    //insert student data
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

    //create class with coordinator
    const insertTeacher = await User.insertInternalAccountData( 
      "Joe", 
      "Kernel", 
      "joekernel@gmail.com", 
      "LRNMRC79A02L219A", 
      "EasyPass1",
      true,
      false,
      false
  );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    const createClass = await Class.createClass(insertTeacher.id);

    expect(createClass).toEqual({
       id: createClass.id
    });

    //create subject
    const subjectId = await Subject.create({
      Name:"SubjectTest"
    })

    //create relation between class, subject and teacher
    const insertRelation = await TCSR.create({
      SubjectId: subjectId,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    })
    
    const subjects = await Subject.findByStudentId(result.id);

    expect(subjects).toEqual(
      expect.arrayContaining(
          [
              expect.objectContaining(
                  {
                      "ID": subjectId,
                      "Name": "SubjectTest"
                  }
        )]));
  
    await Student.remove(result.id);
    await User.remove(testParent.id);
    await TCSR.remove(insertRelation);
    await Subject.remove(subjectId);
    await Class.remove(createClass.id);
    await User.remove(insertTeacher.id);

  });

  test("It should return a message saying no entity has found", async () =>{

    const testFirstName = 'Antonio';
    const testLastName = 'De Giovanni';
    const testSSN = 'TBKHSA93A02F494U';
    const testBirthDate = moment().utc().subtract(13, 'years');
    const testGender = 'M';

    //insert parent data
    const testParent = await User.insertParentData(
      'Name',
      'Lastname',
      'parent1@parents.com',
      'FFLPSL33H68A698Z',
      'Password1'
    );
    expect(testParent).toMatchObject({id: expect.anything()});

    //insert student data
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
    
    const subjects = await Subject.findByStudentId(result.id);
    expect(subjects).toMatchObject({
      message:"Entity not found"
    });

    await Student.remove(result.id);
    await User.remove(testParent.id);
    
  });

  test("It should throw an error when studentId is not missing or invalid", async () =>{

    //create class with coordinator
    const insertTeacher = await User.insertInternalAccountData( 
      "Joe", 
      "Kernel", 
      "joekernel@gmail.com", 
      "LRNMRC79A02L219A", 
      "EasyPass1",
      true,
      false,
      false
  );

    expect(insertTeacher).toEqual({
      id: expect.anything()
    });

    const createClass = await Class.createClass(insertTeacher.id);

    expect(createClass).toEqual({
       id: createClass.id
    });

    //create subject
    const subjectId = await Subject.create({
      Name:"SubjectTest"
    })

    //create relation between class, subject and teacher
    const insertRelation = await TCSR.create({
      SubjectId: subjectId,
      ClassId: createClass.id,
      TeacherId: insertTeacher.id
    })

    try{
      await Subject.findByStudentId();
    }catch(error){
      expect(error).toHaveProperty("message", "Missing or invalid studentId");
      await TCSR.remove(insertRelation);
      await Subject.remove(subjectId);
      await Class.remove(createClass.id);
      await User.remove(insertTeacher.id);
    }
    
  });



});
