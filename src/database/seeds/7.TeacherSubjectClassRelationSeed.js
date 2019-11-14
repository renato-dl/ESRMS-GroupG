
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('TeacherSubjectClassRelation').del()
    .then(function () {
      // Inserts seed entries
      return knex('TeacherSubjectClassRelation').insert([
        {SubjectId: 1, TeacherId: '6e5c9976f5813e59816b40a814e29899', ClassId: 1},
      ]);
    });
};
