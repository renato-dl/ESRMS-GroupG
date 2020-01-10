import Timetable from '../src/database/models/timetable';
import Class from '../src/database/models/class';
import Subject from '../src/database/models/subject';
import User from '../src/database/models/user';

let testTeacherID = null;
let testClassID = null;
let testSubjectIDs = [];
let getTimetableData = null;

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

    testClassID = (await Class.createClass(testTeacherID)).id;

    testSubjectIDs = await Subject.createMany([
        { Name: "TestSubject0" },
        { Name: "TestSubject1" },
        { Name: "TestSubject2" },
        { Name: "TestSubject3" },
        { Name: "TestSubject4" },
        { Name: "TestSubject5" }
    ]);

    getTimetableData = (hours, days, subjects) => {
        days = days || [1, 2, 3, 4, 5];
        subjects = subjects || testSubjectIDs;
    
        const timetableData = [];
        for (let day of days) {
            for (let hour of hours) {
                timetableData.push({ 
                    day: day, 
                    hour: hour, 
                    subjectId: subjects[Math.floor(Math.random() * 10) % subjects.length]
                })
            }
        }
    
        console.log(timetableData);
        return timetableData;
    }
})

describe("Tests about timetable", () => {

    test('It should should create a new timetable', async () => {
        const timetableData = getTimetableData(["8", "9:00", "10", 11, 12]);
        const timetable = await Timetable.add(testClassID, timetableData);
        expect(timetable).toBeTruthy();
        await Timetable.remove(testClassID);
    });

    test('It should throw Error with message \'Missing or invalid classId.\' when an invalid class id is passed when creating a new timetable', async () => {
        try {
            await Timetable.add(null, []);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid classId.');
        }
    });

    test('It should throw Error with message \'Missing or timetable.\' when an invalid timetable is passed when creating a new timetable', async () => {
        try {
            await Timetable.add(testClassID, null);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or timetable.');
        }
    });

    test('It should throw Error with message \'Invalid timetable type.\' when an non array structure timetable is passed when creating a new timetable', async () => {
        try {
            await Timetable.add(testClassID, {});
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Invalid timetable type.');
        }
    });

    test('It should throw Error with message \'Empty timetable.\' when an empty timetable is passed when creating a new timetable', async () => {
        try {
            await Timetable.add(testClassID, []);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Empty timetable.');
        }
    });

    test('It should throw Error with message \'Incomplete timetable.\' when not all the days of the timetable are passed when creating a new timetable', async () => {
        try {
            const timetableData = getTimetableData([8, 9, 10, 11, 12, 13], [1, 2, 3]);
            await Timetable.add(testClassID, timetableData);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Incomplete timetable.');
        }
    });

    test('It should throw Error with message \'Invalid timetable hours.\' when more timetable hours are passed when creating a new timetable', async () => {
        try {
            const timetableData = getTimetableData([8, 9, 10, 11, 12, undefined, 14]);
            await Timetable.add(testClassID, timetableData);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Invalid timetable hours.');
        }
    });

    test('It should throw Error with message \'Invalid timetable hours.\' when less timetable hours are passed when creating a new timetable', async () => {
        try {
            const timetableData = getTimetableData([8, 9, 10]);
            await Timetable.add(testClassID, timetableData);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Invalid timetable hours.');
        }
    });

    test('It should throw Error with message \'Invalid subjects.\' when invalid subjects are passed when creating a new timetable', async () => {
        try {
            const timetableData = getTimetableData([8, 9, 10, 11, 12, 13], null, []);
            await Timetable.add(testClassID, timetableData);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Invalid subjects.');
        }
    });

    test('It should throw Error with message \'Invalid subjects.\' when non existing subjects are passed when creating a new timetable', async () => {
        try {
            const subjects = await Subject.findAll();
            const max = Math.max(...subjects.map((s) => parseInt(s.ID)));
            const timetableData = getTimetableData([8, 9, 10, 11, 12, 13], null, [max + 1]);
            await Timetable.add(testClassID, timetableData);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Invalid subjects.');
        }
    });

    test('It should throw Error with message \'Class not found.\' when a non existing class is passed when creating a new timetable', async () => {
        try {
            const classes = await Class.findAll();
            const max = Math.max(...classes.map((c) => parseInt(c.ID)));
            const timetableData = getTimetableData([8, 9, 10, 11, 12, 13]);
            await Timetable.add(max + 1, timetableData);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Class not found.');
        }
    });

    test('It should throw Error with message \'Class already has a timetable.\' when trying to create a timetable for a class that already has an existing timetable', async () => {
        try {
            const timetableData = getTimetableData([8, 9, 10, 11, 12, 13]);
            await Timetable.add(testClassID, timetableData);
            await Timetable.add(testClassID, timetableData);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Class already has a timetable.');
            await Timetable.remove(testClassID);
        }
    });

    test('It should throw Error with message \'Class already has a timetable or the provided timetable contents are invalid.\' when providing invalid timetable contents (ex: two subjects in the same time)', async () => {
        try {
            const timetableData = getTimetableData([8, 8, 9, 10, 11, 12]);
            await Timetable.add(testClassID, timetableData);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Class already has a timetable or the provided timetable contents are invalid.');
        }
    });

    test('It should return the list of all timetables created', async () => {
        const timetableData = getTimetableData([8, 9, 10, 11, 12]);
        const timetable = await Timetable.add(testClassID, timetableData);
        expect(timetable).toBeTruthy();

        const timetableList = await Timetable.list();
        expect(timetableList).not.toBeNull();

        if (timetableList.length) {
            expect(timetableList[0].ClassID).toBeTruthy();
            expect(timetableList[0].Timetable).toBeTruthy();
            expect(timetableList[0].Timetable.length).toBeGreaterThan(0);
            expect(parseInt(timetableList[0].Timetable[0].Day)).toBeGreaterThanOrEqual(1);
            expect(parseInt(timetableList[0].Timetable[0].Day)).toBeLessThanOrEqual(5);
            expect(parseInt(timetableList[0].Timetable[0].Hour)).toBeGreaterThanOrEqual(8);
            expect(parseInt(timetableList[0].Timetable[0].Hour)).toBeLessThanOrEqual(13);
            expect(timetableList[0].Timetable[0].SubjectID).toBeTruthy();
        }

        await Timetable.remove(testClassID);
    });

    test('It should should delete a timetable', async () => {
        const timetableData = getTimetableData([8, 9, 10, 11, 12]);
        const timetable = await Timetable.add(testClassID, timetableData);
        expect(timetable).toBeTruthy();

        const beforeDeleteTimetableListLength = (await Timetable.list()).length;
        await Timetable.remove(testClassID);
        const afterDeleteTimetableListLength = (await Timetable.list()).length;

        expect(beforeDeleteTimetableListLength).toBe(afterDeleteTimetableListLength + 1);
    });

    test('It should run without issues when trying to delete a timetable that doesnt exists', async () => {
        const timetableData = getTimetableData([8, 9, 10, 11, 12]);
        const timetable = await Timetable.add(testClassID, timetableData);
        expect(timetable).toBeTruthy();
        await Timetable.remove(testClassID);
        await Timetable.remove(testClassID);
    });

    test('It should throw Error with message \'Missing or invalid classId.\' when an invalid class id is passed when deleting a timetable', async () => {
        try {
            await Timetable.remove(null);
        } catch(error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Missing or invalid classId.');
        }
    });
    
})

afterAll(async () => {
    try {
        await Class.remove(testClassID);
        await User.remove(testTeacherID);
        await Subject.removeMany(testSubjectIDs);
    } catch (e) {
        console.log('An error occurred while cleaning up on timetable tests afterAll()');
        console.log(e);
    }
})
