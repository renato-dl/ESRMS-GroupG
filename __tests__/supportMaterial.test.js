import SupportMaterialModel from '../src/database/models/supportMaterial';
import User from '../src/database/models/user';
import Student from '../src/database/models/student';
import Class from '../src/database/models/class';
import teacherClassSubject from '../src/database/models/teacherClassSubject';
import Subject from '../src/database/models/subject';
import moment from 'moment';

let testParentID = null;
let testStudentID = null;
let testSubject = null;
let testTeacherID = null;
let testClassID = null;
let testClassRelationTeacherID = null;

beforeAll(async () => {
    testTeacherID = (await User.insertInternalAccountData( 
        "Joe", 
        "Kernel", 
        "joekernel@gmail.com", 
        "LRNMRC79A02L219A", 
        "EasyPass1", 
        true,
        false,
        false
    )).id;

    testParentID = (await User.insertParentData(
        'Name',
        'Lastname',
        'parent1@parents.com',
        'FFLPSL33H68A698Z',
        'Password1'
    )).id;

    testStudentID = (await Student.insertStudent(
        'TestName',
        'TestSurname',
        'TBKHSA93A02F494U',
        'M',
        moment().utc().subtract(13, 'years'),
        testParentID,
        null
    )).id;

    testClassID = (await Class.createClass(testTeacherID)).id;
    await Class.assignStudentsToClass(testClassID, [testStudentID]); 

    const testSubjectID = await Subject.create({Name: "BabyYodaSubject" });
    testSubject = await Subject.findById(testSubjectID);

    testClassRelationTeacherID = await teacherClassSubject.create({
        SubjectId: testSubject.ID,
        ClassId: testClassID,
        TeacherId: testTeacherID
    });
})

