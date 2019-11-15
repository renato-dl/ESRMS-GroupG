
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Teachers').del()
    .then(function () {
      // Inserts seed entries
      return knex('Teachers').insert([
        {
          ID: '6e5c9976f5813e59816b40a814e29899',
          FirstName: 'Giulia',
          LastName: 'Tesori',
          SSN: 'TSRGLI74R52L219F',
          eMail: 'giulia.tesori@gmail.com',
          Password: 'easypass'
        }
      ]);
    });
};
