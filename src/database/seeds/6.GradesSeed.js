
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Grades').del()
    .then(function () {
      // Inserts seed entries
      return knex('Grades').insert([
        {
          SubjectId: 1,
          StudentId: '868d6ec1dfc8467f6d260c48b5620543',
          Grade: 9,
          GradeDate: '2019-11-03'
        },
        {
          SubjectId: 1,
          StudentId: '7460aba98f7291ee69fcfdd17274c3a1',
          Grade: 7,
          GradeDate: '2019-11-03'
        },
        {
          SubjectId: 1,
          StudentId: '266667153e975bbf735b89d4b03d9f93',
          Grade: 8.5,
          GradeDate: '2019-11-03'
        },
        {
          SubjectId: 7,
          StudentId: '868d6ec1dfc8467f6d260c48b5620543',
          Grade: 10,
          GradeDate: '2019-10-29'
        },
        {
          SubjectId: 7,
          StudentId: '7460aba98f7291ee69fcfdd17274c3a1',
          Grade: 8.25,
          GradeDate: '2019-10-29'
        },
        {
          SubjectId: 7,
          StudentId: '266667153e975bbf735b89d4b03d9f93',
          Grade: 6.75,
          GradeDate: '2019-10-29'
        }
      ]);
    });
};
