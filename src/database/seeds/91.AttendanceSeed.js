
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('AttendanceRegistry').del()
    .then(function () {
      // Inserts seed entries
      return knex('AttendanceRegistry').insert([
        { // absence
          StudentId: '868d6ec1dfc8467f6d260c48b5620543',
          Date: '2019-12-10',
          EntryTeacherId: '26ce21c0-8d32-41d1-8d07-b4994fa53edf',
          LateEntry: null,
          EarlyExit: null,
          ExitTeacherId: null
          
        },
        { // late entry (secod hour)
          StudentId: '868d6ec1dfc8467f6d260c48b5620543',
          Date: '2019-12-11',
          LateEntry: '2h',
          EntryTeacherId: '6d361d43-1308-4ac6-95ab-580138de9141',
          EarlyExit: null,
          ExitTeacherId: null
        },
        { // late entry (within 10m of first hour) + early exit
          StudentId: '868d6ec1dfc8467f6d260c48b5620543',
          Date: '2019-12-12',
          LateEntry: '1h',
          EntryTeacherId: '6e5c9976f5813e59816b40a814e29899',
          EarlyExit: '11:30',
          ExitTeacherId: '26ce21c0-8d32-41d1-8d07-b4994fa53edf'
        }        
      ]);
    });
};
