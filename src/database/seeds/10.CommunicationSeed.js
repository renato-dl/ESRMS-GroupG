
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Communications').del()
    .then(function () {
      // Inserts seed entries
      return knex('Communications').insert([
        { 
          Title: "Communication 1",
          Description: "Lerem Ipsum",
          DueDate: '2019-12-18 00:00:00'
        },
        {
          Title: "Communication 2",
          Description: "Lerem Ipsum",
          DueDate: '2019-12-15 00:00:00'
        },
        {
          Title: "Communication 3",
          Description: "Lerem Ipsum",
          IsImportant: true,
          DueDate: '2019-12-25 00:00:00'
        }        
      ]);
    });
};
