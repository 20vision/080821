-- MySQL dump 10.13  Distrib 8.0.26, for Linux (x86_64)
--
-- Host: localhost    Database: 20Vision
-- ------------------------------------------------------
-- Server version	8.0.26-0ubuntu0.20.04.2

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
INSERT INTO `Mission` VALUES (1,240,'hjlkj  lklj  lj ','asdfsdafsdaf','2021-08-31 17:57:50'),(2,240,'hjlkj  lklj  lj','asdfsdafsdaf','2021-08-31 18:00:53'),(3,240,'hello World','adsfsdafsdaf','2021-08-31 18:02:36'),(5,240,'hello_World','sadfsdafsdaf','2021-08-31 18:11:33'),(6,240,'hello_worldd','sadfsafasd','2021-08-31 18:32:44'),(7,241,'Hello_World','Heyyyy','2021-09-01 10:50:36'),(8,242,'Zelsadf','sdaflkdsajflkjdsa','2021-09-02 11:55:09'),(9,242,'aaaa','aaaa','2021-09-02 18:05:43'),(10,243,'asdfsad_aasfsda','sdafsadfsdaf','2021-09-05 17:04:47'),(11,244,'Hello','Hello World','2021-09-06 17:15:05'),(12,245,'asawewr','dsafsaaa','2021-09-07 11:52:04'),(13,246,'sdafdsaf','sdafsdafd','2021-09-07 17:56:10'),(14,247,'asfasaa','dasfsdafsdaf','2021-09-07 22:58:21'),(15,248,'wqztrzeztrz','treztrzertze','2021-09-08 12:50:30');
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
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`page_id`),
  UNIQUE KEY `Page_UN` (`unique_pagename`)
) ENGINE=InnoDB AUTO_INCREMENT=250 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Page`
--

LOCK TABLES `Page` WRITE;
/*!40000 ALTER TABLE `Page` DISABLE KEYS */;
INSERT INTO `Page` VALUES (60,'9778bf','Alex','alex','ddddddddddddddd','2021-08-18 03:28:35'),(61,'bb82c5','Hello','hello','Hello world','2021-08-18 17:55:04'),(62,'af9877','dsaf','dsaf','asdf','2021-08-18 18:00:23'),(63,'d64675','sdafaa','sdafaa','dsafsdafa','2021-08-18 18:09:20'),(64,'7dbef5','dsafdsaf','dsafdsaf','asdfsdaf','2021-08-18 18:17:19'),(65,'7dbef5','asdfsda','asdfsda','asdfdsa','2021-08-18 18:18:42'),(66,'9778bf','sdaf','sdaf','sadf','2021-08-18 18:22:41'),(67,'d64675','hsadfasd','hsadfasd','sadfdasf safl ','2021-08-19 05:33:48'),(68,'7dbef5','asdfsdasdaf','asdfsdasdaf','sadfsda','2021-08-19 06:18:04'),(69,'ac34c1','sdafsdaf','sdafsdaf','asdfasdf','2021-08-19 06:19:44'),(70,'2dc3bc','sadfdsa','sadfdsa','sdafsdaf','2021-08-19 06:20:07'),(71,'d28e2a','dsafsdaf','dsafsdaf','asdfasdf','2021-08-19 06:22:02'),(72,'d28e2a','asfasdf','asfasdf','sadfadsf','2021-08-19 07:09:35'),(73,'dcb882','asfasdfd','asfasdfd','sadfadsf','2021-08-19 07:09:45'),(74,'af9877','asfasdfdd','asfasdfdd','sadfadsf','2021-08-19 07:13:05'),(75,'d64675','asfasdfddd','asfasdfddd','sadfadsf','2021-08-19 07:13:26'),(76,'dcb882','asfasdfdddddddd','asfasdfdddddddd','sadfadsf','2021-08-19 07:13:40'),(77,'70908e','dafsadsddd','dafsadsddd','safadsfasdf','2021-08-19 07:13:56'),(78,'7dbef5','dafsadsdddd','dafsadsdddd','safadsfasdf','2021-08-19 07:14:44'),(79,'dcb882','dafsadsdddddd','dafsadsdddddd','safadsfasdf','2021-08-19 07:16:10'),(80,'70908e','dafsadsddddddd','dafsadsddddddd','safadsfasdf','2021-08-19 07:16:35'),(81,'7dbef5','asdfdsaf','asdfdsaf','sdafasdf','2021-08-19 07:22:19'),(82,'2dc3bc','asdfdsafd','asdfdsafd','sdafasdf','2021-08-19 07:23:01'),(83,'af9877','asdfdsafdd','asdfdsafdd','sdafasdf','2021-08-19 07:23:37'),(84,'70908e','asdfdsafdddsaf','asdfdsafdddsaf','sdafasdf','2021-08-19 07:25:00'),(85,'67c166','asdfdsafdddsafsadf','asdfdsafdddsafsadf','sdafasdf','2021-08-19 07:25:17'),(86,'9778bf','asdfsdaf','asdfsdaf','asdfsdaf','2021-08-19 07:25:33'),(87,'d64675','asdfsdafsdaf','asdfsdafsdaf','asdfsdaf','2021-08-19 07:27:14'),(88,'7dbef5','asdfsdafsdafsadf','asdfsdafsdafsadf','asdfsdaf','2021-08-19 07:27:24'),(89,'d28e2a','asdfsdafsdafsadfd','asdfsdafsdafsadfd','asdfsdaf','2021-08-19 07:27:42'),(90,'2dc3bc','asdfsdafsdafsadfddd','asdfsdafsdafsadfddd','asdfsdaf','2021-08-19 07:29:34'),(91,'d64675','asdf','asdf','asfd','2021-08-19 07:31:12'),(92,'7dbef5','asfsadf','asfsadf','asdfsadf','2021-08-19 07:32:57'),(93,'7dbef5','asfsadfdasf','asfsadfdasf','asdfsadf','2021-08-19 07:33:36'),(94,'ac34c1','asfsadfdasfd','asfsadfdasfd','asdfsadf','2021-08-19 07:34:32'),(95,'7dbef5','asfsadfdasfdd','asfsadfdasfdd','asdfsadf','2021-08-19 07:36:35'),(96,'7dbef5','sadf','sadf','asdfsdaf','2021-08-19 07:37:42'),(97,'bf1402','asdfads','asdfads','sdafsadf','2021-08-19 07:38:55'),(98,'2dc3bc','asdfadsf','asdfadsf','asdfasdf','2021-08-19 07:40:14'),(99,'097bdc','asdfadsfd','asdfadsfd','asdfasdf','2021-08-19 07:40:38'),(100,'9778bf','asfsdaf','asfsdaf','sdafdsaf','2021-08-19 07:48:35'),(101,'d28e2a','asfsdafd','asfsdafd','sdafdsaf','2021-08-19 07:52:29'),(102,'097bdc','sadfsdaf','sadfsdaf','asdfsadf','2021-08-19 07:54:07'),(103,'d64675','safasf','safasf','asdfsdaf','2021-08-19 07:54:48'),(104,'af9877','asdfdsafff','asdfdsafff','asdfsdaf','2021-08-19 07:57:25'),(105,'9778bf','sdafdsaf','sdafdsaf','asdfasdf','2021-08-19 07:58:47'),(106,'dcb882','sdafdsaff','sdafdsaff','asdfsdaf','2021-08-19 08:01:01'),(107,'7dbef5','asdfsadf','asdfsadf','asdfadsf','2021-08-19 08:02:44'),(108,'70908e','asdfaaaa','asdfaaaa','adsfasaaa','2021-08-19 08:03:00'),(109,'af9877','sdafadsf','sdafadsf','asdfsadfasd','2021-08-19 08:14:51'),(110,'2dc3bc','asdfsadfsd','asdfsadfsd','asdfsdafsdaf','2021-08-19 08:19:49'),(111,'67c166','sadfdasf','sadfdasf','asdfasfsdf','2021-08-19 08:19:59'),(112,'af9877','asdff','asdff','asdfasdf','2021-08-19 08:20:10'),(113,'c3c52e','sadfsdafdd','sadfsdafdd','asdfdasf','2021-08-19 08:20:51'),(114,'dcb882','asdfsdafff','asdfsdafff','asfasdf','2021-08-19 08:21:38'),(115,'d28e2a','asdfasdf','asdfasdf','adsfsdaf','2021-08-19 08:21:50'),(116,'189c3b','adsafs','adsafs','dsafsda','2021-08-19 08:21:54'),(117,'af9877','asdfdsafffff','asdfdsafffff','asdfdsafds','2021-08-19 08:22:05'),(118,'d28e2a','aaaaaa','aaaaaa','aaaaaa','2021-08-19 08:22:11'),(119,'7dbef5','Addasa','addasa','asdfsdaf','2021-08-19 08:22:20'),(120,'9778bf','sadfsdaff','sadfsdaff','asdfasdfsadf','2021-08-19 08:30:06'),(121,'ac34c1','asdfdsafdddd','asdfdsafdddd','asdfsdafasdf','2021-08-20 03:39:14'),(122,'af9877','sdafdasf','sdafdasf','ddddddd','2021-08-20 03:39:21'),(123,'af9877','dddasddasd','dddasddasd','asddsads','2021-08-20 03:39:26'),(124,'d64675','sdfdsaf','sdfdsaf','asdfsadf','2021-08-21 22:38:55'),(125,'af9877','Aasdfsdaf','aasdfsdaf','dsafsdaf','2021-08-22 01:31:37'),(126,'70908e','Tesla','tesla','sdafsdafdsaf','2021-08-22 01:41:24'),(127,'ac34c1','Toaaa','toaaa','asdfdsaf','2021-08-22 01:46:29'),(128,'70908e','DFasdf','dfasdf','asdfsdaf','2021-08-22 02:16:58'),(129,'189c3b','ADFD','adfd','adsfasdf','2021-08-22 02:17:27'),(130,'70908e','FFFFF','fffff','dfsafsdaf','2021-08-22 02:18:49'),(131,'70908e','ASFDA','asfda','asdfsdaf','2021-08-22 02:22:36'),(132,'ac34c1','RRRR','rrrr','safsadf','2021-08-22 02:23:31'),(133,'189c3b','ASDFsdaffffff','asdfsdaffffff','DSAFASDF','2021-08-22 02:24:32'),(134,'67c166','AAARRRR','aaarrrr','dsafsdaf','2021-08-22 02:27:13'),(135,'67c166','ZZZZZ','zzzzz','gfdgsfg','2021-08-22 02:27:18'),(136,'bf1402','EEEE','eeee','EEEE','2021-08-22 02:27:23'),(137,'9778bf','AAAAA','aaaaa','sadfadsf','2021-08-22 02:58:48'),(138,'67c166','QQQQQQ','qqqqqq','QQQQQQQQQQQ','2021-08-22 02:59:13'),(139,'70908e','TTTTTTTTTTTT','tttttttttttt','TTTTTTTTTTTT','2021-08-22 02:59:39'),(140,'9778bf','UUUUUUUUUU','uuuuuuuuuu','UUUUUUUUUUU','2021-08-22 03:00:18'),(141,'189c3b','TZZZZZZZZZZZ','tzzzzzzzzzzz','ZZZZZZZZZZZ','2021-08-22 03:01:32'),(142,'189c3b','ZZZZZZZZZ','zzzzzzzzz','ZZZZZZZZZZZZ','2021-08-22 03:03:43'),(143,'67c166','OOOOOOOOO','ooooooooo','OOOOOOOO','2021-08-22 03:04:19'),(144,'af9877','LLLLLLLLLL','llllllllll','FFFFFFFFFFF','2021-08-22 03:05:15'),(145,'dcb882','IIIIIIIIIIIIII','iiiiiiiiiiiiii','IIIIIIIIIIIIIIII','2021-08-22 03:08:21'),(146,'70908e','ZZZZZZZZ','zzzzzzzz','ZZZZZZ','2021-08-22 03:09:28'),(147,'af9877','UUUUUUU','uuuuuuu','UUUUUUU','2021-08-22 03:09:50'),(148,'ac34c1','XXXXXXXXX','xxxxxxxxx','XXXXXXXXXXX','2021-08-22 03:13:33'),(149,'bb82c5','VVVVVV','vvvvvv','VVVVVVVV','2021-08-22 03:14:32'),(150,'d28e2a','VVVVVVVVVVV','vvvvvvvvvvv','VVVVVVVVVVV','2021-08-22 03:19:56'),(151,'d28e2a','XYYYYYYYYY','xyyyyyyyyy','YYYYYYYYYY','2021-08-22 03:21:59'),(152,'c3c52e','BBBBBBB','bbbbbbb','BBBBBBB','2021-08-22 03:23:31'),(153,'7dbef5','NNNNNNNNNNNN','nnnnnnnnnnnn','NNNNNNNNN','2021-08-22 03:24:57'),(154,'ac34c1','MMMMMMMMM','mmmmmmmmm','MMMMMMMM','2021-08-22 03:25:36'),(155,'67c166','BBBBBBBAA','bbbbbbbaa','BBBBBBBBBBB','2021-08-22 03:26:18'),(156,'bb82c5','CCCCCCC','ccccccc','CCCCCCCCCCC','2021-08-22 03:27:11'),(157,'bf1402','LLLLLLLLL','lllllllll','LLLLLLLLLL','2021-08-22 03:27:44'),(158,'2dc3bc','HHHHHHHHH','hhhhhhhhh','HHHHHHHHH','2021-08-22 03:28:17'),(159,'dcb882','GGGGGGG','ggggggg','GGGGGGGG','2021-08-22 03:28:38'),(160,'bb82c5','ZZZTTTTTTTTT','zzzttttttttt','TTTTTTTTTT','2021-08-22 03:30:10'),(161,'d28e2a','ZTREW','ztrew','REWTREWT','2021-08-22 03:31:00'),(162,'189c3b','CVXBBVCX','cvxbbvcx','VCXBCVXB','2021-08-22 03:31:51'),(163,'097bdc','adsfdshjgjjhg','adsfdshjgjjhg','jhgkjhgk','2021-08-22 03:32:10'),(164,'bf1402','YXCCMKLL','yxccmkll','DSSDF','2021-08-22 03:33:26'),(165,'d28e2a','iuoiuouizo','iuoiuouizo','oziuzoiu','2021-08-22 03:35:00'),(166,'d28e2a','ztuztuzur','ztuztuzur','zturutzu','2021-08-22 03:35:25'),(167,'bf1402','sakljhl','sakljhl','sdafsdaf','2021-08-22 03:36:05'),(168,'ac34c1','34534543','34534543','34534534','2021-08-22 03:36:14'),(169,'af9877','yxyxccxycxy','yxyxccxycxy','xcyxycxcyxcy','2021-08-22 03:36:29'),(170,'c3c52e','asfsadfsdaf','asfsadfsdaf','asdfsdafdasf','2021-08-23 04:11:03'),(171,'af9877','sadfsdafdsa','sadfsdafdsa','asdfasdfdsa','2021-08-23 04:11:09'),(172,'2dc3bc','55555','55555','555555555','2021-08-23 04:11:14'),(173,'ac34c1','111111111','111111111','11111111111','2021-08-23 04:11:19'),(174,'bf1402','22222222222','22222222222','22222222222','2021-08-23 04:11:24'),(175,'bb82c5','3333333333','3333333333','3333333333','2021-08-23 04:11:28'),(176,'2dc3bc','44444444444','44444444444','44444444444444','2021-08-23 04:11:31'),(177,'097bdc','66666666666','66666666666','6666666666666','2021-08-23 04:11:36'),(178,'67c166','777777','777777','7777777777','2021-08-23 04:11:41'),(179,'bf1402','888888888888','888888888888','888888888888','2021-08-23 04:11:45'),(180,'af9877','99999999999','99999999999','999999999999','2021-08-23 04:11:49'),(181,'af9877','000000000','000000000','00000000000','2021-08-23 04:11:53'),(182,'097bdc','SDFSDAF','sdfsdaf','SDAFSDAF','2021-08-23 06:46:56'),(183,'ac34c1','E45452','e45452','FDSAF13','2021-08-23 06:47:18'),(184,'70908e','67547657','67547657','65754756','2021-08-23 06:49:14'),(185,'189c3b','23432','23432','324234','2021-08-23 07:08:13'),(186,'67c166','324234','324234','324234','2021-08-23 07:08:40'),(187,'097bdc','sadfsadf','sadfsadf','sadfasdf','2021-08-23 11:16:39'),(188,'ac34c1','435345','435345','435345','2021-08-23 11:17:20'),(189,'d28e2a','324234df','324234df','324234','2021-08-23 11:31:17'),(190,'d64675','fdsafdf','fdsafdf','dasfsdaf','2021-08-23 11:32:01'),(191,'189c3b','asdfads3222','asdfads3222','fadsf','2021-08-23 12:18:23'),(192,'7dbef5','asdfadsf3222','asdfadsf3222','dasfsda2','2021-08-23 12:20:40'),(193,'189c3b','6743678','6743678','sdafsdaf','2021-08-23 12:24:17'),(194,'c3c52e','324235','324235','234234','2021-08-23 12:24:39'),(195,'d28e2a','23423','23423','324234','2021-08-23 12:25:09'),(196,'dcb882','32324','32324','324234','2021-08-23 12:25:41'),(197,'189c3b','34654','34654','sdafasd','2021-08-23 12:26:53'),(198,'9778bf','324324','324324','234234','2021-08-23 12:30:00'),(199,'d64675','54654654','54654654','546546','2021-08-23 12:30:22'),(200,'9778bf','657457','657457','6574674','2021-08-23 12:32:17'),(201,'2dc3bc','8796769','8796769','896879','2021-08-23 12:32:59'),(202,'097bdc','435435435','435435435','345345345','2021-08-23 12:34:05'),(203,'c3c52e','asfdsafasf','asfdsafasf','sadfdsafdasf','2021-08-24 06:45:59'),(204,'d28e2a','45443','45443','345435','2021-08-24 06:47:09'),(205,'7dbef5','43534532','43534532','345345','2021-08-24 06:49:23'),(206,'70908e','2323223','2323223','23322323','2021-08-24 06:50:02'),(207,'70908e','1211212','1211212','122112','2021-08-24 06:50:36'),(208,'bf1402','54545','54545','4545445','2021-08-24 06:51:29'),(209,'70908e','658876','658876','768768','2021-08-24 06:52:39'),(210,'2dc3bc','90980','90980','980980','2021-08-24 06:52:53'),(211,'7dbef5','23233232','23233232','32233232','2021-08-24 07:01:46'),(212,'9778bf','111111','111111','11111','2021-08-24 07:05:54'),(213,'d28e2a','33333','33333','33333','2021-08-24 07:07:22'),(214,'7dbef5','77777','77777','777777','2021-08-24 07:11:31'),(215,'2dc3bc','8888','8888','8888','2021-08-24 07:12:39'),(216,'67c166','000000','000000','000000','2021-08-24 07:15:17'),(217,'d64675','6666666','6666666','6666666','2021-08-24 07:17:02'),(218,'67c166','222222','222222','222222','2021-08-24 07:19:23'),(219,'d28e2a','2222222','2222222','22222','2021-08-24 07:20:52'),(220,'bf1402','233232','233232','23323232','2021-08-24 07:22:08'),(221,'dcb882','23142314','23142314','12342314','2021-08-24 11:36:54'),(222,'c3c52e','2343423423','2343423423','324234234','2021-08-24 11:45:04'),(223,'ac34c1','234234234','234234234','234234234','2021-08-24 11:45:08'),(224,'d64675','23423432','23423432','324324234','2021-08-24 11:45:11'),(225,'67c166','23423423422','23423423422','23423423422','2021-08-24 11:45:18'),(226,'2dc3bc','23423222222','23423222222','23423','2021-08-24 11:45:25'),(227,'9778bf','234654767','234654767','65436436','2021-08-24 11:45:30'),(228,'097bdc','432524525','432524525','324542354','2021-08-24 11:45:35'),(229,'af9877','12211221','12211221','21122121','2021-08-24 12:09:00'),(230,'70908e','Helloworld','helloworld','Hello world','2021-08-25 01:36:18'),(231,'7dbef5','32222','32222','23222','2021-08-25 01:46:14'),(232,'67c166','safsdaaaaaasdddf','safsdaaaaaasdddf','asdfasdfsdaf','2021-08-25 01:48:26'),(233,'7dbef5','99999999','99999999','9999999','2021-08-25 01:49:03'),(234,'d64675','qqqwwwe','qqqwwwe','qeqwwq','2021-08-25 01:51:18'),(235,'d28e2a','2342342433','2342342433','23423423','2021-08-25 03:06:52'),(236,'bf1402','654965','654965','dssfsadf','2021-08-25 03:12:23'),(237,'67c166','HelloWorldd','helloworldd','safdsa sdaf sdafa ','2021-08-27 06:19:00'),(238,'70908e','HelloWdsa','hellowdsa','sdafasdf','2021-08-29 08:02:41'),(239,'bf1402','zwoie','zwoie','sadfsadf','2021-08-30 16:07:22'),(240,'9778bf','ewqrzzz','ewqrzzz','sdafsadfasdfas dsa fa sdf ','2021-08-31 09:48:49'),(241,'7dbef5','Hello_World','hello_world','lol vision','2021-09-01 09:54:58'),(242,'189c3b','sadfsafdsaf','sadfsafdsaf','sdafadsfsdaf','2021-09-02 11:49:31'),(243,'ac34c1','sadfaaaa','sadfaaaa','sdafsdafsda sdf sda','2021-09-05 17:04:37'),(244,'9778bf','jlklkj','jlklkj','kjlkjlk','2021-09-06 17:14:51'),(245,'dcb882','hfgdhtrr','hfgdhtrr','tewtrewt','2021-09-07 11:51:56'),(246,'67c166','sadfsdaffff','sadfsdaffff','sadfsdaf','2021-09-07 17:56:02'),(247,'bb82c5','f342322','f342322','dsafdsaf','2021-09-07 22:58:16'),(248,'ac34c1','reteww','reteww','wetertrewt rwet erwt','2021-09-08 12:50:20'),(249,'7dbef5','asdfdsafsdaf','asdfdsafsdaf','dsafdasfsdaf','2021-09-16 19:23:52');
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
) ENGINE=InnoDB AUTO_INCREMENT=246 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageUser`
--

