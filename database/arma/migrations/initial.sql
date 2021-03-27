-- --------------------------------------------------------
-- Host:                         185.38.151.28
-- Server version:               10.1.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win32
-- HeidiSQL Version:             10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for altislife_v2
CREATE DATABASE IF NOT EXISTS `altislife_v2` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `altislife_v2`;

-- Dumping structure for table altislife_v2.cartel_captures
CREATE TABLE IF NOT EXISTS `cartel_captures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gangID` int(11) NOT NULL,
  `cartel` varchar(50) NOT NULL,
  `insert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.deathgear
CREATE TABLE IF NOT EXISTS `deathgear` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerid` varchar(32) NOT NULL,
  `side` text NOT NULL,
  `gear` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=953 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for procedure altislife_v2.deleteDeadVehicles
DELIMITER //
//
DELIMITER ;

-- Dumping structure for procedure altislife_v2.deleteOldGangs
DELIMITER //
//
DELIMITER ;

-- Dumping structure for procedure altislife_v2.deleteOldHouses
DELIMITER //
//
DELIMITER ;

-- Dumping structure for procedure altislife_v2.deleteOldRanks
DELIMITER //
CREATE DEFINER=`phxscarso`@`%` PROCEDURE `deleteOldRanks`()
BEGIN
DELETE FROM `phxranks` WHERE `active` = 0;
END//
DELIMITER ;

-- Dumping structure for procedure altislife_v2.deleteOldWanted
DELIMITER //
//
DELIMITER ;

-- Dumping structure for procedure altislife_v2.deletePollData
DELIMITER //
//
DELIMITER ;

-- Dumping structure for table altislife_v2.dispute
CREATE TABLE IF NOT EXISTS `dispute` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `sendername` varchar(50) NOT NULL,
  `senderuid` varchar(17) NOT NULL,
  `receivername` varchar(50) NOT NULL,
  `receiveruid` varchar(17) NOT NULL,
  `reason` text NOT NULL,
  `insert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.gangs
CREATE TABLE IF NOT EXISTS `gangs` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `owner` varchar(32) DEFAULT NULL,
  `type` varchar(32) DEFAULT 'Unknown',
  `name` varchar(32) DEFAULT NULL,
  `tag` varchar(6) DEFAULT NULL,
  `maxmembers` int(3) DEFAULT '8',
  `bank` int(100) DEFAULT '0',
  `active` tinyint(1) DEFAULT '1',
  `insert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9540 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.infocars
