import Class from '../src/database/models/class';
import Subject from '../src/database/models/subject';

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
