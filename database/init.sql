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
  `Title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `DueDate` datetime NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Assignments` (`ID`, `SubjectId`, `ClassId`, `Title`, `Description`, `DueDate`, `CreatedOn`) VALUES
(1, 1, 1, 'Geometry problems', 'Problems # 15 to 22 page 145', '2019-12-18 00:00:00', '2020-01-14 08:18:39'),
(2, 3, 1, 'Kinematics problems', 'Exercises 15 to 19 page 87', '2019-12-17 00:00:00', '2020-01-14 08:18:39'),
(3, 3, 1, 'Kinematics', 'Chapter 3, paragraphs 4 to 8', '2019-12-17 00:00:00', '2020-01-14 08:18:39');

CREATE TABLE `Assignment_File` (
  `ID` int(10) UNSIGNED NOT NULL,
  `AssignmentId` int(10) UNSIGNED NOT NULL,
  `FileId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ClassAttendance` (
  `ID` int(10) UNSIGNED NOT NULL,
  `ClassId` int(10) UNSIGNED NOT NULL,
  `Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `ClassAttendance` (`ID`, `ClassId`, `Date`) VALUES
(1, 1, '2019-12-10 00:00:00'),
(2, 1, '2019-12-11 00:00:00'),
(3, 1, '2019-12-12 00:00:00');

CREATE TABLE `Classes` (
  `ID` int(10) UNSIGNED NOT NULL,
  `CreationYear` int(4) UNSIGNED NOT NULL,
  `Name` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CoordinatorId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Classes` (`ID`, `CreationYear`, `Name`, `CoordinatorId`) VALUES
(1, 2019, 'A', '6e5c9976f5813e59816b40a814e29899'),
(2, 2019, 'B', '26ce21c0-8d32-41d1-8d07-b4994fa53edf'),
(3, 2019, 'C', 'd5799583-42e3-4818-a073-449fc8f1b7e8');

CREATE TABLE `Communications` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `IsImportant` tinyint(1) NOT NULL DEFAULT 0,
  `DueDate` datetime NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Communications` (`ID`, `Title`, `Description`, `IsImportant`, `DueDate`, `CreatedOn`) VALUES
(1, 'Communication 1', 'Lerem Ipsum', 0, '2019-12-18 00:00:00', '2020-01-14 08:18:39'),
(2, 'Communication 2', 'Lerem Ipsum', 0, '2019-12-15 00:00:00', '2020-01-14 08:18:39'),
(3, 'Communication 3', 'Lerem Ipsum', 1, '2019-12-25 00:00:00', '2020-01-14 08:18:39');

CREATE TABLE `Files` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Key` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Size` int(10) UNSIGNED NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Grades` (
  `ID` int(10) UNSIGNED NOT NULL,
  `SubjectId` int(10) UNSIGNED NOT NULL,
  `StudentId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Grade` decimal(10,2) NOT NULL,
  `GradeDate` datetime NOT NULL,
  `Type` enum('Written','Oral') COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Grades` (`ID`, `SubjectId`, `StudentId`, `Grade`, `GradeDate`, `Type`) VALUES
(1, 1, '868d6ec1dfc8467f6d260c48b5620543', '9.00', '2019-11-03 00:00:00', 'Written'),
(2, 1, '7460aba98f7291ee69fcfdd17274c3a1', '7.00', '2019-11-03 00:00:00', 'Oral'),
(3, 1, '266667153e975bbf735b89d4b03d9f93', '8.50', '2019-11-03 00:00:00', 'Written'),
(4, 7, '868d6ec1dfc8467f6d260c48b5620543', '10.00', '2019-10-29 00:00:00', 'Oral'),
(5, 7, '7460aba98f7291ee69fcfdd17274c3a1', '8.25', '2019-10-29 00:00:00', 'Written'),
(6, 7, '266667153e975bbf735b89d4b03d9f93', '6.75', '2019-10-29 00:00:00', 'Oral');

CREATE TABLE `Notes` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `StudentId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TeacherId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IsSeen` tinyint(1) NOT NULL DEFAULT 0,
  `Date` datetime NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Notes` (`ID`, `Title`, `Description`, `StudentId`, `TeacherId`, `IsSeen`, `Date`, `CreatedOn`) VALUES
(1, 'Noisy behaviour in the classroom', 'The student made noise while teaching', '266667153e975bbf735b89d4b03d9f93', '6e5c9976f5813e59816b40a814e29899', 0, '2019-12-18 00:00:00', '2020-01-14 08:18:39'),
(2, 'Exam cheating', 'The student has been seen while copying during the exam', '7460aba98f7291ee69fcfdd17274c3a1', '6e5c9976f5813e59816b40a814e29899', 0, '2019-12-20 00:00:00', '2020-01-14 08:18:39'),
(3, 'Inapropriate speech pattern', 'The student used offensive words against one other student', 'aa49b76d-0308-44ce-a111-dcf31fd7678c', '26ce21c0-8d32-41d1-8d07-b4994fa53edf', 0, '2019-11-18 00:00:00', '2020-01-14 08:18:39');

CREATE TABLE `StudentAttendance` (
  `ID` int(10) UNSIGNED NOT NULL,
  `StudentId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Date` datetime NOT NULL,
  `LateEntry` enum('1h','2h') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `EntryTeacherId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `EarlyExit` time DEFAULT NULL,
  `ExitTeacherId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `StudentAttendance` (`ID`, `StudentId`, `Date`, `LateEntry`, `EntryTeacherId`, `EarlyExit`, `ExitTeacherId`) VALUES
(1, '868d6ec1dfc8467f6d260c48b5620543', '2019-12-10 00:00:00', NULL, '26ce21c0-8d32-41d1-8d07-b4994fa53edf', NULL, NULL),
(2, '868d6ec1dfc8467f6d260c48b5620543', '2019-12-11 00:00:00', '2h', '6d361d43-1308-4ac6-95ab-580138de9141', NULL, NULL),
(3, '868d6ec1dfc8467f6d260c48b5620543', '2019-12-12 00:00:00', '1h', '6e5c9976f5813e59816b40a814e29899', '11:30:00', '26ce21c0-8d32-41d1-8d07-b4994fa53edf');

CREATE TABLE `Students` (
  `ID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FirstName` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LastName` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SSN` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `BirthDate` datetime NOT NULL,
  `Parent1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Parent2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ClassId` int(10) UNSIGNED DEFAULT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `Gender` enum('M','F') COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Students` (`ID`, `FirstName`, `LastName`, `SSN`, `BirthDate`, `Parent1`, `Parent2`, `ClassId`, `CreatedOn`, `Gender`) VALUES
('266667153e975bbf735b89d4b03d9f93', 'Sara', 'Lorenzini', 'LRNSRA05E59L219Q', '2005-05-19 00:00:00', '9d64fa59c91d9109b11cd9e05162c675', '202db8275d3c06e6ce3fe7a47b30e0fe', 1, '2020-01-14 08:18:39', 'F'),
('7460aba98f7291ee69fcfdd17274c3a1', 'Martina', 'Menzi', 'MNZMTN05H41L219C', '2005-06-01 00:00:00', '32d905eaa2770b66baf20282dff09191', NULL, 1, '2020-01-14 08:18:39', 'F'),
('7f32bd55-9222-4dde-9cf4-fb1edb5148cc', 'Giorgino', 'Di Giorgio', 'PVMVRY91A12L533C', '2005-02-11 00:00:00', '6d361d43-1308-4ac6-95ab-580138de9141', NULL, 2, '2020-01-14 08:18:39', 'M'),
('868d6ec1dfc8467f6d260c48b5620543', 'Gianluca', 'Menzi', 'MNZGLC05H01L219X', '2005-06-01 00:00:00', '32d905eaa2770b66baf20282dff09191', NULL, 1, '2020-01-14 08:18:39', 'M'),
('aa49b76d-0308-44ce-a111-dcf31fd7678c', 'Gioia', 'Di Gioia', 'YQUFNS90T41F804P', '2005-01-25 00:00:00', '9e412480-4287-4b62-a1ba-a8dcb03cdd41', NULL, 2, '2020-01-14 08:18:39', 'F');

CREATE TABLE `Subjects` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Subjects` (`ID`, `Name`) VALUES
(1, 'Mathematics'),
(2, 'Geography'),
(3, 'Physics'),
(4, 'History'),
(5, 'Physical Education'),
(6, 'Italian'),
(7, 'English');

CREATE TABLE `Support_Material` (
  `ID` int(10) UNSIGNED NOT NULL,
  `TeacherSubjectClassRelationId` int(10) UNSIGNED NOT NULL,
  `FileId` int(10) UNSIGNED NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `TeacherSubjectClassRelation` (
  `ID` int(10) UNSIGNED NOT NULL,
  `SubjectId` int(10) UNSIGNED NOT NULL,
  `ClassId` int(10) UNSIGNED NOT NULL,
  `TeacherId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `TeacherSubjectClassRelation` (`ID`, `SubjectId`, `ClassId`, `TeacherId`) VALUES
(1, 1, 1, '6e5c9976f5813e59816b40a814e29899'),
(2, 3, 1, '6e5c9976f5813e59816b40a814e29899');

CREATE TABLE `Timetable` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Day` enum('1','2','3','4','5') COLLATE utf8mb4_unicode_ci NOT NULL,
  `Hour` enum('8','9','10','11','12','13') COLLATE utf8mb4_unicode_ci NOT NULL,
  `SubjectId` int(10) UNSIGNED NOT NULL,
  `ClassId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Timetable` (`ID`, `Day`, `Hour`, `SubjectId`, `ClassId`) VALUES
(1, '1', '8', 1, 1),
(2, '1', '9', 2, 1),
(3, '1', '10', 3, 1),
(4, '1', '11', 4, 1),
(5, '1', '12', 5, 1),
(6, '1', '13', 6, 1),
(7, '2', '8', 1, 1),
(8, '2', '9', 2, 1),
(9, '2', '10', 3, 1),
(10, '2', '11', 4, 1),
(11, '2', '12', 5, 1),
(12, '3', '8', 1, 1),
(13, '3', '9', 2, 1),
(14, '3', '10', 3, 1),
(15, '3', '11', 4, 1),
(16, '3', '12', 5, 1),
(17, '4', '8', 1, 1),
(18, '4', '9', 2, 1),
(19, '4', '10', 3, 1),
(20, '4', '11', 4, 1),
(21, '4', '12', 5, 1),
(22, '4', '13', 6, 1),
(23, '5', '8', 1, 1),
(24, '5', '9', 2, 1),
(25, '5', '10', 3, 1),
(26, '5', '11', 4, 1),
(27, '5', '12', 5, 1),
(28, '5', '13', 6, 1),
(29, '1', '8', 1, 2),
(30, '1', '9', 2, 2),
(31, '1', '10', 3, 2),
(32, '1', '11', 4, 2),
(33, '1', '12', 5, 2),
(34, '1', '13', 6, 2),
(35, '2', '8', 1, 2),
(36, '2', '9', 2, 2),
(37, '2', '10', 3, 2),
(38, '2', '11', 4, 2),
(39, '2', '12', 5, 2),
(40, '3', '8', 1, 2),
(41, '3', '9', 2, 2),
(42, '3', '10', 3, 2),
(43, '3', '11', 4, 2),
(44, '3', '12', 5, 2),
(45, '4', '8', 1, 2),
(46, '4', '9', 2, 2),
(47, '4', '10', 3, 2),
(48, '4', '11', 4, 2),
(49, '4', '12', 5, 2),
(50, '4', '13', 6, 2),
(51, '5', '8', 1, 2),
(52, '5', '9', 2, 2),
(53, '5', '10', 3, 2),
(54, '5', '11', 4, 2),
(55, '5', '12', 5, 2),
(56, '5', '13', 6, 2),
(57, '1', '8', 1, 3),
(58, '1', '9', 2, 3),
(59, '1', '10', 3, 3),
(60, '1', '11', 4, 3),
(61, '1', '12', 5, 3),
(62, '1', '13', 6, 3),
(63, '2', '8', 1, 3),
(64, '2', '9', 2, 3),
(65, '2', '10', 3, 3),
(66, '2', '11', 4, 3),
(67, '2', '12', 5, 3),
(68, '3', '8', 1, 3),
(69, '3', '9', 2, 3),
(70, '3', '10', 3, 3),
(71, '3', '11', 4, 3),
(72, '3', '12', 5, 3),
(73, '4', '8', 1, 3),
(74, '4', '9', 2, 3),
(75, '4', '10', 3, 3),
(76, '4', '11', 4, 3),
(77, '4', '12', 5, 3),
(78, '4', '13', 6, 3),
(79, '5', '8', 1, 3),
(80, '5', '9', 2, 3),
(81, '5', '10', 3, 3),
(82, '5', '11', 4, 3),
(83, '5', '12', 5, 3),
(84, '5', '13', 6, 3);

CREATE TABLE `Topics` (
  `ID` int(10) UNSIGNED NOT NULL,
  `TeacherSubjectClassRelationId` int(10) UNSIGNED NOT NULL,
  `Title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `TopicDescription` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `TopicDate` datetime NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Topics` (`ID`, `TeacherSubjectClassRelationId`, `Title`, `TopicDescription`, `TopicDate`, `CreatedOn`) VALUES
(1, 1, 'Expressions', 'Part 1', '2019-10-07 00:00:00', '2020-01-14 08:18:39'),
(2, 1, 'Expressions', 'Part 2', '2019-10-14 00:00:00', '2020-01-14 08:18:39'),
(3, 1, 'Expressions', 'Part 3', '2019-10-21 00:00:00', '2020-01-14 08:18:39');

CREATE TABLE `Users` (
  `ID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eMail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FirstName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LastName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SSN` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `IsAdminOfficer` tinyint(1) NOT NULL DEFAULT 0,
  `IsSysAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `IsParent` tinyint(1) NOT NULL DEFAULT 0,
  `IsTeacher` tinyint(1) NOT NULL DEFAULT 0,
  `IsPrincipal` tinyint(1) NOT NULL DEFAULT 0,
  `IsNew` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Users` (`ID`, `eMail`, `Password`, `FirstName`, `LastName`, `SSN`, `CreatedOn`, `IsAdminOfficer`, `IsSysAdmin`, `IsParent`, `IsTeacher`, `IsPrincipal`, `IsNew`) VALUES
('202db8275d3c06e6ce3fe7a47b30e0fe', 'marco.lorenzini@gmail.com', '$2b$12$1ZvKlOaA5/lY5xgtbxoYPOlpxhJuP1mWrLYlQRJ45/Chn00sEKjiS', 'Marco', 'Lorenzini', 'LRNMRC76A02L219A', '2020-01-14 08:18:39', 0, 0, 1, 0, 0, 0),
('205db8275d3c06e6ce3fe7a47b30e0fe', 'admin@phonyschool.com', '$2b$12$.JEKDxiaZkjjsjjJ2LnysuTilI.NcxH1DtFoJeUTV0YQ3gNKXTVBa', 'Marta', 'Peradotto', 'PRDMRT71D51L219E', '2020-01-14 08:18:39', 1, 1, 0, 0, 0, 0),
('26ce21c0-8d32-41d1-8d07-b4994fa53edf', 'paola.depaola@phonyschool.com', '$2b$12$Gb3xdrarShcT1lmo0NiEke6J57jUAjzCYNVGp4vVl8ILdEeN2TpWa', 'Paola', 'De Paola', 'TXCRDF77T22B735U', '2020-01-14 08:18:39', 0, 0, 0, 1, 0, 0),
('32d905eaa2770b66baf20282dff09191', 'lucia.verdi@gmail.com', '$2b$12$ul/0Rs2XOI3y9vJsPnpLHOolqN7ykCZlGavfV3JXDqwkyV.5lQghS', 'Lucia', 'Verdi', 'VRDLCU75A41L219F', '2020-01-14 08:18:39', 0, 0, 1, 0, 0, 0),
('6d361d43-1308-4ac6-95ab-580138de9141', 'giorgio.digiorgio@parentsunited.com', '$2b$12$OSyDngwTePnIvvdEgvHFTumjEZsT1WOQpqEHCHM7XXwCpIg3iFKXC', 'Giorgio', 'Di Giorgio', 'PVDZRN27M04G189V', '2020-01-14 08:18:39', 0, 0, 1, 1, 0, 0),
('6e5c9976f5813e59816b40a814e29899', 'giulia.tesori@gmail.com', '$2b$12$4cWUlWLKlWU6TiGTDvnLzOnwVgIXpZnzC0t1H4Fjn69DoQIOZb3tq', 'Giulia', 'Tesori', 'TSRGLI74R52L219F', '2020-01-14 08:18:39', 0, 0, 0, 1, 0, 0),
('9d64fa59c91d9109b11cd9e05162c675', 'nadia.rossi@gmail.com', '$2b$12$Urj1v6G2J.L2tEJQswrIMObDvNP9UcmGcaOvIcMRbgDH50krblbEW', 'Nadia', 'Rossi', 'RSSNDA76A41L219U', '2020-01-14 08:18:39', 0, 0, 1, 0, 0, 0),
('9e412480-4287-4b62-a1ba-a8dcb03cdd41', 'maria.demaria@parentsunited.com', '$2b$12$KgMzXBGBs5xwrPnGPJdwoeBZKjJVexdPUqMHvTckn5NB.D6uKqyxK', 'Maria', 'De Maria', 'FGTHCF68M46G424G', '2020-01-14 08:18:39', 0, 0, 1, 0, 0, 0),
('d5799583-42e3-4818-a073-449fc8f1b7e8', 'luca.deluca@phonyschool.com', '$2b$12$U1nCM0VemVQSAG1OsmqdZe3mDow6Hi9YpW.5WzoZmwokZ4gyopulS', 'Luca', 'De Luca', 'WRVKBU59R17L237H', '2020-01-14 08:18:39', 0, 0, 0, 1, 0, 0);


ALTER TABLE `Assignments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `assignments_subjectid_foreign` (`SubjectId`),
  ADD KEY `assignments_classid_foreign` (`ClassId`);

ALTER TABLE `Assignment_File`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `assignment_file_assignmentid_foreign` (`AssignmentId`),
  ADD KEY `assignment_file_fileid_foreign` (`FileId`);

ALTER TABLE `ClassAttendance`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `classattendance_classid_date_unique` (`ClassId`,`Date`);

ALTER TABLE `Classes`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `classes_coordinatorid_foreign` (`CoordinatorId`);

ALTER TABLE `Communications`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `Files`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `Grades`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `grades_subjectid_foreign` (`SubjectId`),
  ADD KEY `grades_studentid_foreign` (`StudentId`);

ALTER TABLE `Notes`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `notes_studentid_foreign` (`StudentId`),
  ADD KEY `notes_teacherid_foreign` (`TeacherId`);

ALTER TABLE `StudentAttendance`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `studentattendance_studentid_date_unique` (`StudentId`,`Date`),
  ADD KEY `studentattendance_entryteacherid_foreign` (`EntryTeacherId`),
  ADD KEY `studentattendance_exitteacherid_foreign` (`ExitTeacherId`);

ALTER TABLE `Students`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `students_ssn_unique` (`SSN`),
  ADD KEY `students_parent1_foreign` (`Parent1`),
  ADD KEY `students_parent2_foreign` (`Parent2`),
  ADD KEY `students_classid_foreign` (`ClassId`);

ALTER TABLE `Subjects`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `Support_Material`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `support_material_teachersubjectclassrelationid_foreign` (`TeacherSubjectClassRelationId`),
  ADD KEY `support_material_fileid_foreign` (`FileId`);

ALTER TABLE `TeacherSubjectClassRelation`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `teachersubjectclassrelation_subjectid_classid_teacherid_unique` (`SubjectId`,`ClassId`,`TeacherId`),
  ADD UNIQUE KEY `teachersubjectclassrelation_subjectid_classid_unique` (`SubjectId`,`ClassId`),
  ADD KEY `teachersubjectclassrelation_classid_foreign` (`ClassId`),
  ADD KEY `teachersubjectclassrelation_teacherid_foreign` (`TeacherId`);

ALTER TABLE `Timetable`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `timetable_day_hour_classid_unique` (`Day`,`Hour`,`ClassId`),
  ADD KEY `timetable_subjectid_foreign` (`SubjectId`),
  ADD KEY `timetable_classid_foreign` (`ClassId`);

ALTER TABLE `Topics`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `topics_teachersubjectclassrelationid_foreign` (`TeacherSubjectClassRelationId`);

ALTER TABLE `Users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `users_ssn_unique` (`SSN`);


ALTER TABLE `Assignments`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `Assignment_File`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `ClassAttendance`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `Classes`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `Communications`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `Files`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `Grades`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `Notes`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `StudentAttendance`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `Subjects`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `Support_Material`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `TeacherSubjectClassRelation`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `Timetable`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

ALTER TABLE `Topics`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;


ALTER TABLE `Assignments`
  ADD CONSTRAINT `assignments_classid_foreign` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`ID`),
  ADD CONSTRAINT `assignments_subjectid_foreign` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`ID`);

ALTER TABLE `Assignment_File`
  ADD CONSTRAINT `assignment_file_assignmentid_foreign` FOREIGN KEY (`AssignmentId`) REFERENCES `Assignments` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignment_file_fileid_foreign` FOREIGN KEY (`FileId`) REFERENCES `Files` (`ID`) ON DELETE CASCADE;

ALTER TABLE `ClassAttendance`
  ADD CONSTRAINT `classattendance_classid_foreign` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`ID`);

ALTER TABLE `Classes`
  ADD CONSTRAINT `classes_coordinatorid_foreign` FOREIGN KEY (`CoordinatorId`) REFERENCES `Users` (`ID`);

ALTER TABLE `Grades`
  ADD CONSTRAINT `grades_studentid_foreign` FOREIGN KEY (`StudentId`) REFERENCES `Students` (`ID`),
  ADD CONSTRAINT `grades_subjectid_foreign` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`ID`);

ALTER TABLE `Notes`
  ADD CONSTRAINT `notes_studentid_foreign` FOREIGN KEY (`StudentId`) REFERENCES `Students` (`ID`),
  ADD CONSTRAINT `notes_teacherid_foreign` FOREIGN KEY (`TeacherId`) REFERENCES `Users` (`ID`);

ALTER TABLE `StudentAttendance`
  ADD CONSTRAINT `studentattendance_entryteacherid_foreign` FOREIGN KEY (`EntryTeacherId`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `studentattendance_exitteacherid_foreign` FOREIGN KEY (`ExitTeacherId`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `studentattendance_studentid_foreign` FOREIGN KEY (`StudentId`) REFERENCES `Students` (`ID`);

ALTER TABLE `Students`
  ADD CONSTRAINT `students_classid_foreign` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`ID`),
  ADD CONSTRAINT `students_parent1_foreign` FOREIGN KEY (`Parent1`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `students_parent2_foreign` FOREIGN KEY (`Parent2`) REFERENCES `Users` (`ID`);

ALTER TABLE `Support_Material`
  ADD CONSTRAINT `support_material_fileid_foreign` FOREIGN KEY (`FileId`) REFERENCES `Files` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `support_material_teachersubjectclassrelationid_foreign` FOREIGN KEY (`TeacherSubjectClassRelationId`) REFERENCES `TeacherSubjectClassRelation` (`ID`);

ALTER TABLE `TeacherSubjectClassRelation`
  ADD CONSTRAINT `teachersubjectclassrelation_classid_foreign` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`ID`),
  ADD CONSTRAINT `teachersubjectclassrelation_subjectid_foreign` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`ID`),
  ADD CONSTRAINT `teachersubjectclassrelation_teacherid_foreign` FOREIGN KEY (`TeacherId`) REFERENCES `Users` (`ID`);

ALTER TABLE `Timetable`
  ADD CONSTRAINT `timetable_classid_foreign` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`ID`),
  ADD CONSTRAINT `timetable_subjectid_foreign` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`ID`);

ALTER TABLE `Topics`
  ADD CONSTRAINT `topics_teachersubjectclassrelationid_foreign` FOREIGN KEY (`TeacherSubjectClassRelationId`) REFERENCES `TeacherSubjectClassRelation` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
