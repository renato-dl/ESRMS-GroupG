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
        },
        {
          ID: '26ce21c0-8d32-41d1-8d07-b4994fa53edf',
          eMail: 'paola.depaola@phonyschool.com',
          Password: 'easypass',
          IsTeacher: true,
          FirstName: 'Paola',
          LastName: 'De Paola',
          SSN: 'TXCRDF77T22B735U'
        },
        {
          ID: 'd5799583-42e3-4818-a073-449fc8f1b7e8',
          eMail: 'luca.deluca@phonyschool.com',
          Password: 'easypass',
          IsTeacher: true,
          FirstName: 'Luca',
          LastName: 'De Luca',
          SSN: 'WRVKBU59R17L237H'
        },
        {
          ID: '6d361d43-1308-4ac6-95ab-580138de9141',
          eMail: 'giorgio.digiorgio@parentsunited.com',
          Password: 'easypass',
          IsParent: true,
          FirstName: 'Giorgio',
          LastName: 'Di Giorgio',
          SSN: 'PVDZRN27M04G189V'
        },
        {
          ID: '9e412480-4287-4b62-a1ba-a8dcb03cdd41',
          eMail: 'maria.demaria@parentsunited.com',
          Password: 'easypass',
          IsParent: true,
          FirstName: 'Maria',
          LastName: 'De Maria',
          SSN: 'FGTHCF68M46G424G'
        }
    ]);
  });
};

  