-- MySQL dump 10.13  Distrib 8.0.14, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: newnode
-- ------------------------------------------------------
-- Server version	8.0.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `role` varchar(255) DEFAULT 'user',
  `user_pass` varchar(255) DEFAULT '0000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,'Fenan','Active','Admin','1234'),(4,'Red Alem','Active','Admin','$2b$10$S/8Zr8h6JSTrVzc0p.Cp6.DJ6zAhBT2PKjx1VvnjysXZOBXcX5S2K'),(6,'Tekalign Andarge','Active','User','$2b$10$S/8Zr8h6JSTrVzc0p.Cp6.DJ6zAhBT2PKjx1VvnjysXZOBXcX5S2K'),(7,'Edl Girma','Inactive','User','$2b$10$S/8Zr8h6JSTrVzc0p.Cp6.DJ6zAhBT2PKjx1VvnjysXZOBXcX5S2K'),(8,'Mrs Roman','Active','User','$2b$10$S/8Zr8h6JSTrVzc0p.Cp6.DJ6zAhBT2PKjx1VvnjysXZOBXcX5S2K'),(11,'Dinael','Active','User','$2b$10$OTAwlaeJZ.Ah14laMSBks.gq19Loqp/yBIFGba9aXcY8nLDqGQage'),(13,'Hiwot Alemayehu','Active','User','$2b$10$S/8Zr8h6JSTrVzc0p.Cp6.DJ6zAhBT2PKjx1VvnjysXZOBXcX5S2K'),(14,'User','Active','User','$2b$10$S/8Zr8h6JSTrVzc0p.Cp6.DJ6zAhBT2PKjx1VvnjysXZOBXcX5S2K'),(16,'Admin','Active','Admin','$2b$10$S/8Zr8h6JSTrVzc0p.Cp6.DJ6zAhBT2PKjx1VvnjysXZOBXcX5S2K'),(20,'Kitaw Ejigu','Active','User','$2b$10$/CnyfT1roB7fipqpca0idOyeSUhHiKhlhalxEjbr6At59gVtGsc7i');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-26 13:02:11
