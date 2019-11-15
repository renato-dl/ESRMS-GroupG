
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Classes').del()
    .then(function () {
      // Inserts seed entries
      return knex('Classes').insert([
        {
          CreationYear: 2019,
          Name: 'A',
          CoordinatorId: '6e5c9976f5813e59816b40a814e29899'
        }
      ]);
    });
};
