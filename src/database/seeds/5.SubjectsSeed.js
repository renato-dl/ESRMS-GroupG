
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Subjects').del()
    .then(function () {
      // Inserts seed entries
      return knex('Subjects').insert([
        {Name: 'Mathematics'},
        {Name: 'Geography'},
        {Name: 'Physics'},
        {Name: 'History'},
        {Name: 'Physical Education'},
        {Name: 'Italian'},
        {Name: 'English'}
      ]);
    });
};
