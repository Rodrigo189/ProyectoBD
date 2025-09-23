-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: liquidacion
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `contrato`
--

DROP TABLE IF EXISTS `contrato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato` (
  `rut_empleado` int NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `apellido_paterno` varchar(20) NOT NULL,
  `apellido_materno` varchar(20) NOT NULL,
  `genero` enum('H','M','X','O') NOT NULL,
  `especialidad` enum('Enfermería','Kinesiología','Tecnología','Medico') NOT NULL,
  `inicio_de_contrato` date NOT NULL,
  `sueldo_bruto` int NOT NULL,
  `sueldo_liquido` int DEFAULT NULL,
  `telefono1` int NOT NULL,
  `telefono2` int DEFAULT NULL,
  `correo` varchar(15) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rut_empleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrato`
--

LOCK TABLES `contrato` WRITE;
/*!40000 ALTER TABLE `contrato` DISABLE KEYS */;
/*!40000 ALTER TABLE `contrato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paciente`
--

DROP TABLE IF EXISTS `paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paciente` (
  `rut` int NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `apellido1` varchar(20) NOT NULL,
  `apellido2` varchar(20) NOT NULL,
  `fec_nac` date NOT NULL,
  PRIMARY KEY (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paciente`
--

LOCK TABLES `paciente` WRITE;
/*!40000 ALTER TABLE `paciente` DISABLE KEYS */;
/*!40000 ALTER TABLE `paciente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reemplazos`
--

DROP TABLE IF EXISTS `reemplazos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reemplazos` (
  `id_reemplazo` int NOT NULL AUTO_INCREMENT,
  `rut_reemplazado` int NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `rut_reemplazante` int NOT NULL,
  `pacientes` int DEFAULT NULL,
  `observacion` text,
  PRIMARY KEY (`id_reemplazo`),
  KEY `rut_reemplazado` (`rut_reemplazado`),
  KEY `rut_reemplazante` (`rut_reemplazante`),
  CONSTRAINT `reemplazos_ibfk_1` FOREIGN KEY (`rut_reemplazado`) REFERENCES `contrato` (`rut_empleado`),
  CONSTRAINT `reemplazos_ibfk_2` FOREIGN KEY (`rut_reemplazante`) REFERENCES `contrato` (`rut_empleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reemplazos`
--

LOCK TABLES `reemplazos` WRITE;
/*!40000 ALTER TABLE `reemplazos` DISABLE KEYS */;
/*!40000 ALTER TABLE `reemplazos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportes`
--

DROP TABLE IF EXISTS `reportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportes` (
  `rut_paciente` int NOT NULL,
  `descripcion` text NOT NULL,
  `observación` text,
  `tipo_de_reporte` varchar(15) NOT NULL,
  `id_reporte` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_reporte`),
  KEY `rut_paciente` (`rut_paciente`),
  CONSTRAINT `reportes_ibfk_2` FOREIGN KEY (`rut_paciente`) REFERENCES `paciente` (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportes`
--

LOCK TABLES `reportes` WRITE;
/*!40000 ALTER TABLE `reportes` DISABLE KEYS */;
/*!40000 ALTER TABLE `reportes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiene_reporte`
--

DROP TABLE IF EXISTS `tiene_reporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiene_reporte` (
  `rut_empleado` int NOT NULL,
  `id_reporte` int DEFAULT NULL,
  KEY `rut_empleado` (`rut_empleado`),
  KEY `id_reporte` (`id_reporte`),
  CONSTRAINT `tiene_reporte_ibfk_1` FOREIGN KEY (`rut_empleado`) REFERENCES `contrato` (`rut_empleado`),
  CONSTRAINT `tiene_reporte_ibfk_2` FOREIGN KEY (`id_reporte`) REFERENCES `reportes` (`id_reporte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiene_reporte`
--

LOCK TABLES `tiene_reporte` WRITE;
/*!40000 ALTER TABLE `tiene_reporte` DISABLE KEYS */;
/*!40000 ALTER TABLE `tiene_reporte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiene_urgencia`
--

DROP TABLE IF EXISTS `tiene_urgencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiene_urgencia` (
  `rut_empleado` int NOT NULL,
  `id_urgencia` int NOT NULL,
  KEY `rut_empleado` (`rut_empleado`),
  KEY `id_urgencia` (`id_urgencia`),
  CONSTRAINT `tiene_urgencia_ibfk_1` FOREIGN KEY (`rut_empleado`) REFERENCES `contrato` (`rut_empleado`),
  CONSTRAINT `tiene_urgencia_ibfk_2` FOREIGN KEY (`id_urgencia`) REFERENCES `urgencias_medicas` (`id_urgencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiene_urgencia`
--

LOCK TABLES `tiene_urgencia` WRITE;
/*!40000 ALTER TABLE `tiene_urgencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `tiene_urgencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `urgencias_medicas`
--

DROP TABLE IF EXISTS `urgencias_medicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `urgencias_medicas` (
  `id_urgencia` int NOT NULL AUTO_INCREMENT,
  `rut_paciente` int NOT NULL,
  `fecha` datetime NOT NULL,
  `observacion` text NOT NULL,
  `ala` varchar(20) NOT NULL,
  `procedimiento` text NOT NULL,
  PRIMARY KEY (`id_urgencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `urgencias_medicas`
--

LOCK TABLES `urgencias_medicas` WRITE;
/*!40000 ALTER TABLE `urgencias_medicas` DISABLE KEYS */;
/*!40000 ALTER TABLE `urgencias_medicas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-01 19:55:13
