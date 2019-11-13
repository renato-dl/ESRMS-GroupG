-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Nov 07, 2019 alle 17:33
-- Versione del server: 10.3.15-MariaDB
-- Versione PHP: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ESRMS`
--
CREATE DATABASE IF NOT EXISTS `ESRMS` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `ESRMS`;

-- --------------------------------------------------------

--
-- Struttura della tabella `Classes`
--

CREATE TABLE `Classes` (
  `ID` int(11) NOT NULL,
  `CreationYear` year(4) NOT NULL,
  `Name` varchar(1) NOT NULL,
  `CoordinatorId` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `Grades`
--

CREATE TABLE `Grades` (
  `ID` int(11) NOT NULL,
  `SubjectId` int(11) NOT NULL,
  `StudentId` varchar(50) NOT NULL,
  `Grade` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `Parents`
--

CREATE TABLE `Parents` (
  `ID` varchar(50) NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `LastName` varchar(30) NOT NULL,
  `eMail` varchar(30) NOT NULL,
  `SSN` varchar(16) NOT NULL,
  `CreatedOn` varchar(20) NOT NULL,
  `Password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `Students`
--

CREATE TABLE `Students` (
  `ID` varchar(50) NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `LastName` varchar(30) NOT NULL,
  `SSN` varchar(16) NOT NULL,
  `CreatedOn` varchar(20) NOT NULL,
  `BirthDate` date NOT NULL,
  `Parent1` varchar(50) NOT NULL,
  `Parent2` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `Subjects`
--

CREATE TABLE `Subjects` (
  `ID` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `Teachers`
--

CREATE TABLE `Teachers` (
  `ID` varchar(50) NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `LastName` varchar(30) NOT NULL,
  `eMail` varchar(30) NOT NULL,
  `SSN` varchar(16) NOT NULL,
  `CreatedOn` varchar(20) NOT NULL,
  `Password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `TeacherSubjectClassRelation`
--

CREATE TABLE `TeacherSubjectClassRelation` (
  `SubjectId` int(11) NOT NULL,
  `TeacherId` varchar(50) NOT NULL,
  `ClassId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `Classes`
--
ALTER TABLE `Classes`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CoordinatorId` (`CoordinatorId`);

--
-- Indici per le tabelle `Grades`
--
ALTER TABLE `Grades`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `SubjectId` (`SubjectId`) USING BTREE,
  ADD KEY `StudentId` (`StudentId`) USING BTREE;

--
-- Indici per le tabelle `Parents`
--
ALTER TABLE `Parents`
  ADD PRIMARY KEY (`ID`);

--
-- Indici per le tabelle `Students`
--
ALTER TABLE `Students`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Parent1` (`Parent1`) USING BTREE,
  ADD KEY `Parent2` (`Parent2`) USING BTREE;

--
-- Indici per le tabelle `Subjects`
--
ALTER TABLE `Subjects`
  ADD PRIMARY KEY (`ID`);

--
-- Indici per le tabelle `Teachers`
--
ALTER TABLE `Teachers`
  ADD PRIMARY KEY (`ID`);

--
-- Indici per le tabelle `TeacherSubjectClassRelation`
--
ALTER TABLE `TeacherSubjectClassRelation`
  ADD PRIMARY KEY (`SubjectId`,`TeacherId`,`ClassId`),
  ADD KEY `ClassId` (`ClassId`),
  ADD KEY `TeacherId` (`TeacherId`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `Classes`
--
ALTER TABLE `Classes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `Grades`
--
ALTER TABLE `Grades`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `Subjects`
--
ALTER TABLE `Subjects`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `Classes`
--
ALTER TABLE `Classes`
  ADD CONSTRAINT `Classes_ibfk_1` FOREIGN KEY (`CoordinatorId`) REFERENCES `Teachers` (`ID`);

--
-- Limiti per la tabella `Grades`
--
ALTER TABLE `Grades`
  ADD CONSTRAINT `Grades_ibfk_1` FOREIGN KEY (`StudentId`) REFERENCES `Students` (`ID`),
  ADD CONSTRAINT `Grades_ibfk_2` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`ID`);

--
-- Limiti per la tabella `Students`
--
ALTER TABLE `Students`
  ADD CONSTRAINT `Students_ibfk_1` FOREIGN KEY (`Parent1`) REFERENCES `Parents` (`ID`),
  ADD CONSTRAINT `Students_ibfk_2` FOREIGN KEY (`Parent2`) REFERENCES `Parents` (`ID`);

--
-- Limiti per la tabella `TeacherSubjectClassRelation`
--
ALTER TABLE `TeacherSubjectClassRelation`
  ADD CONSTRAINT `TeacherSubjectClassRelation_ibfk_1` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`ID`),
  ADD CONSTRAINT `TeacherSubjectClassRelation_ibfk_2` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`ID`),
  ADD CONSTRAINT `TeacherSubjectClassRelation_ibfk_3` FOREIGN KEY (`TeacherId`) REFERENCES `Teachers` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
