
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Communications').del()
    .then(function () {
      // Inserts seed entries
      return knex('Communications').insert([
        { 
          Title: "Communication 1",
          Description: "Lerem Ipsum"
        },
        {
          Title: "Communication 2",
          Description: "Lerem Ipsum"
        },
        {
          Title: "Communication 3",
          Description: "Lerem Ipsum"
        }        
      ]);
    });
};
