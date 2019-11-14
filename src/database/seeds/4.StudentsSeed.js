
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Students').del()
    .then(function () {
      // Inserts seed entries
      return knex('Students').insert([
        {
          ID: '7460aba98f7291ee69fcfdd17274c3a1',
          FirstName: 'Martina',
          LastName: 'Menzi',
          SSN: 'MNZMTN05H41L219C',
          BirthDate: '2005-06-01',
          Parent1: '32d905eaa2770b66baf20282dff09191',
          ClassId: 1
        },
        {
          ID: '868d6ec1dfc8467f6d260c48b5620543',
          FirstName: 'Gianluca',
          LastName: 'Menzi',
          SSN: 'MNZGLC05H01L219X',
          BirthDate: '2005-06-01',
          Parent1: '32d905eaa2770b66baf20282dff09191',
          ClassId: 1
        },
        {
          ID: '266667153e975bbf735b89d4b03d9f93',
          FirstName: 'Sara',
          LastName: 'Lorenzini',
          SSN: 'LRNSRA05E59L219Q',
          BirthDate: '2005-05-19',
          Parent1: '9d64fa59c91d9109b11cd9e05162c675',
          Parent2: '202db8275d3c06e6ce3fe7a47b30e0fe',
          ClassId: 1
        },
    ]);
    });
};
