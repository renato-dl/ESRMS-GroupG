
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Parents').del()
    .then(function () {
      // Inserts seed entries
      return knex('Parents').insert([
        {
          ID: '32d905eaa2770b66baf20282dff09191',
          FirstName: 'Lucia',
          LastName: 'Verdi',
          SSN: 'VRDLCU75A41L219F',
          eMail: 'lucia.verdi@gmail.com',
          Password: 'easypass'
        },
        {
          ID: '202db8275d3c06e6ce3fe7a47b30e0fe',
          FirstName: 'Marco',
          LastName: 'Lorenzini',
          SSN: 'LRNMRC76A02L219A',
          eMail: 'marco.lorenzini@gmail.com',
          Password: 'easypass'
        },
        {
          ID: '9d64fa59c91d9109b11cd9e05162c675',
          FirstName: 'Nadia',
          LastName: 'Rossi',
          SSN: 'RSSNDA76A41L219U',
          eMail: 'nadia.rossi@gmail.com',
          Password: 'easypass'
        }
    ]);
    });
};
