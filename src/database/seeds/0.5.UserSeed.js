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
          IsParent: true
        },
        {
          ID: '202db8275d3c06e6ce3fe7a47b30e0fe',
          eMail: 'marco.lorenzini@gmail.com',
          Password: 'easypass',
          IsParent: true
        },
        {
          ID: '9d64fa59c91d9109b11cd9e05162c675',
          eMail: 'nadia.rossi@gmail.com',
          Password: 'easypass',
          IsParent: true
        },
        {
          ID: '6e5c9976f5813e59816b40a814e29899',
          eMail: 'giulia.tesori@gmail.com',
          Password: 'easypass',
          IsTeacher: true
        },
        {
          ID: '205db8275d3c06e6ce3fe7a47b30e0fe', 
          eMail: 'admin@phonyschool.com', 
          Password:'EasyPassAdmin123',
          IsTeacher: true
        }
    ]);
  });
};

  