describe("Tests about support material", () => {

    test('It should should create a support material', async () => {
        const testMaterialID = await SupportMaterialModel.add(1, {
            filename: 'test_key',
            originalname: 'test_name',
            size: 200,
            mimetype: 'application/test'
        });

        const supportMaterialList = await SupportMaterialModel.findAllByTeacher(testTeacherID, null, null);
        expect(supportMaterialList).not.toBeNull();

        expect(supportMaterialList[0].Subject).toBeTruthy();
        expect(supportMaterialList[0].Name).toEqual('test_name');
        expect(supportMaterialList[0].Type).toEqual('application/test');
        expect(supportMaterialList[0].Size).toEqual(200);
        expect(supportMaterialList[0].CreatedOn).toBeTruthy();

        await SupportMaterialModel.remove(testMaterialID);
    });

    test('It should throw Error with message \'Subject is required\' when an invalid subjectId is passed when adding a new support material', async () => {
        try {
            const testMaterial = await SupportMaterialModel.add(null, {
                filename: 'test_key',
                originalname: 'test_name',
                size: 200,
                mimetype: 'application/test'
            });
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Subject is required');
        }
    });

    test('It should throw Error with message \'File is required\' when an invalid file is passed when adding a new support material', async () => {
        try {
            const testMaterial = await SupportMaterialModel.add(1, null);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'File is required');
        }
    });

    test('It should return the list of all support material by teacher', async () => {
        const testMaterialID = await SupportMaterialModel.add(1, {
            filename: 'test_key',
            originalname: 'test_name',
            size: 200,
            mimetype: 'application/test'
        });

        const supportMaterialList = await SupportMaterialModel.findAllByTeacher(testTeacherID, null, null);
        expect(supportMaterialList).not.toBeNull();

        if (supportMaterialList.length) {
            expect(supportMaterialList[0].Subject).toBeTruthy();
            expect(supportMaterialList[0].Name).toBeTruthy();
            expect(supportMaterialList[0].Type).toBeTruthy();
            expect(supportMaterialList[0].Size).toBeGreaterThan(0);
            expect(supportMaterialList[0].CreatedOn).toBeTruthy();
        }

        await SupportMaterialModel.remove(testMaterialID);
    });

    test('It should return the list of all support material by teacher with filters and pagination', async () => {
        const supportMaterialList = await SupportMaterialModel.findAllByTeacher(
            testTeacherID, 
            { subject: testSubject.Name, from: moment().subtract(1, 'days').toISOString(), to: moment().toISOString() }, 
            { page: 0, pageSize: 25 }
        );

        expect(supportMaterialList).not.toBeNull();

        if (supportMaterialList.length) {
            expect(supportMaterialList[0].Subject).toBeTruthy();
            expect(supportMaterialList[0].Name).toBeTruthy();
            expect(supportMaterialList[0].Type).toBeTruthy();
            expect(supportMaterialList[0].Size).toBeGreaterThan(0);
            expect(supportMaterialList[0].CreatedOn).toBeTruthy();
        }
    });

    test('It should return the list of all support material by teacher with undefined filters and undefined pagination', async () => {
        const supportMaterialList = await SupportMaterialModel.findAllByTeacher(testTeacherID, undefined, undefined);

        expect(supportMaterialList).not.toBeNull();

        if (supportMaterialList.length) {
            expect(supportMaterialList[0].Subject).toBeTruthy();
            expect(supportMaterialList[0].Name).toBeTruthy();
            expect(supportMaterialList[0].Type).toBeTruthy();
            expect(supportMaterialList[0].Size).toBeGreaterThan(0);
            expect(supportMaterialList[0].CreatedOn).toBeTruthy();
        }
    });
    
    test('It should throw Error with message \'Missing or invalid teacher id.\' when an invalid teacher id is passed when getting the list of support materials', async () => {
        try {
            const supportMaterialList = await SupportMaterialModel.findAllByTeacher(null, {}, {}); 
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid teacher id.');
        }
    });

    test('It should return the list of all support material for student', async () => {
        const testMaterialID = await SupportMaterialModel.add(1, {
            filename: 'test_key',
            originalname: 'test_name',
            size: 200,
            mimetype: 'application/test'
        });

        const supportMaterialList = await SupportMaterialModel.findAllByStudent(testStudentID, null, null);
        expect(supportMaterialList).not.toBeNull();

        if (supportMaterialList.length) {
            expect(supportMaterialList[0].Subject).toBeTruthy();
            expect(supportMaterialList[0].Name).toBeTruthy();
            expect(supportMaterialList[0].Type).toBeTruthy();
            expect(supportMaterialList[0].Size).toBeGreaterThan(0);
            expect(supportMaterialList[0].CreatedOn).toBeTruthy();
        }

        await SupportMaterialModel.remove(testMaterialID);
    });

    test('It should return the list of all support material for student with filters and pagination', async () => {
        const supportMaterialList = await SupportMaterialModel.findAllByStudent(
            testStudentID, 
            { subject: testSubject.Name, from: moment().subtract(1, 'days').toISOString(), to: moment().toISOString() }, 
            { page: 0, pageSize: 25 }
        );

        expect(supportMaterialList).not.toBeNull();

        if (supportMaterialList.length) {
            expect(supportMaterialList[0].Subject).toBeTruthy();
            expect(supportMaterialList[0].Name).toBeTruthy();
            expect(supportMaterialList[0].Type).toBeTruthy();
            expect(supportMaterialList[0].Size).toBeGreaterThan(0);
            expect(supportMaterialList[0].CreatedOn).toBeTruthy();
        }
    });

    test('It should return the list of all support material for student with undefined filters and undefined pagination', async () => {
        const supportMaterialList = await SupportMaterialModel.findAllByStudent(testStudentID, undefined, undefined);

        expect(supportMaterialList).not.toBeNull();

        if (supportMaterialList.length) {
            expect(supportMaterialList[0].Subject).toBeTruthy();
            expect(supportMaterialList[0].Name).toBeTruthy();
            expect(supportMaterialList[0].Type).toBeTruthy();
            expect(supportMaterialList[0].Size).toBeGreaterThan(0);
            expect(supportMaterialList[0].CreatedOn).toBeTruthy();
        }
    });
    
    test('It should throw Error with message \'Missing or invalid student id.\' when an invalid student id is passed when getting the list of support materials for student', async () => {
        try {
            const supportMaterialList = await SupportMaterialModel.findAllByStudent(null, {}, {}); 
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid student id.');
        }
    });


    test('It should should delete a support material', async () => {
        const testMaterialID = await SupportMaterialModel.add(1, {
            filename: 'test_key',
            originalname: 'test_name',
            size: 200,
            mimetype: 'application/test'
        });
        const beforeDeleteSupportMaterialListLength = (await SupportMaterialModel.findAll()).length;
        await SupportMaterialModel.remove(testMaterialID);
        const afterDeleteSupportMaterialListLength = (await SupportMaterialModel.findAll()).length;

        expect(beforeDeleteSupportMaterialListLength).toBe(afterDeleteSupportMaterialListLength + 1);
    });

    test('It should throw Error with message \'Missing or invalid support material\' when an invalid id is passed when deleting a support material', async () => {
        try {
            await SupportMaterialModel.remove(null);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid support material');
        }
    });

    test('It should throw Error with message \'Entity not found\' when an non existing support material id is passed', async () => {
        try {
            await SupportMaterialModel.remove(-1);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Entity not found');
        }
    });
    
})

afterAll(async () => {
    try {
        await Student.remove(testStudentID);
        await User.remove(testParentID);
        await teacherClassSubject.remove(testClassRelationTeacherID);
        await Subject.remove(testSubject.ID);
        await Class.remove(testClassID);
        await User.remove(testTeacherID);
    } catch (e) {
        console.log('An error occurred while cleaning up on supportMateril tests afterAll()');
        console.log(e);
    }
})
