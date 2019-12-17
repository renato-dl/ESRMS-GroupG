exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Assignments').del()
    .then(function () {
      // Inserts seed entries
      return knex('Assignments').insert([
        {
          SubjectId: 1,
          ClassId: 1,
          Title: 'Geometry problems',
          Description: 'Problems # 15 to 22 page 145',
          DueDate: '2019-12-18 00:00:00'
        },
        {
          SubjectId: 3,
          ClassId: 1,
          Title: 'Kinematics problems',
          Description: 'Exercises 15 to 19 page 87',
          DueDate: '2019-12-17 00:00:00'
        },
        {
          SubjectId: 3,
          ClassId: 1,
          Title: 'Kinematics',
          Description: 'Chapter 3, paragraphs 4 to 8',
          DueDate: '2019-12-17 00:00:00'
        },
      ]);
    });
};