LOCK TABLES `PageUser` WRITE;
/*!40000 ALTER TABLE `PageUser` DISABLE KEYS */;
INSERT INTO `PageUser` VALUES (56,22,60,1,'2021-08-18 03:28:35','2021-08-18 03:28:35'),(57,26,61,1,'2021-08-18 17:55:06','2021-08-18 17:55:06'),(58,26,62,1,'2021-08-18 18:00:23','2021-08-18 18:00:23'),(59,26,63,1,'2021-08-18 18:09:20','2021-08-18 18:09:20'),(60,26,64,1,'2021-08-18 18:17:19','2021-08-18 18:17:19'),(61,26,65,1,'2021-08-18 18:18:42','2021-08-18 18:18:42'),(62,26,66,1,'2021-08-18 18:22:42','2021-08-18 18:22:42'),(63,27,67,1,'2021-08-19 05:33:48','2021-08-19 05:33:48'),(64,29,68,1,'2021-08-19 06:18:05','2021-08-19 06:18:05'),(65,29,69,1,'2021-08-19 06:19:44','2021-08-19 06:19:44'),(66,29,70,1,'2021-08-19 06:20:07','2021-08-19 06:20:07'),(67,29,71,1,'2021-08-19 06:22:03','2021-08-19 06:22:03'),(68,32,72,1,'2021-08-19 07:09:35','2021-08-19 07:09:35'),(69,32,73,1,'2021-08-19 07:09:45','2021-08-19 07:09:45'),(70,32,74,1,'2021-08-19 07:13:05','2021-08-19 07:13:05'),(71,32,75,1,'2021-08-19 07:13:27','2021-08-19 07:13:27'),(72,32,76,1,'2021-08-19 07:13:40','2021-08-19 07:13:40'),(73,32,77,1,'2021-08-19 07:13:56','2021-08-19 07:13:56'),(74,32,78,1,'2021-08-19 07:14:44','2021-08-19 07:14:44'),(75,32,79,1,'2021-08-19 07:16:10','2021-08-19 07:16:10'),(76,32,80,1,'2021-08-19 07:16:35','2021-08-19 07:16:35'),(77,33,81,1,'2021-08-19 07:22:20','2021-08-19 07:22:20'),(78,33,82,1,'2021-08-19 07:23:01','2021-08-19 07:23:01'),(79,33,83,1,'2021-08-19 07:23:37','2021-08-19 07:23:37'),(80,33,84,1,'2021-08-19 07:25:00','2021-08-19 07:25:00'),(81,33,85,1,'2021-08-19 07:25:17','2021-08-19 07:25:17'),(82,33,86,1,'2021-08-19 07:25:33','2021-08-19 07:25:33'),(83,33,87,1,'2021-08-19 07:27:15','2021-08-19 07:27:15'),(84,33,88,1,'2021-08-19 07:27:24','2021-08-19 07:27:24'),(85,33,89,1,'2021-08-19 07:27:43','2021-08-19 07:27:43'),(86,33,90,1,'2021-08-19 07:29:35','2021-08-19 07:29:35'),(87,33,91,1,'2021-08-19 07:31:12','2021-08-19 07:31:12'),(88,33,92,1,'2021-08-19 07:32:57','2021-08-19 07:32:57'),(89,33,93,1,'2021-08-19 07:33:36','2021-08-19 07:33:36'),(90,33,94,1,'2021-08-19 07:34:32','2021-08-19 07:34:32'),(91,33,95,1,'2021-08-19 07:36:35','2021-08-19 07:36:35'),(92,33,96,1,'2021-08-19 07:37:43','2021-08-19 07:37:43'),(93,33,97,1,'2021-08-19 07:38:55','2021-08-19 07:38:55'),(94,33,98,1,'2021-08-19 07:40:14','2021-08-19 07:40:14'),(95,33,99,1,'2021-08-19 07:40:38','2021-08-19 07:40:38'),(96,33,100,1,'2021-08-19 07:48:35','2021-08-19 07:48:35'),(97,33,101,1,'2021-08-19 07:52:29','2021-08-19 07:52:29'),(98,33,102,1,'2021-08-19 07:54:07','2021-08-19 07:54:07'),(99,33,103,1,'2021-08-19 07:54:48','2021-08-19 07:54:48'),(100,33,104,1,'2021-08-19 07:57:25','2021-08-19 07:57:25'),(101,33,105,1,'2021-08-19 07:58:47','2021-08-19 07:58:47'),(102,33,106,1,'2021-08-19 08:01:01','2021-08-19 08:01:01'),(103,33,107,1,'2021-08-19 08:02:44','2021-08-19 08:02:44'),(104,33,108,1,'2021-08-19 08:03:00','2021-08-19 08:03:00'),(105,33,109,1,'2021-08-19 08:14:51','2021-08-19 08:14:51'),(106,33,110,1,'2021-08-19 08:19:49','2021-08-19 08:19:49'),(107,33,111,1,'2021-08-19 08:19:59','2021-08-19 08:19:59'),(108,33,112,1,'2021-08-19 08:20:10','2021-08-19 08:20:10'),(109,33,113,1,'2021-08-19 08:20:51','2021-08-19 08:20:51'),(110,33,114,1,'2021-08-19 08:21:38','2021-08-19 08:21:38'),(111,33,115,1,'2021-08-19 08:21:50','2021-08-19 08:21:50'),(112,33,116,1,'2021-08-19 08:21:54','2021-08-19 08:21:54'),(113,33,117,1,'2021-08-19 08:22:05','2021-08-19 08:22:05'),(114,33,118,1,'2021-08-19 08:22:11','2021-08-19 08:22:11'),(115,33,119,1,'2021-08-19 08:22:21','2021-08-19 08:22:21'),(116,33,120,1,'2021-08-19 08:30:06','2021-08-19 08:30:06'),(117,35,121,1,'2021-08-20 03:39:15','2021-08-20 03:39:15'),(118,35,122,1,'2021-08-20 03:39:21','2021-08-20 03:39:21'),(119,35,123,1,'2021-08-20 03:39:26','2021-08-20 03:39:26'),(120,36,124,1,'2021-08-21 22:38:55','2021-08-21 22:38:55'),(121,36,125,1,'2021-08-22 01:31:37','2021-08-22 01:31:37'),(122,36,126,1,'2021-08-22 01:41:24','2021-08-22 01:41:24'),(123,36,127,1,'2021-08-22 01:46:30','2021-08-22 01:46:30'),(124,36,128,1,'2021-08-22 02:16:58','2021-08-22 02:16:58'),(125,36,129,1,'2021-08-22 02:17:27','2021-08-22 02:17:27'),(126,36,130,1,'2021-08-22 02:18:49','2021-08-22 02:18:49'),(127,36,131,1,'2021-08-22 02:22:36','2021-08-22 02:22:36'),(128,36,132,1,'2021-08-22 02:23:31','2021-08-22 02:23:31'),(129,36,133,1,'2021-08-22 02:24:32','2021-08-22 02:24:32'),(130,36,134,1,'2021-08-22 02:27:13','2021-08-22 02:27:13'),(131,36,135,1,'2021-08-22 02:27:18','2021-08-22 02:27:18'),(132,36,136,1,'2021-08-22 02:27:23','2021-08-22 02:27:23'),(133,36,137,1,'2021-08-22 02:58:48','2021-08-22 02:58:48'),(134,36,138,1,'2021-08-22 02:59:13','2021-08-22 02:59:13'),(135,36,139,1,'2021-08-22 02:59:39','2021-08-22 02:59:39'),(136,36,140,1,'2021-08-22 03:00:19','2021-08-22 03:00:19'),(137,36,141,1,'2021-08-22 03:01:33','2021-08-22 03:01:33'),(138,36,142,1,'2021-08-22 03:03:43','2021-08-22 03:03:43'),(139,36,143,1,'2021-08-22 03:04:19','2021-08-22 03:04:19'),(140,36,144,1,'2021-08-22 03:05:16','2021-08-22 03:05:16'),(141,36,145,1,'2021-08-22 03:08:21','2021-08-22 03:08:21'),(142,36,146,1,'2021-08-22 03:09:28','2021-08-22 03:09:28'),(143,36,147,1,'2021-08-22 03:09:51','2021-08-22 03:09:51'),(144,36,148,1,'2021-08-22 03:13:33','2021-08-22 03:13:33'),(145,36,149,1,'2021-08-22 03:14:32','2021-08-22 03:14:32'),(146,36,150,1,'2021-08-22 03:19:56','2021-08-22 03:19:56'),(147,36,151,1,'2021-08-22 03:21:59','2021-08-22 03:21:59'),(148,36,152,1,'2021-08-22 03:23:31','2021-08-22 03:23:31'),(149,36,153,1,'2021-08-22 03:24:58','2021-08-22 03:24:58'),(150,36,154,1,'2021-08-22 03:25:37','2021-08-22 03:25:37'),(151,36,155,1,'2021-08-22 03:26:19','2021-08-22 03:26:19'),(152,36,156,1,'2021-08-22 03:27:12','2021-08-22 03:27:12'),(153,36,157,1,'2021-08-22 03:27:44','2021-08-22 03:27:44'),(154,36,158,1,'2021-08-22 03:28:18','2021-08-22 03:28:18'),(155,36,159,1,'2021-08-22 03:28:38','2021-08-22 03:28:38'),(156,36,160,1,'2021-08-22 03:30:11','2021-08-22 03:30:11'),(157,36,161,1,'2021-08-22 03:31:01','2021-08-22 03:31:01'),(158,36,162,1,'2021-08-22 03:31:52','2021-08-22 03:31:52'),(159,36,163,1,'2021-08-22 03:32:11','2021-08-22 03:32:11'),(160,36,164,1,'2021-08-22 03:33:28','2021-08-22 03:33:28'),(161,36,165,1,'2021-08-22 03:35:00','2021-08-22 03:35:00'),(162,36,166,1,'2021-08-22 03:35:25','2021-08-22 03:35:25'),(163,36,167,1,'2021-08-22 03:36:06','2021-08-22 03:36:06'),(164,36,168,1,'2021-08-22 03:36:15','2021-08-22 03:36:15'),(165,36,169,1,'2021-08-22 03:36:30','2021-08-22 03:36:30'),(166,38,170,1,'2021-08-23 04:11:03','2021-08-23 04:11:03'),(167,38,171,1,'2021-08-23 04:11:09','2021-08-23 04:11:09'),(168,38,172,1,'2021-08-23 04:11:14','2021-08-23 04:11:14'),(169,38,173,1,'2021-08-23 04:11:19','2021-08-23 04:11:19'),(170,38,174,1,'2021-08-23 04:11:24','2021-08-23 04:11:24'),(171,38,175,1,'2021-08-23 04:11:28','2021-08-23 04:11:28'),(172,38,176,1,'2021-08-23 04:11:31','2021-08-23 04:11:31'),(173,38,177,1,'2021-08-23 04:11:36','2021-08-23 04:11:36'),(174,38,178,1,'2021-08-23 04:11:41','2021-08-23 04:11:41'),(175,38,179,1,'2021-08-23 04:11:45','2021-08-23 04:11:45'),(176,38,180,1,'2021-08-23 04:11:49','2021-08-23 04:11:49'),(177,38,181,1,'2021-08-23 04:11:53','2021-08-23 04:11:53'),(178,38,182,1,'2021-08-23 06:46:56','2021-08-23 06:46:56'),(179,38,183,1,'2021-08-23 06:47:18','2021-08-23 06:47:18'),(180,38,184,1,'2021-08-23 06:49:14','2021-08-23 06:49:14'),(181,38,185,1,'2021-08-23 07:08:13','2021-08-23 07:08:13'),(182,38,186,1,'2021-08-23 07:08:40','2021-08-23 07:08:40'),(183,39,187,1,'2021-08-23 11:16:39','2021-08-23 11:16:39'),(184,39,188,1,'2021-08-23 11:17:20','2021-08-23 11:17:20'),(185,39,189,1,'2021-08-23 11:31:17','2021-08-23 11:31:17'),(186,39,190,1,'2021-08-23 11:32:01','2021-08-23 11:32:01'),(187,39,191,1,'2021-08-23 12:18:23','2021-08-23 12:18:23'),(188,39,192,1,'2021-08-23 12:20:41','2021-08-23 12:20:41'),(189,39,193,1,'2021-08-23 12:24:17','2021-08-23 12:24:17'),(190,39,194,1,'2021-08-23 12:24:39','2021-08-23 12:24:39'),(191,39,195,1,'2021-08-23 12:25:09','2021-08-23 12:25:09'),(192,39,196,1,'2021-08-23 12:25:42','2021-08-23 12:25:42'),(193,39,197,1,'2021-08-23 12:26:53','2021-08-23 12:26:53'),(194,39,198,1,'2021-08-23 12:30:00','2021-08-23 12:30:00'),(195,39,199,1,'2021-08-23 12:30:22','2021-08-23 12:30:22'),(196,39,200,1,'2021-08-23 12:32:17','2021-08-23 12:32:17'),(197,39,201,1,'2021-08-23 12:32:59','2021-08-23 12:32:59'),(198,39,202,1,'2021-08-23 12:34:05','2021-08-23 12:34:05'),(199,40,203,1,'2021-08-24 06:45:59','2021-08-24 06:45:59'),(200,40,204,1,'2021-08-24 06:47:09','2021-08-24 06:47:09'),(201,40,205,1,'2021-08-24 06:49:23','2021-08-24 06:49:23'),(202,40,206,1,'2021-08-24 06:50:02','2021-08-24 06:50:02'),(203,40,207,1,'2021-08-24 06:50:36','2021-08-24 06:50:36'),(204,40,208,1,'2021-08-24 06:51:29','2021-08-24 06:51:29'),(205,40,209,1,'2021-08-24 06:52:39','2021-08-24 06:52:39'),(206,40,210,1,'2021-08-24 06:52:53','2021-08-24 06:52:53'),(207,40,211,1,'2021-08-24 07:01:46','2021-08-24 07:01:46'),(208,40,212,1,'2021-08-24 07:05:54','2021-08-24 07:05:54'),(209,40,213,1,'2021-08-24 07:07:22','2021-08-24 07:07:22'),(210,40,214,1,'2021-08-24 07:11:31','2021-08-24 07:11:31'),(211,40,215,1,'2021-08-24 07:12:40','2021-08-24 07:12:40'),(212,40,216,1,'2021-08-24 07:15:17','2021-08-24 07:15:17'),(213,40,217,1,'2021-08-24 07:17:02','2021-08-24 07:17:02'),(214,40,218,1,'2021-08-24 07:19:23','2021-08-24 07:19:23'),(215,40,219,1,'2021-08-24 07:20:52','2021-08-24 07:20:52'),(216,41,220,1,'2021-08-24 07:22:08','2021-08-24 07:22:08'),(217,42,221,1,'2021-08-24 11:36:54','2021-08-24 11:36:54'),(218,42,222,1,'2021-08-24 11:45:04','2021-08-24 11:45:04'),(219,42,223,1,'2021-08-24 11:45:08','2021-08-24 11:45:08'),(220,42,224,1,'2021-08-24 11:45:11','2021-08-24 11:45:11'),(221,42,225,1,'2021-08-24 11:45:18','2021-08-24 11:45:18'),(222,42,226,1,'2021-08-24 11:45:25','2021-08-24 11:45:25'),(223,42,227,1,'2021-08-24 11:45:31','2021-08-24 11:45:31'),(224,42,228,1,'2021-08-24 11:45:35','2021-08-24 11:45:35'),(225,42,229,1,'2021-08-24 12:09:01','2021-08-24 12:09:01'),(226,43,230,1,'2021-08-25 01:36:18','2021-08-25 01:36:18'),(227,43,231,1,'2021-08-25 01:46:15','2021-08-25 01:46:15'),(228,43,232,1,'2021-08-25 01:48:28','2021-08-25 01:48:28'),(229,43,233,1,'2021-08-25 01:49:03','2021-08-25 01:49:03'),(230,43,234,1,'2021-08-25 01:51:18','2021-08-25 01:51:18'),(231,46,235,1,'2021-08-25 03:06:53','2021-08-25 03:06:53'),(232,46,236,1,'2021-08-25 03:12:23','2021-08-25 03:12:23'),(233,47,237,1,'2021-08-27 06:19:00','2021-08-27 06:19:00'),(234,48,238,1,'2021-08-29 08:02:41','2021-08-29 08:02:41'),(235,49,239,1,'2021-08-30 16:07:22','2021-08-30 16:07:22'),(236,50,240,1,'2021-08-31 09:48:49','2021-08-31 09:48:49'),(237,51,241,1,'2021-09-01 09:54:58','2021-09-01 09:54:58'),(238,52,242,1,'2021-09-02 11:49:31','2021-09-02 11:49:31'),(239,53,243,1,'2021-09-05 17:04:37','2021-09-05 17:04:37'),(240,54,244,1,'2021-09-06 17:14:51','2021-09-06 17:14:51'),(241,55,245,1,'2021-09-07 11:51:56','2021-09-07 11:51:56'),(242,56,246,1,'2021-09-07 17:56:02','2021-09-07 17:56:02'),(243,57,247,1,'2021-09-07 22:58:16','2021-09-07 22:58:16'),(244,58,248,1,'2021-09-08 12:50:20','2021-09-08 12:50:20'),(245,59,249,1,'2021-09-16 19:23:52','2021-09-16 19:23:52');
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
INSERT INTO `Paper` VALUES (19,'1630872861292',10,1),(20,'1630878221865',10,1),(21,'1630948853018',11,1);
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
INSERT INTO `Paper_Media` VALUES (16,'paper_images/1630872910668/fWSfpRtJ/',17),(17,'paper_images/1630886447698/5No2b6AH/',18),(18,'paper_images/1630948853018/9lm1D3HD/',19);
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
INSERT INTO `Paper_Version` VALUES (17,19,'0.0.0',NULL,'2021-09-05 20:14:22'),(18,20,'0.0.0',NULL,'2021-09-05 22:17:50'),(19,21,'0.0.0',NULL,'2021-09-06 17:20:54');
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
  `public_address` varchar(103) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `profilePicture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `User_UN` (`username`),
  UNIQUE KEY `User_UN_P` (`public_address`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'7.227847712560349e+102','adsssadf',NULL,'2021-08-14 19:24:41'),(2,'6.567853787445032e+102','adsssad',NULL,'2021-08-14 19:26:24'),(3,'4.994242639255864e+102','adsssa',NULL,'2021-08-14 19:46:16'),(4,'1.3039334439429827e+102','alex',NULL,'2021-08-14 19:47:54'),(5,'5.535902976739252e+102','asdfdsaf',NULL,'2021-08-14 21:23:49'),(6,'7.739550349068523e+102','sadfasd',NULL,'2021-08-14 21:24:56'),(7,'2.161382329492717e+102','sdafasd',NULL,'2021-08-14 21:28:33'),(8,'8.501305283026834e+102','sadfasddd',NULL,'2021-08-14 22:18:03'),(9,'8.616782083258334e+101','aaaaa',NULL,'2021-08-14 22:18:55'),(10,'1.3754630589809903e+102','safsdaf',NULL,'2021-08-15 00:08:07'),(11,'3.428311551404517e+102','safs',NULL,'2021-08-15 00:12:51'),(12,'9.72402511310092e+101','aaasd',NULL,'2021-08-15 00:14:08'),(13,'5.4959921628428224e+101','asdfsad',NULL,'2021-08-15 00:20:42'),(14,'6.265140829910509e+102','sadfsad',NULL,'2021-08-15 00:40:51'),(15,'4.198197717640042e+102','alexx',NULL,'2021-08-15 15:47:46'),(16,'8.523779583723408e+102','safsdafdsfa',NULL,'2021-08-16 00:30:19'),(17,'4.562664590544081e+102','alexxx',NULL,'2021-08-16 15:01:15'),(18,'8.450671768429677e+102','alexxxxx','visionary_profile_picture/1629179161025/PdMyO1UB/','2021-08-16 20:17:41'),(19,'6.628135156457666e+102','aaasdf',NULL,'2021-08-17 03:43:06'),(20,'1.3357064824715258e+102','asaaa',NULL,'2021-08-17 03:45:52'),(21,'2.5398015439254553e+102','asdfasdg',NULL,'2021-08-17 05:56:08'),(22,'3.199357859227858e+102','alexxxx','visionary_profile_picture/1629241908451/rgYL9y6O/','2021-08-17 16:09:29'),(23,'4.592015585994699e+102','aaaaaaaasd','visionary_profile_picture/1629216861698/GmZ8etEw/','2021-08-17 16:13:35'),(24,'4.603290350567966e+102','asdfsdaf','visionary_profile_picture/1629216970125/yhnmnWgF/','2021-08-17 16:15:15'),(25,'3.275648398996731e+102','asfffffff','visionary_profile_picture/1629217001318/9PsWPKof/','2021-08-17 16:16:31'),(26,'2.5144394046736816e+102','alexxxxxx',NULL,'2021-08-18 16:35:39'),(27,'5.34045970871661e+102','dsafsada',NULL,'2021-08-19 04:02:53'),(28,'7.296987289783368e+102','asfdsaf',NULL,'2021-08-19 05:56:21'),(29,'8.305959107921009e+102','asdfsafsda',NULL,'2021-08-19 06:03:33'),(30,'2.1812325507466678e+102','asdfsdafff',NULL,'2021-08-19 06:34:39'),(31,'2.0250264003769637e+102','sadfadsf',NULL,'2021-08-19 06:41:14'),(32,'4.639741491770356e+102','asdfsdafkk',NULL,'2021-08-19 06:44:28'),(33,'6.382828618895331e+101','asfasf',NULL,'2021-08-19 07:22:04'),(34,'6.993047876070371e+102','dsafsdafsadfas','visionary_profile_picture/1629391702209/3j0mEgC8/','2021-08-19 16:48:03'),(35,'3.235500468442336e+102','sadfaaaa',NULL,'2021-08-20 02:48:45'),(36,'2.5305581566118407e+102','asfdsafaaa',NULL,'2021-08-21 18:00:49'),(37,'6.388564320334147e+102','iuzoiuzo',NULL,'2021-08-22 18:08:36'),(38,'5.301356357064575e+102','asfdsa2332',NULL,'2021-08-23 03:20:16'),(39,'2.8364045512575143e+102','56rte5',NULL,'2021-08-23 10:54:09'),(40,'5.946828549445196e+102','dsafsdaf',NULL,'2021-08-24 06:42:11'),(41,'5.618533410857918e+102','dsafdsaaaa',NULL,'2021-08-24 07:21:59'),(42,'7.083202374440045e+100','dsafadsf',NULL,'2021-08-24 07:53:24'),(43,'1.6288701235760217e+102','dsafdsaf',NULL,'2021-08-25 01:36:04'),(44,'5.249775379258445e+102','aaaadddf',NULL,'2021-08-25 02:43:24'),(45,'8.219905163501185e+101','sadfsaaadfgh',NULL,'2021-08-25 02:53:06'),(46,'5.096090403702996e+102','saaaadfl',NULL,'2021-08-25 03:06:44'),(47,'3.857670660899658e+102','ivialdsaf',NULL,'2021-08-27 06:18:43'),(48,'7.790055522123252e+102','asfsadw332',NULL,'2021-08-29 08:02:29'),(49,'2.1932415089826218e+102','af4w2',NULL,'2021-08-30 16:07:09'),(50,'9.981182687458562e+102','ewr3221',NULL,'2021-08-31 09:48:35'),(51,'2.5004631871997084e+102','hello',NULL,'2021-09-01 09:54:36'),(52,'6.616121427827863e+102','iouoioiu',NULL,'2021-09-02 11:49:21'),(53,'9.222458320091626e+102','sadfawww',NULL,'2021-09-05 17:04:29'),(54,'2.434190967766051e+102','alexxxxxxx',NULL,'2021-09-06 17:14:40'),(55,'1.8483475260214532e+102','sadfsdaf',NULL,'2021-09-07 11:51:44'),(56,'1.372498543631715e+102','2343244',NULL,'2021-09-07 17:55:52'),(57,'8.643461335914193e+102','aa322',NULL,'2021-09-07 22:58:08'),(58,'7.557235608823276e+102','tzteze',NULL,'2021-09-08 12:50:08'),(59,'3.756850002420822e+102','asfsdafsa',NULL,'2021-09-16 19:23:44');
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
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Session`
--

