
exports.up = function(knex) {
  return knex.schema.table('Assignments', function(table){
    table.dropColumn('AttachmentFile');
  });
};

exports.down = function(knex) {
  return knex.schema.table('Assignments', function(table){
    table.text('AttachmentFile');
  });
};
