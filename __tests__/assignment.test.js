import Assignment from '../src/database/models/assignment';
import Student from '../src/database/models/student';


describe("Tests about assignments", () => {

  test('It should return the list of all assignments', async () => {
      const testStudent = '266667153e975bbf735b89d4b03d9f93';
      const testParent = '9d64fa59c91d9109b11cd9e05162c675';
      const related = await Student.checkIfRelated(testStudent, testParent);
      expect(related).toBe(true);

      const assignments = await Assignment.findByStudentId(testStudent, {}, {});
      expect(assignments).not.toBeNull();
      expect(assignments).toHaveLength(3);
      const date1 = new Date("2019-12-15T00:00:00.000Z");
      const date2 = new Date("2019-12-18T00:00:00.000Z");
      expect(assignments).toEqual(
          expect.arrayContaining([
              expect.objectContaining(
                  {
                      "Name": "Physics",
                      "Title": "Kinematics problems",
                      "Description": "Exercises 15 to 19 page 87",
                      "DueDate": date1
                  },
                  {
                      "Name": "Physics",
                      "Title": "Kinematics",
                      "Description": "Chapter 3, paragraphs 4 to 8",
                      "DueDate": date1
                  },
                  {
                      "Name": "Mathematics",
                      "Title": "Geometry problems",
                      "Description": "Probblems # 15 to 22 page 145",
                      "DueDate": date2
                  }
              )
          ])
      );
  });

  test('Should throw Error with message \'There are no assignments for the chosen student!\' when passing dates where the students doesnt have assignments', async () => {
      try {
          await Assignment.findByStudentId(
              '266667153e975bbf735b89d4b03d9f93', 
              { from: "2019-02-15T00:00:00.000Z", to: "2019-02-15T00:00:00.000Z"}, 
              {}
          );
      } catch(error) {
          expect(error).toBeInstanceOf(Error);
          expect(error).toHaveProperty('message', 'There are no assignments for the chosen student!');
      }
  });

})