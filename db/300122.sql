-- MySQL dump 10.13  Distrib 8.0.27, for Linux (x86_64)
--
-- Host: localhost    Database: 20Vision
-- ------------------------------------------------------
-- Server version	8.0.27-0ubuntu0.20.04.1

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
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL,
  `parent_type` tinyint(1) NOT NULL,
  `comment_category_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `from_version_id` int NOT NULL,
  `to_version_id` int NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `Comment_FK` (`comment_category_id`),
  KEY `Comment_FK_1` (`from_version_id`),
  KEY `Comment_FK_2` (`to_version_id`),
  KEY `Comment_FK_3` (`user_id`),
  CONSTRAINT `Comment_FK` FOREIGN KEY (`comment_category_id`) REFERENCES `Comment_Category` (`comment_category_id`),
  CONSTRAINT `Comment_FK_1` FOREIGN KEY (`from_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE,
  CONSTRAINT `Comment_FK_2` FOREIGN KEY (`to_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE,
  CONSTRAINT `Comment_FK_3` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment_Category`
--

DROP TABLE IF EXISTS `Comment_Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment_Category` (
  `comment_category_id` int NOT NULL AUTO_INCREMENT,
  `page_id` int NOT NULL,
  `title` varchar(70) NOT NULL,
  `color` varchar(6) NOT NULL,
  PRIMARY KEY (`comment_category_id`),
  KEY `Comment_Category_FK` (`page_id`),
  CONSTRAINT `Comment_Category_FK` FOREIGN KEY (`page_id`) REFERENCES `Page` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment_Category`
--

LOCK TABLES `Comment_Category` WRITE;
/*!40000 ALTER TABLE `Comment_Category` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment_Category` ENABLE KEYS */;
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
  KEY `Forum_Post_FK` (`user_id`) USING BTREE,
  KEY `Forum_Post_main` (`forumpost_parent_id`) USING BTREE,
  CONSTRAINT `Forum_Post_FK_copy` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ForumPost_FK` FOREIGN KEY (`forumpost_parent_id`) REFERENCES `ForumPost_Parent` (`forumpost_parent_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumPost`
--

LOCK TABLES `ForumPost` WRITE;
/*!40000 ALTER TABLE `ForumPost` DISABLE KEYS */;
INSERT INTO `ForumPost` VALUES (36,14,0,55,0,'asdfsdaf',69,'e4faff',0,'2022-01-02 14:28:09'),(37,14,1,40,1,'asdfdasfasdf',69,'e4faff',999992421,'2022-01-02 14:28:16'),(38,14,2,31,2,'sadfasfdsaf',69,'ffcece',999992421,'2022-01-02 14:28:21'),(39,14,3,28,3,'asdfasdf',69,'edd9ff',999992421,'2022-01-02 14:28:28'),(40,14,41,48,1,'asdfasdf',69,'fbcfa8',999992421,'2022-01-02 14:28:32'),(41,15,0,1,0,'adsfasdf',69,'ffcece',0,'2022-01-02 14:28:36'),(42,16,0,3,0,'sdafsadfafdsaf',69,'e5fff9',0,'2022-01-03 19:44:21'),(43,17,0,1,0,'sadfdasf',69,'ffcece',0,'2022-01-03 23:13:36'),(44,18,0,1,0,'safasdfsdaf',69,'fff8d1',0,'2022-01-12 18:05:28'),(45,19,0,1,0,'Hellouuuu',69,'edd9ff',0,'2022-01-12 18:15:48'),(46,20,0,1,0,'OKKKKKK',69,'fbcfa8',0,'2022-01-12 18:16:16'),(47,14,42,45,2,'OKKASF',69,'fbe4a0',999992421,'2022-01-12 18:22:41'),(48,14,32,37,2,'Hello',69,'edd9ff',999992421,'2022-01-13 12:44:41'),(49,14,49,50,1,'sadfsdaf',69,'fff8d1',999992421,'2022-01-13 14:30:38'),(50,14,51,52,1,'sdafsdaaa',69,'ffcece',999992421,'2022-01-13 15:22:19'),(51,14,46,47,2,'safadsfsdaf',69,'fff8d1',999992421,'2022-01-13 15:26:22'),(52,14,4,19,4,'HEyyyyy',69,'fff8d1',999992421,'2022-01-13 15:28:07'),(53,14,20,23,4,'safdsafdsa',69,'e5fff9',999992421,'2022-01-13 15:28:23'),(54,14,21,22,5,'asfdsafsdaf',69,'edd9ff',999992421,'2022-01-13 15:28:32'),(55,14,33,36,3,'sadfdsafdas',69,'fbcfa8',999992421,'2022-01-13 21:35:15'),(56,14,34,35,4,'Hello du asdfdsa',69,'fbcfa8',999992421,'2022-01-13 21:35:35'),(57,16,1,2,1,'Hello World',69,'fbcfa8',999992421,'2022-01-16 16:05:51'),(58,14,5,16,5,'jkhkhkhkj',69,'ffcece',999992421,'2022-01-16 20:54:25'),(59,14,38,39,2,'hfghfghfgh',69,'edd9ff',999992421,'2022-01-16 21:12:11'),(60,14,6,11,6,'sadfasdfsdaf',69,'fbcfa8',999992421,'2022-01-18 12:11:08'),(61,14,7,10,7,'safdsafdsaf',69,'e5fff9',999992421,'2022-01-18 12:11:19'),(62,14,29,30,3,'Ok hey lets go',69,'ffeaf8',999992421,'2022-01-18 17:41:31'),(63,14,43,44,3,'New post',69,'fff8d1',999992421,'2022-01-18 17:41:55'),(64,14,17,18,5,'Okk',69,'edd9ff',999992421,'2022-01-24 15:02:00'),(65,14,53,54,1,'EYOOUUUUU',69,'fbcfa8',999992421,'2022-01-24 15:02:17'),(66,14,8,9,8,'OKKLIEUFDSAF',69,'ffeaf8',999992421,'2022-01-24 15:04:00'),(67,14,12,13,6,'OKudsafaueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',69,'e4faff',999992421,'2022-01-24 15:04:49'),(68,14,14,15,6,'sadfadsfdsaf',69,'edd9ff',999992421,'2022-01-24 16:00:29'),(69,14,24,25,4,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',69,'fbe4a0',999992421,'2022-01-24 16:19:01'),(70,14,26,27,4,'Okuasdfas',69,'edd9ff',999992421,'2022-01-27 10:27:11'),(71,21,0,1,0,'sadfasdfasdf',69,'fbe4a0',0,'2022-01-30 19:41:40'),(72,22,0,1,0,'asdfasfsdaf',69,'ddfff7',0,'2022-01-30 19:41:54'),(73,23,0,1,0,'asdfsdaf',69,'edd9ff',0,'2022-01-30 19:42:18');
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumPost_Like`
--

LOCK TABLES `ForumPost_Like` WRITE;
/*!40000 ALTER TABLE `ForumPost_Like` DISABLE KEYS */;
INSERT INTO `ForumPost_Like` VALUES (14,69,38,'2022-01-02 14:32:59'),(24,69,36,'2022-01-13 12:13:13'),(27,69,42,'2022-01-16 16:23:14'),(28,69,41,'2022-01-16 16:23:16'),(29,69,57,'2022-01-16 16:23:33'),(31,69,59,'2022-01-28 08:36:14'),(32,69,52,'2022-01-28 11:24:34'),(33,69,53,'2022-01-28 11:24:35'),(34,69,69,'2022-01-28 11:24:38');
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumPost_Parent`
--

LOCK TABLES `ForumPost_Parent` WRITE;
/*!40000 ALTER TABLE `ForumPost_Parent` DISABLE KEYS */;
INSERT INTO `ForumPost_Parent` VALUES (14,253,'p'),(15,253,'p'),(16,253,'p'),(17,253,'p'),(18,253,'p'),(19,253,'p'),(20,253,'p'),(21,253,'p'),(22,253,'p'),(23,253,'p');
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
  `description` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mission_id`),
  UNIQUE KEY `Mission_UN` (`title`,`page_id`),
  KEY `Mission_FK` (`page_id`),
  CONSTRAINT `Mission_FK` FOREIGN KEY (`page_id`) REFERENCES `Page` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mission`
--

LOCK TABLES `Mission` WRITE;
/*!40000 ALTER TABLE `Mission` DISABLE KEYS */;
INSERT INTO `Mission` VALUES (16,253,'Hello_World','asdfsdafsaf','2021-12-15 03:16:28');
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
) ENGINE=InnoDB AUTO_INCREMENT=255 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Page`
--

LOCK TABLES `Page` WRITE;
/*!40000 ALTER TABLE `Page` DISABLE KEYS */;
INSERT INTO `Page` VALUES (253,'70908e','20Vision','20vision','20Vision \'s purpose is to enhance manhood\'s ability of asking the right questions of \"Life the Universe and Everything\". To ask questions, we need Knowledge. To obtain Knowledge we need to Research. To Research, we need to Develop. To Develop we need to obtain Knowledge. To obtain Knowledge...','CtENBNHd5fz2u1TERoZZQ9wqoydxsXTbph5xTyy8LUva','2021-09-22 01:41:20'),(254,'dcb882','Something','something','Something else',NULL,'2021-10-02 06:41:23');
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
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageUser`
--

LOCK TABLES `PageUser` WRITE;
/*!40000 ALTER TABLE `PageUser` DISABLE KEYS */;
INSERT INTO `PageUser` VALUES (249,69,253,1,'2021-09-22 01:41:20','2021-09-22 01:41:20'),(250,70,254,1,'2021-10-02 06:41:23','2021-10-02 06:41:23');
/*!40000 ALTER TABLE `PageUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Paper`
--

DROP TABLE IF EXISTS `Paper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Paper` (
  `paper_id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(13) NOT NULL,
  `mission_id` int NOT NULL,
  `private` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`paper_id`),
  UNIQUE KEY `Paper_UN` (`uid`),
  KEY `Paper_FK` (`mission_id`),
  CONSTRAINT `Paper_FK` FOREIGN KEY (`mission_id`) REFERENCES `Mission` (`mission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Paper`
--

LOCK TABLES `Paper` WRITE;
/*!40000 ALTER TABLE `Paper` DISABLE KEYS */;
INSERT INTO `Paper` VALUES (22,'1639539158678',16,1),(23,'1640354314129',16,1),(24,'1643451277679',16,1);
/*!40000 ALTER TABLE `Paper` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Paper_Comment_Like`
--

DROP TABLE IF EXISTS `Paper_Comment_Like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Paper_Comment_Like` (
  `paper_comment_like_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `comment_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`paper_comment_like_id`),
  KEY `Paper_Comment_Like_FK_1` (`comment_id`),
  KEY `Paper_Comment_Like_FK` (`user_id`),
  CONSTRAINT `Paper_Comment_Like_FK` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `Paper_Comment_Like_FK_1` FOREIGN KEY (`comment_id`) REFERENCES `Comment` (`comment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Paper_Comment_Like`
--

LOCK TABLES `Paper_Comment_Like` WRITE;
/*!40000 ALTER TABLE `Paper_Comment_Like` DISABLE KEYS */;
/*!40000 ALTER TABLE `Paper_Comment_Like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Paper_Description`
--

DROP TABLE IF EXISTS `Paper_Description`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Paper_Description` (
  `paper_description_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(500) NOT NULL,
  `paper_version_id` int NOT NULL,
  PRIMARY KEY (`paper_description_id`),
  UNIQUE KEY `Paper_Description_UN` (`paper_version_id`),
  CONSTRAINT `Paper_Description_FK` FOREIGN KEY (`paper_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Paper_Description`
--

LOCK TABLES `Paper_Description` WRITE;
/*!40000 ALTER TABLE `Paper_Description` DISABLE KEYS */;
/*!40000 ALTER TABLE `Paper_Description` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Paper_Header`
--

DROP TABLE IF EXISTS `Paper_Header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Paper_Header` (
  `paper_header_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(70) NOT NULL,
  `paper_version_id` int NOT NULL,
  PRIMARY KEY (`paper_header_id`),
  UNIQUE KEY `Paper_Header_UN` (`paper_version_id`),
  CONSTRAINT `Paper_Header_FK` FOREIGN KEY (`paper_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Paper_Header`
--

LOCK TABLES `Paper_Header` WRITE;
/*!40000 ALTER TABLE `Paper_Header` DISABLE KEYS */;
/*!40000 ALTER TABLE `Paper_Header` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Paper_Media`
--

DROP TABLE IF EXISTS `Paper_Media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Paper_Media` (
  `paper_media_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(200) NOT NULL,
  `paper_version_id` int NOT NULL,
  PRIMARY KEY (`paper_media_id`),
  UNIQUE KEY `Paper_Media_UN` (`paper_version_id`),
  CONSTRAINT `Paper_Media_FK` FOREIGN KEY (`paper_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Paper_Media`
--

LOCK TABLES `Paper_Media` WRITE;
/*!40000 ALTER TABLE `Paper_Media` DISABLE KEYS */;
INSERT INTO `Paper_Media` VALUES (19,'paper_images/1639539158678/gHiZY7ax/',20),(20,'paper_images/1640354314129/wqZPRbh4/',21),(21,'paper_images/1643451277679/JNfMUzmn/',22);
/*!40000 ALTER TABLE `Paper_Media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Paper_Version`
--

DROP TABLE IF EXISTS `Paper_Version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Paper_Version` (
  `paper_version_id` int NOT NULL AUTO_INCREMENT,
  `paper_id` int NOT NULL,
  `version` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`paper_version_id`),
  KEY `Paper_Version_FK` (`paper_id`),
  CONSTRAINT `Paper_Version_FK` FOREIGN KEY (`paper_id`) REFERENCES `Paper` (`paper_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Paper_Version`
--

LOCK TABLES `Paper_Version` WRITE;
/*!40000 ALTER TABLE `Paper_Version` DISABLE KEYS */;
INSERT INTO `Paper_Version` VALUES (20,22,'0.0.0',NULL,'2021-12-15 03:32:40'),(21,23,'0.0.0',NULL,'2021-12-24 13:58:36'),(22,24,'0.0.0',NULL,'2022-01-29 10:14:39');
/*!40000 ALTER TABLE `Paper_Version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reply`
--

DROP TABLE IF EXISTS `Reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reply` (
  `reply_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `parent_id` int NOT NULL,
  `parent_type` tinyint(1) NOT NULL,
  `content` varchar(500) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reply_id`),
  KEY `Reply_FK` (`user_id`),
  CONSTRAINT `Reply_FK` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reply`
--

LOCK TABLES `Reply` WRITE;
/*!40000 ALTER TABLE `Reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sub`
--

DROP TABLE IF EXISTS `Sub`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sub` (
  `sub_id` int NOT NULL AUTO_INCREMENT,
  `from_version_id` int NOT NULL,
  `to_version_id` int NOT NULL,
  PRIMARY KEY (`sub_id`),
  KEY `Sub_FK` (`from_version_id`),
  KEY `Sub_FK_1` (`to_version_id`),
  CONSTRAINT `Sub_FK` FOREIGN KEY (`from_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE,
  CONSTRAINT `Sub_FK_1` FOREIGN KEY (`to_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sub`
--

LOCK TABLES `Sub` WRITE;
/*!40000 ALTER TABLE `Sub` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sub` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sub_Description`
--

DROP TABLE IF EXISTS `Sub_Description`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sub_Description` (
  `sub_description_id` int NOT NULL AUTO_INCREMENT,
  `paper_version_id` int NOT NULL,
  `sub_id` int NOT NULL,
  `content` varchar(500) NOT NULL,
  PRIMARY KEY (`sub_description_id`),
  KEY `Sub_Description_FK` (`paper_version_id`),
  KEY `Sub_Description_FK_1` (`sub_id`),
  CONSTRAINT `Sub_Description_FK` FOREIGN KEY (`paper_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE,
  CONSTRAINT `Sub_Description_FK_1` FOREIGN KEY (`sub_id`) REFERENCES `Sub` (`sub_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sub_Description`
--

LOCK TABLES `Sub_Description` WRITE;
/*!40000 ALTER TABLE `Sub_Description` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sub_Description` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sub_Header`
--

DROP TABLE IF EXISTS `Sub_Header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sub_Header` (
  `sub_header_id` int NOT NULL AUTO_INCREMENT,
  `paper_version_id` int NOT NULL,
  `sub_id` int NOT NULL,
  `content` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`sub_header_id`),
  KEY `Sub_Header_FK` (`paper_version_id`),
  KEY `Sub_Header_FK_1` (`sub_id`),
  CONSTRAINT `Sub_Header_FK` FOREIGN KEY (`paper_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE,
  CONSTRAINT `Sub_Header_FK_1` FOREIGN KEY (`sub_id`) REFERENCES `Sub` (`sub_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sub_Header`
--

LOCK TABLES `Sub_Header` WRITE;
/*!40000 ALTER TABLE `Sub_Header` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sub_Header` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sub_Index`
--

DROP TABLE IF EXISTS `Sub_Index`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sub_Index` (
  `sub_index_id` int NOT NULL AUTO_INCREMENT,
  `paper_version_id` int NOT NULL,
  `sub_id` int NOT NULL,
  `content` int NOT NULL,
  PRIMARY KEY (`sub_index_id`),
  KEY `Sub_Index_FK` (`paper_version_id`),
  KEY `Sub_Index_FK_1` (`sub_id`),
  CONSTRAINT `Sub_Index_FK` FOREIGN KEY (`paper_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE,
  CONSTRAINT `Sub_Index_FK_1` FOREIGN KEY (`sub_id`) REFERENCES `Sub` (`sub_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sub_Index`
--

LOCK TABLES `Sub_Index` WRITE;
/*!40000 ALTER TABLE `Sub_Index` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sub_Index` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sub_Media`
--

DROP TABLE IF EXISTS `Sub_Media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sub_Media` (
  `sub_media_id` int NOT NULL AUTO_INCREMENT,
  `paper_version_id` int NOT NULL,
  `sub_id` int NOT NULL,
  `content` varchar(200) NOT NULL,
  PRIMARY KEY (`sub_media_id`),
  KEY `Sub_Media_FK` (`sub_id`),
  KEY `Sub_Media_FK_1` (`paper_version_id`),
  CONSTRAINT `Sub_Media_FK` FOREIGN KEY (`sub_id`) REFERENCES `Sub` (`sub_id`) ON DELETE CASCADE,
  CONSTRAINT `Sub_Media_FK_1` FOREIGN KEY (`paper_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sub_Media`
--

LOCK TABLES `Sub_Media` WRITE;
/*!40000 ALTER TABLE `Sub_Media` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sub_Media` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Topic`
--

LOCK TABLES `Topic` WRITE;
/*!40000 ALTER TABLE `Topic` DISABLE KEYS */;
INSERT INTO `Topic` VALUES (1,253,'safsadf','asdfasdf','0','2022-01-30 10:04:50'),(2,253,'asdfsdaf','sdafasdfasdf','0','2022-01-30 10:13:40'),(3,253,'asdfsda_fdasfdasfdsa f ads f sda f','sda f sdaf s daf sda  das asdfasdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd','651651651651511.6','2022-01-30 10:20:34'),(4,253,'sadfsdafsadf_ADFADF_DSA_FDSAF_D_SA_FA_DSF_DSA_SDA_FDSA_FDSA_ASD_FADS_FAS_FSDA_FSDA_FA_FDSA_FSDA_F_AS','sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasdfsadf sadfsdafsdaf dsafasd','15615650.005111115','2022-01-30 10:37:01'),(5,253,'asf_sad_fdsa_fsad_fdas_','das fdsa f dasf sda  adsf','656165160.516165','2022-01-30 10:39:27');
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
) ENGINE=InnoDB AUTO_INCREMENT=307 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Session`
--

LOCK TABLES `User_Session` WRITE;
/*!40000 ALTER TABLE `User_Session` DISABLE KEYS */;
INSERT INTO `User_Session` VALUES (205,69,2130706433,NULL,'2021-09-20 17:13:45'),(206,69,2130706433,NULL,'2021-09-20 17:25:53'),(207,69,2130706433,NULL,'2021-09-21 22:27:43'),(208,69,2130706433,NULL,'2021-09-22 12:30:13'),(209,69,2130706433,NULL,'2021-09-24 19:13:19'),(210,69,2130706433,NULL,'2021-09-24 23:42:26'),(211,69,2130706433,NULL,'2021-09-25 14:22:01'),(212,69,2130706433,NULL,'2021-09-27 20:40:49'),(213,69,2130706433,NULL,'2021-09-28 20:46:28'),(214,69,2130706433,NULL,'2021-09-29 23:54:02'),(215,69,2130706433,NULL,'2021-09-30 18:06:20'),(216,69,2130706433,NULL,'2021-10-01 08:49:11'),(217,69,2130706433,NULL,'2021-10-01 10:09:11'),(218,69,2130706433,NULL,'2021-10-02 05:41:52'),(219,70,2130706433,NULL,'2021-10-02 06:40:51'),(220,69,2130706433,NULL,'2021-10-03 18:04:41'),(221,69,2130706433,NULL,'2021-10-04 08:00:13'),(222,69,2130706433,NULL,'2021-10-05 15:31:05'),(223,69,2130706433,NULL,'2021-10-07 04:42:47'),(224,69,2130706433,NULL,'2021-10-12 21:06:22'),(225,69,2130706433,NULL,'2021-10-13 01:24:41'),(226,69,2130706433,NULL,'2021-10-13 14:21:04'),(227,69,2130706433,NULL,'2021-10-19 07:01:00'),(228,69,2130706433,NULL,'2021-10-19 13:11:46'),(229,69,2130706433,NULL,'2021-10-20 10:19:53'),(230,69,2130706433,NULL,'2021-10-20 11:22:26'),(231,69,2130706433,NULL,'2021-10-20 12:47:43'),(232,71,2130706433,NULL,'2021-10-20 13:34:45'),(233,72,2130706433,NULL,'2021-10-20 13:38:19'),(234,69,2130706433,NULL,'2021-10-20 13:39:25'),(235,72,2130706433,NULL,'2021-10-23 08:48:15'),(236,69,2130706433,NULL,'2021-10-23 08:48:45'),(237,69,2130706433,NULL,'2021-10-25 15:44:14'),(238,69,2130706433,NULL,'2021-10-25 15:47:42'),(239,69,2130706433,NULL,'2021-10-25 15:50:01'),(240,69,2130706433,NULL,'2021-10-25 15:51:15'),(241,69,2130706433,NULL,'2021-10-25 15:51:24'),(242,69,2130706433,NULL,'2021-10-25 16:21:24'),(243,69,2130706433,NULL,'2021-10-25 16:36:48'),(244,69,2130706433,NULL,'2021-10-28 18:12:27'),(245,69,2130706433,NULL,'2021-10-28 23:16:34'),(246,69,2130706433,NULL,'2021-10-28 23:16:48'),(247,69,2130706433,NULL,'2021-10-29 14:03:41'),(248,69,2130706433,NULL,'2021-10-29 14:04:07'),(249,69,2130706433,NULL,'2021-10-30 16:35:25'),(250,69,2130706433,NULL,'2021-10-30 16:38:28'),(251,69,2130706433,NULL,'2021-10-30 16:41:19'),(252,69,2130706433,NULL,'2021-11-01 15:27:35'),(253,69,2130706433,NULL,'2021-11-01 15:27:50'),(254,69,2130706433,NULL,'2021-11-02 11:29:12'),(255,69,2130706433,NULL,'2021-11-03 12:21:54'),(256,69,2130706433,NULL,'2021-11-04 18:27:36'),(257,69,2130706433,NULL,'2021-11-04 18:29:20'),(258,69,2130706433,NULL,'2021-11-05 16:14:13'),(259,69,2130706433,NULL,'2021-11-08 17:48:44'),(260,69,2130706433,NULL,'2021-11-09 20:41:34'),(261,69,2130706433,NULL,'2021-11-12 14:38:27'),(262,69,2130706433,NULL,'2021-11-12 14:38:37'),(263,69,2130706433,NULL,'2021-11-12 15:41:51'),(264,69,2130706433,NULL,'2021-11-13 01:36:39'),(265,69,2130706433,NULL,'2021-11-13 01:36:50'),(266,69,2130706433,NULL,'2021-11-15 03:03:32'),(267,69,2130706433,NULL,'2021-11-15 03:05:12'),(268,69,2130706433,NULL,'2021-11-18 15:38:54'),(269,69,2130706433,NULL,'2021-11-18 15:39:06'),(270,69,2130706433,NULL,'2021-11-21 22:04:55'),(271,69,2130706433,NULL,'2021-11-21 22:08:02'),(272,69,2130706433,NULL,'2021-11-27 15:14:57'),(273,69,2130706433,NULL,'2021-11-28 17:20:27'),(274,69,2130706433,NULL,'2021-11-28 17:33:17'),(275,69,2130706433,NULL,'2021-12-01 17:52:08'),(276,69,2130706433,NULL,'2021-12-01 17:52:24'),(277,69,2130706433,NULL,'2021-12-02 14:21:10'),(278,69,2130706433,NULL,'2021-12-02 15:02:07'),(279,69,2130706433,NULL,'2021-12-03 17:15:27'),(280,69,2130706433,NULL,'2021-12-03 17:30:52'),(281,69,2130706433,NULL,'2021-12-03 17:31:03'),(282,69,2130706433,NULL,'2021-12-04 14:20:32'),(283,69,2130706433,NULL,'2021-12-04 14:21:11'),(284,69,2130706433,NULL,'2021-12-05 15:31:55'),(285,69,2130706433,NULL,'2021-12-06 19:34:17'),(286,69,2130706433,NULL,'2021-12-06 19:40:56'),(287,69,2130706433,NULL,'2021-12-06 23:20:52'),(288,69,2130706433,NULL,'2021-12-06 23:41:16'),(289,69,2130706433,NULL,'2021-12-06 23:55:20'),(290,69,2130706433,NULL,'2021-12-07 00:06:43'),(291,69,2130706433,NULL,'2021-12-10 20:21:15'),(292,69,2130706433,NULL,'2021-12-11 04:04:28'),(293,69,2130706433,NULL,'2021-12-11 04:05:20'),(294,69,2130706433,NULL,'2021-12-12 20:56:00'),(295,69,2130706433,NULL,'2021-12-13 02:53:18'),(296,69,2130706433,NULL,'2021-12-15 14:09:45'),(297,69,2130706433,NULL,'2021-12-17 16:23:11'),(298,69,2130706433,NULL,'2021-12-19 03:51:07'),(299,69,2130706433,NULL,'2021-12-19 19:05:25'),(300,69,2130706433,NULL,'2021-12-24 23:06:02'),(301,69,2130706433,NULL,'2022-01-11 13:42:43'),(302,69,2130706433,NULL,'2022-01-13 23:55:46'),(303,69,2130706433,NULL,'2022-01-18 14:42:57'),(304,69,2130706433,NULL,'2022-01-20 15:08:46'),(305,69,2130706433,NULL,'2022-01-24 12:10:00'),(306,69,2130706433,NULL,'2022-01-29 22:36:39');
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

-- Dump completed on 2022-01-30 20:49:13
