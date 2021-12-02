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
-- Table structure for table `Discussion-Reply_Like`
--

DROP TABLE IF EXISTS `Discussion-Reply_Like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Discussion-Reply_Like` (
  `discussion-reply_like` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `parent_id` int NOT NULL,
  `parent_type` tinyint(1) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`discussion-reply_like`),
  KEY `Discussion_Reply_Like_FK` (`user_id`),
  CONSTRAINT `Discussion_Reply_Like_FK` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Discussion-Reply_Like`
--

LOCK TABLES `Discussion-Reply_Like` WRITE;
/*!40000 ALTER TABLE `Discussion-Reply_Like` DISABLE KEYS */;
/*!40000 ALTER TABLE `Discussion-Reply_Like` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mission`
--

LOCK TABLES `Mission` WRITE;
/*!40000 ALTER TABLE `Mission` DISABLE KEYS */;
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
  `token_mint_address` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
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
INSERT INTO `Page` VALUES (253,'70908e','20Vision','20vision','20Vision \'s purpose is to enhance manhood\'s ability of asking the right questions of \"Life the Universe and Everything\". To ask questions, we need Knowledge. To obtain Knowledge we need to Research. To Research, we need to Develop. To Develop we need to obtain Knowledge. To obtain Knowledge...',NULL,'2021-09-22 01:41:20'),(254,'dcb882','Something','something','Something else',NULL,'2021-10-02 06:41:23');
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Paper`
--

LOCK TABLES `Paper` WRITE;
/*!40000 ALTER TABLE `Paper` DISABLE KEYS */;
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
-- Table structure for table `Paper_Discussion`
--

DROP TABLE IF EXISTS `Paper_Discussion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Paper_Discussion` (
  `paper_discussion_id` int NOT NULL AUTO_INCREMENT,
  `paper_version_id` int NOT NULL,
  `user_id` int NOT NULL,
  `color` varchar(6) NOT NULL,
  `content` varchar(500) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`paper_discussion_id`),
  KEY `Paper_Discussion_FK` (`paper_version_id`),
  KEY `Paper_Discussion_FK_1` (`user_id`),
  CONSTRAINT `Paper_Discussion_FK` FOREIGN KEY (`paper_version_id`) REFERENCES `Paper_Version` (`paper_version_id`) ON DELETE CASCADE,
  CONSTRAINT `Paper_Discussion_FK_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Paper_Discussion`
--

LOCK TABLES `Paper_Discussion` WRITE;
/*!40000 ALTER TABLE `Paper_Discussion` DISABLE KEYS */;
/*!40000 ALTER TABLE `Paper_Discussion` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Paper_Media`
--

LOCK TABLES `Paper_Media` WRITE;
/*!40000 ALTER TABLE `Paper_Media` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Paper_Version`
--

LOCK TABLES `Paper_Version` WRITE;
/*!40000 ALTER TABLE `Paper_Version` DISABLE KEYS */;
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
-- Table structure for table `Topic_Discussion`
--

DROP TABLE IF EXISTS `Topic_Discussion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Topic_Discussion` (
  `topic_discussion_id` int NOT NULL AUTO_INCREMENT,
  `topic_id` int NOT NULL,
  `user_id` int NOT NULL,
  `color` varchar(6) NOT NULL,
  `content` varchar(500) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`topic_discussion_id`),
  KEY `Topic_Discussion_FK` (`topic_id`),
  KEY `Topic_Discussion_FK_1` (`user_id`),
  CONSTRAINT `Topic_Discussion_FK` FOREIGN KEY (`topic_id`) REFERENCES `Topics` (`topic_id`) ON DELETE CASCADE,
  CONSTRAINT `Topic_Discussion_FK_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Topic_Discussion`
--

