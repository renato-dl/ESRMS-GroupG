USE `ESRMS`;

-- first delete old elements
delete from Topics;

-- drop table
drop table Topics;

-- create table correctly
create table Topics ( 
  ID INT NOT NULL AUTO_INCREMENT, 
  SubjectId INT NOT NULL,
  ClassId INT NOT NULL, 
  Title TEXT NOT NULL,
  TopicDescription TEXT NOT NULL,
  TopicDate datetime not null, 
  CreatedOn timestamp not null DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (ID), 
  FOREIGN KEY (SubjectId) REFERENCES Subjects(ID),
  FOREIGN KEY (ClassId) REFERENCES TeacherSubjectClassRelation(ClassId) 
  );

-- insert some topics
INSERT INTO Topics(ID, SubjectId, ClassId, Title, TopicDescription, TopicDate, CreatedOn) 
VALUES(NULL, 1, 1, "Expressions", "Part 1", "2019-10-07 10:00:00", NULL);

INSERT INTO Topics(ID, SubjectId, ClassId, Title, TopicDescription, TopicDate, CreatedOn) 
VALUES(NULL, 1, 1, "Expressions", "Part 2", "2019-10-14 10:00:00", NULL);

INSERT INTO Topics(ID, SubjectId, ClassId, Title, TopicDescription, TopicDate, CreatedOn) 
VALUES(NULL, 1, 1, "Expressions", "Part 3", "2019-10-21 10:00:00", NULL);
