-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: proyectobd
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
-- Table structure for table `contratos`
--

DROP TABLE IF EXISTS `contratos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contratos` (
  `id_contrato` int NOT NULL,
  `rut` varchar(30) NOT NULL,
  `sueldo_bruto` int NOT NULL,
  `sueldo_liquido` int NOT NULL,
  `inicio_contrato` date NOT NULL,
  `telefono_1` int NOT NULL,
  `telefono_2` int DEFAULT NULL,
  `correo` varchar(15) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_contrato`),
  KEY `rut` (`rut`),
  CONSTRAINT `contratos_ibfk_1` FOREIGN KEY (`rut`) REFERENCES `funcionarios` (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contratos`
--

LOCK TABLES `contratos` WRITE;
/*!40000 ALTER TABLE `contratos` DISABLE KEYS */;
/*!40000 ALTER TABLE `contratos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formularios_turno`
--

DROP TABLE IF EXISTS `formularios_turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formularios_turno` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `hora_ingreso` time DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `descripcion_turno` text,
  `caso_sos` tinyint(1) DEFAULT '0',
  `descripcion_sos` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formularios_turno`
--

LOCK TABLES `formularios_turno` WRITE;
/*!40000 ALTER TABLE `formularios_turno` DISABLE KEYS */;
/*!40000 ALTER TABLE `formularios_turno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionarios` (
  `rut` varchar(12) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cargo` varchar(50) DEFAULT NULL,
  `clave` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionarios`
--

LOCK TABLES `funcionarios` WRITE;
/*!40000 ALTER TABLE `funcionarios` DISABLE KEYS */;
INSERT INTO `funcionarios` VALUES ('12345678-9','Juan Pﾃｩrez','Enfermero','clave123'),('98765432-1','Marﾃｭa Lﾃｳpez','Mﾃｩdico','clave456');
/*!40000 ALTER TABLE `funcionarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicamentos`
--

DROP TABLE IF EXISTS `medicamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rut_residente` varchar(12) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `dosis` varchar(100) DEFAULT NULL,
  `caso_sos` tinyint(1) DEFAULT '0',
  `medico_indicador` varchar(100) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_termino` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rut_residente` (`rut_residente`),
  CONSTRAINT `medicamentos_ibfk_1` FOREIGN KEY (`rut_residente`) REFERENCES `residentes` (`rut`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamentos`
--

LOCK TABLES `medicamentos` WRITE;
/*!40000 ALTER TABLE `medicamentos` DISABLE KEYS */;
INSERT INTO `medicamentos` VALUES (1,'11111111-1','Losartﾃ｡n','50mg cada 12 horas',0,'Dr. Martﾃｭnez','2024-01-01',NULL),(2,'22222222-2','Metformina','850mg cada 8 horas',0,'Dra. Sﾃ｡nchez','2024-02-01',NULL);
/*!40000 ALTER TABLE `medicamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paciente`
--

DROP TABLE IF EXISTS `paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paciente` (
  `rut` varchar(30) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `familiar` varchar(200) NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) NOT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) NOT NULL,
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
  `id_reemplazo` int NOT NULL,
  `rut_reemplazado` varchar(30) NOT NULL,
  `fecha` datetime NOT NULL,
  `pacientes` int DEFAULT NULL,
  `observacion` text,
  `rut_reemplazante` varchar(30) NOT NULL,
  PRIMARY KEY (`id_reemplazo`),
  KEY `rut_reemplazado` (`rut_reemplazado`),
  KEY `rut_reemplazante` (`rut_reemplazante`),
  CONSTRAINT `reemplazos_ibfk_1` FOREIGN KEY (`rut_reemplazado`) REFERENCES `funcionarios` (`rut`),
  CONSTRAINT `reemplazos_ibfk_2` FOREIGN KEY (`rut_reemplazante`) REFERENCES `funcionarios` (`rut`)
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
-- Table structure for table `registros_vitales`
--

DROP TABLE IF EXISTS `registros_vitales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros_vitales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rut_residente` varchar(12) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `tipo_signo_vital` varchar(50) DEFAULT NULL,
  `valor` varchar(20) DEFAULT NULL,
  `unidad` varchar(10) DEFAULT NULL,
  `diuresis_dia` varchar(50) DEFAULT NULL,
  `diuresis_noche` varchar(50) DEFAULT NULL,
  `deposicion` varchar(50) DEFAULT NULL,
  `vomito` varchar(50) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `registrado_por` varchar(100) DEFAULT NULL,
  `cargo` varchar(50) DEFAULT NULL,
  `turno` varchar(20) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id`),
  KEY `rut_residente` (`rut_residente`),
  CONSTRAINT `registros_vitales_ibfk_1` FOREIGN KEY (`rut_residente`) REFERENCES `residentes` (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros_vitales`
--

LOCK TABLES `registros_vitales` WRITE;
/*!40000 ALTER TABLE `registros_vitales` DISABLE KEYS */;
/*!40000 ALTER TABLE `registros_vitales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residentes`
--

DROP TABLE IF EXISTS `residentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residentes` (
  `rut` varchar(12) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `medico_tratante` varchar(100) DEFAULT NULL,
  `proximo_control` date DEFAULT NULL,
  `diagnostico` text,
  PRIMARY KEY (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residentes`
--

LOCK TABLES `residentes` WRITE;
/*!40000 ALTER TABLE `residentes` DISABLE KEYS */;
INSERT INTO `residentes` VALUES ('11111111-1','Ana Garcﾃｭa','1950-05-15','2024-01-01','Dr. Martﾃｭnez','2025-10-15','Hipertensiﾃｳn'),('22222222-2','Carlos Rodrﾃｭguez','1945-08-20','2024-02-01','Dra. Sﾃ｡nchez','2025-10-20','Diabetes tipo 2');
/*!40000 ALTER TABLE `residentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiene_urgencias`
--

DROP TABLE IF EXISTS `tiene_urgencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiene_urgencias` (
  `rut` varchar(30) NOT NULL,
  `id_urgencia` int NOT NULL,
  `rut_paciente` varchar(50) NOT NULL,
  KEY `rut` (`rut`),
  KEY `id_urgencia` (`id_urgencia`),
  KEY `rut_paciente` (`rut_paciente`),
  CONSTRAINT `tiene_urgencias_ibfk_1` FOREIGN KEY (`rut`) REFERENCES `funcionarios` (`rut`),
  CONSTRAINT `tiene_urgencias_ibfk_2` FOREIGN KEY (`id_urgencia`) REFERENCES `urgencias_medicas` (`id_urgencia`),
  CONSTRAINT `tiene_urgencias_ibfk_3` FOREIGN KEY (`rut_paciente`) REFERENCES `paciente` (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiene_urgencias`
--

LOCK TABLES `tiene_urgencias` WRITE;
/*!40000 ALTER TABLE `tiene_urgencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `tiene_urgencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `urgencias_medicas`
--

DROP TABLE IF EXISTS `urgencias_medicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `urgencias_medicas` (
  `id_urgencia` int NOT NULL,
  `rut` varchar(30) NOT NULL,
  `fecha` datetime NOT NULL,
  `observacion` text NOT NULL,
  `ala` varchar(20) NOT NULL,
  `procedimiento` text NOT NULL,
  `rut_paciente` varchar(30) NOT NULL,
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

-- Dump completed on 2025-09-23 20:47:25
