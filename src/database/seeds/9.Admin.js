
exports.seed = function(knex) {

  //return knex('Users').del()
  //  .then(function () {

      return knex('Users').insert([
        {
          ID: '205db8275d3c06e6ce3fe7a47b30e0fe', 
          eMail: 'xhoikerbizi@gmail.com', 
          Password:'EasyPassAdmin123',
          Role: 'admin'
        }        
      ]);
  //  });
};
