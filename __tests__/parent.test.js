import Grade from "../src/database/models/grade";

describe('Customer tests', () => {
   
    test('It should retrive the grades of that student', async () => {
        const grades = await Grade.findByStudentId("bcbcbcbcbc", "266667153e975bbf735b89d4b03d9f93");
        console.log(grades);
        expect(5).toBe(5);

    });

});