import Student from "../src/database/models/student";
import Grade from "../src/database/models/grade";
import Assigment from "../src/database/models/assignment";

describe('Parent tests 1', () => {

    test('It should retrive the student of a given parent', async () => {
        const students = await Student.findByParentId("9d64fa59c91d9109b11cd9e05162c675");
        expect(students).not.toBeNull();
        expect(students).toHaveLength(1);
        const date = new Date('2005-05-19T00:00:00.000Z');
        expect(students).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining(
                    {
                        "ID": "266667153e975bbf735b89d4b03d9f93",
                        "FirstName": "Sara",
                        "LastName": "Lorenzini",
                        "SSN": "LRNSRA05E59L219Q",
                        "BirthDate": date
                    }
       )]));
    });

    test('It should retrive the students of a given parent', async () => {
        const students = await Student.findByParentId("32d905eaa2770b66baf20282dff09191");
        expect(students).not.toBeNull();
        expect(students).toHaveLength(2);

        const date = new Date('2005-06-01T00:00:00.000Z');
        expect(students).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining(
                        {
                            "ID": "7460aba98f7291ee69fcfdd17274c3a1",
                            "FirstName": "Martina",
                            "LastName": "Menzi",
                            "Gender": "F",
                            "SSN": "MNZMTN05H41L219C",
                            "BirthDate": date
                        },
                        

       ),
                    expect.objectContaining(
                        {
                            "ID": "868d6ec1dfc8467f6d260c48b5620543",
                            "FirstName": "Gianluca",
                            "LastName": "Menzi",
                            "Gender": "M",
                            "SSN": "MNZGLC05H01L219X",
                            "BirthDate": date
                        }
                    )
    ]));
    });

    test('should throw Error with message \'Entity not found\' when the passed Id does not exist', async () => {
        try{
            const students = await Student.findByParentId("32e905eaa2770b66baf20282dff09191");
        }
        catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Entity not found');
        }
    });

});

describe('Parent tests 2', () => {

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

describe("Tests about assignments", () => {

    test('It should return the list of all assignments', async () => {
        const testStudent = '266667153e975bbf735b89d4b03d9f93';
        const testParent = '9d64fa59c91d9109b11cd9e05162c675';
        const related = await Student.checkIfRelated(testStudent, testParent);
        expect(related).toBe(true);

        const assignments = await Assigment.findByStudentId(testStudent, {}, {});
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
            await Assigment.findByStudentId(
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

describe("Tests about getting the students based on subject and class", () => {

    test('It should return an empty list of students when teacher passes a subject that he/she doesnt teach', async () => {
        const teacherID = '6e5c9976f5813e59816b40a814e29899';
        const classID = 1;
        const subjectID = 5;

        const students = await Student.getStudentsDataByClassIdAndSubjectId(teacherID, classID, subjectID);
        expect(students).not.toBeNull();
        expect(students).toHaveLength(0);
    });

    test('It should return the list of students for the subject that the teacher teaches in a class', async () => {
        const teacherID = '6e5c9976f5813e59816b40a814e29899';
        const classID = 1;
        const subjectID = 1;

        const students = await Student.getStudentsDataByClassIdAndSubjectId(teacherID, classID, subjectID);
        expect(students).not.toBeNull();
        expect(students).toHaveLength(3);
        expect(students).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        "ID": "266667153e975bbf735b89d4b03d9f93",
                        "FirstName": "Sara",
                        "LastName": "Lorenzini",
                        "Gender": "F"
                    },
                    {
                        "ID": "7460aba98f7291ee69fcfdd17274c3a1",
                        "FirstName": "Martina",
                        "LastName": "Menzi",
                        "Gender": "F"
                    },
                    {
                        "ID": "868d6ec1dfc8467f6d260c48b5620543",
                        "FirstName": "Gianluca",
                        "LastName": "Menzi",
                        "Gender": "M"
                    }
                )
            ])
        );
    });

})
