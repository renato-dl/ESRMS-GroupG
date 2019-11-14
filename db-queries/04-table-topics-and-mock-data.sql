USE `ESRMS`;
-- associate teacher to subject
INSERT INTO TeacherSubjectClassRelation(SubjectId, TeacherId, ClassId) 
VALUES(1, '6e5c9976f5813e59816b40a814e29899', 1);

-- create topic table
create table Topics ( 
  ID INT NOT NULL AUTO_INCREMENT, 
  SubjectId INT NOT NULL, 
  Title TEXT NOT NULL, 
  TopicDate datetime not null, 
  CreatedOn timestamp not null DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (ID), 
  FOREIGN KEY (SubjectId) REFERENCES subjects(ID) 
  )ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- insert some topics
INSERT INTO Topics(ID, SubjectId, Title, TopicDate, CreatedOn) 
VALUES(NULL, 1, "Expressions Part 1", "2019-10-07 10:00:00", NULL);

INSERT INTO Topics(ID, SubjectId, Title, TopicDate, CreatedOn) 
VALUES(NULL, 1, "Expressions Part 2", "2019-10-14 10:00:00", NULL);

INSERT INTO Topics(ID, SubjectId, Title, TopicDate, CreatedOn) 
VALUES(NULL, 1, "Expressions Part 3", "2019-10-21 10:00:00", NULL);

-- correct dates of math exams (to Monday, incorrect date)
update grades set gradedate = '2019-11-04 10:00:00' where subjectid = 1;