CREATE TABLE IF NOT EXISTS `infocars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classname` varchar(50) NOT NULL,
  `buyPrice` int(100) DEFAULT NULL,
  `sellPrice` int(100) DEFAULT NULL,
  `storage` int(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxalliances
CREATE TABLE IF NOT EXISTS `phxalliances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gangID` int(11) NOT NULL,
  `allyID` int(11) NOT NULL,
  `active` int(11) NOT NULL DEFAULT '1',
  `ally_since` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxbasebids
CREATE TABLE IF NOT EXISTS `phxbasebids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gangID` int(11) NOT NULL DEFAULT '-1',
  `bid` int(11) NOT NULL DEFAULT '0',
  `base` varchar(50) NOT NULL,
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxcars
CREATE TABLE IF NOT EXISTS `phxcars` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `side` varchar(16) NOT NULL,
  `classname` varchar(64) NOT NULL,
  `type` varchar(16) NOT NULL,
  `pid` varchar(17) NOT NULL,
  `alive` tinyint(1) NOT NULL DEFAULT '1',
  `blacklist` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `plate` varchar(50) NOT NULL,
  `color` int(20) NOT NULL,
  `RGB` varchar(50) NOT NULL DEFAULT '"[]"',
  `inventory` text NOT NULL,
  `gear` text NOT NULL,
  `fuel` double NOT NULL DEFAULT '1',
  `damage` varchar(256) NOT NULL,
  `dead` tinyint(1) NOT NULL DEFAULT '0',
  `insert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `side` (`side`),
  KEY `pid` (`pid`),
  KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=76545 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxcategories
CREATE TABLE IF NOT EXISTS `phxcategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `houseid` int(11) NOT NULL,
  `categoryid` int(11) NOT NULL DEFAULT '0',
  `name` varchar(14) NOT NULL DEFAULT 'Category',
  `iconid` int(11) NOT NULL DEFAULT '1',
  `storage` text NOT NULL,
  `old` int(11) NOT NULL DEFAULT '0',
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2272 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxclients
CREATE TABLE IF NOT EXISTS `phxclients` (
  `uid` int(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `aliases` text NOT NULL,
  `playerid` varchar(17) NOT NULL,
  `gangid` varchar(64) NOT NULL DEFAULT '-1',
  `cardid` varchar(64) NOT NULL DEFAULT '-1',
  `cash` int(100) NOT NULL DEFAULT '0',
  `bankacc` int(100) NOT NULL DEFAULT '0',
  `ganglevel` int(11) NOT NULL DEFAULT '0',
  `adminlevel` enum('0','1','2','3','4','5') NOT NULL DEFAULT '0',
  `coplevel` enum('0','1','2','3','4','5','6','7','8','9','10','11','12','13') NOT NULL DEFAULT '0',
  `havoclevel` enum('0','1','2','3','4','5','6','7','8','9','10','11','12','13') NOT NULL DEFAULT '0',
  `mediclevel` enum('0','1','2','3','4','5','6','7','8','9','10','11','12','13') NOT NULL DEFAULT '0',
  `npaslevel` enum('0','1','2','3','4') NOT NULL DEFAULT '0',
  `tpulevel` enum('0','1','2','3','4') NOT NULL DEFAULT '0',
  `ctulevel` enum('0','1','2','3','4') NOT NULL DEFAULT '0',
  `mi5level` enum('0','1','2','3','4','5') NOT NULL DEFAULT '0',
  `academylevel` enum('0','1','2','3','4') NOT NULL DEFAULT '0',
  `hadlevel` enum('0','1','2','3','4') NOT NULL DEFAULT '0',
  `hsflevel` enum('0','1','2','3','4') NOT NULL DEFAULT '0',
  `hmulevel` enum('0','1','2','3','4') NOT NULL DEFAULT '0',
  `hsslevel` enum('0','1','2','3','4') NOT NULL DEFAULT '0',
  `sarlevel` enum('0','1','2','3','4','5') NOT NULL DEFAULT '0',
  `donatorLevel` int(11) NOT NULL DEFAULT '0',
  `prestigeLevel` int(11) NOT NULL DEFAULT '0',
  `isSO1` int(11) NOT NULL DEFAULT '0',
  `civ_licenses` text NOT NULL,
  `cop_licenses` text NOT NULL,
  `med_licenses` text NOT NULL,
  `hav_licenses` text NOT NULL,
  `civ_professions` text NOT NULL,
  `cop_professions` text NOT NULL,
  `med_professions` text NOT NULL,
  `hav_professions` text NOT NULL,
  `civ_gear` text NOT NULL,
  `cop_gear` text NOT NULL,
  `med_gear` text NOT NULL,
  `hav_gear` text NOT NULL,
  `mi5_gear` text NOT NULL,
  `hss_gear` text NOT NULL,
  `new_gear` text NOT NULL,
  `law_gear` text NOT NULL,
  `tax_gear` text NOT NULL,
  `ser_gear` text NOT NULL,
  `so1_gear` text NOT NULL,
  `civ_stats` varchar(32) NOT NULL DEFAULT '"[100,100,0]"',
  `cop_stats` varchar(32) NOT NULL DEFAULT '"[100,100,0]"',
  `med_stats` varchar(32) NOT NULL DEFAULT '"[100,100,0]"',
  `hav_stats` varchar(32) NOT NULL DEFAULT '"[100,100,0]"',
  `cop_perks` text NOT NULL,
  `med_perks` text NOT NULL,
  `civ_perks` text NOT NULL,
  `hav_perks` text NOT NULL,
  `achievements` text NOT NULL,
  `level` int(11) NOT NULL DEFAULT '1',
  `xp` int(11) NOT NULL DEFAULT '0',
  `arrested` tinyint(1) NOT NULL DEFAULT '0',
  `jail_time` int(11) NOT NULL DEFAULT '0',
  `hav_arrested` tinyint(1) NOT NULL DEFAULT '0',
  `hav_jail_time` int(11) NOT NULL DEFAULT '0',
  `blacklist` tinyint(1) NOT NULL DEFAULT '0',
  `hav_blacklist` tinyint(1) NOT NULL DEFAULT '0',
  `loy_days` int(11) NOT NULL DEFAULT '0',
  `loy_rewards` text NOT NULL,
  `loy_last` date NOT NULL,
  `last_seen` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastcopseen` timestamp NULL DEFAULT NULL,
  `lastnhsseen` timestamp NULL DEFAULT NULL,
  `lasthavocseen` timestamp NULL DEFAULT NULL,
  `lastcivseen` timestamp NULL DEFAULT NULL,
  `playtime` varchar(32) NOT NULL DEFAULT '"[0,0,0,0,0,0]"',
  `insert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `pid` (`playerid`),
  KEY `name` (`name`),
  KEY `blacklist` (`blacklist`)
) ENGINE=InnoDB AUTO_INCREMENT=54045 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxhouses
CREATE TABLE IF NOT EXISTS `phxhouses` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `pid` varchar(17) NOT NULL,
  `pos` varchar(64) DEFAULT NULL,
  `owned` tinyint(1) DEFAULT '0',
  `garage` tinyint(1) NOT NULL DEFAULT '0',
  `gang` tinyint(1) NOT NULL DEFAULT '0',
  `world` varchar(18) NOT NULL DEFAULT 'Altis',
  `insert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=7465 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxids
CREATE TABLE IF NOT EXISTS `phxids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerid` varchar(64) NOT NULL,
  `uid` int(12) NOT NULL,
  `realname` varchar(128) NOT NULL,
  `age` int(3) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `ethnicity` varchar(50) NOT NULL,
  `isFake` int(11) NOT NULL DEFAULT '0',
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxoptions
CREATE TABLE IF NOT EXISTS `phxoptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pollID` int(11) NOT NULL DEFAULT '-1',
  `name` varchar(50) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `description` varchar(64) NOT NULL,
  `delete` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxpolls
CREATE TABLE IF NOT EXISTS `phxpolls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL DEFAULT 'General Election',
  `type` varchar(50) NOT NULL DEFAULT 'general_election',
  `description` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `repeat` int(11) NOT NULL DEFAULT '0',
  `isPolling` int(11) NOT NULL DEFAULT '0',
  `isCompleted` int(11) NOT NULL DEFAULT '0',
  `noVotes` int(11) NOT NULL DEFAULT '0',
  `noOptions` int(11) NOT NULL DEFAULT '0',
  `delete` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxranks
CREATE TABLE IF NOT EXISTS `phxranks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gangID` int(11) NOT NULL,
  `name` varchar(16) NOT NULL,
  `level` int(11) NOT NULL DEFAULT '0',
  `isLeader` int(11) NOT NULL,
  `invite` int(11) NOT NULL DEFAULT '0',
  `kick` int(11) NOT NULL DEFAULT '0',
  `promote` int(11) NOT NULL DEFAULT '0',
  `upgrade` int(11) NOT NULL DEFAULT '0',
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=304 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxresults
CREATE TABLE IF NOT EXISTS `phxresults` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pollID` int(11) NOT NULL DEFAULT '-1',
  `results` text NOT NULL,
  `insert_time` date NOT NULL,
  `delete` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.phxvotes
CREATE TABLE IF NOT EXISTS `phxvotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pollID` int(11) NOT NULL DEFAULT '-1',
  `optionID` int(11) NOT NULL DEFAULT '-1',
  `uid` varchar(50) NOT NULL,
  `delete` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for procedure altislife_v2.resetLifeVehicles
DELIMITER //
//
DELIMITER ;

-- Dumping structure for procedure altislife_v2.resetSettings
DELIMITER //
CREATE DEFINER=`phxscarso`@`%` PROCEDURE `resetSettings`()
BEGIN
 UPDATE serversettings SET restart = restart - 1 WHERE restart > '0' AND `name` <> 'last_governor';
END//
DELIMITER ;

-- Dumping structure for table altislife_v2.serversettings
CREATE TABLE IF NOT EXISTS `serversettings` (
  `name` varchar(50) NOT NULL,
  `value` varchar(100) NOT NULL DEFAULT '0',
  `array` text NOT NULL,
  `restart` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table altislife_v2.wanted
CREATE TABLE IF NOT EXISTS `wanted` (
  `wantedID` varchar(64) NOT NULL,
  `wantedName` varchar(32) NOT NULL,
  `wantedCrimes` text NOT NULL,
  `wantedBounty` int(100) NOT NULL,
  `removeWanted` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `insert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wantedID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;