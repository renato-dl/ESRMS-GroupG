SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `Assignments` (
  `ID` int(10) UNSIGNED NOT NULL,
  `SubjectId` int(10) UNSIGNED NOT NULL,
  `ClassId` int(10) UNSIGNED NOT NULL,
  `Title` text NOT NULL,
  `Description` text NOT NULL,
  `DueDate` datetime NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Assignments` (`ID`, `SubjectId`, `ClassId`, `Title`, `Description`, `DueDate`, `CreatedOn`) VALUES
(1, 1, 1, 'Geometry problems', 'Problems # 15 to 22 page 145', '2019-12-18 00:00:00', '2019-12-07 09:29:16'),
(2, 3, 1, 'Kinematics problems', 'Exercises 15 to 19 page 87', '2019-12-15 00:00:00', '2019-12-07 09:29:16'),
(3, 3, 1, 'Kinematics', 'Chapter 3, paragraphs 4 to 8', '2019-12-15 00:00:00', '2019-12-07 09:29:16');

CREATE TABLE `Classes` (
  `ID` int(10) UNSIGNED NOT NULL,
  `CreationYear` int(4) UNSIGNED NOT NULL,
  `Name` varchar(1) NOT NULL,
  `CoordinatorId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Classes` (`ID`, `CreationYear`, `Name`, `CoordinatorId`) VALUES
(1, 2019, 'A', '6e5c9976f5813e59816b40a814e29899'),
(2, 2019, 'B', '26ce21c0-8d32-41d1-8d07-b4994fa53edf'),
(3, 2019, 'C', 'd5799583-42e3-4818-a073-449fc8f1b7e8');

CREATE TABLE `Grades` (
  `ID` int(10) UNSIGNED NOT NULL,
  `SubjectId` int(10) UNSIGNED NOT NULL,
  `StudentId` varchar(255) NOT NULL,
  `Grade` decimal(10,2) NOT NULL,
  `GradeDate` datetime NOT NULL,
  `Type` enum('Written','Oral') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Grades` (`ID`, `SubjectId`, `StudentId`, `Grade`, `GradeDate`, `Type`) VALUES
(1, 1, '868d6ec1dfc8467f6d260c48b5620543', '9.00', '2019-11-03 00:00:00', 'Written'),
(2, 1, '7460aba98f7291ee69fcfdd17274c3a1', '7.00', '2019-11-03 00:00:00', 'Oral'),
(3, 1, '266667153e975bbf735b89d4b03d9f93', '8.50', '2019-11-03 00:00:00', 'Written'),
(4, 7, '868d6ec1dfc8467f6d260c48b5620543', '10.00', '2019-10-29 00:00:00', 'Oral'),
(5, 7, '7460aba98f7291ee69fcfdd17274c3a1', '8.25', '2019-10-29 00:00:00', 'Written'),
(6, 7, '266667153e975bbf735b89d4b03d9f93', '6.75', '2019-10-29 00:00:00', 'Oral');

CREATE TABLE `Students` (
  `ID` varchar(255) NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `LastName` varchar(30) NOT NULL,
  `SSN` varchar(16) NOT NULL,
  `BirthDate` datetime NOT NULL,
  `Parent1` varchar(255) NOT NULL,
  `Parent2` varchar(255) DEFAULT NULL,
  `ClassId` int(10) UNSIGNED DEFAULT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `Gender` enum('M','F') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Students` (`ID`, `FirstName`, `LastName`, `SSN`, `BirthDate`, `Parent1`, `Parent2`, `ClassId`, `CreatedOn`, `Gender`) VALUES
('266667153e975bbf735b89d4b03d9f93', 'Sara', 'Lorenzini', 'LRNSRA05E59L219Q', '2005-05-19 00:00:00', '9d64fa59c91d9109b11cd9e05162c675', '202db8275d3c06e6ce3fe7a47b30e0fe', 1, '2019-12-07 09:29:16', 'F'),
('7460aba98f7291ee69fcfdd17274c3a1', 'Martina', 'Menzi', 'MNZMTN05H41L219C', '2005-06-01 00:00:00', '32d905eaa2770b66baf20282dff09191', NULL, 1, '2019-12-07 09:29:16', 'F'),
('7f32bd55-9222-4dde-9cf4-fb1edb5148cc', 'Giorgino', 'Di Giorgio', 'PVMVRY91A12L533C', '2005-02-11 00:00:00', '6d361d43-1308-4ac6-95ab-580138de9141', NULL, 2, '2019-12-07 09:29:16', 'M'),
('868d6ec1dfc8467f6d260c48b5620543', 'Gianluca', 'Menzi', 'MNZGLC05H01L219X', '2005-06-01 00:00:00', '32d905eaa2770b66baf20282dff09191', NULL, 1, '2019-12-07 09:29:16', 'M'),
('aa49b76d-0308-44ce-a111-dcf31fd7678c', 'Gioia', 'Di Gioia', 'YQUFNS90T41F804P', '2005-01-25 00:00:00', '9e412480-4287-4b62-a1ba-a8dcb03cdd41', NULL, 2, '2019-12-07 09:29:16', 'F');

CREATE TABLE `Subjects` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Subjects` (`ID`, `Name`) VALUES
(1, 'Mathematics'),
(2, 'Geography'),
(3, 'Physics'),
(4, 'History'),
(5, 'Physical Education'),
(6, 'Italian'),
(7, 'English');

CREATE TABLE `TeacherSubjectClassRelation` (
  `ID` int(10) UNSIGNED NOT NULL,
  `SubjectId` int(10) UNSIGNED NOT NULL,
  `ClassId` int(10) UNSIGNED NOT NULL,
  `TeacherId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `TeacherSubjectClassRelation` (`ID`, `SubjectId`, `ClassId`, `TeacherId`) VALUES
(1, 1, 1, '6e5c9976f5813e59816b40a814e29899'),
(2, 3, 1, '6e5c9976f5813e59816b40a814e29899');

CREATE TABLE `Topics` (
  `ID` int(10) UNSIGNED NOT NULL,
  `TeacherSubjectClassRelationId` int(10) UNSIGNED NOT NULL,
  `Title` text NOT NULL,
  `TopicDescription` text NOT NULL,
  `TopicDate` datetime NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Topics` (`ID`, `TeacherSubjectClassRelationId`, `Title`, `TopicDescription`, `TopicDate`, `CreatedOn`) VALUES
(1, 1, 'Expressions', 'Part 1', '2019-10-07 00:00:00', '2019-12-07 09:29:16'),
(2, 1, 'Expressions', 'Part 2', '2019-10-14 00:00:00', '2019-12-07 09:29:16'),
(3, 1, 'Expressions', 'Part 3', '2019-10-21 00:00:00', '2019-12-07 09:29:16');

CREATE TABLE `Users` (
  `ID` varchar(255) NOT NULL,
  `eMail` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `SSN` varchar(16) NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `IsAdminOfficer` tinyint(1) NOT NULL DEFAULT 0,
  `IsSysAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `IsParent` tinyint(1) NOT NULL DEFAULT 0,
  `IsTeacher` tinyint(1) NOT NULL DEFAULT 0,
  `IsPrincipal` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Users` (`ID`, `eMail`, `Password`, `FirstName`, `LastName`, `SSN`, `CreatedOn`, `IsAdminOfficer`, `IsSysAdmin`, `IsParent`, `IsTeacher`, `IsPrincipal`) VALUES
('202db8275d3c06e6ce3fe7a47b30e0fe', 'marco.lorenzini@gmail.com', '$2b$12$zQpAirPbNGF0erFoadsyKeZdE87Y2QEvFqNTAiMj113DSFSR70Rnm', 'Marco', 'Lorenzini', 'LRNMRC76A02L219A', '2019-12-07 09:29:16', 0, 0, 1, 0, 0),
('205db8275d3c06e6ce3fe7a47b30e0fe', 'admin@phonyschool.com', '$2b$12$27/jWKKEOoiYztmwsTO1AeAfjRisWc/0smVXCao63uAXLdCiXMt.i', 'Marta', 'Peradotto', 'PRDMRT71D51L219E', '2019-12-07 09:29:16', 1, 1, 0, 0, 0),
('26ce21c0-8d32-41d1-8d07-b4994fa53edf', 'paola.depaola@phonyschool.com', '$2b$12$uV91JXw3DMdewU6Hjh5pM.9EetUkyyUCNHxiSNU2/4KD4apN2hGgq', 'Paola', 'De Paola', 'TXCRDF77T22B735U', '2019-12-07 09:29:16', 0, 0, 0, 1, 0),
('32d905eaa2770b66baf20282dff09191', 'lucia.verdi@gmail.com', '$2b$12$kJ/ZfsvbIUgE/RmpSTv8TekY7gB//SjWfrzbVdmU/HQf0UWOiVLGO', 'Lucia', 'Verdi', 'VRDLCU75A41L219F', '2019-12-07 09:29:16', 0, 0, 1, 0, 0),
('6d361d43-1308-4ac6-95ab-580138de9141', 'giorgio.digiorgio@parentsunited.com', '$2b$12$/Yaqrn7prQd.aTQYn6FfKeqK4qaT8eDMXu7xS04e9lhOJUSWzY7rC', 'Giorgio', 'Di Giorgio', 'PVDZRN27M04G189V', '2019-12-07 09:29:16', 0, 0, 1, 1, 0),
('6e5c9976f5813e59816b40a814e29899', 'giulia.tesori@gmail.com', '$2b$12$wxAnRc/px3orbzinHBbNRu51cmMgRN2L6k3ouBFeBFYig2.oTqsxi', 'Giulia', 'Tesori', 'TSRGLI74R52L219F', '2019-12-07 09:29:16', 0, 0, 0, 1, 0),
('9d64fa59c91d9109b11cd9e05162c675', 'nadia.rossi@gmail.com', '$2b$12$KMeaf7v7MJSVAsVMGFOAjOzDu2hgX6c87Q9zGQrKAIUY4171OkPm.', 'Nadia', 'Rossi', 'RSSNDA76A41L219U', '2019-12-07 09:29:16', 0, 0, 1, 0, 0),
('9e412480-4287-4b62-a1ba-a8dcb03cdd41', 'maria.demaria@parentsunited.com', '$2b$12$6gz.4ugWzXAzserSyXKMOuuKqP7TqVJ5GYAagGweZvOjH/MlJVfw.', 'Maria', 'De Maria', 'FGTHCF68M46G424G', '2019-12-07 09:29:16', 0, 0, 1, 0, 0),
('d5799583-42e3-4818-a073-449fc8f1b7e8', 'luca.deluca@phonyschool.com', '$2b$12$e8uIYzf8Sw6hL3mCcE3TGuylyuEi3nliR0Eqic/o/lG7NSyP/5M3e', 'Luca', 'De Luca', 'WRVKBU59R17L237H', '2019-12-07 09:29:16', 0, 0, 0, 1, 0);


ALTER TABLE `Assignments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `assignments_subjectid_foreign` (`SubjectId`),
  ADD KEY `assignments_classid_foreign` (`ClassId`);

ALTER TABLE `Classes`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `classes_coordinatorid_foreign` (`CoordinatorId`);

ALTER TABLE `Grades`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `grades_subjectid_foreign` (`SubjectId`),
  ADD KEY `grades_studentid_foreign` (`StudentId`);

ALTER TABLE `Students`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `students_ssn_unique` (`SSN`),
  ADD KEY `students_parent1_foreign` (`Parent1`),
  ADD KEY `students_parent2_foreign` (`Parent2`),
  ADD KEY `students_classid_foreign` (`ClassId`);

ALTER TABLE `Subjects`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `TeacherSubjectClassRelation`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `teachersubjectclassrelation_subjectid_classid_teacherid_unique` (`SubjectId`,`ClassId`,`TeacherId`),
  ADD KEY `teachersubjectclassrelation_classid_foreign` (`ClassId`),
  ADD KEY `teachersubjectclassrelation_teacherid_foreign` (`TeacherId`);

ALTER TABLE `Topics`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `topics_teachersubjectclassrelationid_foreign` (`TeacherSubjectClassRelationId`);

ALTER TABLE `Users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `users_ssn_unique` (`SSN`);


ALTER TABLE `Assignments`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `Classes`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

ALTER TABLE `Grades`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

ALTER TABLE `Subjects`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `TeacherSubjectClassRelation`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `Topics`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;


ALTER TABLE `Assignments`
  ADD CONSTRAINT `assignments_classid_foreign` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`ID`),
  ADD CONSTRAINT `assignments_subjectid_foreign` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`ID`);

ALTER TABLE `Classes`
  ADD CONSTRAINT `classes_coordinatorid_foreign` FOREIGN KEY (`CoordinatorId`) REFERENCES `Users` (`ID`);

ALTER TABLE `Grades`
  ADD CONSTRAINT `grades_studentid_foreign` FOREIGN KEY (`StudentId`) REFERENCES `Students` (`ID`),
  ADD CONSTRAINT `grades_subjectid_foreign` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`ID`);

ALTER TABLE `Students`
  ADD CONSTRAINT `students_classid_foreign` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`ID`),
  ADD CONSTRAINT `students_parent1_foreign` FOREIGN KEY (`Parent1`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `students_parent2_foreign` FOREIGN KEY (`Parent2`) REFERENCES `Users` (`ID`);

ALTER TABLE `TeacherSubjectClassRelation`
  ADD CONSTRAINT `teachersubjectclassrelation_classid_foreign` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`ID`),
  ADD CONSTRAINT `teachersubjectclassrelation_subjectid_foreign` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`ID`),
  ADD CONSTRAINT `teachersubjectclassrelation_teacherid_foreign` FOREIGN KEY (`TeacherId`) REFERENCES `Users` (`ID`);

ALTER TABLE `Topics`
  ADD CONSTRAINT `topics_teachersubjectclassrelationid_foreign` FOREIGN KEY (`TeacherSubjectClassRelationId`) REFERENCES `TeacherSubjectClassRelation` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
