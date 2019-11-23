exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Users').del()
    .then(function () {
      // Inserts seed entries
      return knex('Users').insert([
        {
          ID: '32d905eaa2770b66baf20282dff09191',
          eMail: 'lucia.verdi@gmail.com',
          Password: 'easypass',
          IsParent: true,
          FirstName: 'Lucia',
          LastName: 'Verdi',
          SSN: 'VRDLCU75A41L219F'
        },
        {
          ID: '202db8275d3c06e6ce3fe7a47b30e0fe',
          eMail: 'marco.lorenzini@gmail.com',
          Password: 'easypass',
          IsParent: true,
          FirstName: 'Marco',
          LastName: 'Lorenzini',
          SSN: 'LRNMRC76A02L219A'
        },
        {
          ID: '9d64fa59c91d9109b11cd9e05162c675',
          eMail: 'nadia.rossi@gmail.com',
          Password: 'easypass',
          IsParent: true,
          FirstName: 'Nadia',
          LastName: 'Rossi',
          SSN: 'RSSNDA76A41L219U'
        },
        {
          ID: '6e5c9976f5813e59816b40a814e29899',
          eMail: 'giulia.tesori@gmail.com',
          Password: 'easypass',
          IsTeacher: true,
          FirstName: 'Giulia',
          LastName: 'Tesori',
          SSN: 'TSRGLI74R52L219F'
        },
        {
          ID: '205db8275d3c06e6ce3fe7a47b30e0fe', 
          eMail: 'admin@phonyschool.com', 
          Password:'EasyPassAdmin123',
          IsAdminOfficer: true,
          IsSysAdmin: true,
          FirstName: 'Marta',
          LastName: 'Peradotto',
          SSN: 'PRDMRT71D51L219E'
        }
    ]);
  });
};

  