LOCK TABLES `User_Session` WRITE;
/*!40000 ALTER TABLE `User_Session` DISABLE KEYS */;
INSERT INTO `User_Session` VALUES (136,2,2130706433,'Linux 64','2021-08-14 19:26:25'),(137,3,2130706433,'Linux 64','2021-08-14 19:46:16'),(138,4,2130706433,'Linux 64','2021-08-14 19:47:54'),(139,5,2130706433,'Linux 64','2021-08-14 21:23:49'),(140,6,2130706433,'Linux 64','2021-08-14 21:24:57'),(141,7,2130706433,'Linux 64','2021-08-14 21:28:33'),(142,8,2130706433,'Linux 64','2021-08-14 22:18:03'),(143,9,2130706433,'Linux 64','2021-08-14 22:18:55'),(144,10,2130706433,'Linux 64','2021-08-15 00:08:07'),(145,11,2130706433,'Linux 64','2021-08-15 00:12:52'),(146,12,2130706433,'Linux 64','2021-08-15 00:14:08'),(147,13,2130706433,'Linux 64','2021-08-15 00:20:43'),(148,14,2130706433,'Linux 64','2021-08-15 00:40:51'),(149,15,2130706433,'Linux 64','2021-08-15 15:47:47'),(150,16,2130706433,'Linux 64','2021-08-16 00:30:19'),(151,17,2130706433,'Linux 64','2021-08-16 15:01:17'),(152,18,2130706433,'Linux 64','2021-08-16 20:17:41'),(153,19,2130706433,'Linux 64','2021-08-17 03:43:07'),(154,20,2130706433,'Linux 64','2021-08-17 03:45:52'),(155,21,2130706433,'Linux 64','2021-08-17 05:56:08'),(156,22,2130706433,'Linux 64','2021-08-17 16:09:29'),(157,23,2130706433,'Linux 64','2021-08-17 16:13:35'),(158,24,2130706433,'Linux 64','2021-08-17 16:15:16'),(159,25,2130706433,'Linux 64','2021-08-17 16:16:31'),(160,26,2130706433,'Linux 64','2021-08-18 16:35:40'),(161,27,2130706433,'Linux 64','2021-08-19 04:02:54'),(162,28,2130706433,'Linux 64','2021-08-19 05:56:21'),(163,29,2130706433,'Linux 64','2021-08-19 06:03:34'),(164,30,2130706433,'Linux 64','2021-08-19 06:34:39'),(165,31,2130706433,'Linux 64','2021-08-19 06:41:15'),(166,32,2130706433,'Linux 64','2021-08-19 06:44:28'),(167,33,2130706433,'Linux 64','2021-08-19 07:22:04'),(168,34,2130706433,'Linux 64','2021-08-19 16:48:03'),(169,35,2130706433,'Linux 64','2021-08-20 02:48:45'),(170,36,2130706433,'Linux 64','2021-08-21 18:00:50'),(171,37,2130706433,'Linux 64','2021-08-22 18:08:36'),(172,38,2130706433,'Linux 64','2021-08-23 03:20:17'),(173,39,2130706433,'Linux 64','2021-08-23 10:54:09'),(174,40,2130706433,'Linux 64','2021-08-24 06:42:12'),(175,41,2130706433,'Linux 64','2021-08-24 07:21:59'),(176,42,2130706433,'Linux 64','2021-08-24 07:53:24'),(177,43,2130706433,'Linux 64','2021-08-25 01:36:04'),(178,44,2130706433,'Linux 64','2021-08-25 02:43:25'),(179,45,2130706433,'Linux 64','2021-08-25 02:53:06'),(180,46,2130706433,'Linux 64','2021-08-25 03:06:44'),(181,47,2130706433,'Linux 64','2021-08-27 06:18:43'),(182,48,2130706433,'Linux 64','2021-08-29 08:02:29'),(183,49,2130706433,'Linux 64','2021-08-30 16:07:10'),(184,50,2130706433,'Linux 64','2021-08-31 09:48:35'),(185,51,2130706433,'Linux 64','2021-09-01 09:54:36'),(186,52,2130706433,'Linux 64','2021-09-02 11:49:22'),(187,53,2130706433,'Linux 64','2021-09-05 17:04:29'),(188,54,2130706433,'Linux 64','2021-09-06 17:14:40'),(189,55,2130706433,'Linux 64','2021-09-07 11:51:44'),(190,56,2130706433,'Linux 64','2021-09-07 17:55:52'),(191,57,2130706433,'Linux 64','2021-09-07 22:58:08'),(192,58,2130706433,'Linux 64','2021-09-08 12:50:09'),(193,59,2130706433,'Linux 64','2021-09-16 19:23:45');
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

-- Dump completed on 2021-09-17  3:15:12
