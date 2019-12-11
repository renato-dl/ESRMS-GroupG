
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('ClassAttendanceRecord').del()
    .then(function () {
      // Inserts seed entries
      return knex('ClassAttendanceRecord').insert([
        {
          ClassId: 1,
          Date: '2019-12-10'
        },
        {
          ClassId: 1,
          Date: '2019-12-11'
        },
        {
          ClassId: 1,
          Date: '2019-12-12'
        }
      ]);
    });
};
