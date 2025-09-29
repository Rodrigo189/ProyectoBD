-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: proyectobd
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `apoderado`
--

DROP TABLE IF EXISTS `apoderado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apoderado` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `parentesco` varchar(40) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `correo` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apoderado`
--

LOCK TABLES `apoderado` WRITE;
/*!40000 ALTER TABLE `apoderado` DISABLE KEYS */;
INSERT INTO `apoderado` VALUES (1,'María Pérez','Hija','+56 9 1111 2222','maria@example.com'),(2,'Juan Pérez','Hijo','+56912345678','juanperez@mail.com'),(3,'Juan Pérez','Hijo','+56912345678','juanperez@mail.com'),(4,'Juan González','Hijo','+56 9 7777 6666','juan.gonzalez@example.com');
/*!40000 ALTER TABLE `apoderado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atencion`
--

DROP TABLE IF EXISTS `atencion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atencion` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `residente_rut` varchar(12) NOT NULL,
  `fecha` datetime NOT NULL,
  `motivo` varchar(200) NOT NULL,
  `profesional` varchar(100) DEFAULT NULL,
  `area` varchar(80) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id`),
  KEY `idx_at_res_fecha` (`residente_rut`,`fecha`),
  CONSTRAINT `fk_at_res` FOREIGN KEY (`residente_rut`) REFERENCES `residentes` (`rut`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atencion`
--

LOCK TABLES `atencion` WRITE;
/*!40000 ALTER TABLE `atencion` DISABLE KEYS */;
/*!40000 ALTER TABLE `atencion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calidad_apoyo`
--

DROP TABLE IF EXISTS `calidad_apoyo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calidad_apoyo` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calidad_apoyo`
--

LOCK TABLES `calidad_apoyo` WRITE;
/*!40000 ALTER TABLE `calidad_apoyo` DISABLE KEYS */;
INSERT INTO `calidad_apoyo` VALUES (4,'Buena'),(2,'Mala'),(1,'Nula'),(3,'Regular');
/*!40000 ALTER TABLE `calidad_apoyo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria_residente`
--

DROP TABLE IF EXISTS `categoria_residente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_residente` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_residente`
--

LOCK TABLES `categoria_residente` WRITE;
/*!40000 ALTER TABLE `categoria_residente` DISABLE KEYS */;
INSERT INTO `categoria_residente` VALUES (1,'Dependencia severa',NULL),(2,'Dependencia total',NULL),(3,'Dependencia leve','Requiere poca asistencia'),(4,'Dependencia moderada','Requiere apoyo frecuente');
/*!40000 ALTER TABLE `categoria_residente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrato_ingreso`
--

DROP TABLE IF EXISTS `contrato_ingreso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato_ingreso` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `residente_rut` varchar(12) NOT NULL,
  `habitacion_id` int unsigned NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `fecha_egreso` date DEFAULT NULL,
  `motivo_institucionalizacion` text,
  `origen_ingreso_id` tinyint unsigned NOT NULL,
  `categoria_residente_id` tinyint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ci_ori` (`origen_ingreso_id`),
  KEY `fk_ci_cat` (`categoria_residente_id`),
  KEY `idx_ci_res` (`residente_rut`),
  KEY `idx_ci_hab` (`habitacion_id`),
  CONSTRAINT `fk_ci_cat` FOREIGN KEY (`categoria_residente_id`) REFERENCES `categoria_residente` (`id`),
  CONSTRAINT `fk_ci_hab` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacion` (`id`),
  CONSTRAINT `fk_ci_ori` FOREIGN KEY (`origen_ingreso_id`) REFERENCES `origen_ingreso` (`id`),
  CONSTRAINT `fk_ci_res` FOREIGN KEY (`residente_rut`) REFERENCES `residentes` (`rut`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrato_ingreso`
--

LOCK TABLES `contrato_ingreso` WRITE;
/*!40000 ALTER TABLE `contrato_ingreso` DISABLE KEYS */;
INSERT INTO `contrato_ingreso` VALUES (4,'11111111-1',1,'2025-09-27',NULL,NULL,2,1),(5,'11111111-1',1,'2025-09-27',NULL,NULL,2,1);
/*!40000 ALTER TABLE `contrato_ingreso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrato_ingreso_medicamentos`
--

DROP TABLE IF EXISTS `contrato_ingreso_medicamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato_ingreso_medicamentos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contrato_ingreso_id` int unsigned NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `dosis` varchar(100) NOT NULL,
  `frecuencia` varchar(100) NOT NULL,
  `via_administracion` varchar(60) DEFAULT NULL,
  `observacion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cim_ci` (`contrato_ingreso_id`),
  CONSTRAINT `fk_cim_ci` FOREIGN KEY (`contrato_ingreso_id`) REFERENCES `contrato_ingreso` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrato_ingreso_medicamentos`
--

LOCK TABLES `contrato_ingreso_medicamentos` WRITE;
/*!40000 ALTER TABLE `contrato_ingreso_medicamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `contrato_ingreso_medicamentos` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Table structure for table `escolaridad`
--

DROP TABLE IF EXISTS `escolaridad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `escolaridad` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `escolaridad`
--

LOCK TABLES `escolaridad` WRITE;
/*!40000 ALTER TABLE `escolaridad` DISABLE KEYS */;
INSERT INTO `escolaridad` VALUES (1,'Analfabeto',NULL),(2,'Básica',NULL),(3,'Media',NULL),(4,'Superior/Técnica',NULL),(5,'Superior',NULL);
/*!40000 ALTER TABLE `escolaridad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examen_tipo`
--

DROP TABLE IF EXISTS `examen_tipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examen_tipo` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examen_tipo`
--

LOCK TABLES `examen_tipo` WRITE;
/*!40000 ALTER TABLE `examen_tipo` DISABLE KEYS */;
INSERT INTO `examen_tipo` VALUES (6,'ECG'),(2,'Glicemia'),(1,'Hemograma'),(4,'Orina'),(5,'Rayos X'),(3,'Sangre');
/*!40000 ALTER TABLE `examen_tipo` ENABLE KEYS */;
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
-- Table structure for table `habitacion`
--

DROP TABLE IF EXISTS `habitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitacion` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `piso` varchar(10) DEFAULT NULL,
  `ala` varchar(20) DEFAULT NULL,
  `camas` tinyint unsigned NOT NULL DEFAULT '1',
  `estado` enum('disponible','ocupada','mantencion') NOT NULL DEFAULT 'disponible',
  `observacion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitacion`
--

LOCK TABLES `habitacion` WRITE;
/*!40000 ALTER TABLE `habitacion` DISABLE KEYS */;
INSERT INTO `habitacion` VALUES (1,'A-101','1','Norte',2,'disponible',NULL),(2,'B-202','2','Sur',1,'disponible',NULL);
/*!40000 ALTER TABLE `habitacion` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamentos`
--

LOCK TABLES `medicamentos` WRITE;
/*!40000 ALTER TABLE `medicamentos` DISABLE KEYS */;
INSERT INTO `medicamentos` VALUES (3,'11111111-1','Paracetamol','500mg cada 8 horas',0,'Dr. Martínez','2025-09-01','2025-09-10');
/*!40000 ALTER TABLE `medicamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `origen_ingreso`
--

DROP TABLE IF EXISTS `origen_ingreso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `origen_ingreso` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `origen_ingreso`
--

LOCK TABLES `origen_ingreso` WRITE;
/*!40000 ALTER TABLE `origen_ingreso` DISABLE KEYS */;
INSERT INTO `origen_ingreso` VALUES (2,'Casa'),(1,'Hospital'),(3,'Otro');
/*!40000 ALTER TABLE `origen_ingreso` ENABLE KEYS */;
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
-- Table structure for table `patologia`
--

DROP TABLE IF EXISTS `patologia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patologia` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patologia`
--

LOCK TABLES `patologia` WRITE;
/*!40000 ALTER TABLE `patologia` DISABLE KEYS */;
INSERT INTO `patologia` VALUES (7,'Artrosis'),(6,'Cáncer'),(1,'Diabetes tipo I'),(2,'Diabetes tipo II'),(3,'EPOC'),(4,'Glaucoma'),(5,'Patología renal');
/*!40000 ALTER TABLE `patologia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prevision_salud`
--

DROP TABLE IF EXISTS `prevision_salud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prevision_salud` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prevision_salud`
--

LOCK TABLES `prevision_salud` WRITE;
/*!40000 ALTER TABLE `prevision_salud` DISABLE KEYS */;
INSERT INTO `prevision_salud` VALUES (1,'Fonasa'),(2,'Isapre');
/*!40000 ALTER TABLE `prevision_salud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prevision_social`
--

DROP TABLE IF EXISTS `prevision_social`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prevision_social` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prevision_social`
--

LOCK TABLES `prevision_social` WRITE;
/*!40000 ALTER TABLE `prevision_social` DISABLE KEYS */;
INSERT INTO `prevision_social` VALUES (1,'AFP'),(2,'IPS');
/*!40000 ALTER TABLE `prevision_social` ENABLE KEYS */;
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
-- Table structure for table `residente_alergia`
--

DROP TABLE IF EXISTS `residente_alergia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residente_alergia` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `residente_rut` varchar(12) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `contraindicaciones` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ral_res` (`residente_rut`),
  CONSTRAINT `fk_ral_res` FOREIGN KEY (`residente_rut`) REFERENCES `residentes` (`rut`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residente_alergia`
--

LOCK TABLES `residente_alergia` WRITE;
/*!40000 ALTER TABLE `residente_alergia` DISABLE KEYS */;
/*!40000 ALTER TABLE `residente_alergia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residente_apoderado`
--

DROP TABLE IF EXISTS `residente_apoderado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residente_apoderado` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `residente_rut` varchar(12) NOT NULL,
  `apoderado_id` int unsigned NOT NULL,
  `es_principal` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_res_apod` (`residente_rut`,`apoderado_id`),
  KEY `fk_ra_apo` (`apoderado_id`),
  CONSTRAINT `fk_ra_apo` FOREIGN KEY (`apoderado_id`) REFERENCES `apoderado` (`id`),
  CONSTRAINT `fk_ra_res` FOREIGN KEY (`residente_rut`) REFERENCES `residentes` (`rut`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residente_apoderado`
--

LOCK TABLES `residente_apoderado` WRITE;
/*!40000 ALTER TABLE `residente_apoderado` DISABLE KEYS */;
/*!40000 ALTER TABLE `residente_apoderado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residente_examen`
--

DROP TABLE IF EXISTS `residente_examen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residente_examen` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `residente_rut` varchar(12) NOT NULL,
  `examen_tipo_id` smallint unsigned NOT NULL,
  `fecha` date NOT NULL,
  `resultado_texto` text,
  `archivo_url` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_re_tipo` (`examen_tipo_id`),
  KEY `idx_re_res_fecha` (`residente_rut`,`fecha`),
  CONSTRAINT `fk_re_res` FOREIGN KEY (`residente_rut`) REFERENCES `residentes` (`rut`) ON DELETE CASCADE,
  CONSTRAINT `fk_re_tipo` FOREIGN KEY (`examen_tipo_id`) REFERENCES `examen_tipo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residente_examen`
--

LOCK TABLES `residente_examen` WRITE;
/*!40000 ALTER TABLE `residente_examen` DISABLE KEYS */;
/*!40000 ALTER TABLE `residente_examen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residente_ficha`
--

DROP TABLE IF EXISTS `residente_ficha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residente_ficha` (
  `residente_rut` varchar(12) NOT NULL,
  `prevision_salud_id` tinyint unsigned DEFAULT NULL,
  `prevision_social_id` tinyint unsigned DEFAULT NULL,
  `direccion_actual` varchar(200) DEFAULT NULL,
  `actividad_laboral_previa` varchar(120) DEFAULT NULL,
  `religion` varchar(60) DEFAULT NULL,
  `estado_civil` varchar(30) DEFAULT NULL,
  `escolaridad_id` tinyint unsigned DEFAULT NULL,
  `lectoescritura` tinyint(1) NOT NULL DEFAULT '1',
  `vive_solo` tinyint(1) NOT NULL DEFAULT '0',
  `calidad_apoyo_id` tinyint unsigned DEFAULT NULL,
  `analfabeto` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`residente_rut`),
  KEY `fk_rf_ps` (`prevision_salud_id`),
  KEY `fk_rf_pso` (`prevision_social_id`),
  KEY `fk_rf_esc` (`escolaridad_id`),
  KEY `fk_rf_cap` (`calidad_apoyo_id`),
  CONSTRAINT `fk_rf_cap` FOREIGN KEY (`calidad_apoyo_id`) REFERENCES `calidad_apoyo` (`id`),
  CONSTRAINT `fk_rf_esc` FOREIGN KEY (`escolaridad_id`) REFERENCES `escolaridad` (`id`),
  CONSTRAINT `fk_rf_ps` FOREIGN KEY (`prevision_salud_id`) REFERENCES `prevision_salud` (`id`),
  CONSTRAINT `fk_rf_pso` FOREIGN KEY (`prevision_social_id`) REFERENCES `prevision_social` (`id`),
  CONSTRAINT `fk_rf_res` FOREIGN KEY (`residente_rut`) REFERENCES `residentes` (`rut`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residente_ficha`
--

LOCK TABLES `residente_ficha` WRITE;
/*!40000 ALTER TABLE `residente_ficha` DISABLE KEYS */;
INSERT INTO `residente_ficha` VALUES ('11111111-1',1,2,NULL,NULL,NULL,NULL,3,1,0,1,0);
/*!40000 ALTER TABLE `residente_ficha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residente_patologia`
--

DROP TABLE IF EXISTS `residente_patologia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residente_patologia` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `residente_rut` varchar(12) NOT NULL,
  `patologia_id` smallint unsigned NOT NULL,
  `fecha_diagnostico` date DEFAULT NULL,
  `detalle` varchar(200) DEFAULT NULL,
  `vigente` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_res_pat` (`residente_rut`,`patologia_id`,`vigente`),
  KEY `fk_rp_pat` (`patologia_id`),
  CONSTRAINT `fk_rp_pat` FOREIGN KEY (`patologia_id`) REFERENCES `patologia` (`id`),
  CONSTRAINT `fk_rp_res` FOREIGN KEY (`residente_rut`) REFERENCES `residentes` (`rut`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residente_patologia`
--

LOCK TABLES `residente_patologia` WRITE;
/*!40000 ALTER TABLE `residente_patologia` DISABLE KEYS */;
/*!40000 ALTER TABLE `residente_patologia` ENABLE KEYS */;
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
  `sexo` enum('M','F','O') DEFAULT NULL,
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
INSERT INTO `residentes` VALUES ('11111111-1','Ana García','1950-05-15',NULL,'2024-01-01','Dr. Martínez','2025-10-15','Hipertensión'),('string','string','2025-09-26',NULL,'2025-09-26','string','2025-09-26','string');
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

--
-- Temporary view structure for view `vw_ficha_clinica_residente`
--

DROP TABLE IF EXISTS `vw_ficha_clinica_residente`;
/*!50001 DROP VIEW IF EXISTS `vw_ficha_clinica_residente`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_ficha_clinica_residente` AS SELECT 
 1 AS `rut`,
 1 AS `nombre`,
 1 AS `fecha_nacimiento`,
 1 AS `edad`,
 1 AS `fecha_ingreso`,
 1 AS `medico_tratante`,
 1 AS `proximo_control`,
 1 AS `diagnostico`,
 1 AS `direccion_actual`,
 1 AS `actividad_laboral_previa`,
 1 AS `religion`,
 1 AS `estado_civil`,
 1 AS `escolaridad`,
 1 AS `lectoescritura`,
 1 AS `analfabeto`,
 1 AS `vive_solo`,
 1 AS `calidad_apoyo`,
 1 AS `prevision_salud`,
 1 AS `prevision_social`,
 1 AS `motivo_institucionalizacion`,
 1 AS `origen_ingreso`,
 1 AS `categoria_residente`,
 1 AS `habitacion`,
 1 AS `piso`,
 1 AS `ala`,
 1 AS `camas`,
 1 AS `estado_habitacion`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_residente_alergias`
--

DROP TABLE IF EXISTS `vw_residente_alergias`;
/*!50001 DROP VIEW IF EXISTS `vw_residente_alergias`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_residente_alergias` AS SELECT 
 1 AS `residente_rut`,
 1 AS `descripcion`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_residente_apoderados`
--

DROP TABLE IF EXISTS `vw_residente_apoderados`;
/*!50001 DROP VIEW IF EXISTS `vw_residente_apoderados`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_residente_apoderados` AS SELECT 
 1 AS `residente_rut`,
 1 AS `nombre`,
 1 AS `parentesco`,
 1 AS `telefono`,
 1 AS `correo`,
 1 AS `es_principal`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_residente_examenes`
--

DROP TABLE IF EXISTS `vw_residente_examenes`;
/*!50001 DROP VIEW IF EXISTS `vw_residente_examenes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_residente_examenes` AS SELECT 
 1 AS `residente_rut`,
 1 AS `tipo`,
 1 AS `fecha`,
 1 AS `resultado`,
 1 AS `archivo_url`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_residente_patologias`
--

DROP TABLE IF EXISTS `vw_residente_patologias`;
/*!50001 DROP VIEW IF EXISTS `vw_residente_patologias`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_residente_patologias` AS SELECT 
 1 AS `residente_rut`,
 1 AS `patologia`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_residente_ubicacion_actual`
--

DROP TABLE IF EXISTS `vw_residente_ubicacion_actual`;
/*!50001 DROP VIEW IF EXISTS `vw_residente_ubicacion_actual`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_residente_ubicacion_actual` AS SELECT 
 1 AS `residente_rut`,
 1 AS `habitacion_id`,
 1 AS `habitacion`,
 1 AS `fecha_ingreso`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_ficha_clinica_residente`
--

/*!50001 DROP VIEW IF EXISTS `vw_ficha_clinica_residente`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_ficha_clinica_residente` AS select `r`.`rut` AS `rut`,`r`.`nombre` AS `nombre`,`r`.`fecha_nacimiento` AS `fecha_nacimiento`,timestampdiff(YEAR,`r`.`fecha_nacimiento`,curdate()) AS `edad`,`r`.`fecha_ingreso` AS `fecha_ingreso`,`r`.`medico_tratante` AS `medico_tratante`,`r`.`proximo_control` AS `proximo_control`,`r`.`diagnostico` AS `diagnostico`,`f`.`direccion_actual` AS `direccion_actual`,`f`.`actividad_laboral_previa` AS `actividad_laboral_previa`,`f`.`religion` AS `religion`,`f`.`estado_civil` AS `estado_civil`,`e`.`nombre` AS `escolaridad`,`f`.`lectoescritura` AS `lectoescritura`,`f`.`analfabeto` AS `analfabeto`,`f`.`vive_solo` AS `vive_solo`,`ca`.`nombre` AS `calidad_apoyo`,`ps`.`nombre` AS `prevision_salud`,`psoc`.`nombre` AS `prevision_social`,`ci`.`motivo_institucionalizacion` AS `motivo_institucionalizacion`,`oi`.`nombre` AS `origen_ingreso`,`cr`.`nombre` AS `categoria_residente`,`h`.`codigo` AS `habitacion`,`h`.`piso` AS `piso`,`h`.`ala` AS `ala`,`h`.`camas` AS `camas`,`h`.`estado` AS `estado_habitacion` from (((((((((`residentes` `r` left join `residente_ficha` `f` on((`f`.`residente_rut` = `r`.`rut`))) left join `escolaridad` `e` on((`f`.`escolaridad_id` = `e`.`id`))) left join `calidad_apoyo` `ca` on((`f`.`calidad_apoyo_id` = `ca`.`id`))) left join `prevision_salud` `ps` on((`f`.`prevision_salud_id` = `ps`.`id`))) left join `prevision_social` `psoc` on((`f`.`prevision_social_id` = `psoc`.`id`))) left join `contrato_ingreso` `ci` on((`ci`.`residente_rut` = `r`.`rut`))) left join `origen_ingreso` `oi` on((`ci`.`origen_ingreso_id` = `oi`.`id`))) left join `categoria_residente` `cr` on((`ci`.`categoria_residente_id` = `cr`.`id`))) left join `habitacion` `h` on((`ci`.`habitacion_id` = `h`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_residente_alergias`
--

/*!50001 DROP VIEW IF EXISTS `vw_residente_alergias`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_residente_alergias` AS select `residente_alergia`.`residente_rut` AS `residente_rut`,`residente_alergia`.`descripcion` AS `descripcion` from `residente_alergia` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_residente_apoderados`
--

/*!50001 DROP VIEW IF EXISTS `vw_residente_apoderados`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_residente_apoderados` AS select `ra`.`residente_rut` AS `residente_rut`,`a`.`nombre` AS `nombre`,`a`.`parentesco` AS `parentesco`,`a`.`telefono` AS `telefono`,`a`.`correo` AS `correo`,`ra`.`es_principal` AS `es_principal` from (`residente_apoderado` `ra` join `apoderado` `a` on((`ra`.`apoderado_id` = `a`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_residente_examenes`
--

/*!50001 DROP VIEW IF EXISTS `vw_residente_examenes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_residente_examenes` AS select `re`.`residente_rut` AS `residente_rut`,`et`.`nombre` AS `tipo`,`re`.`fecha` AS `fecha`,`re`.`resultado_texto` AS `resultado`,`re`.`archivo_url` AS `archivo_url` from (`residente_examen` `re` join `examen_tipo` `et` on((`re`.`examen_tipo_id` = `et`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_residente_patologias`
--

/*!50001 DROP VIEW IF EXISTS `vw_residente_patologias`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_residente_patologias` AS select `rp`.`residente_rut` AS `residente_rut`,`p`.`nombre` AS `patologia` from (`residente_patologia` `rp` join `patologia` `p` on((`rp`.`patologia_id` = `p`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_residente_ubicacion_actual`
--

/*!50001 DROP VIEW IF EXISTS `vw_residente_ubicacion_actual`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_residente_ubicacion_actual` AS select `ci`.`residente_rut` AS `residente_rut`,`ci`.`habitacion_id` AS `habitacion_id`,`h`.`codigo` AS `habitacion`,`ci`.`fecha_ingreso` AS `fecha_ingreso` from (`contrato_ingreso` `ci` join `habitacion` `h` on((`h`.`id` = `ci`.`habitacion_id`))) where (`ci`.`fecha_egreso` is null) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-29 18:56:00
