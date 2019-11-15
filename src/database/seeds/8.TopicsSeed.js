
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Topics').del()
    .then(function () {
      // Inserts seed entries
      return knex('Topics').insert([
        {
          TeacherSubjectClassRelationId: 1,
          Title: 'Expressions',
          TopicDescription: 'Part 1',
          TopicDate: '2019-10-07'
        },
        {
          TeacherSubjectClassRelationId: 1,
          Title: 'Expressions',
          TopicDescription: 'Part 2',
          TopicDate: '2019-10-14'
        },
        {
          TeacherSubjectClassRelationId: 1,
          Title: 'Expressions',
          TopicDescription: 'Part 3',
          TopicDate: '2019-10-21'
        }
      ]);
    });
};
