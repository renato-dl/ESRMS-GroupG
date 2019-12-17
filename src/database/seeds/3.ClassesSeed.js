
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
        },
        {
          CreationYear: 2019,
          Name: 'B',
          CoordinatorId: '26ce21c0-8d32-41d1-8d07-b4994fa53edf'
        },
        {
          CreationYear: 2019,
          Name: 'C',
          CoordinatorId: 'd5799583-42e3-4818-a073-449fc8f1b7e8'
        }
      ]);
    });
};
