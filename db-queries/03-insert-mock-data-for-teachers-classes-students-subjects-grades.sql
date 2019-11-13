-- first one teacher to be the coordinator
INSERT INTO `Teachers` (`ID`, `FirstName`, `LastName`, `eMail`, `SSN`, `CreatedOn`, `Password`) VALUES ('6e5c9976f5813e59816b40a814e29899', 'Giulia', 'Tesori', 'giulia.tesori@gmail.com', 'TSRGLI74R52L219F', CURRENT_TIMESTAMP, 'easypass');

-- create class 1A
INSERT INTO `Classes` (`ID`, `CreationYear`, `Name`, `CoordinatorId`) VALUES (NULL, '2019', 'A', '6e5c9976f5813e59816b40a814e29899');

-- insert students
-- student A with parent A
INSERT INTO `Students` (`ID`, `FirstName`, `LastName`, `SSN`, `CreatedOn`, `BirthDate`, `Parent1`, `Parent2`, `ClassId`) VALUES ('7460aba98f7291ee69fcfdd17274c3a1', 'Martina', 'Menzi', 'MNZMTN05H41L219C', CURRENT_TIMESTAMP, '2005-06-01', '32d905eaa2770b66baf20282dff09191', NULL, '1');
-- student B with parent A
INSERT INTO `Students` (`ID`, `FirstName`, `LastName`, `SSN`, `CreatedOn`, `BirthDate`, `Parent1`, `Parent2`, `ClassId`) VALUES ('868d6ec1dfc8467f6d260c48b5620543', 'Gianluca', 'Menzi', 'MNZGLC05H01L219X', CURRENT_TIMESTAMP, '2005-06-01', '32d905eaa2770b66baf20282dff09191', NULL, '1');
-- student C with parent B and C
INSERT INTO `Students` (`ID`, `FirstName`, `LastName`, `SSN`, `CreatedOn`, `BirthDate`, `Parent1`, `Parent2`, `ClassId`) VALUES ('266667153e975bbf735b89d4b03d9f93', 'Sara', 'Lorenzini', 'LRNSRA05E59L219Q', CURRENT_TIMESTAMP, '2005-05-19', '9d64fa59c91d9109b11cd9e05162c675', '202db8275d3c06e6ce3fe7a47b30e0fe', '1');

-- insert subjects (liceo scientifico: missing Latin, Design and Arts History, Religion)
INSERT INTO `Subjects` (`ID`, `Name`) VALUES (NULL, 'Mathematics');
INSERT INTO `Subjects` (`ID`, `Name`) VALUES (NULL, 'Geography');
INSERT INTO `Subjects` (`ID`, `Name`) VALUES (NULL, 'Physics');
INSERT INTO `Subjects` (`ID`, `Name`) VALUES (NULL, 'History');
INSERT INTO `Subjects` (`ID`, `Name`) VALUES (NULL, 'Physical Education');
INSERT INTO `Subjects` (`ID`, `Name`) VALUES (NULL, 'Italian');
INSERT INTO `Subjects` (`ID`, `Name`) VALUES (NULL, 'English');

-- insert grades
INSERT INTO `Grades` (`ID`, `SubjectId`, `StudentId`, `Grade`, `GradeDate`) VALUES (NULL, '1', '868d6ec1dfc8467f6d260c48b5620543', '9', '2019-11-03 10:00:00');
INSERT INTO `Grades` (`ID`, `SubjectId`, `StudentId`, `Grade`, `GradeDate`) VALUES (NULL, '1', '7460aba98f7291ee69fcfdd17274c3a1', '7', '2019-11-03 10:00:00');
INSERT INTO `Grades` (`ID`, `SubjectId`, `StudentId`, `Grade`, `GradeDate`) VALUES (NULL, '1', '266667153e975bbf735b89d4b03d9f93', '8.5', '2019-11-03 10:00:00');

INSERT INTO `Grades` (`ID`, `SubjectId`, `StudentId`, `Grade`, `GradeDate`) VALUES (NULL, '7', '868d6ec1dfc8467f6d260c48b5620543', '10', '2019-10-29 10:00:00');
INSERT INTO `Grades` (`ID`, `SubjectId`, `StudentId`, `Grade`, `GradeDate`) VALUES (NULL, '7', '7460aba98f7291ee69fcfdd17274c3a1', '8.25', '2019-10-29 10:00:00');
INSERT INTO `Grades` (`ID`, `SubjectId`, `StudentId`, `Grade`, `GradeDate`) VALUES (NULL, '7', '266667153e975bbf735b89d4b03d9f93', '6.75', '2019-10-29 10:00:00');
