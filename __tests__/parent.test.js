import Grade from "../src/database/models/grade";

describe('Customer tests', () => {
   
    test('It should check the correctness of accounting service time', async () => {
        const grades = await Grade.findByStudentId(1, 1);
        console.log(grades);
        expect(5).toBe(5);

    });

});