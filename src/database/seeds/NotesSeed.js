
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Notes').del()
    .then(function () {

      // Inserts seed entries
      return knex('Notes').insert([
        { 
          Title: "Noisy behaviour in the classroom",
          Description: "The student made noise while teaching",
          StudentId: "266667153e975bbf735b89d4b03d9f93",
          TeacherId: "6e5c9976f5813e59816b40a814e29899",
          IsSeen: false,
          Date: '2019-12-18 00:00:00'
        },
        { 
          Title: "Exam cheating",
          Description: "The student has been seen while copying during the exam",
          StudentId: "7460aba98f7291ee69fcfdd17274c3a1",
          TeacherId: "6e5c9976f5813e59816b40a814e29899",
          IsSeen: false,
          Date: '2019-12-20 00:00:00'
        },
        { 
          Title: "Inapropriate speech pattern",
          Description: "The student used offensive words against one other student",
          StudentId: "aa49b76d-0308-44ce-a111-dcf31fd7678c",
          TeacherId: "26ce21c0-8d32-41d1-8d07-b4994fa53edf",
          IsSeen: false,
          Date: '2019-11-18 00:00:00'
        }      
      ]);
    });
};
