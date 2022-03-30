-- MySQL dump 10.13  Distrib 8.0.28, for Linux (x86_64)
--
-- Host: localhost    Database: 20Vision
-- ------------------------------------------------------
-- Server version	8.0.28-0ubuntu0.20.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Component`
--

DROP TABLE IF EXISTS `Component`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Component` (
  `component_id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(21) NOT NULL,
  `header` varchar(100) NOT NULL,
  `body` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mission_id` int NOT NULL,
  `type` char(1) NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`component_id`),
  UNIQUE KEY `Paper_UN` (`uid`),
  KEY `Component_FK` (`mission_id`),
  CONSTRAINT `Component_FK` FOREIGN KEY (`mission_id`) REFERENCES `Mission` (`mission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Component`
--

LOCK TABLES `Component` WRITE;
/*!40000 ALTER TABLE `Component` DISABLE KEYS */;
INSERT INTO `Component` VALUES (2,'1648126772150B5I9VlCr','sadafsdaf','dsafdsafdsafdsafdsafdsfads f dsaf sda fdas fsda f asdf s\nda f\ndas f\nsda\n f\nsda \nf',16,'s',0,'2022-03-24 12:59:33'),(3,'1648141484588XfnupCBc','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam e',16,'p',0,'2022-03-24 17:04:46'),(4,'16482259509414tx22kqK','Patent Mercedes Benz','Mercedes-Benz ist eine eingetragene Handelsmarke für Automobile der Mercedes-Benz Group. Der Name entstand 1926 nach dem Zusammenschluss der Daimler-Motoren-Gesellschaft mit Benz & Cie. zur Daimler-Benz AG. 2016 wurden 2,08 Millionen Neufahrzeuge der Marke verkauft.',16,'r',0,'2022-03-25 16:32:32'),(5,'1648242596528MuzSyc1K','sdafdsfdasf','Planning a desired outcome is not only great for having a clear path and saving time but also to prevent you from heading towards a direction that was not intended. Prevent going the easy route and ending up somewhere you didn\'t want to go. It\'s like trying to score a goal in football with your eyes focusing the floor',16,'r',0,'2022-03-25 21:09:59'),(6,'1648242634993A24cqd1X','sdafdsaf','20Vision \'s purpose is to enhance our ability of asking the right questions of Life the Universe and Everything. For millennia people tried to forecast the weather, but without the proper knowledge and tools the question would be too brought and the answer a guess. Nowadays the question involves a lot of factors narrowing down possible answers. Thus creating a great foundation to enhance questioning, knowledge and develop is our vision.',16,'r',0,'2022-03-25 21:10:36'),(7,'1648242669454bfaQLQYT','Money','Money acts as a \"Fairness Machine\". It is q faceless medium that decides who has the right over a medium. It acts as a feedback loop. Those who for example who used a resouce and developed a product service or result woth the largest impact to resources spent ratio - will \"earn\" the most - aka will have more resources to decide further. This clearly is not working mamy times, otherwise we wouldn\'t question capitalism. ',16,'s',0,'2022-03-25 21:11:10'),(8,'16482427012962XkSciiW','Hellou','20Vision \'s purpose is to enhance our ability of asking the right questions of Life the Universe and Everything. For millennia people tried to forecast the weather, but without the proper knowledge and tools the question would be too brought and the answer a guess. Nowadays the question involves a lot of factors narrowing down possible answers. Thus creating a great foundation to enhance questioning, knowledge and develop is our vision.',16,'r',0,'2022-03-25 21:11:42'),(9,'1648325105276OGdtku2U','sdafdsafdsaf','dasfdasfsdaf',17,'p',0,'2022-03-26 20:05:06');
/*!40000 ALTER TABLE `Component` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ComponentConnection`
--

DROP TABLE IF EXISTS `ComponentConnection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ComponentConnection` (
  `component_connection_id` int NOT NULL AUTO_INCREMENT,
  `component_id` int NOT NULL,
  `child_component_id` int NOT NULL,
  `child_component_index` int NOT NULL,
  PRIMARY KEY (`component_connection_id`),
  UNIQUE KEY `ComponentConnection_UN` (`child_component_id`,`component_id`),
  KEY `ComponentConnection_FK` (`component_id`),
  CONSTRAINT `ComponentConnection_FK` FOREIGN KEY (`component_id`) REFERENCES `Component` (`component_id`) ON DELETE CASCADE,
  CONSTRAINT `ComponentConnection_FK_1` FOREIGN KEY (`child_component_id`) REFERENCES `Component` (`component_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ComponentConnection`
--

LOCK TABLES `ComponentConnection` WRITE;
/*!40000 ALTER TABLE `ComponentConnection` DISABLE KEYS */;
INSERT INTO `ComponentConnection` VALUES (1,2,3,0),(2,2,4,1),(3,2,5,2),(4,2,6,3),(5,2,7,4),(6,2,8,5);
/*!40000 ALTER TABLE `ComponentConnection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Following`
--

DROP TABLE IF EXISTS `Following`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Following` (
  `following_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `page_id` int NOT NULL,
  PRIMARY KEY (`following_id`),
  KEY `Following_FK_1` (`page_id`),
  KEY `Following_FK` (`user_id`),
  CONSTRAINT `Following_FK` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `Following_FK_1` FOREIGN KEY (`page_id`) REFERENCES `Page` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Following`
--

LOCK TABLES `Following` WRITE;
/*!40000 ALTER TABLE `Following` DISABLE KEYS */;
/*!40000 ALTER TABLE `Following` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ForumPost`
--

DROP TABLE IF EXISTS `ForumPost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ForumPost` (
  `forumpost_id` int NOT NULL AUTO_INCREMENT,
  `fp_uid` varchar(21) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `forumpost_parent_id` int NOT NULL,
  `left` int NOT NULL,
  `right` int NOT NULL,
  `depth` int NOT NULL,
  `message` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` int NOT NULL,
  `hex_color` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_token_impact_per_million` int NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`forumpost_id`),
  UNIQUE KEY `FP_UN` (`fp_uid`),
  KEY `Forum_Post_FK` (`user_id`) USING BTREE,
  KEY `Forum_Post_main` (`forumpost_parent_id`) USING BTREE,
  CONSTRAINT `Forum_Post_FK_copy` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ForumPost_FK` FOREIGN KEY (`forumpost_parent_id`) REFERENCES `ForumPost_Parent` (`forumpost_parent_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumPost`
--

LOCK TABLES `ForumPost` WRITE;
/*!40000 ALTER TABLE `ForumPost` DISABLE KEYS */;
/*!40000 ALTER TABLE `ForumPost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ForumPost_Like`
--

DROP TABLE IF EXISTS `ForumPost_Like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ForumPost_Like` (
  `forum_post_like_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `forumpost_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`forum_post_like_id`),
  UNIQUE KEY `ForumPost_Like_UN` (`user_id`,`forumpost_id`),
  KEY `ForumPost_Like_FK` (`forumpost_id`),
  CONSTRAINT `Forum_Post_Like_FK` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `ForumPost_Like_FK` FOREIGN KEY (`forumpost_id`) REFERENCES `ForumPost` (`forumpost_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumPost_Like`
--

LOCK TABLES `ForumPost_Like` WRITE;
/*!40000 ALTER TABLE `ForumPost_Like` DISABLE KEYS */;
/*!40000 ALTER TABLE `ForumPost_Like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ForumPost_Parent`
--

DROP TABLE IF EXISTS `ForumPost_Parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ForumPost_Parent` (
  `forumpost_parent_id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL,
  `parent_type` char(1) NOT NULL,
  PRIMARY KEY (`forumpost_parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumPost_Parent`
--

LOCK TABLES `ForumPost_Parent` WRITE;
/*!40000 ALTER TABLE `ForumPost_Parent` DISABLE KEYS */;
INSERT INTO `ForumPost_Parent` VALUES (14,253,'p'),(15,253,'p'),(16,253,'p'),(17,253,'p'),(18,253,'p'),(19,253,'p'),(20,253,'p'),(21,253,'p'),(22,253,'p'),(23,253,'p'),(24,253,'p'),(25,1,'t'),(26,1,'t'),(27,253,'p'),(28,253,'p');
/*!40000 ALTER TABLE `ForumPost_Parent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Forum_Swipe`
--

DROP TABLE IF EXISTS `Forum_Swipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Forum_Swipe` (
  `forumpostswipe_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `swiped_id` int NOT NULL,
  `type` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`forumpostswipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Forum_Swipe`
--

LOCK TABLES `Forum_Swipe` WRITE;
/*!40000 ALTER TABLE `Forum_Swipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `Forum_Swipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Mission`
--

DROP TABLE IF EXISTS `Mission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Mission` (
  `mission_id` int NOT NULL AUTO_INCREMENT,
  `page_id` int NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mission_id`),
  UNIQUE KEY `Mission_UN` (`title`,`page_id`),
  KEY `Mission_FK` (`page_id`),
  CONSTRAINT `Mission_FK` FOREIGN KEY (`page_id`) REFERENCES `Page` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mission`
--

LOCK TABLES `Mission` WRITE;
/*!40000 ALTER TABLE `Mission` DISABLE KEYS */;
INSERT INTO `Mission` VALUES (16,253,'Hello_World','asdfsdafsaf','2021-12-15 03:16:28'),(17,253,'d_saf_sdaf_dasf_sdaf_','fdasfdsaf asdf asd fsd a','2022-03-14 09:30:38');
/*!40000 ALTER TABLE `Mission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Page`
--

DROP TABLE IF EXISTS `Page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Page` (
  `page_id` int NOT NULL AUTO_INCREMENT,
  `page_icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pagename` varchar(50) NOT NULL,
  `unique_pagename` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `vision` varchar(500) NOT NULL,
  `token_mint_address` varchar(44) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`page_id`),
  UNIQUE KEY `Page_UN` (`unique_pagename`),
  UNIQUE KEY `Page_Pub_Key_UN` (`token_mint_address`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Page`
--

LOCK TABLES `Page` WRITE;
/*!40000 ALTER TABLE `Page` DISABLE KEYS */;
INSERT INTO `Page` VALUES (253,'70908e','20Vision','20vision','20Vision \'s purpose is to enhance manhood\'s ability of asking the right questions of \"Life the Universe and Everything\". To ask questions, we need Knowledge. To obtain Knowledge we need to Research. To Research, we need to Develop. To Develop we need to obtain Knowledge. To obtain Knowledge...','CtENBNHd5fz2u1TERoZZQ9wqoydxsXTbph5xTyy8LUva','2021-09-22 01:41:20'),(254,'dcb882','Something','something','Something else',NULL,'2021-10-02 06:41:23'),(255,'ac34c1','kkjhkj','kkjhkj','lkjlkjlkjlk',NULL,'2022-02-22 10:41:02');
/*!40000 ALTER TABLE `Page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PageUser`
--

DROP TABLE IF EXISTS `PageUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PageUser` (
  `page_user_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `page_id` int NOT NULL,
  `role` tinyint(1) DEFAULT NULL,
  `last_selected` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`page_user_id`),
  KEY `PageUser_FK_1` (`page_id`),
  KEY `PageUser_FK` (`user_id`),
  CONSTRAINT `PageUser_FK` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `PageUser_FK_1` FOREIGN KEY (`page_id`) REFERENCES `Page` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=252 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageUser`
--

LOCK TABLES `PageUser` WRITE;
/*!40000 ALTER TABLE `PageUser` DISABLE KEYS */;
INSERT INTO `PageUser` VALUES (249,69,253,1,'2021-09-22 01:41:20','2021-09-22 01:41:20'),(250,70,254,1,'2021-10-02 06:41:23','2021-10-02 06:41:23'),(251,69,255,1,'2022-02-22 10:41:03','2022-02-22 10:41:03');
/*!40000 ALTER TABLE `PageUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Topic`
--

DROP TABLE IF EXISTS `Topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Topic` (
  `topic_id` int NOT NULL AUTO_INCREMENT,
  `page_id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(280) NOT NULL,
  `threshold` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`topic_id`),
  KEY `Topics_FK` (`page_id`),
  CONSTRAINT `Topics_FK` FOREIGN KEY (`page_id`) REFERENCES `Page` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Topic`
--

LOCK TABLES `Topic` WRITE;
/*!40000 ALTER TABLE `Topic` DISABLE KEYS */;
INSERT INTO `Topic` VALUES (1,253,'safsadf','asdfasdf','0','2022-01-30 10:04:50'),(2,253,'asdfsdaf','sdafasdfasdf','0','2022-01-30 10:13:40'),(3,253,'asdfsda_fdasfdasfdsa f ads f sda f','sda f sdaf s daf sda  das asdfasdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd','651651651651511.6','2022-01-30 10:20:34'),(4,253,'sadfsdafsadf_ADFADF_DSA_FDSAF_D_SA_FA_DSF_DSA_SDA_FDSA_FDSA_ASD_FADS_FAS_FSDA_FSDA_FA_FDSA_FSDA_F_AS','sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasd','15615650.005111115','2022-01-30 10:37:01'),(5,253,'asf_sad_fdsa_fsad_fdas_','das fdsa f dasf sda  adsf','656165160.516165','2022-01-30 10:39:27'),(6,253,'Lunch_Break[Alarm_(at_home)_->_Cooking_->_Lunch]','It is all about taking breaks.','500','2022-02-01 20:40:47');
/*!40000 ALTER TABLE `Topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `public_key` varchar(44) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `profilePicture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `User_UN` (`username`),
  UNIQUE KEY `User_UN_P` (`public_key`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (69,'HBwQjmrR4eHYPGDE3aQD8DTwoVYVgtd22e19L75v1NGj','alexx','visionary_profile_picture/1638555669047/XVCGr0c1/','2021-09-20 17:13:45'),(70,'AaJT9wC5j2zk78MtTWngkP6n7gN7d4Rqw9AYezmWq1o8','alex',NULL,'2021-10-02 06:40:50'),(71,'CohZhJhnHkdutc7iktrrGVUX4oUM3VctSX7DybSzRN4f','aleedxx',NULL,'2021-10-20 13:34:45'),(72,'G1tUHWDaR1Jerzz9MdwPfxoXVMmwT6kU4DmncZmke5gb','alexxxxy',NULL,'2021-10-20 13:38:19');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_Session`
--

DROP TABLE IF EXISTS `User_Session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_Session` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ip_address` int unsigned NOT NULL,
  `device` varchar(100) DEFAULT NULL,
  `last_use` timestamp NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `User_Session_FK` (`user_id`),
  CONSTRAINT `User_Session_FK` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=320 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Session`
--

LOCK TABLES `User_Session` WRITE;
/*!40000 ALTER TABLE `User_Session` DISABLE KEYS */;
INSERT INTO `User_Session` VALUES (205,69,2130706433,NULL,'2021-09-20 17:13:45'),(206,69,2130706433,NULL,'2021-09-20 17:25:53'),(207,69,2130706433,NULL,'2021-09-21 22:27:43'),(208,69,2130706433,NULL,'2021-09-22 12:30:13'),(209,69,2130706433,NULL,'2021-09-24 19:13:19'),(210,69,2130706433,NULL,'2021-09-24 23:42:26'),(211,69,2130706433,NULL,'2021-09-25 14:22:01'),(212,69,2130706433,NULL,'2021-09-27 20:40:49'),(213,69,2130706433,NULL,'2021-09-28 20:46:28'),(214,69,2130706433,NULL,'2021-09-29 23:54:02'),(215,69,2130706433,NULL,'2021-09-30 18:06:20'),(216,69,2130706433,NULL,'2021-10-01 08:49:11'),(217,69,2130706433,NULL,'2021-10-01 10:09:11'),(218,69,2130706433,NULL,'2021-10-02 05:41:52'),(219,70,2130706433,NULL,'2021-10-02 06:40:51'),(220,69,2130706433,NULL,'2021-10-03 18:04:41'),(221,69,2130706433,NULL,'2021-10-04 08:00:13'),(222,69,2130706433,NULL,'2021-10-05 15:31:05'),(223,69,2130706433,NULL,'2021-10-07 04:42:47'),(224,69,2130706433,NULL,'2021-10-12 21:06:22'),(225,69,2130706433,NULL,'2021-10-13 01:24:41'),(226,69,2130706433,NULL,'2021-10-13 14:21:04'),(227,69,2130706433,NULL,'2021-10-19 07:01:00'),(228,69,2130706433,NULL,'2021-10-19 13:11:46'),(229,69,2130706433,NULL,'2021-10-20 10:19:53'),(230,69,2130706433,NULL,'2021-10-20 11:22:26'),(231,69,2130706433,NULL,'2021-10-20 12:47:43'),(232,71,2130706433,NULL,'2021-10-20 13:34:45'),(233,72,2130706433,NULL,'2021-10-20 13:38:19'),(234,69,2130706433,NULL,'2021-10-20 13:39:25'),(235,72,2130706433,NULL,'2021-10-23 08:48:15'),(236,69,2130706433,NULL,'2021-10-23 08:48:45'),(237,69,2130706433,NULL,'2021-10-25 15:44:14'),(238,69,2130706433,NULL,'2021-10-25 15:47:42'),(239,69,2130706433,NULL,'2021-10-25 15:50:01'),(240,69,2130706433,NULL,'2021-10-25 15:51:15'),(241,69,2130706433,NULL,'2021-10-25 15:51:24'),(242,69,2130706433,NULL,'2021-10-25 16:21:24'),(243,69,2130706433,NULL,'2021-10-25 16:36:48'),(244,69,2130706433,NULL,'2021-10-28 18:12:27'),(245,69,2130706433,NULL,'2021-10-28 23:16:34'),(246,69,2130706433,NULL,'2021-10-28 23:16:48'),(247,69,2130706433,NULL,'2021-10-29 14:03:41'),(248,69,2130706433,NULL,'2021-10-29 14:04:07'),(249,69,2130706433,NULL,'2021-10-30 16:35:25'),(250,69,2130706433,NULL,'2021-10-30 16:38:28'),(251,69,2130706433,NULL,'2021-10-30 16:41:19'),(252,69,2130706433,NULL,'2021-11-01 15:27:35'),(253,69,2130706433,NULL,'2021-11-01 15:27:50'),(254,69,2130706433,NULL,'2021-11-02 11:29:12'),(255,69,2130706433,NULL,'2021-11-03 12:21:54'),(256,69,2130706433,NULL,'2021-11-04 18:27:36'),(257,69,2130706433,NULL,'2021-11-04 18:29:20'),(258,69,2130706433,NULL,'2021-11-05 16:14:13'),(259,69,2130706433,NULL,'2021-11-08 17:48:44'),(260,69,2130706433,NULL,'2021-11-09 20:41:34'),(261,69,2130706433,NULL,'2021-11-12 14:38:27'),(262,69,2130706433,NULL,'2021-11-12 14:38:37'),(263,69,2130706433,NULL,'2021-11-12 15:41:51'),(264,69,2130706433,NULL,'2021-11-13 01:36:39'),(265,69,2130706433,NULL,'2021-11-13 01:36:50'),(266,69,2130706433,NULL,'2021-11-15 03:03:32'),(267,69,2130706433,NULL,'2021-11-15 03:05:12'),(268,69,2130706433,NULL,'2021-11-18 15:38:54'),(269,69,2130706433,NULL,'2021-11-18 15:39:06'),(270,69,2130706433,NULL,'2021-11-21 22:04:55'),(271,69,2130706433,NULL,'2021-11-21 22:08:02'),(272,69,2130706433,NULL,'2021-11-27 15:14:57'),(273,69,2130706433,NULL,'2021-11-28 17:20:27'),(274,69,2130706433,NULL,'2021-11-28 17:33:17'),(275,69,2130706433,NULL,'2021-12-01 17:52:08'),(276,69,2130706433,NULL,'2021-12-01 17:52:24'),(277,69,2130706433,NULL,'2021-12-02 14:21:10'),(278,69,2130706433,NULL,'2021-12-02 15:02:07'),(279,69,2130706433,NULL,'2021-12-03 17:15:27'),(280,69,2130706433,NULL,'2021-12-03 17:30:52'),(281,69,2130706433,NULL,'2021-12-03 17:31:03'),(282,69,2130706433,NULL,'2021-12-04 14:20:32'),(283,69,2130706433,NULL,'2021-12-04 14:21:11'),(284,69,2130706433,NULL,'2021-12-05 15:31:55'),(285,69,2130706433,NULL,'2021-12-06 19:34:17'),(286,69,2130706433,NULL,'2021-12-06 19:40:56'),(287,69,2130706433,NULL,'2021-12-06 23:20:52'),(288,69,2130706433,NULL,'2021-12-06 23:41:16'),(289,69,2130706433,NULL,'2021-12-06 23:55:20'),(290,69,2130706433,NULL,'2021-12-07 00:06:43'),(291,69,2130706433,NULL,'2021-12-10 20:21:15'),(292,69,2130706433,NULL,'2021-12-11 04:04:28'),(293,69,2130706433,NULL,'2021-12-11 04:05:20'),(294,69,2130706433,NULL,'2021-12-12 20:56:00'),(295,69,2130706433,NULL,'2021-12-13 02:53:18'),(296,69,2130706433,NULL,'2021-12-15 14:09:45'),(297,69,2130706433,NULL,'2021-12-17 16:23:11'),(298,69,2130706433,NULL,'2021-12-19 03:51:07'),(299,69,2130706433,NULL,'2021-12-19 19:05:25'),(300,69,2130706433,NULL,'2021-12-24 23:06:02'),(301,69,2130706433,NULL,'2022-01-11 13:42:43'),(302,69,2130706433,NULL,'2022-01-13 23:55:46'),(303,69,2130706433,NULL,'2022-01-18 14:42:57'),(304,69,2130706433,NULL,'2022-01-20 15:08:46'),(305,69,2130706433,NULL,'2022-01-24 12:10:00'),(306,69,2130706433,NULL,'2022-01-29 22:36:39'),(307,69,2130706433,NULL,'2022-02-01 16:50:08'),(308,69,2130706433,NULL,'2022-02-02 07:45:58'),(309,69,2130706433,NULL,'2022-02-04 09:31:05'),(310,69,2130706433,NULL,'2022-02-22 10:30:34'),(311,69,2130706433,NULL,'2022-02-24 20:40:32'),(312,69,2130706433,NULL,'2022-03-01 11:40:19'),(313,69,2130706433,NULL,'2022-03-06 16:54:30'),(314,69,2130706433,NULL,'2022-03-09 11:08:25'),(315,69,2130706433,NULL,'2022-03-10 09:28:29'),(316,69,2130706433,NULL,'2022-03-13 11:24:30'),(317,69,2130706433,NULL,'2022-03-15 12:24:21'),(318,69,2130706433,NULL,'2022-03-22 14:16:08'),(319,69,2130706433,NULL,'2022-03-27 16:33:23');
/*!40000 ALTER TABLE `User_Session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-30 21:23:07
