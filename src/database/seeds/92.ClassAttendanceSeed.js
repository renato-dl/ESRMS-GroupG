
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('ClassAttendance').del()
    .then(function () {
      // Inserts seed entries
      return knex('ClassAttendance').insert([
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