LOCK TABLES `Topic_Discussion` WRITE;
/*!40000 ALTER TABLE `Topic_Discussion` DISABLE KEYS */;
/*!40000 ALTER TABLE `Topic_Discussion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Topics`
--

DROP TABLE IF EXISTS `Topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Topics` (
  `topic_id` int NOT NULL AUTO_INCREMENT,
  `page_id` int NOT NULL,
  `name` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `entry` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`topic_id`),
  KEY `Topics_FK` (`page_id`),
  CONSTRAINT `Topics_FK` FOREIGN KEY (`page_id`) REFERENCES `Page` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Topics`
--

LOCK TABLES `Topics` WRITE;
/*!40000 ALTER TABLE `Topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `Topics` ENABLE KEYS */;
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
INSERT INTO `User` VALUES (69,'HBwQjmrR4eHYPGDE3aQD8DTwoVYVgtd22e19L75v1NGj','alexx',NULL,'2021-09-20 17:13:45'),(70,'AaJT9wC5j2zk78MtTWngkP6n7gN7d4Rqw9AYezmWq1o8','alex',NULL,'2021-10-02 06:40:50'),(71,'CohZhJhnHkdutc7iktrrGVUX4oUM3VctSX7DybSzRN4f','aleedxx',NULL,'2021-10-20 13:34:45'),(72,'G1tUHWDaR1Jerzz9MdwPfxoXVMmwT6kU4DmncZmke5gb','alexxxxy',NULL,'2021-10-20 13:38:19');
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
) ENGINE=InnoDB AUTO_INCREMENT=279 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Session`
--

LOCK TABLES `User_Session` WRITE;
/*!40000 ALTER TABLE `User_Session` DISABLE KEYS */;
INSERT INTO `User_Session` VALUES (205,69,2130706433,NULL,'2021-09-20 17:13:45'),(206,69,2130706433,NULL,'2021-09-20 17:25:53'),(207,69,2130706433,NULL,'2021-09-21 22:27:43'),(208,69,2130706433,NULL,'2021-09-22 12:30:13'),(209,69,2130706433,NULL,'2021-09-24 19:13:19'),(210,69,2130706433,NULL,'2021-09-24 23:42:26'),(211,69,2130706433,NULL,'2021-09-25 14:22:01'),(212,69,2130706433,NULL,'2021-09-27 20:40:49'),(213,69,2130706433,NULL,'2021-09-28 20:46:28'),(214,69,2130706433,NULL,'2021-09-29 23:54:02'),(215,69,2130706433,NULL,'2021-09-30 18:06:20'),(216,69,2130706433,NULL,'2021-10-01 08:49:11'),(217,69,2130706433,NULL,'2021-10-01 10:09:11'),(218,69,2130706433,NULL,'2021-10-02 05:41:52'),(219,70,2130706433,NULL,'2021-10-02 06:40:51'),(220,69,2130706433,NULL,'2021-10-03 18:04:41'),(221,69,2130706433,NULL,'2021-10-04 08:00:13'),(222,69,2130706433,NULL,'2021-10-05 15:31:05'),(223,69,2130706433,NULL,'2021-10-07 04:42:47'),(224,69,2130706433,NULL,'2021-10-12 21:06:22'),(225,69,2130706433,NULL,'2021-10-13 01:24:41'),(226,69,2130706433,NULL,'2021-10-13 14:21:04'),(227,69,2130706433,NULL,'2021-10-19 07:01:00'),(228,69,2130706433,NULL,'2021-10-19 13:11:46'),(229,69,2130706433,NULL,'2021-10-20 10:19:53'),(230,69,2130706433,NULL,'2021-10-20 11:22:26'),(231,69,2130706433,NULL,'2021-10-20 12:47:43'),(232,71,2130706433,NULL,'2021-10-20 13:34:45'),(233,72,2130706433,NULL,'2021-10-20 13:38:19'),(234,69,2130706433,NULL,'2021-10-20 13:39:25'),(235,72,2130706433,NULL,'2021-10-23 08:48:15'),(236,69,2130706433,NULL,'2021-10-23 08:48:45'),(237,69,2130706433,NULL,'2021-10-25 15:44:14'),(238,69,2130706433,NULL,'2021-10-25 15:47:42'),(239,69,2130706433,NULL,'2021-10-25 15:50:01'),(240,69,2130706433,NULL,'2021-10-25 15:51:15'),(241,69,2130706433,NULL,'2021-10-25 15:51:24'),(242,69,2130706433,NULL,'2021-10-25 16:21:24'),(243,69,2130706433,NULL,'2021-10-25 16:36:48'),(244,69,2130706433,NULL,'2021-10-28 18:12:27'),(245,69,2130706433,NULL,'2021-10-28 23:16:34'),(246,69,2130706433,NULL,'2021-10-28 23:16:48'),(247,69,2130706433,NULL,'2021-10-29 14:03:41'),(248,69,2130706433,NULL,'2021-10-29 14:04:07'),(249,69,2130706433,NULL,'2021-10-30 16:35:25'),(250,69,2130706433,NULL,'2021-10-30 16:38:28'),(251,69,2130706433,NULL,'2021-10-30 16:41:19'),(252,69,2130706433,NULL,'2021-11-01 15:27:35'),(253,69,2130706433,NULL,'2021-11-01 15:27:50'),(254,69,2130706433,NULL,'2021-11-02 11:29:12'),(255,69,2130706433,NULL,'2021-11-03 12:21:54'),(256,69,2130706433,NULL,'2021-11-04 18:27:36'),(257,69,2130706433,NULL,'2021-11-04 18:29:20'),(258,69,2130706433,NULL,'2021-11-05 16:14:13'),(259,69,2130706433,NULL,'2021-11-08 17:48:44'),(260,69,2130706433,NULL,'2021-11-09 20:41:34'),(261,69,2130706433,NULL,'2021-11-12 14:38:27'),(262,69,2130706433,NULL,'2021-11-12 14:38:37'),(263,69,2130706433,NULL,'2021-11-12 15:41:51'),(264,69,2130706433,NULL,'2021-11-13 01:36:39'),(265,69,2130706433,NULL,'2021-11-13 01:36:50'),(266,69,2130706433,NULL,'2021-11-15 03:03:32'),(267,69,2130706433,NULL,'2021-11-15 03:05:12'),(268,69,2130706433,NULL,'2021-11-18 15:38:54'),(269,69,2130706433,NULL,'2021-11-18 15:39:06'),(270,69,2130706433,NULL,'2021-11-21 22:04:55'),(271,69,2130706433,NULL,'2021-11-21 22:08:02'),(272,69,2130706433,NULL,'2021-11-27 15:14:57'),(273,69,2130706433,NULL,'2021-11-28 17:20:27'),(274,69,2130706433,NULL,'2021-11-28 17:33:17'),(275,69,2130706433,NULL,'2021-12-01 17:52:08'),(276,69,2130706433,NULL,'2021-12-01 17:52:24'),(277,69,2130706433,NULL,'2021-12-02 14:21:10'),(278,69,2130706433,NULL,'2021-12-02 15:02:07');
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

-- Dump completed on 2021-12-02 19:32:39
