-- MySQL dump 10.13  Distrib 8.0.28, for macos12.2 (x86_64)
--
-- Host: localhost    Database: 20Vision
-- ------------------------------------------------------
-- Server version	8.0.28

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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Component`
--

LOCK TABLES `Component` WRITE;
/*!40000 ALTER TABLE `Component` DISABLE KEYS */;
INSERT INTO `Component` VALUES (23,'1651257513871SwLrKSuU','A Happy Life is not created by Happy Events','Would you enter a simulation where you could do whatever you want to do ? Probably not.\nA life of meaningful pain is more valuable than a life of meaningless pleasure. This also counts for tasks where you forget why you do them or run on autopilot.',18,'r',0,'2022-04-29 18:38:34'),(24,'1652799585038pUWmYYq4','Teamwork is interfering in individual efforts','It is well known that the larger a team gets, the less efficient it will become - \'Ringelmann effect\'. The most famous example is pulling a rope. Ringlemann found that having people work together on a task resulted in significantly less effort per person than when individuals acted by their own. Each person with its individual process is interfering another persons process leading to decreased motivation and a lack of coordination.',18,'r',0,'2022-05-17 14:59:46'),(26,'1652801907644ZLMVZCNz','Page','Pages are supposed to split the effort of individuals and prevent the inefficiency of teamwork. Efforts get reunited with common Visions, Missions and Components in an open source way.',18,'p',0,'2022-05-17 15:38:28'),(27,'1652802892334XkcvIHmC','Vision - Purpose, Cause or Belief','A Purpose, Cause or Belief is why you do what you do. A beyond-the-self goal. Doing things you belief in seems to be one of the keys towards a happy life. According to Simon Sinek\'s Model \"The Golden Circle\" it is how our brain works and why great leaders like Steve Jobs and Martin Luther King inspired so many. Purpose is one of the strongest bonds that connect and motivate people.',18,'r',0,'2022-05-17 15:54:53');
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
  CONSTRAINT `ComponentConnection_FK_1` FOREIGN KEY (`child_component_id`) REFERENCES `Component` (`component_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ComponentConnection`
--

LOCK TABLES `ComponentConnection` WRITE;
/*!40000 ALTER TABLE `ComponentConnection` DISABLE KEYS */;
INSERT INTO `ComponentConnection` VALUES (10,26,24,0),(11,27,23,0),(12,26,27,1);
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
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`forumpost_id`),
  UNIQUE KEY `FP_UN` (`fp_uid`),
  KEY `Forum_Post_FK` (`user_id`) USING BTREE,
  KEY `Forum_Post_main` (`forumpost_parent_id`) USING BTREE,
  CONSTRAINT `Forum_Post_FK_copy` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ForumPost_FK` FOREIGN KEY (`forumpost_parent_id`) REFERENCES `ForumPost_Parent` (`forumpost_parent_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumPost_Parent`
--

LOCK TABLES `ForumPost_Parent` WRITE;
/*!40000 ALTER TABLE `ForumPost_Parent` DISABLE KEYS */;
/*!40000 ALTER TABLE `ForumPost_Parent` ENABLE KEYS */;
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
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mission_id`),
  UNIQUE KEY `Mission_UN` (`title`,`page_id`),
  KEY `Mission_FK` (`page_id`),
  CONSTRAINT `Mission_FK` FOREIGN KEY (`page_id`) REFERENCES `Page` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mission`
--

LOCK TABLES `Mission` WRITE;
/*!40000 ALTER TABLE `Mission` DISABLE KEYS */;
INSERT INTO `Mission` VALUES (18,257,'Structuring_Efforts','Connecting People and their Efforts so common goals can be achieved better.','2022-04-18 11:54:53');
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
) ENGINE=InnoDB AUTO_INCREMENT=258 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Page`
--

LOCK TABLES `Page` WRITE;
/*!40000 ALTER TABLE `Page` DISABLE KEYS */;
INSERT INTO `Page` VALUES (257,'7dbef5','20Vision','20vision','20Vision\'s purpose is to improve our understanding of Life & the Universe in order to ask the right questions. We think that tools & continuous progress are the best way to do this. Tools like Language prevented us from reinventing the wheel upon generations. Computers, Medicine, AI, ... all have compounding effects on Humanity. But more important than exponential growth is growing in a fair manner. Physiological Needs, Safety, Belonging, Esteem and Self-Actualisation have to be prioritised.','AQE243iUqz6EcvbSWABYSf6mfEFEdPS3F8y8kY7YmtMz','2022-04-16 19:44:41');
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
  CONSTRAINT `PageUser_FK` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `PageUser_FK_1` FOREIGN KEY (`page_id`) REFERENCES `Page` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=254 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageUser`
--

LOCK TABLES `PageUser` WRITE;
/*!40000 ALTER TABLE `PageUser` DISABLE KEYS */;
INSERT INTO `PageUser` VALUES (253,69,257,1,'2022-04-16 19:44:41','2022-04-16 19:44:41');
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
INSERT INTO `User` VALUES (69,'HBwQjmrR4eHYPGDE3aQD8DTwoVYVgtd22e19L75v1NGj','alexx','visionary_profile_picture/1638555669047/XVCGr0c1/','2021-09-20 17:13:45');
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
) ENGINE=InnoDB AUTO_INCREMENT=326 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Session`
--

LOCK TABLES `User_Session` WRITE;
/*!40000 ALTER TABLE `User_Session` DISABLE KEYS */;
INSERT INTO `User_Session` VALUES (322,69,2130706433,NULL,'2022-04-16 17:54:29'),(323,69,2130706433,NULL,'2022-04-17 23:30:50'),(324,69,2130706433,NULL,'2022-04-20 22:24:27'),(325,69,2130706433,NULL,'2022-05-12 13:39:04');
/*!40000 ALTER TABLE `User_Session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserComponentSave`
--

DROP TABLE IF EXISTS `UserComponentSave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserComponentSave` (
  `usercomponentsave_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `component_id` int NOT NULL,
  `added` timestamp NOT NULL,
  PRIMARY KEY (`usercomponentsave_id`),
  UNIQUE KEY `UserComponentSave_UN` (`component_id`,`user_id`),
  KEY `UserComponentSave_FK_1` (`user_id`),
  CONSTRAINT `UserComponentSave_FK` FOREIGN KEY (`component_id`) REFERENCES `Component` (`component_id`) ON DELETE CASCADE,
  CONSTRAINT `UserComponentSave_FK_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserComponentSave`
--

LOCK TABLES `UserComponentSave` WRITE;
/*!40000 ALTER TABLE `UserComponentSave` DISABLE KEYS */;
INSERT INTO `UserComponentSave` VALUES (4,69,23,'2022-05-15 16:34:15'),(5,69,24,'2022-05-17 15:39:30'),(6,69,27,'2022-05-17 15:56:26');
/*!40000 ALTER TABLE `UserComponentSave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database '20Vision'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-17 18:22:46
