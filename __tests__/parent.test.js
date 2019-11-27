import Student from "../src/database/models/student";
import Grade from "../src/database/models/grade";

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