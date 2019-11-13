import Grade from "../src/database/models/grade";
import Student from "../src/database/models/student";

describe('Parent tests', () => {

    test('It should retrive the student of a given parent', async () => {
        const students = await Student.findByParentId("9d64fa59c91d9109b11cd9e05162c675");
        expect(students).not.toBeNull();
        expect(students).toHaveLength(1);
        const date = new Date('2005-05-18T22:00:00.000Z');
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

        const date = new Date('2005-05-31T22:00:00.000Z');
        expect(students).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining(
                        {
                            "ID": "7460aba98f7291ee69fcfdd17274c3a1",
                            "FirstName": "Martina",
                            "LastName": "Menzi",
                            "SSN": "MNZMTN05H41L219C",
                            "BirthDate": date
                        },
                        {
                            "ID": "868d6ec1dfc8467f6d260c48b5620543",
                            "FirstName": "Gianluca",
                            "LastName": "Menzi",
                            "SSN": "MNZGLC05H01L219X",
                            "BirthDate": date
                        }

       )]));
    });
});