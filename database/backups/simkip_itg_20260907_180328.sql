/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.8-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: simkip_itg
-- ------------------------------------------------------
-- Server version	11.8.8-MariaDB-1 from Debian

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `jenis` enum('SP','Validasi','Hapus','Approve','Login','Ubah','Ekspor','Laporan','Tambah') NOT NULL,
  `aktivitas` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `terkait_nim` varchar(20) DEFAULT NULL,
  `terkait_nama` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES
(1,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-08-31 14:57:46'),
(2,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 04:35:28'),
(3,1,'Ubah','Mengubah status mahasiswa Kailla Salsabila (2306064) dari Aktif menjadi Nonaktif',NULL,'2306064','Kailla Salsabila','127.0.0.1','2026-09-01 05:22:31'),
(4,1,'Ubah','Mengubah status mahasiswa Kailla Salsabila (2306064) dari Nonaktif menjadi Aktif',NULL,'2306064','Kailla Salsabila','127.0.0.1','2026-09-01 05:22:41'),
(5,1,'Tambah','Tambah mahasiswa: Praja Muda (2507077)',NULL,'2507077','Praja Muda','127.0.0.1','2026-09-01 07:03:09'),
(6,1,'SP','Terbitkan SP1 untuk Praja Muda (2507077)',NULL,'2507077','Praja Muda','127.0.0.1','2026-09-01 07:29:11'),
(7,1,'SP','Terbitkan SP1 untuk Marwata Waskita (202511003)',NULL,'202511003','Marwata Waskita','127.0.0.1','2026-09-01 08:17:26'),
(8,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 08:27:43'),
(9,1,'SP','Terbitkan SP1 untuk Gina Uyainah (202506001)',NULL,'202506001','Gina Uyainah','127.0.0.1','2026-09-01 08:28:37'),
(10,1,'SP','Terbitkan SP1 untuk Zaenab Astuti (202206001)',NULL,'202206001','Zaenab Astuti','127.0.0.1','2026-09-01 08:41:00'),
(11,1,'SP','Terbitkan SP1 untuk Yunita Prakasa (202306001)',NULL,'202306001','Yunita Prakasa','127.0.0.1','2026-09-01 08:45:45'),
(12,NULL,'Login','Login: Zaenab Astuti (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 10:42:47'),
(13,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 10:51:39'),
(14,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 12:08:46'),
(15,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 14:44:40'),
(16,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 14:59:15'),
(17,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 14:59:59'),
(18,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 15:01:07'),
(19,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 15:05:50'),
(20,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 16:03:05'),
(21,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-01 16:07:52'),
(22,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 00:02:45'),
(23,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 00:08:42'),
(24,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 00:32:02'),
(25,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 00:32:25'),
(26,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 01:17:04'),
(27,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 01:31:20'),
(28,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 02:06:27'),
(29,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 02:06:38'),
(30,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 02:07:56'),
(31,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 02:19:24'),
(32,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 02:20:07'),
(33,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 02:20:37'),
(34,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 02:20:49'),
(35,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 02:21:44'),
(36,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 02:44:42'),
(37,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 02:49:19'),
(38,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 05:16:43'),
(39,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 06:22:26'),
(40,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 06:23:15'),
(41,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 06:23:35'),
(42,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 06:23:46'),
(43,NULL,'Ubah','Reset status IPK semester 6 Kailla Salsabila (2306064) ke Menunggu karena pengajuan ulang','Status diubah dari Diajukan/Ditolak menjadi Menunggu agar muncul di antrian validasi admin','2306064','Kailla Salsabila','127.0.0.1','2026-09-02 06:30:08'),
(44,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 07:31:32'),
(45,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 08:05:37'),
(46,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 08:06:18'),
(47,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 08:07:56'),
(48,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 08:55:11'),
(49,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 08:56:18'),
(50,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 08:57:32'),
(51,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 08:57:47'),
(52,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 09:00:13'),
(53,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 09:01:07'),
(54,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 09:01:40'),
(55,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 09:02:38'),
(56,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 09:03:47'),
(57,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 09:05:05'),
(58,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 09:06:31'),
(59,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 12:35:08'),
(60,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 12:36:01'),
(61,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 12:56:42'),
(62,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 12:59:34'),
(63,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 13:01:01'),
(64,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 13:52:20'),
(65,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 13:53:13'),
(66,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 14:02:40'),
(67,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 14:04:30'),
(68,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 14:06:01'),
(69,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 14:21:44'),
(70,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 14:24:21'),
(71,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 14:25:41'),
(72,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 14:27:21'),
(73,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 14:34:14'),
(74,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 14:36:14'),
(75,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 15:00:59'),
(76,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 15:20:18'),
(77,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 15:48:04'),
(78,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 15:50:42'),
(79,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 15:52:59'),
(80,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 16:02:05'),
(81,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 16:17:21'),
(82,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 16:28:12'),
(83,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 16:41:27'),
(84,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 16:54:01'),
(85,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 17:19:06'),
(86,NULL,'Login','Login: Wisnu Fujiati (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 19:17:33'),
(87,1,'Ubah','Update status SP SP1 → Selesai (202306001)',NULL,'202306001','Wisnu Fujiati','127.0.0.1','2026-09-02 19:18:20'),
(88,1,'Ubah','Update status SP SP1 → Selesai (202206001)',NULL,'202206001','Samiah Prasasta','127.0.0.1','2026-09-02 19:31:45'),
(89,NULL,'Login','Login: Dadi Salahudin (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 20:33:02'),
(90,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 22:46:17'),
(91,NULL,'Login','Login: Harto Marpaung (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 22:47:21'),
(92,NULL,'Login','Login: Ahmad Rizky Pratama (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 22:54:11'),
(93,NULL,'Login','Login: Rina Marlina (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 22:58:33'),
(94,1,'Approve','Terbitkan bebas tanggungan Rina Marlina (2507106)',NULL,'2507106','Rina Marlina','127.0.0.1','2026-09-02 23:16:00'),
(95,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 23:17:58'),
(96,NULL,'Login','Login: Kaprodi Teknik Informatika (prodi)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 23:40:12'),
(97,NULL,'Login','Login: Dr. Rina Kurniawati, S.E., M.Si. (warek)',NULL,NULL,NULL,'127.0.0.1','2026-09-02 23:50:29'),
(98,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 00:01:07'),
(99,NULL,'Login','Login: Kaprodi Teknik Informatika (prodi)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 01:04:33'),
(100,NULL,'Login','Login: Dr. Rina Kurniawati, S.E., M.Si. (warek)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 01:06:47'),
(101,NULL,'Login','Login: Kaprodi Teknik Informatika (prodi)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 01:53:43'),
(102,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 01:54:50'),
(103,NULL,'Login','Login: Dr. Rina Kurniawati, S.E., M.Si. (warek)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 01:58:22'),
(104,NULL,'Login','Login: Dr. Rina Kurniawati, S.E., M.Si. (warek)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:40:54'),
(105,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:41:09'),
(106,1,'Laporan','Buat laporan: LAPORAN EVALUASI SEMESTER GENAP TA 2025/2026',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:41:53'),
(107,1,'Laporan','Submit laporan: LAPORAN EVALUASI SEMESTER GENAP TA 2025/2026',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:41:53'),
(108,NULL,'Login','Login: Dr. Rina Kurniawati, S.E., M.Si. (warek)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:42:10'),
(109,2,'Approve','Warek setujui laporan: LAPORAN EVALUASI SEMESTER GENAP TA 2025/2026',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:42:36'),
(110,NULL,'Login','Login: Kaprodi Teknik Informatika (prodi)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:42:51'),
(111,NULL,'Login','Login: Dr. Rina Kurniawati, S.E., M.Si. (warek)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:43:27'),
(112,1,'Laporan','Buat laporan: LAPORAN EVALUASI SEMESTER GANJIL TA 2026/2027 — TEKNIK INFORMATIKA',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:45:44'),
(113,1,'Laporan','Submit laporan: LAPORAN EVALUASI SEMESTER GANJIL TA 2026/2027 — TEKNIK INFORMATIKA',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:45:44'),
(114,2,'Approve','Warek setujui laporan: LAPORAN EVALUASI SEMESTER GANJIL TA 2026/2027 — TEKNIK INFORMATIKA',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:46:01'),
(115,NULL,'Login','Login: Kaprodi Teknik Informatika (prodi)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 03:46:25'),
(116,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 06:17:58'),
(117,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-03 06:18:05'),
(118,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-04 03:05:38'),
(119,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-04 11:55:49'),
(120,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-04 12:44:48'),
(121,1,'SP','Terbitkan SP1 untuk Harto Marpaung (202311001)',NULL,'202311001','Harto Marpaung','127.0.0.1','2026-09-05 00:53:39'),
(122,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 01:26:59'),
(123,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 01:29:21'),
(124,NULL,'Login','Login: Kaprodi Teknik Informatika (prodi)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 01:55:52'),
(125,NULL,'Login','Login: Kaprodi Teknik Informatika (prodi)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 01:56:07'),
(126,NULL,'Login','Login: Dr. Rina Kurniawati, S.E., M.Si. (warek)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 02:35:34'),
(127,NULL,'Login','Login: Dr. Rina Kurniawati, S.E., M.Si. (warek)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 02:47:48'),
(128,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 02:55:44'),
(129,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 02:56:21'),
(130,NULL,'Login','Login: Kaprodi Teknik Informatika (prodi)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 03:03:40'),
(131,NULL,'Login','Login: Kailla Salsabila (mahasiswa)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 03:03:52'),
(132,NULL,'Login','Login: Encep Jianul Hayat (admin)',NULL,NULL,NULL,'127.0.0.1','2026-09-05 03:10:08');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `bebas_tanggungan_histories`
--

DROP TABLE IF EXISTS `bebas_tanggungan_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bebas_tanggungan_histories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `bebas_tanggungan_id` bigint(20) unsigned NOT NULL,
  `status` varchar(255) NOT NULL,
  `catatan` text DEFAULT NULL,
  `reviewed_by` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bebas_tanggungan_histories_bebas_tanggungan_id_foreign` (`bebas_tanggungan_id`),
  KEY `bebas_tanggungan_histories_reviewed_by_foreign` (`reviewed_by`),
  CONSTRAINT `bebas_tanggungan_histories_bebas_tanggungan_id_foreign` FOREIGN KEY (`bebas_tanggungan_id`) REFERENCES `bebas_tanggungans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bebas_tanggungan_histories_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bebas_tanggungan_histories`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `bebas_tanggungan_histories` WRITE;
/*!40000 ALTER TABLE `bebas_tanggungan_histories` DISABLE KEYS */;
INSERT INTO `bebas_tanggungan_histories` VALUES
(1,12,'Ditolak','Dokumen pendukung perbaikan IPK belum memenuhi standar audit akademik.',1,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(2,19,'Ditolak','Terdapat riwayat Surat Peringatan yang belum dicharKAN closed-loop.',1,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(3,24,'Ditolak','Dokumen pendukung perbaikan IPK belum memenuhi standar audit akademik.',1,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(4,28,'Ditolak','Dokumen pendukung perbaikan IPK belum memenuhi standar audit akademik.',1,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(5,32,'Ditolak','Dokumen pendukung perbaikan IPK belum memenuhi standar audit akademik.',1,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(6,41,'Menunggu','Pengajuan awal',452,'2026-09-02 15:55:39','2026-09-02 15:55:39'),
(7,41,'Ditolak','gapapa mau aja',1,'2026-09-02 15:56:19','2026-09-02 15:56:19'),
(8,41,'Menunggu','Pengajuan ulang',452,'2026-09-02 15:57:00','2026-09-02 15:57:00'),
(9,42,'Menunggu','Pengajuan awal',457,'2026-09-02 15:58:48','2026-09-02 15:58:48'),
(10,42,'Ditolak','karena apa we',1,'2026-09-02 16:00:06','2026-09-02 16:00:06'),
(11,42,'Menunggu','Pengajuan ulang',457,'2026-09-02 16:12:11','2026-09-02 16:12:11'),
(12,42,'Ditolak','ajuin ulang',1,'2026-09-02 16:12:47','2026-09-02 16:12:47'),
(13,42,'Menunggu','Pengajuan ulang',457,'2026-09-02 16:15:41','2026-09-02 16:15:41'),
(14,42,'Disetujui','Surat diterbitkan dengan nomor SKPS/KIP-K/ITG/09/2026/042',1,'2026-09-02 16:16:00','2026-09-02 16:16:00');
/*!40000 ALTER TABLE `bebas_tanggungan_histories` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `bebas_tanggungans`
--

DROP TABLE IF EXISTS `bebas_tanggungans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bebas_tanggungans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mahasiswa_id` bigint(20) unsigned NOT NULL,
  `tanggal_ajukan` date NOT NULL,
  `status` enum('Menunggu','Diproses','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu',
  `catatan_admin` text DEFAULT NULL,
  `reviewed_by` bigint(20) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `nomor_surat` varchar(100) DEFAULT NULL,
  `tanggal_terbit` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bebas_tanggungans_mahasiswa_id_foreign` (`mahasiswa_id`),
  KEY `bebas_tanggungans_reviewed_by_foreign` (`reviewed_by`),
  CONSTRAINT `bebas_tanggungans_mahasiswa_id_foreign` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bebas_tanggungans_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bebas_tanggungans`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `bebas_tanggungans` WRITE;
/*!40000 ALTER TABLE `bebas_tanggungans` DISABLE KEYS */;
INSERT INTO `bebas_tanggungans` VALUES
(5,96,'2026-03-11','Disetujui',NULL,1,'2026-03-18 17:00:00','SKPS/KIP-K/ITG/03/2026/005','2026-03-24','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(6,141,'2026-03-13','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(7,142,'2026-03-09','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(8,143,'2026-03-09','Disetujui',NULL,1,'2026-03-21 17:00:00','SKPS/KIP-K/ITG/03/2026/008','2026-03-21','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(9,144,'2026-03-14','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(10,145,'2026-03-06','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(11,146,'2026-03-12','Disetujui',NULL,1,'2026-03-23 17:00:00','SKPS/KIP-K/ITG/03/2026/011','2026-03-24','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(12,147,'2026-03-08','Ditolak','Dokumen pendukung perbaikan IPK belum memenuhi standar audit akademik.',1,'2026-03-10 17:00:00',NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(13,147,'2026-08-20','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(14,148,'2026-03-08','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(15,149,'2026-03-03','Disetujui',NULL,1,'2026-03-15 17:00:00','SKPS/KIP-K/ITG/03/2026/015','2026-03-17','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(16,150,'2026-03-07','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(17,151,'2026-03-05','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(18,152,'2026-03-14','Disetujui',NULL,1,'2026-03-20 17:00:00','SKPS/KIP-K/ITG/03/2026/018','2026-03-29','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(19,153,'2026-03-04','Ditolak','Terdapat riwayat Surat Peringatan yang belum dicharKAN closed-loop.',1,'2026-03-14 17:00:00',NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(20,153,'2026-08-23','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(21,154,'2026-03-04','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(22,155,'2026-03-06','Disetujui',NULL,1,'2026-03-08 17:00:00','SKPS/KIP-K/ITG/03/2026/022','2026-03-20','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(23,126,'2026-02-10','Disetujui',NULL,1,'2026-02-15 17:00:00','SKPS/KIP-K/ITG/02/2026/023','2026-02-18','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(24,127,'2026-02-10','Ditolak','Dokumen pendukung perbaikan IPK belum memenuhi standar audit akademik.',1,'2026-02-16 17:00:00',NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(25,127,'2026-08-26','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(26,128,'2026-02-15','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(27,129,'2026-02-10','Disetujui',NULL,1,'2026-02-15 17:00:00','SKPS/KIP-K/ITG/02/2026/027','2026-02-23','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(28,130,'2026-02-08','Ditolak','Dokumen pendukung perbaikan IPK belum memenuhi standar audit akademik.',1,'2026-02-12 17:00:00',NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(29,130,'2026-08-18','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(30,131,'2026-02-06','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(31,132,'2026-02-15','Disetujui',NULL,1,'2026-02-25 17:00:00','SKPS/KIP-K/ITG/02/2026/031','2026-03-01','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(32,133,'2026-02-20','Ditolak','Terdapat riwayat Surat Peringatan yang belum dicharKAN closed-loop.',1,'2026-02-28 17:00:00',NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(33,133,'2026-08-26','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(34,134,'2026-02-09','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(35,135,'2026-02-12','Disetujui',NULL,1,'2026-02-14 17:00:00','SKPS/KIP-K/ITG/02/2026/035','2026-02-23','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(36,136,'2026-02-07','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(37,137,'2026-02-16','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(38,138,'2026-02-12','Disetujui',NULL,1,'2026-02-16 17:00:00','SKPS/KIP-K/ITG/02/2026/038','2026-02-27','2026-09-01 03:49:51','2026-09-01 03:49:51'),
(39,139,'2026-02-13','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(40,140,'2026-02-08','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-01 03:49:51','2026-09-01 03:49:51'),
(41,201,'2026-09-02','Menunggu',NULL,NULL,NULL,NULL,NULL,'2026-09-02 15:55:39','2026-09-02 15:57:00'),
(42,206,'2026-09-02','Disetujui',NULL,1,'2026-09-02 16:16:00','SKPS/KIP-K/ITG/09/2026/042','2026-09-02','2026-09-02 15:58:48','2026-09-02 16:16:00');
/*!40000 ALTER TABLE `bebas_tanggungans` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES
('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba','i:1;',1788577867),
('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba:timer','i:1788577867;',1788577867),
('laravel-cache-nilai_mutu_map','a:7:{s:1:\"A\";a:8:{s:2:\"id\";i:1;s:3:\"min\";d:80;s:3:\"max\";d:100;s:5:\"huruf\";s:1:\"A\";s:4:\"poin\";d:4;s:5:\"lulus\";b:1;s:10:\"created_at\";N;s:10:\"updated_at\";N;}s:2:\"AB\";a:8:{s:2:\"id\";i:2;s:3:\"min\";d:75;s:3:\"max\";d:79.9;s:5:\"huruf\";s:2:\"AB\";s:4:\"poin\";d:3.5;s:5:\"lulus\";b:1;s:10:\"created_at\";N;s:10:\"updated_at\";N;}s:1:\"B\";a:8:{s:2:\"id\";i:3;s:3:\"min\";d:70;s:3:\"max\";d:74.9;s:5:\"huruf\";s:1:\"B\";s:4:\"poin\";d:3;s:5:\"lulus\";b:1;s:10:\"created_at\";N;s:10:\"updated_at\";N;}s:2:\"BC\";a:8:{s:2:\"id\";i:4;s:3:\"min\";d:65;s:3:\"max\";d:69.9;s:5:\"huruf\";s:2:\"BC\";s:4:\"poin\";d:2.5;s:5:\"lulus\";b:1;s:10:\"created_at\";N;s:10:\"updated_at\";N;}s:1:\"C\";a:8:{s:2:\"id\";i:5;s:3:\"min\";d:60;s:3:\"max\";d:64.9;s:5:\"huruf\";s:1:\"C\";s:4:\"poin\";d:2;s:5:\"lulus\";b:1;s:10:\"created_at\";N;s:10:\"updated_at\";N;}s:1:\"D\";a:8:{s:2:\"id\";i:6;s:3:\"min\";d:55;s:3:\"max\";d:59.9;s:5:\"huruf\";s:1:\"D\";s:4:\"poin\";d:1;s:5:\"lulus\";b:0;s:10:\"created_at\";N;s:10:\"updated_at\";N;}s:1:\"E\";a:8:{s:2:\"id\";i:7;s:3:\"min\";d:0;s:3:\"max\";d:54.9;s:5:\"huruf\";s:1:\"E\";s:4:\"poin\";d:0;s:5:\"lulus\";b:0;s:10:\"created_at\";N;s:10:\"updated_at\";N;}}',1788581034),
('simkip-itg-cache-5c785c036466adea360111aa28563bfd556b5fba','i:1;',1788400762),
('simkip-itg-cache-5c785c036466adea360111aa28563bfd556b5fba:timer','i:1788400762;',1788400762);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `catatan_internals`
--

DROP TABLE IF EXISTS `catatan_internals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `catatan_internals` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mahasiswa_id` bigint(20) unsigned NOT NULL,
  `tahun_ajaran` varchar(50) NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `deskripsi` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catatan_internals_mahasiswa_id_foreign` (`mahasiswa_id`),
  CONSTRAINT `catatan_internals_mahasiswa_id_foreign` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catatan_internals`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `catatan_internals` WRITE;
/*!40000 ALTER TABLE `catatan_internals` DISABLE KEYS */;
INSERT INTO `catatan_internals` VALUES
(1,127,'2022/2023 Genap','Finansial','Membutuhkan beasiswa tambahan untuk menutupi biaya hidup selama semester berjalan.','2026-09-01 04:55:07','2026-09-01 04:55:07'),
(2,127,'2023/2024 Ganjil','Fasilitas','Akses internet di area asrama sangat lambat, mengganggu pembelajaran online.','2026-09-01 04:55:07','2026-09-01 04:55:07'),
(3,130,'2022/2023 Ganjil','Finansial','Kesulitan membayar uang kuliah tepat waktu karena keterbatasan ekonomi keluarga.','2026-09-01 04:55:09','2026-09-01 04:55:09'),
(4,133,'2022/2023 Ganjil','Finansial','Kesulitan membayar uang kuliah tepat waktu karena keterbatasan ekonomi keluarga.','2026-09-01 04:55:12','2026-09-01 04:55:12'),
(5,133,'2022/2023 Ganjil','Akademik','Sulit menyesuaikan diri dengan sistem evaluasi di beberapa mata kuliah.','2026-09-01 04:55:12','2026-09-01 04:55:12'),
(6,134,'2022/2023 Ganjil','Finansial','Biaya transportasi ke kampus menjadi beban mengingat jarak dari rumah ke kampus cukup jauh.','2026-09-01 04:55:13','2026-09-01 04:55:13'),
(7,136,'2022/2023 Genap','Finansial','Biaya transportasi ke kampus menjadi beban mengingat jarak dari rumah ke kampus cukup jauh.','2026-09-01 04:55:14','2026-09-01 04:55:14'),
(8,139,'2022/2023 Genap','Akademik','Kesulitan mengikuti materi perkuliahan karena metode pengajaran yang kurang cocok.','2026-09-01 04:55:17','2026-09-01 04:55:17'),
(9,140,'2023/2024 Ganjil','Fasilitas','Fasilitas olahraga di kampus perlu perbaikan agar bisa digunakan optimal.','2026-09-01 04:55:17','2026-09-01 04:55:17'),
(10,142,'2023/2024 Ganjil','Akademik','Sulit menyesuaikan diri dengan sistem evaluasi di beberapa mata kuliah.','2026-09-01 04:55:19','2026-09-01 04:55:19'),
(11,143,'2023/2024 Genap','Finansial','Biaya transportasi ke kampus menjadi beban mengingat jarak dari rumah ke kampus cukup jauh.','2026-09-01 04:55:20','2026-09-01 04:55:20');
/*!40000 ALTER TABLE `catatan_internals` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `contact_histories`
--

DROP TABLE IF EXISTS `contact_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_histories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `no_hp` varchar(20) NOT NULL,
  `keterangan` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_histories_user_id_foreign` (`user_id`),
  CONSTRAINT `contact_histories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_histories`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `contact_histories` WRITE;
/*!40000 ALTER TABLE `contact_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_histories` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `dokumen_field_values`
--

DROP TABLE IF EXISTS `dokumen_field_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `dokumen_field_values` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `dokumen_id` bigint(20) unsigned NOT NULL,
  `dokumen_jenis_field_id` bigint(20) unsigned NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dokumen_field_values_dokumen_id_foreign` (`dokumen_id`),
  KEY `dokumen_field_values_dokumen_jenis_field_id_foreign` (`dokumen_jenis_field_id`),
  CONSTRAINT `dokumen_field_values_dokumen_id_foreign` FOREIGN KEY (`dokumen_id`) REFERENCES `dokumens` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dokumen_field_values_dokumen_jenis_field_id_foreign` FOREIGN KEY (`dokumen_jenis_field_id`) REFERENCES `dokumen_jenis_fields` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dokumen_field_values`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `dokumen_field_values` WRITE;
/*!40000 ALTER TABLE `dokumen_field_values` DISABLE KEYS */;
INSERT INTO `dokumen_field_values` VALUES
(2,867,1,'ITG','2026-09-02 11:02:57','2026-09-02 11:02:57');
/*!40000 ALTER TABLE `dokumen_field_values` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `dokumen_jenis`
--

DROP TABLE IF EXISTS `dokumen_jenis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `dokumen_jenis` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `kode` varchar(255) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `is_wajib` tinyint(1) NOT NULL DEFAULT 1,
  `urutan` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dokumen_jenis`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `dokumen_jenis` WRITE;
/*!40000 ALTER TABLE `dokumen_jenis` DISABLE KEYS */;
INSERT INTO `dokumen_jenis` VALUES
(1,'PKKMB',NULL,NULL,1,1,'2026-08-31 07:54:56','2026-08-31 07:54:56'),
(2,'MABIM',NULL,NULL,1,2,'2026-08-31 07:54:56','2026-08-31 07:54:56'),
(3,'Bela Negara',NULL,NULL,1,3,'2026-08-31 07:54:56','2026-08-31 07:54:56'),
(4,'Sertifikasi',NULL,NULL,0,4,'2026-08-31 07:54:56','2026-09-01 04:54:09'),
(5,'Berita Acara KP',NULL,NULL,0,5,'2026-08-31 07:54:56','2026-09-02 10:51:03'),
(6,'KHS',NULL,NULL,0,0,'2026-08-31 21:21:33','2026-09-01 04:34:13'),
(7,'Pakta Integritas',NULL,NULL,1,0,'2026-08-31 21:21:33','2026-08-31 21:40:35');
/*!40000 ALTER TABLE `dokumen_jenis` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `dokumen_jenis_fields`
--

DROP TABLE IF EXISTS `dokumen_jenis_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `dokumen_jenis_fields` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `dokumen_jenis_id` bigint(20) unsigned NOT NULL,
  `label` varchar(255) NOT NULL,
  `tipe` enum('text','number','date','url','dropdown','checkbox') NOT NULL,
  `opsi` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT 0,
  `urutan` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dokumen_jenis_fields_dokumen_jenis_id_foreign` (`dokumen_jenis_id`),
  CONSTRAINT `dokumen_jenis_fields_dokumen_jenis_id_foreign` FOREIGN KEY (`dokumen_jenis_id`) REFERENCES `dokumen_jenis` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dokumen_jenis_fields_chk_1` CHECK (json_valid(`opsi`))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dokumen_jenis_fields`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `dokumen_jenis_fields` WRITE;
/*!40000 ALTER TABLE `dokumen_jenis_fields` DISABLE KEYS */;
INSERT INTO `dokumen_jenis_fields` VALUES
(1,5,'Tempat KP','text',NULL,1,0,'2026-09-02 10:50:46','2026-09-02 10:50:46');
/*!40000 ALTER TABLE `dokumen_jenis_fields` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `dokumens`
--

DROP TABLE IF EXISTS `dokumens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `dokumens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mahasiswa_id` bigint(20) unsigned NOT NULL,
  `dokumen_jenis_id` bigint(20) unsigned NOT NULL,
  `nama_file` varchar(255) NOT NULL,
  `path_file` varchar(255) NOT NULL,
  `ukuran` int(11) DEFAULT NULL,
  `status` enum('Menunggu','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu',
  `catatan_admin` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `approved_by` bigint(20) unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dokumens_mahasiswa_id_foreign` (`mahasiswa_id`),
  KEY `dokumens_dokumen_jenis_id_foreign` (`dokumen_jenis_id`),
  KEY `dokumens_approved_by_foreign` (`approved_by`),
  CONSTRAINT `dokumens_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `dokumens_dokumen_jenis_id_foreign` FOREIGN KEY (`dokumen_jenis_id`) REFERENCES `dokumen_jenis` (`id`),
  CONSTRAINT `dokumens_mahasiswa_id_foreign` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dokumens_chk_1` CHECK (json_valid(`metadata`))
) ENGINE=InnoDB AUTO_INCREMENT=952 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dokumens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `dokumens` WRITE;
/*!40000 ALTER TABLE `dokumens` DISABLE KEYS */;
INSERT INTO `dokumens` VALUES
(123,96,7,'Pakta_Integritas_2306064.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-21 17:00:00'),
(124,96,1,'Sertifikat_PKKMB_2306064.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(125,96,3,'Sertifikat_BelaNegara_2306064.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-19 17:00:00'),
(126,96,2,'Sertifikat_MABIM_2306064.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-24 17:00:00'),
(127,96,4,'Sertifikat_Kompetensi_2306064.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-09-02 01:24:00','2026-05-09 17:00:00','2026-09-02 01:24:00'),
(128,96,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_2306064.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-09-02 02:49:33','2024-02-09 17:00:00','2026-09-02 02:49:33'),
(129,96,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_2306064.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-09-02 02:49:33','2024-08-09 17:00:00','2026-09-02 02:49:33'),
(130,96,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_2306064.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-09-02 02:49:33','2025-02-09 17:00:00','2026-09-02 02:49:33'),
(131,96,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_2306064.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-09-02 02:49:33','2025-08-09 17:00:00','2026-09-02 02:49:33'),
(132,96,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_2306064.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-09-02 02:49:33','2026-02-09 17:00:00','2026-09-02 02:49:33'),
(226,126,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202206001.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(227,126,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202206001.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(228,126,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202206001.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(229,126,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202206001.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(230,126,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202206001.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(231,126,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202206001.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(232,126,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202206001.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(233,126,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202206001.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(234,126,7,'Pakta_Integritas_202206001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(235,126,1,'Sertifikat_PKKMB_202206001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(236,126,3,'Sertifikat_BelaNegara_202206001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(237,126,2,'Sertifikat_MABIM_202206001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(238,126,4,'Sertifikat_Kompetensi_202206001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-05-09 17:00:00','2025-05-14 17:00:00'),
(239,127,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202206002.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(240,127,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202206002.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(241,127,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202206002.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(242,127,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202206002.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(243,127,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202206002.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(244,127,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202206002.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(245,127,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202206002.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(246,127,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202206002.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(247,127,7,'Pakta_Integritas_202206002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(248,127,1,'Sertifikat_PKKMB_202206002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(249,127,3,'Sertifikat_BelaNegara_202206002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(250,127,2,'Sertifikat_MABIM_202206002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(251,128,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202206003.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(252,128,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202206003.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(253,128,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202206003.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(254,128,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202206003.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(255,128,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202206003.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(256,128,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202206003.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(257,128,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202206003.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(258,128,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202206003.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(259,128,7,'Pakta_Integritas_202206003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(260,128,1,'Sertifikat_PKKMB_202206003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(261,128,3,'Sertifikat_BelaNegara_202206003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(262,128,2,'Sertifikat_MABIM_202206003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(263,129,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202207001.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(264,129,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202207001.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(265,129,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202207001.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(266,129,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202207001.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(267,129,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202207001.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(268,129,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202207001.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(269,129,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202207001.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(270,129,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202207001.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(271,129,7,'Pakta_Integritas_202207001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(272,129,1,'Sertifikat_PKKMB_202207001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(273,129,3,'Sertifikat_BelaNegara_202207001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(274,129,2,'Sertifikat_MABIM_202207001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(275,129,4,'Sertifikat_Kompetensi_202207001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-05-09 17:00:00','2025-05-14 17:00:00'),
(276,130,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202207002.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(277,130,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202207002.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(278,130,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202207002.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(279,130,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202207002.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(280,130,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202207002.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(281,130,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202207002.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(282,130,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202207002.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(283,130,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202207002.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(284,130,7,'Pakta_Integritas_202207002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(285,130,1,'Sertifikat_PKKMB_202207002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(286,130,3,'Sertifikat_BelaNegara_202207002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(287,130,2,'Sertifikat_MABIM_202207002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(288,131,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202207003.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(289,131,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202207003.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(290,131,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202207003.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(291,131,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202207003.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(292,131,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202207003.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(293,131,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202207003.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(294,131,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202207003.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(295,131,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202207003.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(296,131,7,'Pakta_Integritas_202207003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(297,131,1,'Sertifikat_PKKMB_202207003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(298,131,3,'Sertifikat_BelaNegara_202207003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(299,131,2,'Sertifikat_MABIM_202207003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(300,132,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202203001.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(301,132,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202203001.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(302,132,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202203001.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(303,132,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202203001.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(304,132,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202203001.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(305,132,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202203001.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(306,132,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202203001.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(307,132,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202203001.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(308,132,7,'Pakta_Integritas_202203001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(309,132,1,'Sertifikat_PKKMB_202203001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(310,132,3,'Sertifikat_BelaNegara_202203001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(311,132,2,'Sertifikat_MABIM_202203001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(312,132,4,'Sertifikat_Kompetensi_202203001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-05-09 17:00:00','2025-05-14 17:00:00'),
(313,133,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202203002.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(314,133,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202203002.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(315,133,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202203002.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(316,133,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202203002.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(317,133,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202203002.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(318,133,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202203002.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(319,133,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202203002.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(320,133,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202203002.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(321,133,7,'Pakta_Integritas_202203002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(322,133,1,'Sertifikat_PKKMB_202203002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(323,133,3,'Sertifikat_BelaNegara_202203002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(324,133,2,'Sertifikat_MABIM_202203002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(325,134,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202203003.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(326,134,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202203003.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(327,134,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202203003.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(328,134,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202203003.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(329,134,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202203003.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(330,134,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202203003.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(331,134,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202203003.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(332,134,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202203003.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(333,134,7,'Pakta_Integritas_202203003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(334,134,1,'Sertifikat_PKKMB_202203003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(335,134,3,'Sertifikat_BelaNegara_202203003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(336,134,2,'Sertifikat_MABIM_202203003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(337,135,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202211001.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(338,135,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202211001.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(339,135,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202211001.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(340,135,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202211001.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(341,135,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202211001.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(342,135,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202211001.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(343,135,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202211001.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(344,135,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202211001.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(345,135,7,'Pakta_Integritas_202211001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(346,135,1,'Sertifikat_PKKMB_202211001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(347,135,3,'Sertifikat_BelaNegara_202211001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(348,135,2,'Sertifikat_MABIM_202211001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(349,135,4,'Sertifikat_Kompetensi_202211001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-05-09 17:00:00','2025-05-14 17:00:00'),
(350,136,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202211002.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(351,136,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202211002.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(352,136,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202211002.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(353,136,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202211002.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(354,136,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202211002.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(355,136,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202211002.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(356,136,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202211002.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(357,136,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202211002.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(358,136,7,'Pakta_Integritas_202211002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(359,136,1,'Sertifikat_PKKMB_202211002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(360,136,3,'Sertifikat_BelaNegara_202211002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(361,136,2,'Sertifikat_MABIM_202211002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(362,137,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202211003.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(363,137,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202211003.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(364,137,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202211003.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(365,137,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202211003.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(366,137,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202211003.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(367,137,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202211003.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(368,137,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202211003.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(369,137,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202211003.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(370,137,7,'Pakta_Integritas_202211003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(371,137,1,'Sertifikat_PKKMB_202211003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(372,137,3,'Sertifikat_BelaNegara_202211003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(373,137,2,'Sertifikat_MABIM_202211003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(374,138,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202224001.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(375,138,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202224001.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(376,138,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202224001.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(377,138,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202224001.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(378,138,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202224001.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(379,138,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202224001.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(380,138,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202224001.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(381,138,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202224001.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(382,138,7,'Pakta_Integritas_202224001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(383,138,1,'Sertifikat_PKKMB_202224001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(384,138,3,'Sertifikat_BelaNegara_202224001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(385,138,2,'Sertifikat_MABIM_202224001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(386,138,4,'Sertifikat_Kompetensi_202224001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-05-09 17:00:00','2025-05-14 17:00:00'),
(387,139,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202224002.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(388,139,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202224002.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(389,139,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202224002.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(390,139,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202224002.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(391,139,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202224002.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(392,139,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202224002.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(393,139,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202224002.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(394,139,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202224002.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(395,139,7,'Pakta_Integritas_202224002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(396,139,1,'Sertifikat_PKKMB_202224002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(397,139,3,'Sertifikat_BelaNegara_202224002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(398,139,2,'Sertifikat_MABIM_202224002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(399,140,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202224003.pdf',NULL,'Disetujui','Semester 1 (2022/2023 Ganjil)',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(400,140,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202224003.pdf',NULL,'Disetujui','Semester 2 (2022/2023 Genap)',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(401,140,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202224003.pdf',NULL,'Disetujui','Semester 3 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(402,140,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202224003.pdf',NULL,'Disetujui','Semester 4 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(403,140,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202224003.pdf',NULL,'Disetujui','Semester 5 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(404,140,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202224003.pdf',NULL,'Disetujui','Semester 6 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(405,140,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_202224003.pdf',NULL,'Disetujui','Semester 7 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(406,140,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_202224003.pdf',NULL,'Disetujui','Semester 8 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(407,140,7,'Pakta_Integritas_202224003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-20 17:00:00','2022-08-22 17:00:00'),
(408,140,1,'Sertifikat_PKKMB_202224003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-08-24 17:00:00','2022-08-26 17:00:00'),
(409,140,3,'Sertifikat_BelaNegara_202224003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2022-09-14 17:00:00','2022-09-16 17:00:00'),
(410,140,2,'Sertifikat_MABIM_202224003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-03-19 17:00:00','2023-03-21 17:00:00'),
(411,141,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202306001.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(412,141,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202306001.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(413,141,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202306001.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(414,141,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202306001.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(415,141,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202306001.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(416,141,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202306001.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(417,141,7,'Pakta_Integritas_202306001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(418,141,1,'Sertifikat_PKKMB_202306001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(419,141,3,'Sertifikat_BelaNegara_202306001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(420,141,2,'Sertifikat_MABIM_202306001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(421,141,4,'Sertifikat_Kompetensi_202306001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-05-09 17:00:00','2026-05-14 17:00:00'),
(422,142,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202306002.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(423,142,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202306002.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(424,142,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202306002.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(425,142,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202306002.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(426,142,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202306002.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(427,142,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202306002.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(428,142,7,'Pakta_Integritas_202306002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(429,142,1,'Sertifikat_PKKMB_202306002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(430,142,3,'Sertifikat_BelaNegara_202306002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(431,142,2,'Sertifikat_MABIM_202306002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(432,143,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202306003.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(433,143,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202306003.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(434,143,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202306003.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(435,143,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202306003.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(436,143,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202306003.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(437,143,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202306003.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(438,143,7,'Pakta_Integritas_202306003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(439,143,1,'Sertifikat_PKKMB_202306003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(440,143,3,'Sertifikat_BelaNegara_202306003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(441,143,2,'Sertifikat_MABIM_202306003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(442,144,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202307001.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(443,144,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202307001.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(444,144,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202307001.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(445,144,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202307001.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(446,144,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202307001.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(447,144,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202307001.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(448,144,7,'Pakta_Integritas_202307001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(449,144,1,'Sertifikat_PKKMB_202307001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(450,144,3,'Sertifikat_BelaNegara_202307001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(451,144,2,'Sertifikat_MABIM_202307001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(452,144,4,'Sertifikat_Kompetensi_202307001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-05-09 17:00:00','2026-05-14 17:00:00'),
(453,145,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202307002.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(454,145,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202307002.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(455,145,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202307002.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(456,145,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202307002.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(457,145,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202307002.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(458,145,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202307002.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(459,145,7,'Pakta_Integritas_202307002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(460,145,1,'Sertifikat_PKKMB_202307002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(461,145,3,'Sertifikat_BelaNegara_202307002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(462,145,2,'Sertifikat_MABIM_202307002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(463,146,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202307003.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(464,146,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202307003.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(465,146,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202307003.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(466,146,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202307003.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(467,146,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202307003.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(468,146,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202307003.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(469,146,7,'Pakta_Integritas_202307003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(470,146,1,'Sertifikat_PKKMB_202307003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(471,146,3,'Sertifikat_BelaNegara_202307003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(472,146,2,'Sertifikat_MABIM_202307003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(473,147,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202303001.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(474,147,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202303001.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(475,147,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202303001.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(476,147,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202303001.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(477,147,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202303001.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(478,147,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202303001.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(479,147,7,'Pakta_Integritas_202303001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(480,147,1,'Sertifikat_PKKMB_202303001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(481,147,3,'Sertifikat_BelaNegara_202303001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(482,147,2,'Sertifikat_MABIM_202303001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(483,147,4,'Sertifikat_Kompetensi_202303001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-05-09 17:00:00','2026-05-14 17:00:00'),
(484,148,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202303002.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(485,148,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202303002.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(486,148,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202303002.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(487,148,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202303002.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(488,148,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202303002.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(489,148,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202303002.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(490,148,7,'Pakta_Integritas_202303002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(491,148,1,'Sertifikat_PKKMB_202303002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(492,148,3,'Sertifikat_BelaNegara_202303002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(493,148,2,'Sertifikat_MABIM_202303002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(494,149,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202303003.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(495,149,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202303003.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(496,149,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202303003.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(497,149,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202303003.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(498,149,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202303003.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(499,149,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202303003.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(500,149,7,'Pakta_Integritas_202303003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(501,149,1,'Sertifikat_PKKMB_202303003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(502,149,3,'Sertifikat_BelaNegara_202303003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(503,149,2,'Sertifikat_MABIM_202303003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(504,150,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202311001.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(505,150,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202311001.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(506,150,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202311001.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(507,150,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202311001.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(508,150,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202311001.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(509,150,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202311001.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(510,150,7,'Pakta_Integritas_202311001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(511,150,1,'Sertifikat_PKKMB_202311001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(512,150,3,'Sertifikat_BelaNegara_202311001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(513,150,2,'Sertifikat_MABIM_202311001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(514,150,4,'Sertifikat_Kompetensi_202311001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-05-09 17:00:00','2026-05-14 17:00:00'),
(515,151,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202311002.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(516,151,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202311002.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(517,151,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202311002.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(518,151,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202311002.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(519,151,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202311002.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(520,151,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202311002.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(521,151,7,'Pakta_Integritas_202311002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(522,151,1,'Sertifikat_PKKMB_202311002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(523,151,3,'Sertifikat_BelaNegara_202311002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(524,151,2,'Sertifikat_MABIM_202311002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(525,152,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202311003.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(526,152,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202311003.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(527,152,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202311003.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(528,152,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202311003.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(529,152,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202311003.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(530,152,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202311003.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(531,152,7,'Pakta_Integritas_202311003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(532,152,1,'Sertifikat_PKKMB_202311003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(533,152,3,'Sertifikat_BelaNegara_202311003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(534,152,2,'Sertifikat_MABIM_202311003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(535,153,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202324001.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(536,153,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202324001.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(537,153,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202324001.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(538,153,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202324001.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(539,153,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202324001.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(540,153,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202324001.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(541,153,7,'Pakta_Integritas_202324001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(542,153,1,'Sertifikat_PKKMB_202324001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(543,153,3,'Sertifikat_BelaNegara_202324001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(544,153,2,'Sertifikat_MABIM_202324001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(545,153,4,'Sertifikat_Kompetensi_202324001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-05-09 17:00:00','2026-05-14 17:00:00'),
(546,154,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202324002.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(547,154,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202324002.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(548,154,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202324002.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(549,154,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202324002.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(550,154,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202324002.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(551,154,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202324002.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(552,154,7,'Pakta_Integritas_202324002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(553,154,1,'Sertifikat_PKKMB_202324002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(554,154,3,'Sertifikat_BelaNegara_202324002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(555,154,2,'Sertifikat_MABIM_202324002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(556,155,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202324003.pdf',NULL,'Disetujui','Semester 1 (2023/2024 Ganjil)',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(557,155,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202324003.pdf',NULL,'Disetujui','Semester 2 (2023/2024 Genap)',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(558,155,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202324003.pdf',NULL,'Disetujui','Semester 3 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(559,155,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202324003.pdf',NULL,'Disetujui','Semester 4 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(560,155,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_202324003.pdf',NULL,'Disetujui','Semester 5 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(561,155,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_202324003.pdf',NULL,'Disetujui','Semester 6 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(562,155,7,'Pakta_Integritas_202324003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-20 17:00:00','2023-08-22 17:00:00'),
(563,155,1,'Sertifikat_PKKMB_202324003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-08-24 17:00:00','2023-08-26 17:00:00'),
(564,155,3,'Sertifikat_BelaNegara_202324003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2023-09-14 17:00:00','2023-09-16 17:00:00'),
(565,155,2,'Sertifikat_MABIM_202324003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-03-19 17:00:00','2024-03-21 17:00:00'),
(566,156,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202406001.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(567,156,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202406001.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(568,156,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202406001.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(569,156,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202406001.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(570,156,7,'Pakta_Integritas_202406001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(571,156,1,'Sertifikat_PKKMB_202406001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(572,156,3,'Sertifikat_BelaNegara_202406001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(573,156,2,'Sertifikat_MABIM_202406001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(574,156,4,'Sertifikat_Kompetensi_202406001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-05-09 17:00:00','2027-05-14 17:00:00'),
(575,157,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202406002.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(576,157,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202406002.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(577,157,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202406002.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(578,157,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202406002.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(579,157,7,'Pakta_Integritas_202406002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(580,157,1,'Sertifikat_PKKMB_202406002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(581,157,3,'Sertifikat_BelaNegara_202406002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(582,157,2,'Sertifikat_MABIM_202406002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(583,158,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202406003.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(584,158,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202406003.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(585,158,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202406003.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(586,158,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202406003.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(587,158,7,'Pakta_Integritas_202406003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(588,158,1,'Sertifikat_PKKMB_202406003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(589,158,3,'Sertifikat_BelaNegara_202406003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(590,158,2,'Sertifikat_MABIM_202406003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(591,159,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202407001.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(592,159,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202407001.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(593,159,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202407001.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(594,159,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202407001.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(595,159,7,'Pakta_Integritas_202407001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(596,159,1,'Sertifikat_PKKMB_202407001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(597,159,3,'Sertifikat_BelaNegara_202407001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(598,159,2,'Sertifikat_MABIM_202407001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(599,159,4,'Sertifikat_Kompetensi_202407001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-05-09 17:00:00','2027-05-14 17:00:00'),
(600,160,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202407002.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(601,160,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202407002.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(602,160,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202407002.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(603,160,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202407002.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(604,160,7,'Pakta_Integritas_202407002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(605,160,1,'Sertifikat_PKKMB_202407002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(606,160,3,'Sertifikat_BelaNegara_202407002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(607,160,2,'Sertifikat_MABIM_202407002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(608,161,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202407003.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(609,161,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202407003.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(610,161,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202407003.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(611,161,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202407003.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(612,161,7,'Pakta_Integritas_202407003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(613,161,1,'Sertifikat_PKKMB_202407003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(614,161,3,'Sertifikat_BelaNegara_202407003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(615,161,2,'Sertifikat_MABIM_202407003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(616,162,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202403001.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(617,162,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202403001.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(618,162,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202403001.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(619,162,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202403001.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(620,162,7,'Pakta_Integritas_202403001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(621,162,1,'Sertifikat_PKKMB_202403001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(622,162,3,'Sertifikat_BelaNegara_202403001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(623,162,2,'Sertifikat_MABIM_202403001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(624,162,4,'Sertifikat_Kompetensi_202403001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-05-09 17:00:00','2027-05-14 17:00:00'),
(625,163,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202403002.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(626,163,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202403002.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(627,163,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202403002.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(628,163,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202403002.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(629,163,7,'Pakta_Integritas_202403002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(630,163,1,'Sertifikat_PKKMB_202403002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(631,163,3,'Sertifikat_BelaNegara_202403002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(632,163,2,'Sertifikat_MABIM_202403002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(633,164,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202403003.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(634,164,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202403003.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(635,164,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202403003.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(636,164,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202403003.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(637,164,7,'Pakta_Integritas_202403003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(638,164,1,'Sertifikat_PKKMB_202403003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(639,164,3,'Sertifikat_BelaNegara_202403003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(640,164,2,'Sertifikat_MABIM_202403003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(641,165,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202411001.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(642,165,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202411001.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(643,165,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202411001.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(644,165,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202411001.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(645,165,7,'Pakta_Integritas_202411001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(646,165,1,'Sertifikat_PKKMB_202411001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(647,165,3,'Sertifikat_BelaNegara_202411001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(648,165,2,'Sertifikat_MABIM_202411001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(649,165,4,'Sertifikat_Kompetensi_202411001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-05-09 17:00:00','2027-05-14 17:00:00'),
(650,166,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202411002.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(651,166,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202411002.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(652,166,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202411002.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(653,166,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202411002.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(654,166,7,'Pakta_Integritas_202411002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(655,166,1,'Sertifikat_PKKMB_202411002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(656,166,3,'Sertifikat_BelaNegara_202411002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(657,166,2,'Sertifikat_MABIM_202411002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(658,167,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202411003.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(659,167,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202411003.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(660,167,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202411003.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(661,167,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202411003.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(662,167,7,'Pakta_Integritas_202411003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(663,167,1,'Sertifikat_PKKMB_202411003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(664,167,3,'Sertifikat_BelaNegara_202411003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(665,167,2,'Sertifikat_MABIM_202411003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(666,168,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202424001.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(667,168,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202424001.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(668,168,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202424001.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(669,168,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202424001.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(670,168,7,'Pakta_Integritas_202424001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(671,168,1,'Sertifikat_PKKMB_202424001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(672,168,3,'Sertifikat_BelaNegara_202424001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(673,168,2,'Sertifikat_MABIM_202424001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(674,168,4,'Sertifikat_Kompetensi_202424001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-05-09 17:00:00','2027-05-14 17:00:00'),
(675,169,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202424002.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(676,169,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202424002.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(677,169,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202424002.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(678,169,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202424002.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(679,169,7,'Pakta_Integritas_202424002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(680,169,1,'Sertifikat_PKKMB_202424002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(681,169,3,'Sertifikat_BelaNegara_202424002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(682,169,2,'Sertifikat_MABIM_202424002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(683,170,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202424003.pdf',NULL,'Disetujui','Semester 1 (2024/2025 Ganjil)',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(684,170,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202424003.pdf',NULL,'Disetujui','Semester 2 (2024/2025 Genap)',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(685,170,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_202424003.pdf',NULL,'Disetujui','Semester 3 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(686,170,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_202424003.pdf',NULL,'Disetujui','Semester 4 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(687,170,7,'Pakta_Integritas_202424003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-20 17:00:00','2024-08-22 17:00:00'),
(688,170,1,'Sertifikat_PKKMB_202424003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-08-24 17:00:00','2024-08-26 17:00:00'),
(689,170,3,'Sertifikat_BelaNegara_202424003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2024-09-14 17:00:00','2024-09-16 17:00:00'),
(690,170,2,'Sertifikat_MABIM_202424003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-03-19 17:00:00','2025-03-21 17:00:00'),
(691,171,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202506001.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(692,171,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202506001.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(693,171,7,'Pakta_Integritas_202506001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(694,171,1,'Sertifikat_PKKMB_202506001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(695,171,3,'Sertifikat_BelaNegara_202506001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(696,171,2,'Sertifikat_MABIM_202506001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(697,171,4,'Sertifikat_Kompetensi_202506001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2028-05-09 17:00:00','2028-05-14 17:00:00'),
(698,172,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202506002.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(699,172,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202506002.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(700,172,7,'Pakta_Integritas_202506002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(701,172,1,'Sertifikat_PKKMB_202506002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(702,172,3,'Sertifikat_BelaNegara_202506002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(703,172,2,'Sertifikat_MABIM_202506002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(704,173,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202506003.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(705,173,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202506003.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(706,173,7,'Pakta_Integritas_202506003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(707,173,1,'Sertifikat_PKKMB_202506003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(708,173,3,'Sertifikat_BelaNegara_202506003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(709,173,2,'Sertifikat_MABIM_202506003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(710,174,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202507001.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(711,174,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202507001.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(712,174,7,'Pakta_Integritas_202507001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(713,174,1,'Sertifikat_PKKMB_202507001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(714,174,3,'Sertifikat_BelaNegara_202507001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(715,174,2,'Sertifikat_MABIM_202507001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(716,174,4,'Sertifikat_Kompetensi_202507001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2028-05-09 17:00:00','2028-05-14 17:00:00'),
(717,175,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202507002.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(718,175,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202507002.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(719,175,7,'Pakta_Integritas_202507002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(720,175,1,'Sertifikat_PKKMB_202507002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(721,175,3,'Sertifikat_BelaNegara_202507002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(722,175,2,'Sertifikat_MABIM_202507002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(723,176,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202507003.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(724,176,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202507003.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(725,176,7,'Pakta_Integritas_202507003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(726,176,1,'Sertifikat_PKKMB_202507003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(727,176,3,'Sertifikat_BelaNegara_202507003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(728,176,2,'Sertifikat_MABIM_202507003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(729,177,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202503001.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(730,177,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202503001.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(731,177,7,'Pakta_Integritas_202503001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(732,177,1,'Sertifikat_PKKMB_202503001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(733,177,3,'Sertifikat_BelaNegara_202503001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(734,177,2,'Sertifikat_MABIM_202503001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(735,177,4,'Sertifikat_Kompetensi_202503001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2028-05-09 17:00:00','2028-05-14 17:00:00'),
(736,178,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202503002.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(737,178,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202503002.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(738,178,7,'Pakta_Integritas_202503002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(739,178,1,'Sertifikat_PKKMB_202503002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(740,178,3,'Sertifikat_BelaNegara_202503002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(741,178,2,'Sertifikat_MABIM_202503002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(742,179,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202503003.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(743,179,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202503003.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(744,179,7,'Pakta_Integritas_202503003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(745,179,1,'Sertifikat_PKKMB_202503003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(746,179,3,'Sertifikat_BelaNegara_202503003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(747,179,2,'Sertifikat_MABIM_202503003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(748,180,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202511001.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(749,180,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202511001.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(750,180,7,'Pakta_Integritas_202511001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(751,180,1,'Sertifikat_PKKMB_202511001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(752,180,3,'Sertifikat_BelaNegara_202511001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(753,180,2,'Sertifikat_MABIM_202511001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(754,180,4,'Sertifikat_Kompetensi_202511001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2028-05-09 17:00:00','2028-05-14 17:00:00'),
(755,181,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202511002.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(756,181,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202511002.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(757,181,7,'Pakta_Integritas_202511002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(758,181,1,'Sertifikat_PKKMB_202511002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(759,181,3,'Sertifikat_BelaNegara_202511002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(760,181,2,'Sertifikat_MABIM_202511002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(761,182,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202511003.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(762,182,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202511003.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(763,182,7,'Pakta_Integritas_202511003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(764,182,1,'Sertifikat_PKKMB_202511003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(765,182,3,'Sertifikat_BelaNegara_202511003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(766,182,2,'Sertifikat_MABIM_202511003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(767,183,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202524001.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(768,183,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202524001.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(769,183,7,'Pakta_Integritas_202524001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(770,183,1,'Sertifikat_PKKMB_202524001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(771,183,3,'Sertifikat_BelaNegara_202524001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(772,183,2,'Sertifikat_MABIM_202524001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(773,183,4,'Sertifikat_Kompetensi_202524001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2028-05-09 17:00:00','2028-05-14 17:00:00'),
(774,184,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202524002.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(775,184,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202524002.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(776,184,7,'Pakta_Integritas_202524002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(777,184,1,'Sertifikat_PKKMB_202524002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(778,184,3,'Sertifikat_BelaNegara_202524002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(779,184,2,'Sertifikat_MABIM_202524002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(780,185,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202524003.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(781,185,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_202524003.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(782,185,7,'Pakta_Integritas_202524003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-20 17:00:00','2025-08-22 17:00:00'),
(783,185,1,'Sertifikat_PKKMB_202524003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-08-24 17:00:00','2025-08-26 17:00:00'),
(784,185,3,'Sertifikat_BelaNegara_202524003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2025-09-14 17:00:00','2025-09-16 17:00:00'),
(785,185,2,'Sertifikat_MABIM_202524003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(786,186,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202606001.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(787,186,7,'Pakta_Integritas_202606001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(788,186,1,'Sertifikat_PKKMB_202606001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(789,186,3,'Sertifikat_BelaNegara_202606001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(790,186,2,'Sertifikat_MABIM_202606001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(791,186,4,'Sertifikat_Kompetensi_202606001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Ditolak','adcfghj',NULL,1,'2026-09-02 07:02:30','2029-05-09 17:00:00','2026-09-02 07:02:30'),
(792,187,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202606002.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(793,187,7,'Pakta_Integritas_202606002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(794,187,1,'Sertifikat_PKKMB_202606002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(795,187,3,'Sertifikat_BelaNegara_202606002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(796,187,2,'Sertifikat_MABIM_202606002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(797,188,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202606003.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(798,188,7,'Pakta_Integritas_202606003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(799,188,1,'Sertifikat_PKKMB_202606003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(800,188,3,'Sertifikat_BelaNegara_202606003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(801,188,2,'Sertifikat_MABIM_202606003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(802,189,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202607001.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(803,189,7,'Pakta_Integritas_202607001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(804,189,1,'Sertifikat_PKKMB_202607001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(805,189,3,'Sertifikat_BelaNegara_202607001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(806,189,2,'Sertifikat_MABIM_202607001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(807,189,4,'Sertifikat_Kompetensi_202607001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2029-05-09 17:00:00','2029-05-14 17:00:00'),
(808,190,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202607002.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(809,190,7,'Pakta_Integritas_202607002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(810,190,1,'Sertifikat_PKKMB_202607002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(811,190,3,'Sertifikat_BelaNegara_202607002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(812,190,2,'Sertifikat_MABIM_202607002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(813,191,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202607003.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(814,191,7,'Pakta_Integritas_202607003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(815,191,1,'Sertifikat_PKKMB_202607003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(816,191,3,'Sertifikat_BelaNegara_202607003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(817,191,2,'Sertifikat_MABIM_202607003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(818,192,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202603001.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(819,192,7,'Pakta_Integritas_202603001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(820,192,1,'Sertifikat_PKKMB_202603001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(821,192,3,'Sertifikat_BelaNegara_202603001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(822,192,2,'Sertifikat_MABIM_202603001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(823,192,4,'Sertifikat_Kompetensi_202603001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2029-05-09 17:00:00','2029-05-14 17:00:00'),
(824,193,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202603002.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(825,193,7,'Pakta_Integritas_202603002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(826,193,1,'Sertifikat_PKKMB_202603002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(827,193,3,'Sertifikat_BelaNegara_202603002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(828,193,2,'Sertifikat_MABIM_202603002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(829,194,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202603003.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(830,194,7,'Pakta_Integritas_202603003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(831,194,1,'Sertifikat_PKKMB_202603003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(832,194,3,'Sertifikat_BelaNegara_202603003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(833,194,2,'Sertifikat_MABIM_202603003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(834,195,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202611001.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(835,195,7,'Pakta_Integritas_202611001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(836,195,1,'Sertifikat_PKKMB_202611001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(837,195,3,'Sertifikat_BelaNegara_202611001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(838,195,2,'Sertifikat_MABIM_202611001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(839,195,4,'Sertifikat_Kompetensi_202611001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2029-05-09 17:00:00','2029-05-14 17:00:00'),
(840,196,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202611002.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(841,196,7,'Pakta_Integritas_202611002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(842,196,1,'Sertifikat_PKKMB_202611002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(843,196,3,'Sertifikat_BelaNegara_202611002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(844,196,2,'Sertifikat_MABIM_202611002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(845,197,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202611003.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(846,197,7,'Pakta_Integritas_202611003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(847,197,1,'Sertifikat_PKKMB_202611003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(848,197,3,'Sertifikat_BelaNegara_202611003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(849,197,2,'Sertifikat_MABIM_202611003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(850,198,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202624001.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(851,198,7,'Pakta_Integritas_202624001.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(852,198,1,'Sertifikat_PKKMB_202624001.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(853,198,3,'Sertifikat_BelaNegara_202624001.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(854,198,2,'Sertifikat_MABIM_202624001.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(855,198,4,'Sertifikat_Kompetensi_202624001.pdf','dokumen/dummy_sertifikasi.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2029-05-09 17:00:00','2029-05-14 17:00:00'),
(856,199,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202624002.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(857,199,7,'Pakta_Integritas_202624002.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(858,199,1,'Sertifikat_PKKMB_202624002.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(859,199,3,'Sertifikat_BelaNegara_202624002.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(860,199,2,'Sertifikat_MABIM_202624002.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(861,200,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_202624003.pdf',NULL,'Disetujui','Semester 1 (2026/2027 Ganjil)',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(862,200,7,'Pakta_Integritas_202624003.pdf','dokumen/dummy_pakta.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-20 17:00:00','2026-08-22 17:00:00'),
(863,200,1,'Sertifikat_PKKMB_202624003.pdf','dokumen/dummy_pkkmb.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-08-24 17:00:00','2026-08-26 17:00:00'),
(864,200,3,'Sertifikat_BelaNegara_202624003.pdf','dokumen/dummy_belanegara.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2026-09-14 17:00:00','2026-09-16 17:00:00'),
(865,200,2,'Sertifikat_MABIM_202624003.pdf','dokumen/dummy_mabim.pdf',NULL,'Disetujui',NULL,NULL,NULL,NULL,'2027-03-19 17:00:00','2027-03-21 17:00:00'),
(867,96,5,'7EahlYcSHaPczOP770fk4GUxluwLVigo9r8CN2jN.jpg','dokumen/2306064/Berita Acara KP/jo1KuzkDwjbeyFgt7zxoCftRuOwoLxNzBHLT39dw.jpg',30104,'Disetujui',NULL,'{\"1\":\"ITG\"}',1,'2026-09-02 11:03:24','2026-09-02 11:02:57','2026-09-02 11:03:24'),
(868,201,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_2507101.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,1,'2025-02-12 17:00:00','2025-02-09 17:00:00','2025-02-11 17:00:00'),
(869,201,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_2507101.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,1,'2025-08-12 17:00:00','2025-08-09 17:00:00','2025-08-11 17:00:00'),
(870,201,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_2507101.pdf',NULL,'Disetujui','Semester 3 (2026/2027 Ganjil)',NULL,1,'2026-02-12 17:00:00','2026-02-09 17:00:00','2026-02-11 17:00:00'),
(871,201,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_2507101.pdf',NULL,'Disetujui','Semester 4 (2026/2027 Genap)',NULL,1,'2026-08-12 17:00:00','2026-08-09 17:00:00','2026-08-11 17:00:00'),
(872,201,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_2507101.pdf',NULL,'Disetujui','Semester 5 (2027/2028 Ganjil)',NULL,1,'2027-02-12 17:00:00','2027-02-09 17:00:00','2027-02-11 17:00:00'),
(873,201,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_2507101.pdf',NULL,'Disetujui','Semester 6 (2027/2028 Genap)',NULL,1,'2027-08-12 17:00:00','2027-08-09 17:00:00','2027-08-11 17:00:00'),
(874,201,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_2507101.pdf',NULL,'Disetujui','Semester 7 (2028/2029 Ganjil)',NULL,1,'2028-02-12 17:00:00','2028-02-09 17:00:00','2028-02-11 17:00:00'),
(875,201,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_2507101.pdf',NULL,'Disetujui','Semester 8 (2028/2029 Genap)',NULL,1,'2028-08-12 17:00:00','2028-08-09 17:00:00','2028-08-11 17:00:00'),
(876,201,7,'Pakta Integritas_2507101.pdf','dokumen/dummy_Pakta Integritas.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-22 17:00:00','2025-08-20 17:00:00','2025-08-22 17:00:00'),
(877,201,1,'PKKMB_2507101.pdf','dokumen/dummy_PKKMB.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-26 17:00:00','2025-08-24 17:00:00','2025-08-26 17:00:00'),
(878,201,2,'MABIM_2507101.pdf','dokumen/dummy_MABIM.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-03-21 17:00:00','2026-03-19 17:00:00','2026-03-21 17:00:00'),
(879,202,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_2507102.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,1,'2025-02-12 17:00:00','2025-02-09 17:00:00','2025-02-11 17:00:00'),
(880,202,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_2507102.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,1,'2025-08-12 17:00:00','2025-08-09 17:00:00','2025-08-11 17:00:00'),
(881,202,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_2507102.pdf',NULL,'Disetujui','Semester 3 (2026/2027 Ganjil)',NULL,1,'2026-02-12 17:00:00','2026-02-09 17:00:00','2026-02-11 17:00:00'),
(882,202,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_2507102.pdf',NULL,'Disetujui','Semester 4 (2026/2027 Genap)',NULL,1,'2026-08-12 17:00:00','2026-08-09 17:00:00','2026-08-11 17:00:00'),
(883,202,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_2507102.pdf',NULL,'Disetujui','Semester 5 (2027/2028 Ganjil)',NULL,1,'2027-02-12 17:00:00','2027-02-09 17:00:00','2027-02-11 17:00:00'),
(884,202,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_2507102.pdf',NULL,'Disetujui','Semester 6 (2027/2028 Genap)',NULL,1,'2027-08-12 17:00:00','2027-08-09 17:00:00','2027-08-11 17:00:00'),
(885,202,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_2507102.pdf',NULL,'Disetujui','Semester 7 (2028/2029 Ganjil)',NULL,1,'2028-02-12 17:00:00','2028-02-09 17:00:00','2028-02-11 17:00:00'),
(886,202,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_2507102.pdf',NULL,'Disetujui','Semester 8 (2028/2029 Genap)',NULL,1,'2028-08-12 17:00:00','2028-08-09 17:00:00','2028-08-11 17:00:00'),
(887,202,7,'Pakta Integritas_2507102.pdf','dokumen/dummy_Pakta Integritas.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-22 17:00:00','2025-08-20 17:00:00','2025-08-22 17:00:00'),
(888,202,1,'PKKMB_2507102.pdf','dokumen/dummy_PKKMB.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-26 17:00:00','2025-08-24 17:00:00','2025-08-26 17:00:00'),
(889,202,2,'MABIM_2507102.pdf','dokumen/dummy_MABIM.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-03-21 17:00:00','2026-03-19 17:00:00','2026-03-21 17:00:00'),
(890,202,3,'Bela Negara_2507102.pdf','dokumen/dummy_Bela Negara.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-09-16 17:00:00','2025-09-14 17:00:00','2025-09-16 17:00:00'),
(891,203,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_2507103.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,1,'2025-02-12 17:00:00','2025-02-09 17:00:00','2025-02-11 17:00:00'),
(892,203,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_2507103.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,1,'2025-08-12 17:00:00','2025-08-09 17:00:00','2025-08-11 17:00:00'),
(893,203,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_2507103.pdf',NULL,'Disetujui','Semester 3 (2026/2027 Ganjil)',NULL,1,'2026-02-12 17:00:00','2026-02-09 17:00:00','2026-02-11 17:00:00'),
(894,203,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_2507103.pdf',NULL,'Disetujui','Semester 4 (2026/2027 Genap)',NULL,1,'2026-08-12 17:00:00','2026-08-09 17:00:00','2026-08-11 17:00:00'),
(895,203,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_2507103.pdf',NULL,'Disetujui','Semester 5 (2027/2028 Ganjil)',NULL,1,'2027-02-12 17:00:00','2027-02-09 17:00:00','2027-02-11 17:00:00'),
(896,203,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_2507103.pdf',NULL,'Disetujui','Semester 6 (2027/2028 Genap)',NULL,1,'2027-08-12 17:00:00','2027-08-09 17:00:00','2027-08-11 17:00:00'),
(897,203,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_2507103.pdf',NULL,'Disetujui','Semester 7 (2028/2029 Ganjil)',NULL,1,'2028-02-12 17:00:00','2028-02-09 17:00:00','2028-02-11 17:00:00'),
(898,203,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_2507103.pdf',NULL,'Disetujui','Semester 8 (2028/2029 Genap)',NULL,1,'2028-08-12 17:00:00','2028-08-09 17:00:00','2028-08-11 17:00:00'),
(899,203,7,'Pakta Integritas_2507103.pdf','dokumen/dummy_Pakta Integritas.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-22 17:00:00','2025-08-20 17:00:00','2025-08-22 17:00:00'),
(900,203,1,'PKKMB_2507103.pdf','dokumen/dummy_PKKMB.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-26 17:00:00','2025-08-24 17:00:00','2025-08-26 17:00:00'),
(901,203,2,'MABIM_2507103.pdf','dokumen/dummy_MABIM.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-03-21 17:00:00','2026-03-19 17:00:00','2026-03-21 17:00:00'),
(902,203,3,'Bela Negara_2507103.pdf','dokumen/dummy_Bela Negara.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-09-16 17:00:00','2025-09-14 17:00:00','2025-09-16 17:00:00'),
(903,204,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_2507104.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,1,'2025-02-12 17:00:00','2025-02-09 17:00:00','2025-02-11 17:00:00'),
(904,204,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_2507104.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,1,'2025-08-12 17:00:00','2025-08-09 17:00:00','2025-08-11 17:00:00'),
(905,204,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_2507104.pdf',NULL,'Disetujui','Semester 3 (2026/2027 Ganjil)',NULL,1,'2026-02-12 17:00:00','2026-02-09 17:00:00','2026-02-11 17:00:00'),
(906,204,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_2507104.pdf',NULL,'Disetujui','Semester 4 (2026/2027 Genap)',NULL,1,'2026-08-12 17:00:00','2026-08-09 17:00:00','2026-08-11 17:00:00'),
(907,204,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_2507104.pdf',NULL,'Disetujui','Semester 5 (2027/2028 Ganjil)',NULL,1,'2027-02-12 17:00:00','2027-02-09 17:00:00','2027-02-11 17:00:00'),
(908,204,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_2507104.pdf',NULL,'Disetujui','Semester 6 (2027/2028 Genap)',NULL,1,'2027-08-12 17:00:00','2027-08-09 17:00:00','2027-08-11 17:00:00'),
(909,204,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_2507104.pdf',NULL,'Disetujui','Semester 7 (2028/2029 Ganjil)',NULL,1,'2028-02-12 17:00:00','2028-02-09 17:00:00','2028-02-11 17:00:00'),
(910,204,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_2507104.pdf',NULL,'Disetujui','Semester 8 (2028/2029 Genap)',NULL,1,'2028-08-12 17:00:00','2028-08-09 17:00:00','2028-08-11 17:00:00'),
(911,204,7,'Pakta Integritas_2507104.pdf','dokumen/dummy_Pakta Integritas.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-22 17:00:00','2025-08-20 17:00:00','2025-08-22 17:00:00'),
(912,204,1,'PKKMB_2507104.pdf','dokumen/dummy_PKKMB.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-26 17:00:00','2025-08-24 17:00:00','2025-08-26 17:00:00'),
(913,204,2,'MABIM_2507104.pdf','dokumen/dummy_MABIM.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-03-21 17:00:00','2026-03-19 17:00:00','2026-03-21 17:00:00'),
(914,204,3,'Bela Negara_2507104.pdf','dokumen/dummy_Bela Negara.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-09-16 17:00:00','2025-09-14 17:00:00','2025-09-16 17:00:00'),
(915,205,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_2507105.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,1,'2025-02-12 17:00:00','2025-02-09 17:00:00','2025-02-11 17:00:00'),
(916,205,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_2507105.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,1,'2025-08-12 17:00:00','2025-08-09 17:00:00','2025-08-11 17:00:00'),
(917,205,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_2507105.pdf',NULL,'Disetujui','Semester 3 (2026/2027 Ganjil)',NULL,1,'2026-02-12 17:00:00','2026-02-09 17:00:00','2026-02-11 17:00:00'),
(918,205,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_2507105.pdf',NULL,'Disetujui','Semester 4 (2026/2027 Genap)',NULL,1,'2026-08-12 17:00:00','2026-08-09 17:00:00','2026-08-11 17:00:00'),
(919,205,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_2507105.pdf',NULL,'Disetujui','Semester 5 (2027/2028 Ganjil)',NULL,1,'2027-02-12 17:00:00','2027-02-09 17:00:00','2027-02-11 17:00:00'),
(920,205,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_2507105.pdf',NULL,'Disetujui','Semester 6 (2027/2028 Genap)',NULL,1,'2027-08-12 17:00:00','2027-08-09 17:00:00','2027-08-11 17:00:00'),
(921,205,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_2507105.pdf',NULL,'Disetujui','Semester 7 (2028/2029 Ganjil)',NULL,1,'2028-02-12 17:00:00','2028-02-09 17:00:00','2028-02-11 17:00:00'),
(922,205,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_2507105.pdf',NULL,'Disetujui','Semester 8 (2028/2029 Genap)',NULL,1,'2028-08-12 17:00:00','2028-08-09 17:00:00','2028-08-11 17:00:00'),
(923,205,7,'Pakta Integritas_2507105.pdf','dokumen/dummy_Pakta Integritas.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-22 17:00:00','2025-08-20 17:00:00','2025-08-22 17:00:00'),
(924,205,1,'PKKMB_2507105.pdf','dokumen/dummy_PKKMB.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-26 17:00:00','2025-08-24 17:00:00','2025-08-26 17:00:00'),
(925,205,2,'MABIM_2507105.pdf','dokumen/dummy_MABIM.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-03-21 17:00:00','2026-03-19 17:00:00','2026-03-21 17:00:00'),
(926,205,3,'Bela Negara_2507105.pdf','dokumen/dummy_Bela Negara.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-09-16 17:00:00','2025-09-14 17:00:00','2025-09-16 17:00:00'),
(927,206,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_2507106.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,1,'2025-02-12 17:00:00','2025-02-09 17:00:00','2025-02-11 17:00:00'),
(928,206,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_2507106.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,1,'2025-08-12 17:00:00','2025-08-09 17:00:00','2025-08-11 17:00:00'),
(929,206,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_2507106.pdf',NULL,'Disetujui','Semester 3 (2026/2027 Ganjil)',NULL,1,'2026-02-12 17:00:00','2026-02-09 17:00:00','2026-02-11 17:00:00'),
(930,206,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_2507106.pdf',NULL,'Disetujui','Semester 4 (2026/2027 Genap)',NULL,1,'2026-08-12 17:00:00','2026-08-09 17:00:00','2026-08-11 17:00:00'),
(931,206,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_2507106.pdf',NULL,'Disetujui','Semester 5 (2027/2028 Ganjil)',NULL,1,'2027-02-12 17:00:00','2027-02-09 17:00:00','2027-02-11 17:00:00'),
(932,206,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_2507106.pdf',NULL,'Disetujui','Semester 6 (2027/2028 Genap)',NULL,1,'2027-08-12 17:00:00','2027-08-09 17:00:00','2027-08-11 17:00:00'),
(933,206,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_2507106.pdf',NULL,'Disetujui','Semester 7 (2028/2029 Ganjil)',NULL,1,'2028-02-12 17:00:00','2028-02-09 17:00:00','2028-02-11 17:00:00'),
(934,206,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_2507106.pdf',NULL,'Disetujui','Semester 8 (2028/2029 Genap)',NULL,1,'2028-08-12 17:00:00','2028-08-09 17:00:00','2028-08-11 17:00:00'),
(935,206,7,'Pakta Integritas_2507106.pdf','dokumen/dummy_Pakta Integritas.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-22 17:00:00','2025-08-20 17:00:00','2025-08-22 17:00:00'),
(936,206,1,'PKKMB_2507106.pdf','dokumen/dummy_PKKMB.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-26 17:00:00','2025-08-24 17:00:00','2025-08-26 17:00:00'),
(937,206,2,'MABIM_2507106.pdf','dokumen/dummy_MABIM.pdf',NULL,'Disetujui',NULL,NULL,1,'2026-03-21 17:00:00','2026-03-19 17:00:00','2026-03-21 17:00:00'),
(938,206,3,'Bela Negara_2507106.pdf','dokumen/dummy_Bela Negara.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-09-16 17:00:00','2025-09-14 17:00:00','2025-09-16 17:00:00'),
(939,207,6,'KHS_Semester_1.pdf','dokumen/khs_sem_1_2507107.pdf',NULL,'Disetujui','Semester 1 (2025/2026 Ganjil)',NULL,1,'2025-02-12 17:00:00','2025-02-09 17:00:00','2025-02-11 17:00:00'),
(940,207,6,'KHS_Semester_2.pdf','dokumen/khs_sem_2_2507107.pdf',NULL,'Disetujui','Semester 2 (2025/2026 Genap)',NULL,1,'2025-08-12 17:00:00','2025-08-09 17:00:00','2025-08-11 17:00:00'),
(941,207,6,'KHS_Semester_3.pdf','dokumen/khs_sem_3_2507107.pdf',NULL,'Disetujui','Semester 3 (2026/2027 Ganjil)',NULL,1,'2026-02-12 17:00:00','2026-02-09 17:00:00','2026-02-11 17:00:00'),
(942,207,6,'KHS_Semester_4.pdf','dokumen/khs_sem_4_2507107.pdf',NULL,'Disetujui','Semester 4 (2026/2027 Genap)',NULL,1,'2026-08-12 17:00:00','2026-08-09 17:00:00','2026-08-11 17:00:00'),
(943,207,6,'KHS_Semester_5.pdf','dokumen/khs_sem_5_2507107.pdf',NULL,'Disetujui','Semester 5 (2027/2028 Ganjil)',NULL,1,'2027-02-12 17:00:00','2027-02-09 17:00:00','2027-02-11 17:00:00'),
(944,207,6,'KHS_Semester_6.pdf','dokumen/khs_sem_6_2507107.pdf',NULL,'Disetujui','Semester 6 (2027/2028 Genap)',NULL,1,'2027-08-12 17:00:00','2027-08-09 17:00:00','2027-08-11 17:00:00'),
(945,207,6,'KHS_Semester_7.pdf','dokumen/khs_sem_7_2507107.pdf',NULL,'Disetujui','Semester 7 (2028/2029 Ganjil)',NULL,1,'2028-02-12 17:00:00','2028-02-09 17:00:00','2028-02-11 17:00:00'),
(946,207,6,'KHS_Semester_8.pdf','dokumen/khs_sem_8_2507107.pdf',NULL,'Disetujui','Semester 8 (2028/2029 Genap)',NULL,1,'2028-08-12 17:00:00','2028-08-09 17:00:00','2028-08-11 17:00:00'),
(947,207,7,'Pakta Integritas_2507107.pdf','dokumen/dummy_Pakta Integritas.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-22 17:00:00','2025-08-20 17:00:00','2025-08-22 17:00:00'),
(948,207,1,'PKKMB_2507107.pdf','dokumen/dummy_PKKMB.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-08-26 17:00:00','2025-08-24 17:00:00','2025-08-26 17:00:00'),
(949,207,2,'MABIM_2507107.pdf','dokumen/dummy_MABIM.pdf',NULL,'Ditolak','Dokumen tidak sesuai format, mohon upload ulang.',NULL,NULL,NULL,'2026-03-19 17:00:00','2026-03-21 17:00:00'),
(950,207,3,'Bela Negara_2507107.pdf','dokumen/dummy_Bela Negara.pdf',NULL,'Disetujui',NULL,NULL,1,'2025-09-16 17:00:00','2025-09-14 17:00:00','2025-09-16 17:00:00'),
(951,201,3,'7EahlYcSHaPczOP770fk4GUxluwLVigo9r8CN2jN.jpg','dokumen/2507101/Bela Negara/DkswReqyLMdmXh3uw8oNnsvE5IpXK3aLobvkTlXM.jpg',30104,'Disetujui',NULL,NULL,1,'2026-09-02 15:55:15','2026-09-02 15:54:41','2026-09-02 15:55:15');
/*!40000 ALTER TABLE `dokumens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ipk_semestrs`
--

DROP TABLE IF EXISTS `ipk_semestrs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ipk_semestrs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mahasiswa_id` bigint(20) unsigned NOT NULL,
  `semester` tinyint(3) unsigned NOT NULL,
  `tahun_ajaran` varchar(30) NOT NULL,
  `ips` decimal(3,2) NOT NULL DEFAULT 0.00,
  `ipk` decimal(3,2) NOT NULL,
  `file_khs` varchar(255) DEFAULT NULL,
  `status` enum('Menunggu','Disetujui','Ditolak','Draft','Diajukan') NOT NULL DEFAULT 'Menunggu',
  `catatan_admin` text DEFAULT NULL,
  `validated_by` bigint(20) unsigned DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ipk_semestrs_mahasiswa_id_semester_unique` (`mahasiswa_id`,`semester`),
  KEY `ipk_semestrs_validated_by_foreign` (`validated_by`),
  CONSTRAINT `ipk_semestrs_mahasiswa_id_foreign` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ipk_semestrs_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=817 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ipk_semestrs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ipk_semestrs` WRITE;
/*!40000 ALTER TABLE `ipk_semestrs` DISABLE KEYS */;
INSERT INTO `ipk_semestrs` VALUES
(79,96,1,'2023/2024 Ganjil',3.80,3.80,'khs_sem_1_2306064.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2026-09-01 22:09:21'),
(80,96,2,'2023/2024 Genap',3.80,3.80,'khs_sem_2_2306064.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-09 17:00:00'),
(81,96,3,'Tahun 2024/2025-1',2.00,3.20,'khs/2306064/saifKRJVGEbrIiXAdwOEs1MdK7jdvDfESGJJo7Ig.pdf','Disetujui',NULL,1,'2026-09-02 01:25:38','2025-02-09 17:00:00','2026-09-02 01:25:38'),
(82,96,4,'Tahun 2024/2025-2',3.00,3.15,'khs/2306064/jErazEQFLoP6h18GeGw2ZR3xPeiEcnKFOhPivRsD.pdf','Disetujui',NULL,1,'2026-09-02 01:25:33','2025-08-09 17:00:00','2026-09-02 01:25:33'),
(83,96,5,'Tahun 2025/2026-1',4.00,3.32,'khs/2306064/u7CSQzib6Yg2tBgu8JXWYpKgTm5GUdB4FfbQ1gX4.pdf','Disetujui',NULL,1,'2026-09-02 02:49:33','2026-02-09 17:00:00','2026-09-02 02:49:33'),
(84,96,6,'Tahun 2025/2026-2',3.50,3.35,'khs/2306064/RY8N2LSi3ROl9YRWiHEhiy5fTdQoAeTj6maSTudZ.pdf','Disetujui',NULL,1,'2026-09-02 00:52:00','2026-08-09 17:00:00','2026-09-02 02:49:15'),
(430,144,1,'2023/2024 Ganjil',3.69,3.69,'khs_sem_1_202307001.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(431,144,2,'2023/2024 Genap',3.82,3.82,'khs_sem_2_202307001.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(432,144,3,'2024/2025 Ganjil',3.84,3.84,'khs_sem_3_202307001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(433,144,4,'2024/2025 Genap',3.91,3.91,'khs_sem_4_202307001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(434,144,5,'2025/2026 Ganjil',3.94,3.94,'khs_sem_5_202307001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(435,144,6,'2025/2026 Genap',3.88,3.88,'khs_sem_6_202307001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(436,145,1,'2023/2024 Ganjil',3.38,3.38,'khs_sem_1_202307002.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(437,145,2,'2023/2024 Genap',3.53,3.53,'khs_sem_2_202307002.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(438,145,3,'2024/2025 Ganjil',2.76,2.76,'khs_sem_3_202307002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(439,145,4,'2024/2025 Genap',3.19,3.19,'khs_sem_4_202307002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(440,145,5,'2025/2026 Ganjil',3.33,3.33,'khs_sem_5_202307002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(441,145,6,'2025/2026 Genap',3.45,3.45,'khs_sem_6_202307002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(442,146,1,'2023/2024 Ganjil',2.86,2.86,'khs_sem_1_202307003.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(443,146,2,'2023/2024 Genap',2.99,2.99,'khs_sem_2_202307003.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(444,146,3,'2024/2025 Ganjil',3.06,3.06,'khs_sem_3_202307003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(445,146,4,'2024/2025 Genap',3.14,3.14,'khs_sem_4_202307003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(446,146,5,'2025/2026 Ganjil',3.17,3.17,'khs_sem_5_202307003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(447,146,6,'2025/2026 Genap',3.21,3.21,'khs_sem_6_202307003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(448,147,1,'2023/2024 Ganjil',3.70,3.70,'khs_sem_1_202303001.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(449,147,2,'2023/2024 Genap',3.75,3.75,'khs_sem_2_202303001.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(450,147,3,'2024/2025 Ganjil',3.82,3.82,'khs_sem_3_202303001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(451,147,4,'2024/2025 Genap',3.86,3.86,'khs_sem_4_202303001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(452,147,5,'2025/2026 Ganjil',3.95,3.95,'khs_sem_5_202303001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(453,147,6,'2025/2026 Genap',3.92,3.92,'khs_sem_6_202303001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(454,148,1,'2023/2024 Ganjil',3.43,3.43,'khs_sem_1_202303002.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(455,148,2,'2023/2024 Genap',3.46,3.46,'khs_sem_2_202303002.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(456,148,3,'2024/2025 Ganjil',2.83,2.83,'khs_sem_3_202303002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(457,148,4,'2024/2025 Genap',3.23,3.23,'khs_sem_4_202303002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(458,148,5,'2025/2026 Ganjil',3.34,3.34,'khs_sem_5_202303002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(459,148,6,'2025/2026 Genap',3.49,3.49,'khs_sem_6_202303002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(460,149,1,'2023/2024 Ganjil',2.92,2.92,'khs_sem_1_202303003.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(461,149,2,'2023/2024 Genap',2.99,2.99,'khs_sem_2_202303003.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(462,149,3,'2024/2025 Ganjil',3.05,3.05,'khs_sem_3_202303003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(463,149,4,'2024/2025 Genap',3.11,3.11,'khs_sem_4_202303003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(464,149,5,'2025/2026 Ganjil',3.20,3.20,'khs_sem_5_202303003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(465,149,6,'2025/2026 Genap',3.24,3.24,'khs_sem_6_202303003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(466,150,1,'2023/2024 Ganjil',3.74,3.74,'khs_sem_1_202311001.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(467,150,2,'2023/2024 Genap',3.76,3.76,'khs_sem_2_202311001.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(468,150,3,'2024/2025 Ganjil',3.85,3.85,'khs_sem_3_202311001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(469,150,4,'2024/2025 Genap',3.87,3.87,'khs_sem_4_202311001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(470,150,5,'2025/2026 Ganjil',3.90,3.90,'khs_sem_5_202311001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(471,150,6,'2025/2026 Genap',3.93,3.93,'khs_sem_6_202311001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(472,151,1,'2023/2024 Ganjil',3.42,3.42,'khs_sem_1_202311002.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(473,151,2,'2023/2024 Genap',3.52,3.52,'khs_sem_2_202311002.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(474,151,3,'2024/2025 Ganjil',2.85,2.85,'khs_sem_3_202311002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(475,151,4,'2024/2025 Genap',3.19,3.19,'khs_sem_4_202311002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(476,151,5,'2025/2026 Ganjil',3.33,3.33,'khs_sem_5_202311002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(477,151,6,'2025/2026 Genap',3.50,3.50,'khs_sem_6_202311002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(478,152,1,'2023/2024 Ganjil',2.87,2.87,'khs_sem_1_202311003.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(479,152,2,'2023/2024 Genap',3.04,3.04,'khs_sem_2_202311003.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(480,152,3,'2024/2025 Ganjil',3.14,3.14,'khs_sem_3_202311003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(481,152,4,'2024/2025 Genap',3.12,3.12,'khs_sem_4_202311003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(482,152,5,'2025/2026 Ganjil',3.22,3.22,'khs_sem_5_202311003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(483,152,6,'2025/2026 Genap',3.26,3.26,'khs_sem_6_202311003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(484,153,1,'2023/2024 Ganjil',3.66,3.66,'khs_sem_1_202324001.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(485,153,2,'2023/2024 Genap',3.84,3.84,'khs_sem_2_202324001.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(486,153,3,'2024/2025 Ganjil',3.83,3.83,'khs_sem_3_202324001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(487,153,4,'2024/2025 Genap',3.92,3.92,'khs_sem_4_202324001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(488,153,5,'2025/2026 Ganjil',3.90,3.90,'khs_sem_5_202324001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(489,153,6,'2025/2026 Genap',3.89,3.89,'khs_sem_6_202324001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(490,154,1,'2023/2024 Ganjil',3.37,3.37,'khs_sem_1_202324002.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(491,154,2,'2023/2024 Genap',3.49,3.49,'khs_sem_2_202324002.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(492,154,3,'2024/2025 Ganjil',2.83,2.83,'khs_sem_3_202324002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(493,154,4,'2024/2025 Genap',3.22,3.22,'khs_sem_4_202324002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(494,154,5,'2025/2026 Ganjil',3.39,3.39,'khs_sem_5_202324002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(495,154,6,'2025/2026 Genap',3.42,3.42,'khs_sem_6_202324002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(496,155,1,'2023/2024 Ganjil',2.93,2.93,'khs_sem_1_202324003.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(497,155,2,'2023/2024 Genap',3.03,3.03,'khs_sem_2_202324003.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(498,155,3,'2024/2025 Ganjil',3.13,3.13,'khs_sem_3_202324003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(499,155,4,'2024/2025 Genap',3.15,3.15,'khs_sem_4_202324003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(500,155,5,'2025/2026 Ganjil',3.16,3.16,'khs_sem_5_202324003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(501,155,6,'2025/2026 Genap',3.25,3.25,'khs_sem_6_202324003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(502,156,1,'2024/2025 Ganjil',3.72,3.72,'khs_sem_1_202406001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(503,156,2,'2024/2025 Genap',3.76,3.76,'khs_sem_2_202406001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(504,156,3,'2025/2026 Ganjil',3.81,3.81,'khs_sem_3_202406001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(505,156,4,'2025/2026 Genap',3.87,3.87,'khs_sem_4_202406001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(506,157,1,'2024/2025 Ganjil',3.43,3.43,'khs_sem_1_202406002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(507,157,2,'2024/2025 Genap',3.50,3.50,'khs_sem_2_202406002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(508,157,3,'2025/2026 Ganjil',2.81,2.81,'khs_sem_3_202406002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(509,157,4,'2025/2026 Genap',3.18,3.18,'khs_sem_4_202406002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(510,158,1,'2024/2025 Ganjil',2.88,2.88,'khs_sem_1_202406003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(511,158,2,'2024/2025 Genap',2.96,2.96,'khs_sem_2_202406003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(512,158,3,'2025/2026 Ganjil',3.14,3.14,'khs_sem_3_202406003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(513,158,4,'2025/2026 Genap',3.12,3.12,'khs_sem_4_202406003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(514,159,1,'2024/2025 Ganjil',3.72,3.72,'khs_sem_1_202407001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(515,159,2,'2024/2025 Genap',3.76,3.76,'khs_sem_2_202407001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(516,159,3,'2025/2026 Ganjil',3.90,3.90,'khs_sem_3_202407001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(517,159,4,'2025/2026 Genap',3.83,3.83,'khs_sem_4_202407001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(518,160,1,'2024/2025 Ganjil',3.44,3.44,'khs_sem_1_202407002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(519,160,2,'2024/2025 Genap',3.46,3.46,'khs_sem_2_202407002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(520,160,3,'2025/2026 Ganjil',2.83,2.83,'khs_sem_3_202407002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(521,160,4,'2025/2026 Genap',3.22,3.22,'khs_sem_4_202407002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(522,161,1,'2024/2025 Ganjil',2.86,2.86,'khs_sem_1_202407003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(523,161,2,'2024/2025 Genap',3.00,3.00,'khs_sem_2_202407003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(524,161,3,'2025/2026 Ganjil',3.14,3.14,'khs_sem_3_202407003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(525,161,4,'2025/2026 Genap',3.18,3.18,'khs_sem_4_202407003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(526,162,1,'2024/2025 Ganjil',3.67,3.67,'khs_sem_1_202403001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(527,162,2,'2024/2025 Genap',3.76,3.76,'khs_sem_2_202403001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(528,162,3,'2025/2026 Ganjil',3.82,3.82,'khs_sem_3_202403001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(529,162,4,'2025/2026 Genap',3.91,3.91,'khs_sem_4_202403001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(530,163,1,'2024/2025 Ganjil',3.36,3.36,'khs_sem_1_202403002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(531,163,2,'2024/2025 Genap',3.52,3.52,'khs_sem_2_202403002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(532,163,3,'2025/2026 Ganjil',2.78,2.78,'khs_sem_3_202403002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(533,163,4,'2025/2026 Genap',3.21,3.21,'khs_sem_4_202403002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(534,164,1,'2024/2025 Ganjil',2.91,2.91,'khs_sem_1_202403003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(535,164,2,'2024/2025 Genap',2.98,2.98,'khs_sem_2_202403003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(536,164,3,'2025/2026 Ganjil',3.14,3.14,'khs_sem_3_202403003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(537,164,4,'2025/2026 Genap',3.17,3.17,'khs_sem_4_202403003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(538,165,1,'2024/2025 Ganjil',3.65,3.65,'khs_sem_1_202411001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(539,165,2,'2024/2025 Genap',3.81,3.81,'khs_sem_2_202411001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(540,165,3,'2025/2026 Ganjil',3.83,3.83,'khs_sem_3_202411001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(541,165,4,'2025/2026 Genap',3.88,3.88,'khs_sem_4_202411001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(542,166,1,'2024/2025 Ganjil',3.37,3.37,'khs_sem_1_202411002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(543,166,2,'2024/2025 Genap',3.52,3.52,'khs_sem_2_202411002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(544,166,3,'2025/2026 Ganjil',2.79,2.79,'khs_sem_3_202411002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(545,166,4,'2025/2026 Genap',3.22,3.22,'khs_sem_4_202411002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(546,167,1,'2024/2025 Ganjil',2.92,2.92,'khs_sem_1_202411003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(547,167,2,'2024/2025 Genap',3.03,3.03,'khs_sem_2_202411003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(548,167,3,'2025/2026 Ganjil',3.08,3.08,'khs_sem_3_202411003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(549,167,4,'2025/2026 Genap',3.15,3.15,'khs_sem_4_202411003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(550,168,1,'2024/2025 Ganjil',3.73,3.73,'khs_sem_1_202424001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(551,168,2,'2024/2025 Genap',3.83,3.83,'khs_sem_2_202424001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(552,168,3,'2025/2026 Ganjil',3.82,3.82,'khs_sem_3_202424001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(553,168,4,'2025/2026 Genap',3.90,3.90,'khs_sem_4_202424001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(554,169,1,'2024/2025 Ganjil',3.38,3.38,'khs_sem_1_202424002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(555,169,2,'2024/2025 Genap',3.51,3.51,'khs_sem_2_202424002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(556,169,3,'2025/2026 Ganjil',2.77,2.77,'khs_sem_3_202424002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(557,169,4,'2025/2026 Genap',3.19,3.19,'khs_sem_4_202424002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(558,170,1,'2024/2025 Ganjil',2.89,2.89,'khs_sem_1_202424003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(559,170,2,'2024/2025 Genap',2.97,2.97,'khs_sem_2_202424003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(560,170,3,'2025/2026 Ganjil',3.13,3.13,'khs_sem_3_202424003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(561,170,4,'2025/2026 Genap',3.19,3.19,'khs_sem_4_202424003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(562,171,1,'2025/2026 Ganjil',3.67,3.67,'khs_sem_1_202506001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(563,171,2,'2025/2026 Genap',3.81,3.81,'khs_sem_2_202506001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(564,172,1,'2025/2026 Ganjil',3.42,3.42,'khs_sem_1_202506002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(565,172,2,'2025/2026 Genap',3.54,3.54,'khs_sem_2_202506002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(566,173,1,'2025/2026 Ganjil',2.86,2.86,'khs_sem_1_202506003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(567,173,2,'2025/2026 Genap',3.04,3.04,'khs_sem_2_202506003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(568,174,1,'2025/2026 Ganjil',3.70,3.70,'khs_sem_1_202507001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(569,174,2,'2025/2026 Genap',3.79,3.79,'khs_sem_2_202507001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(570,175,1,'2025/2026 Ganjil',3.43,3.43,'khs_sem_1_202507002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(571,175,2,'2025/2026 Genap',3.46,3.46,'khs_sem_2_202507002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(572,176,1,'2025/2026 Ganjil',2.93,2.93,'khs_sem_1_202507003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(573,176,2,'2025/2026 Genap',2.95,2.95,'khs_sem_2_202507003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(574,177,1,'2025/2026 Ganjil',3.68,3.68,'khs_sem_1_202503001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(575,177,2,'2025/2026 Genap',3.76,3.76,'khs_sem_2_202503001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(576,178,1,'2025/2026 Ganjil',3.45,3.45,'khs_sem_1_202503002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(577,178,2,'2025/2026 Genap',3.54,3.54,'khs_sem_2_202503002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(578,179,1,'2025/2026 Ganjil',2.92,2.92,'khs_sem_1_202503003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(579,179,2,'2025/2026 Genap',3.05,3.05,'khs_sem_2_202503003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(580,180,1,'2025/2026 Ganjil',3.73,3.73,'khs_sem_1_202511001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(581,180,2,'2025/2026 Genap',3.85,3.85,'khs_sem_2_202511001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(582,181,1,'2025/2026 Ganjil',3.40,3.40,'khs_sem_1_202511002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(583,181,2,'2025/2026 Genap',3.55,3.55,'khs_sem_2_202511002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(584,182,1,'2025/2026 Ganjil',2.94,2.94,'khs_sem_1_202511003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(585,182,2,'2025/2026 Genap',2.96,2.96,'khs_sem_2_202511003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(586,183,1,'2025/2026 Ganjil',3.69,3.69,'khs_sem_1_202524001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(587,183,2,'2025/2026 Genap',3.83,3.83,'khs_sem_2_202524001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(588,184,1,'2025/2026 Ganjil',3.43,3.43,'khs_sem_1_202524002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(589,184,2,'2025/2026 Genap',3.51,3.51,'khs_sem_2_202524002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(590,185,1,'2025/2026 Ganjil',2.92,2.92,'khs_sem_1_202524003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(591,185,2,'2025/2026 Genap',3.05,3.05,'khs_sem_2_202524003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(592,186,1,'2026/2027 Ganjil',3.69,3.69,'khs_sem_1_202606001.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(593,187,1,'2026/2027 Ganjil',3.36,3.36,'khs_sem_1_202606002.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(594,188,1,'2026/2027 Ganjil',2.93,2.93,'khs_sem_1_202606003.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(595,189,1,'2026/2027 Ganjil',3.67,3.67,'khs_sem_1_202607001.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(596,190,1,'2026/2027 Ganjil',3.43,3.43,'khs_sem_1_202607002.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(597,191,1,'2026/2027 Ganjil',2.90,2.90,'khs_sem_1_202607003.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(598,192,1,'2026/2027 Ganjil',3.67,3.67,'khs_sem_1_202603001.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(599,193,1,'2026/2027 Ganjil',3.42,3.42,'khs_sem_1_202603002.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(600,194,1,'2026/2027 Ganjil',2.86,2.86,'khs_sem_1_202603003.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(601,195,1,'2026/2027 Ganjil',3.73,3.73,'khs_sem_1_202611001.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(602,196,1,'2026/2027 Ganjil',3.35,3.35,'khs_sem_1_202611002.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(603,197,1,'2026/2027 Ganjil',2.91,2.91,'khs_sem_1_202611003.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(604,198,1,'2026/2027 Ganjil',3.67,3.67,'khs_sem_1_202624001.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(605,199,1,'2026/2027 Ganjil',3.44,3.44,'khs_sem_1_202624002.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(606,200,1,'2026/2027 Ganjil',2.93,2.93,'khs_sem_1_202624003.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(623,126,1,'2022/2023 Ganjil',3.70,3.70,'khs_sem_1_202206001.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(624,126,2,'2022/2023 Genap',3.83,3.83,'khs_sem_2_202206001.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(625,126,3,'2023/2024 Ganjil',3.89,3.89,'khs_sem_3_202206001.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(626,126,4,'2023/2024 Genap',3.91,3.91,'khs_sem_4_202206001.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(627,126,5,'2024/2025 Ganjil',3.94,3.94,'khs_sem_5_202206001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(628,126,6,'2024/2025 Genap',3.94,3.94,'khs_sem_6_202206001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(629,126,7,'2025/2026 Ganjil',3.90,3.90,'khs_sem_7_202206001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(630,126,8,'2025/2026 Genap',3.94,3.94,'khs_sem_8_202206001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(631,127,1,'2022/2023 Ganjil',3.40,3.40,'khs_sem_1_202206002.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(632,127,2,'2022/2023 Genap',3.54,3.54,'khs_sem_2_202206002.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(633,127,3,'2023/2024 Ganjil',2.85,2.85,'khs_sem_3_202206002.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(634,127,4,'2023/2024 Genap',3.18,3.18,'khs_sem_4_202206002.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(635,127,5,'2024/2025 Ganjil',3.38,3.38,'khs_sem_5_202206002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(636,127,6,'2024/2025 Genap',3.48,3.48,'khs_sem_6_202206002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(637,127,7,'2025/2026 Ganjil',3.54,3.54,'khs_sem_7_202206002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(638,127,8,'2025/2026 Genap',3.53,3.53,'khs_sem_8_202206002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(639,128,1,'2022/2023 Ganjil',2.91,2.91,'khs_sem_1_202206003.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(640,128,2,'2022/2023 Genap',2.97,2.97,'khs_sem_2_202206003.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(641,128,3,'2023/2024 Ganjil',3.13,3.13,'khs_sem_3_202206003.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(642,128,4,'2023/2024 Genap',3.16,3.16,'khs_sem_4_202206003.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(643,128,5,'2024/2025 Ganjil',3.22,3.22,'khs_sem_5_202206003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(644,128,6,'2024/2025 Genap',3.22,3.22,'khs_sem_6_202206003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(645,128,7,'2025/2026 Ganjil',3.32,3.32,'khs_sem_7_202206003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(646,128,8,'2025/2026 Genap',3.32,3.32,'khs_sem_8_202206003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(647,129,1,'2022/2023 Ganjil',3.66,3.66,'khs_sem_1_202207001.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(648,129,2,'2022/2023 Genap',3.79,3.79,'khs_sem_2_202207001.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(649,129,3,'2023/2024 Ganjil',3.88,3.88,'khs_sem_3_202207001.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(650,129,4,'2023/2024 Genap',3.93,3.93,'khs_sem_4_202207001.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(651,129,5,'2024/2025 Ganjil',3.85,3.85,'khs_sem_5_202207001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(652,129,6,'2024/2025 Genap',3.95,3.95,'khs_sem_6_202207001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(653,129,7,'2025/2026 Ganjil',3.95,3.95,'khs_sem_7_202207001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(654,129,8,'2025/2026 Genap',3.99,3.99,'khs_sem_8_202207001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(655,130,1,'2022/2023 Ganjil',3.36,3.36,'khs_sem_1_202207002.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(656,130,2,'2022/2023 Genap',3.49,3.49,'khs_sem_2_202207002.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(657,130,3,'2023/2024 Ganjil',2.75,2.75,'khs_sem_3_202207002.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(658,130,4,'2023/2024 Genap',3.24,3.24,'khs_sem_4_202207002.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(659,130,5,'2024/2025 Ganjil',3.39,3.39,'khs_sem_5_202207002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(660,130,6,'2024/2025 Genap',3.45,3.45,'khs_sem_6_202207002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(661,130,7,'2025/2026 Ganjil',3.52,3.52,'khs_sem_7_202207002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(662,130,8,'2025/2026 Genap',3.53,3.53,'khs_sem_8_202207002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(663,131,1,'2022/2023 Ganjil',2.90,2.90,'khs_sem_1_202207003.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(664,131,2,'2022/2023 Genap',2.96,2.96,'khs_sem_2_202207003.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(665,131,3,'2023/2024 Ganjil',3.14,3.14,'khs_sem_3_202207003.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(666,131,4,'2023/2024 Genap',3.19,3.19,'khs_sem_4_202207003.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(667,131,5,'2024/2025 Ganjil',3.18,3.18,'khs_sem_5_202207003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(668,131,6,'2024/2025 Genap',3.28,3.28,'khs_sem_6_202207003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(669,131,7,'2025/2026 Ganjil',3.25,3.25,'khs_sem_7_202207003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(670,131,8,'2025/2026 Genap',3.27,3.27,'khs_sem_8_202207003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(671,132,1,'2022/2023 Ganjil',3.67,3.67,'khs_sem_1_202203001.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(672,132,2,'2022/2023 Genap',3.78,3.78,'khs_sem_2_202203001.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(673,132,3,'2023/2024 Ganjil',3.87,3.87,'khs_sem_3_202203001.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(674,132,4,'2023/2024 Genap',3.88,3.88,'khs_sem_4_202203001.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(675,132,5,'2024/2025 Ganjil',3.91,3.91,'khs_sem_5_202203001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(676,132,6,'2024/2025 Genap',3.91,3.91,'khs_sem_6_202203001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(677,132,7,'2025/2026 Ganjil',3.95,3.95,'khs_sem_7_202203001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(678,132,8,'2025/2026 Genap',3.92,3.92,'khs_sem_8_202203001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(679,133,1,'2022/2023 Ganjil',3.45,3.45,'khs_sem_1_202203002.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(680,133,2,'2022/2023 Genap',3.46,3.46,'khs_sem_2_202203002.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(681,133,3,'2023/2024 Ganjil',2.83,2.83,'khs_sem_3_202203002.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(682,133,4,'2023/2024 Genap',3.17,3.17,'khs_sem_4_202203002.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(683,133,5,'2024/2025 Ganjil',3.39,3.39,'khs_sem_5_202203002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(684,133,6,'2024/2025 Genap',3.42,3.42,'khs_sem_6_202203002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(685,133,7,'2025/2026 Ganjil',3.50,3.50,'khs_sem_7_202203002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(686,133,8,'2025/2026 Genap',3.54,3.54,'khs_sem_8_202203002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(687,134,1,'2022/2023 Ganjil',2.85,2.85,'khs_sem_1_202203003.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(688,134,2,'2022/2023 Genap',3.02,3.02,'khs_sem_2_202203003.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(689,134,3,'2023/2024 Ganjil',3.06,3.06,'khs_sem_3_202203003.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(690,134,4,'2023/2024 Genap',3.16,3.16,'khs_sem_4_202203003.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(691,134,5,'2024/2025 Ganjil',3.18,3.18,'khs_sem_5_202203003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(692,134,6,'2024/2025 Genap',3.26,3.26,'khs_sem_6_202203003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(693,134,7,'2025/2026 Ganjil',3.26,3.26,'khs_sem_7_202203003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(694,134,8,'2025/2026 Genap',3.28,3.28,'khs_sem_8_202203003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(695,135,1,'2022/2023 Ganjil',3.72,3.72,'khs_sem_1_202211001.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(696,135,2,'2022/2023 Genap',3.80,3.80,'khs_sem_2_202211001.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(697,135,3,'2023/2024 Ganjil',3.84,3.84,'khs_sem_3_202211001.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(698,135,4,'2023/2024 Genap',3.89,3.89,'khs_sem_4_202211001.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(699,135,5,'2024/2025 Ganjil',3.87,3.87,'khs_sem_5_202211001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(700,135,6,'2024/2025 Genap',3.88,3.88,'khs_sem_6_202211001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(701,135,7,'2025/2026 Ganjil',3.92,3.92,'khs_sem_7_202211001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(702,135,8,'2025/2026 Genap',3.94,3.94,'khs_sem_8_202211001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(703,136,1,'2022/2023 Ganjil',3.40,3.40,'khs_sem_1_202211002.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(704,136,2,'2022/2023 Genap',3.45,3.45,'khs_sem_2_202211002.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(705,136,3,'2023/2024 Ganjil',2.84,2.84,'khs_sem_3_202211002.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(706,136,4,'2023/2024 Genap',3.22,3.22,'khs_sem_4_202211002.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(707,136,5,'2024/2025 Ganjil',3.32,3.32,'khs_sem_5_202211002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(708,136,6,'2024/2025 Genap',3.48,3.48,'khs_sem_6_202211002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(709,136,7,'2025/2026 Ganjil',3.53,3.53,'khs_sem_7_202211002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(710,136,8,'2025/2026 Genap',3.54,3.54,'khs_sem_8_202211002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(711,137,1,'2022/2023 Ganjil',2.87,2.87,'khs_sem_1_202211003.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(712,137,2,'2022/2023 Genap',3.03,3.03,'khs_sem_2_202211003.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(713,137,3,'2023/2024 Ganjil',3.14,3.14,'khs_sem_3_202211003.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(714,137,4,'2023/2024 Genap',3.11,3.11,'khs_sem_4_202211003.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(715,137,5,'2024/2025 Ganjil',3.22,3.22,'khs_sem_5_202211003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(716,137,6,'2024/2025 Genap',3.26,3.26,'khs_sem_6_202211003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(717,137,7,'2025/2026 Ganjil',3.24,3.24,'khs_sem_7_202211003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(718,137,8,'2025/2026 Genap',3.26,3.26,'khs_sem_8_202211003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(719,138,1,'2022/2023 Ganjil',3.75,3.75,'khs_sem_1_202224001.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(720,138,2,'2022/2023 Genap',3.81,3.81,'khs_sem_2_202224001.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(721,138,3,'2023/2024 Ganjil',3.86,3.86,'khs_sem_3_202224001.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(722,138,4,'2023/2024 Genap',3.86,3.86,'khs_sem_4_202224001.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(723,138,5,'2024/2025 Ganjil',3.91,3.91,'khs_sem_5_202224001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(724,138,6,'2024/2025 Genap',3.90,3.90,'khs_sem_6_202224001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(725,138,7,'2025/2026 Ganjil',3.90,3.90,'khs_sem_7_202224001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(726,138,8,'2025/2026 Genap',4.00,4.00,'khs_sem_8_202224001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(727,139,1,'2022/2023 Ganjil',3.41,3.41,'khs_sem_1_202224002.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(728,139,2,'2022/2023 Genap',3.53,3.53,'khs_sem_2_202224002.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(729,139,3,'2023/2024 Ganjil',2.78,2.78,'khs_sem_3_202224002.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(730,139,4,'2023/2024 Genap',3.21,3.21,'khs_sem_4_202224002.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(731,139,5,'2024/2025 Ganjil',3.34,3.34,'khs_sem_5_202224002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(732,139,6,'2024/2025 Genap',3.41,3.41,'khs_sem_6_202224002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(733,139,7,'2025/2026 Ganjil',3.46,3.46,'khs_sem_7_202224002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(734,139,8,'2025/2026 Genap',3.53,3.53,'khs_sem_8_202224002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(735,140,1,'2022/2023 Ganjil',2.89,2.89,'khs_sem_1_202224003.pdf','Disetujui',NULL,NULL,NULL,'2022-02-09 17:00:00','2022-02-11 17:00:00'),
(736,140,2,'2022/2023 Genap',3.03,3.03,'khs_sem_2_202224003.pdf','Disetujui',NULL,NULL,NULL,'2022-08-09 17:00:00','2022-08-11 17:00:00'),
(737,140,3,'2023/2024 Ganjil',3.14,3.14,'khs_sem_3_202224003.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(738,140,4,'2023/2024 Genap',3.18,3.18,'khs_sem_4_202224003.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(739,140,5,'2024/2025 Ganjil',3.18,3.18,'khs_sem_5_202224003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(740,140,6,'2024/2025 Genap',3.26,3.26,'khs_sem_6_202224003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(741,140,7,'2025/2026 Ganjil',3.31,3.31,'khs_sem_7_202224003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(742,140,8,'2025/2026 Genap',3.27,3.27,'khs_sem_8_202224003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(743,141,1,'2023/2024 Ganjil',3.69,3.69,'khs_sem_1_202306001.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(744,141,2,'2023/2024 Genap',3.77,3.77,'khs_sem_2_202306001.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(745,141,3,'2024/2025 Ganjil',3.83,3.83,'khs_sem_3_202306001.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(746,141,4,'2024/2025 Genap',3.84,3.84,'khs_sem_4_202306001.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(747,141,5,'2025/2026 Ganjil',3.86,3.86,'khs_sem_5_202306001.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(748,141,6,'2025/2026 Genap',3.92,3.92,'khs_sem_6_202306001.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(749,142,1,'2023/2024 Ganjil',3.40,3.40,'khs_sem_1_202306002.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(750,142,2,'2023/2024 Genap',3.46,3.46,'khs_sem_2_202306002.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(751,142,3,'2024/2025 Ganjil',2.84,2.84,'khs_sem_3_202306002.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(752,142,4,'2024/2025 Genap',3.25,3.25,'khs_sem_4_202306002.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(753,142,5,'2025/2026 Ganjil',3.32,3.32,'khs_sem_5_202306002.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(754,142,6,'2025/2026 Genap',3.45,3.45,'khs_sem_6_202306002.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(755,143,1,'2023/2024 Ganjil',2.89,2.89,'khs_sem_1_202306003.pdf','Disetujui',NULL,NULL,NULL,'2023-02-09 17:00:00','2023-02-11 17:00:00'),
(756,143,2,'2023/2024 Genap',3.03,3.03,'khs_sem_2_202306003.pdf','Disetujui',NULL,NULL,NULL,'2023-08-09 17:00:00','2023-08-11 17:00:00'),
(757,143,3,'2024/2025 Ganjil',3.07,3.07,'khs_sem_3_202306003.pdf','Disetujui',NULL,NULL,NULL,'2024-02-09 17:00:00','2024-02-11 17:00:00'),
(758,143,4,'2024/2025 Genap',3.12,3.12,'khs_sem_4_202306003.pdf','Disetujui',NULL,NULL,NULL,'2024-08-09 17:00:00','2024-08-11 17:00:00'),
(759,143,5,'2025/2026 Ganjil',3.25,3.25,'khs_sem_5_202306003.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(760,143,6,'2025/2026 Genap',3.28,3.28,'khs_sem_6_202306003.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(761,201,1,'2025/2026 Ganjil',3.39,3.39,'khs_sem_1_2507101.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(762,201,2,'2025/2026 Genap',3.44,3.44,'khs_sem_2_2507101.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(763,201,3,'2026/2027 Ganjil',3.47,3.47,'khs_sem_3_2507101.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(764,201,4,'2026/2027 Genap',3.36,3.36,'khs_sem_4_2507101.pdf','Disetujui',NULL,NULL,NULL,'2026-08-09 17:00:00','2026-08-11 17:00:00'),
(765,201,5,'2027/2028 Ganjil',3.38,3.38,'khs_sem_5_2507101.pdf','Disetujui',NULL,NULL,NULL,'2027-02-09 17:00:00','2027-02-11 17:00:00'),
(766,201,6,'2027/2028 Genap',3.44,3.44,'khs_sem_6_2507101.pdf','Disetujui',NULL,NULL,NULL,'2027-08-09 17:00:00','2027-08-11 17:00:00'),
(767,201,7,'2028/2029 Ganjil',3.34,3.34,'khs_sem_7_2507101.pdf','Disetujui',NULL,NULL,NULL,'2028-02-09 17:00:00','2028-02-11 17:00:00'),
(768,201,8,'2028/2029 Genap',3.42,3.42,'khs_sem_8_2507101.pdf','Disetujui',NULL,NULL,NULL,'2028-08-09 17:00:00','2028-08-11 17:00:00'),
(769,202,1,'2025/2026 Ganjil',3.00,3.00,'khs_sem_1_2507102.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(770,202,2,'2025/2026 Genap',2.97,2.97,'khs_sem_2_2507102.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(771,202,3,'2026/2027 Ganjil',3.09,3.09,'khs_sem_3_2507102.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(772,202,4,'2026/2027 Genap',2.84,2.84,'khs_sem_4_2507102.pdf','Disetujui',NULL,NULL,NULL,'2026-08-09 17:00:00','2026-08-11 17:00:00'),
(773,202,5,'2027/2028 Ganjil',3.02,3.02,'khs_sem_5_2507102.pdf','Disetujui',NULL,NULL,NULL,'2027-02-09 17:00:00','2027-02-11 17:00:00'),
(774,202,6,'2027/2028 Genap',2.94,2.94,'khs_sem_6_2507102.pdf','Disetujui',NULL,NULL,NULL,'2027-08-09 17:00:00','2027-08-11 17:00:00'),
(775,202,7,'2028/2029 Ganjil',2.89,2.89,'khs_sem_7_2507102.pdf','Disetujui',NULL,NULL,NULL,'2028-02-09 17:00:00','2028-02-11 17:00:00'),
(776,202,8,'2028/2029 Genap',2.82,2.82,'khs_sem_8_2507102.pdf','Disetujui',NULL,NULL,NULL,'2028-08-09 17:00:00','2028-08-11 17:00:00'),
(777,203,1,'2025/2026 Ganjil',3.74,3.74,'khs_sem_1_2507103.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(778,203,2,'2025/2026 Genap',3.65,3.65,'khs_sem_2_2507103.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(779,203,3,'2026/2027 Ganjil',3.60,3.60,'khs_sem_3_2507103.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(780,203,4,'2026/2027 Genap',3.45,3.45,'khs_sem_4_2507103.pdf','Disetujui',NULL,NULL,NULL,'2026-08-09 17:00:00','2026-08-11 17:00:00'),
(781,203,5,'2027/2028 Ganjil',3.60,3.60,'khs_sem_5_2507103.pdf','Disetujui',NULL,NULL,NULL,'2027-02-09 17:00:00','2027-02-11 17:00:00'),
(782,203,6,'2027/2028 Genap',3.52,3.52,'khs_sem_6_2507103.pdf','Disetujui',NULL,NULL,NULL,'2027-08-09 17:00:00','2027-08-11 17:00:00'),
(783,203,7,'2028/2029 Ganjil',3.52,3.52,'khs_sem_7_2507103.pdf','Disetujui',NULL,NULL,NULL,'2028-02-09 17:00:00','2028-02-11 17:00:00'),
(784,203,8,'2028/2029 Genap',3.75,3.75,'khs_sem_8_2507103.pdf','Disetujui',NULL,NULL,NULL,'2028-08-09 17:00:00','2028-08-11 17:00:00'),
(785,204,1,'2025/2026 Ganjil',3.22,3.22,'khs_sem_1_2507104.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(786,204,2,'2025/2026 Genap',3.25,3.25,'khs_sem_2_2507104.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(787,204,3,'2026/2027 Ganjil',3.36,3.36,'khs_sem_3_2507104.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(788,204,4,'2026/2027 Genap',3.29,3.29,'khs_sem_4_2507104.pdf','Disetujui',NULL,NULL,NULL,'2026-08-09 17:00:00','2026-08-11 17:00:00'),
(789,204,5,'2027/2028 Ganjil',3.35,3.35,'khs_sem_5_2507104.pdf','Disetujui',NULL,NULL,NULL,'2027-02-09 17:00:00','2027-02-11 17:00:00'),
(790,204,6,'2027/2028 Genap',3.20,3.20,'khs_sem_6_2507104.pdf','Disetujui',NULL,NULL,NULL,'2027-08-09 17:00:00','2027-08-11 17:00:00'),
(791,204,7,'2028/2029 Ganjil',3.31,3.31,'khs_sem_7_2507104.pdf','Disetujui',NULL,NULL,NULL,'2028-02-09 17:00:00','2028-02-11 17:00:00'),
(792,204,8,'2028/2029 Genap',3.38,3.38,'khs_sem_8_2507104.pdf','Disetujui',NULL,NULL,NULL,'2028-08-09 17:00:00','2028-08-11 17:00:00'),
(793,205,1,'2025/2026 Ganjil',3.33,3.33,'khs_sem_1_2507105.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(794,205,2,'2025/2026 Genap',3.09,3.09,'khs_sem_2_2507105.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(795,205,3,'2026/2027 Ganjil',3.32,3.32,'khs_sem_3_2507105.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(796,205,4,'2026/2027 Genap',3.31,3.31,'khs_sem_4_2507105.pdf','Disetujui',NULL,NULL,NULL,'2026-08-09 17:00:00','2026-08-11 17:00:00'),
(797,205,5,'2027/2028 Ganjil',3.32,3.32,'khs_sem_5_2507105.pdf','Disetujui',NULL,NULL,NULL,'2027-02-09 17:00:00','2027-02-11 17:00:00'),
(798,205,6,'2027/2028 Genap',3.16,3.16,'khs_sem_6_2507105.pdf','Disetujui',NULL,NULL,NULL,'2027-08-09 17:00:00','2027-08-11 17:00:00'),
(799,205,7,'2028/2029 Ganjil',3.16,3.16,'khs_sem_7_2507105.pdf','Disetujui',NULL,NULL,NULL,'2028-02-09 17:00:00','2028-02-11 17:00:00'),
(800,205,8,'2028/2029 Genap',3.07,3.07,'khs_sem_8_2507105.pdf','Disetujui',NULL,NULL,NULL,'2028-08-09 17:00:00','2028-08-11 17:00:00'),
(801,206,1,'2025/2026 Ganjil',3.87,3.87,'khs_sem_1_2507106.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(802,206,2,'2025/2026 Genap',3.61,3.61,'khs_sem_2_2507106.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(803,206,3,'2026/2027 Ganjil',3.74,3.74,'khs_sem_3_2507106.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(804,206,4,'2026/2027 Genap',3.60,3.60,'khs_sem_4_2507106.pdf','Disetujui',NULL,NULL,NULL,'2026-08-09 17:00:00','2026-08-11 17:00:00'),
(805,206,5,'2027/2028 Ganjil',3.74,3.74,'khs_sem_5_2507106.pdf','Disetujui',NULL,NULL,NULL,'2027-02-09 17:00:00','2027-02-11 17:00:00'),
(806,206,6,'2027/2028 Genap',3.72,3.72,'khs_sem_6_2507106.pdf','Disetujui',NULL,NULL,NULL,'2027-08-09 17:00:00','2027-08-11 17:00:00'),
(807,206,7,'2028/2029 Ganjil',3.68,3.68,'khs_sem_7_2507106.pdf','Disetujui',NULL,NULL,NULL,'2028-02-09 17:00:00','2028-02-11 17:00:00'),
(808,206,8,'2028/2029 Genap',3.81,3.81,'khs_sem_8_2507106.pdf','Disetujui',NULL,NULL,NULL,'2028-08-09 17:00:00','2028-08-11 17:00:00'),
(809,207,1,'2025/2026 Ganjil',3.59,3.59,'khs_sem_1_2507107.pdf','Disetujui',NULL,NULL,NULL,'2025-02-09 17:00:00','2025-02-11 17:00:00'),
(810,207,2,'2025/2026 Genap',3.57,3.57,'khs_sem_2_2507107.pdf','Disetujui',NULL,NULL,NULL,'2025-08-09 17:00:00','2025-08-11 17:00:00'),
(811,207,3,'2026/2027 Ganjil',3.49,3.49,'khs_sem_3_2507107.pdf','Disetujui',NULL,NULL,NULL,'2026-02-09 17:00:00','2026-02-11 17:00:00'),
(812,207,4,'2026/2027 Genap',3.46,3.46,'khs_sem_4_2507107.pdf','Disetujui',NULL,NULL,NULL,'2026-08-09 17:00:00','2026-08-11 17:00:00'),
(813,207,5,'2027/2028 Ganjil',3.44,3.44,'khs_sem_5_2507107.pdf','Disetujui',NULL,NULL,NULL,'2027-02-09 17:00:00','2027-02-11 17:00:00'),
(814,207,6,'2027/2028 Genap',3.48,3.48,'khs_sem_6_2507107.pdf','Disetujui',NULL,NULL,NULL,'2027-08-09 17:00:00','2027-08-11 17:00:00'),
(815,207,7,'2028/2029 Ganjil',3.41,3.41,'khs_sem_7_2507107.pdf','Disetujui',NULL,NULL,NULL,'2028-02-09 17:00:00','2028-02-11 17:00:00'),
(816,207,8,'2028/2029 Genap',3.59,3.59,'khs_sem_8_2507107.pdf','Disetujui',NULL,NULL,NULL,'2028-08-09 17:00:00','2028-08-11 17:00:00');
/*!40000 ALTER TABLE `ipk_semestrs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `jenis_pelanggarans`
--

DROP TABLE IF EXISTS `jenis_pelanggarans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jenis_pelanggarans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `eskalasi` varchar(50) NOT NULL DEFAULT 'normal',
  `aktif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jenis_pelanggarans_nama_unique` (`nama`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jenis_pelanggarans`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `jenis_pelanggarans` WRITE;
/*!40000 ALTER TABLE `jenis_pelanggarans` DISABLE KEYS */;
INSERT INTO `jenis_pelanggarans` VALUES
(1,'Akademik','Pelanggaran IPK di bawah standar minimum yang ditetapkan','normal',1,'2026-08-31 07:54:56','2026-08-31 07:54:56'),
(2,'Keuangan','Melanggar ketentuan keuangan (tunggakan UKT, etc.)','otomatis',1,'2026-08-31 07:54:56','2026-08-31 07:54:56'),
(3,'Kedisiplinan','Melanggar aturan kedisiplinan kampus','otomatis',1,'2026-08-31 07:54:56','2026-08-31 07:54:56'),
(4,'Integritas','Melanggar integritas akademik (plagiarisme, kecurangan, etc.)','otomatis',1,'2026-08-31 07:54:56','2026-08-31 07:54:56'),
(5,'Cuti Tanpa Izin','Tidak melakukan registrasi ulang tanpa keterangan','langsung_sp3',1,'2026-08-31 07:54:56','2026-08-31 07:54:56'),
(6,'Pelaporan','Tidak memenuhi kewajiban pelaporan KIP-K','otomatis',1,'2026-08-31 07:54:56','2026-08-31 07:54:56'),
(7,'Pelayanan','Melanggar ketentuan pelayanan/asesment','otomatis',1,'2026-08-31 07:54:56','2026-08-31 07:54:56'),
(8,'Non-Akademik','Pelanggaran kode etik atau tata tertib kampus','normal',1,NULL,NULL);
/*!40000 ALTER TABLE `jenis_pelanggarans` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `konfigurasis`
--

DROP TABLE IF EXISTS `konfigurasis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `konfigurasis` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  `tipe` enum('number','text','boolean','date') NOT NULL DEFAULT 'text',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `konfigurasis_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `konfigurasis`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `konfigurasis` WRITE;
/*!40000 ALTER TABLE `konfigurasis` DISABLE KEYS */;
INSERT INTO `konfigurasis` VALUES
(1,'ipk_minimum','3.0','IPK Minimum KIP-K','number','2026-08-31 07:54:56','2026-08-31 07:54:56'),
(2,'max_semester','8','Batas Semester Studi','number','2026-08-31 07:54:56','2026-08-31 07:54:56'),
(3,'sks_minimum_lulus','144','Minimum SKS Kelulusan','number','2026-08-31 07:54:56','2026-08-31 07:54:56'),
(4,'nama_institusi','Institut Teknologi Garut','Nama Institusi','text','2026-08-31 07:54:56','2026-08-31 07:54:56'),
(5,'singkatan_institusi','ITG','Singkatan Institusi','text','2026-08-31 07:54:56','2026-08-31 07:54:56'),
(6,'alamat_institusi','Jl. Mayor Syamsu No.1, Garut 44151','Alamat Institusi','text','2026-08-31 07:54:56','2026-08-31 07:54:56'),
(7,'telp_institusi','(0262) 540895','Telepon Institusi','text','2026-08-31 07:54:56','2026-08-31 07:54:56'),
(8,'logo_institusi','','Logo Institusi','text','2026-08-31 07:54:56','2026-08-31 07:54:56'),
(9,'periode_input_aktif','1','Periode Input Aktif','boolean','2026-08-31 07:54:56','2026-09-02 02:03:47'),
(10,'periode_input_buka','2025-08-01','Tanggal Buka','date','2026-08-31 07:54:56','2026-09-02 03:37:44'),
(11,'periode_input_tutup','2025-09-30','Tanggal Tutup','date','2026-08-31 07:54:56','2026-09-02 03:37:44'),
(12,'tahun_akademik_aktif','2024/2025','Tahun Akademik Aktif','text','2026-08-31 07:54:56','2026-09-02 03:37:44'),
(13,'semester_aktif','Genap','Semester Aktif','text','2026-08-31 07:54:56','2026-09-02 03:37:44'),
(14,'masa_tenggang_sp','90','Masa Tenggang SP','number',NULL,NULL),
(15,'sks_minimum_semester','18','Minimum SKS per Semester','number',NULL,NULL),
(16,'periode_input_ta','2025/2026 Genap','Tahun Ajaran Input Nilai','text','2026-09-01 17:30:27','2026-09-01 17:30:27'),
(18,'periode_input_tahun_ajaran','2024/2025 Genap','Periode Input TA','text','2026-09-01 18:43:56','2026-09-02 03:37:44');
/*!40000 ALTER TABLE `konfigurasis` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `laporan_reviews`
--

DROP TABLE IF EXISTS `laporan_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `laporan_reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `laporan_id` bigint(20) unsigned NOT NULL,
  `warek_id` bigint(20) unsigned NOT NULL,
  `aksi` enum('Disetujui','Ditolak','Dikembalikan') NOT NULL,
  `catatan` text DEFAULT NULL,
  `reviewed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `laporan_reviews_laporan_id_foreign` (`laporan_id`),
  KEY `laporan_reviews_warek_id_foreign` (`warek_id`),
  CONSTRAINT `laporan_reviews_laporan_id_foreign` FOREIGN KEY (`laporan_id`) REFERENCES `laporans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `laporan_reviews_warek_id_foreign` FOREIGN KEY (`warek_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laporan_reviews`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `laporan_reviews` WRITE;
/*!40000 ALTER TABLE `laporan_reviews` DISABLE KEYS */;
INSERT INTO `laporan_reviews` VALUES
(1,1,2,'Disetujui',NULL,'2026-09-02 20:42:36','2026-09-02 20:42:36','2026-09-02 20:42:36'),
(2,2,2,'Disetujui',NULL,'2026-09-02 20:46:01','2026-09-02 20:46:01','2026-09-02 20:46:01');
/*!40000 ALTER TABLE `laporan_reviews` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `laporans`
--

DROP TABLE IF EXISTS `laporans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `laporans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nomor_surat` varchar(100) DEFAULT NULL,
  `judul` varchar(255) NOT NULL,
  `periode` varchar(100) NOT NULL,
  `tahun_akademik` varchar(20) NOT NULL,
  `semester` enum('Ganjil','Genap') NOT NULL,
  `tanggal_laporan` date NOT NULL,
  `catatan_laporan` text DEFAULT NULL,
  `cakupan` varchar(50) DEFAULT NULL,
  `angkatan` varchar(20) DEFAULT NULL,
  `prodi` varchar(100) DEFAULT NULL,
  `tujuan_prodi` tinyint(1) NOT NULL DEFAULT 0,
  `tujuan_warek` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('Draft','Diajukan','Disetujui','Ditolak','Dikembalikan') DEFAULT 'Draft',
  `dibuat_oleh` bigint(20) unsigned NOT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `laporans_nomor_surat_unique` (`nomor_surat`),
  KEY `laporans_dibuat_oleh_foreign` (`dibuat_oleh`),
  CONSTRAINT `laporans_dibuat_oleh_foreign` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laporans`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `laporans` WRITE;
/*!40000 ALTER TABLE `laporans` DISABLE KEYS */;
INSERT INTO `laporans` VALUES
(1,'LAP/KIP-K/ITG/09/2026/001','LAPORAN EVALUASI SEMESTER GENAP TA 2025/2026','Genap 2025/2026','2025/2026','Genap','2026-09-03','AASSDDAASSDD','semua',NULL,NULL,0,1,'Disetujui',1,'2026-09-02 20:41:53','2026-09-02 20:41:53','2026-09-02 20:42:36'),
(2,'LAP/KIP-K/ITG/09/2026/002','LAPORAN EVALUASI SEMESTER GANJIL TA 2026/2027 — TEKNIK INFORMATIKA','Ganjil 2026/2027','2026/2027','Ganjil','2026-09-03','asdasdasd','prodi','2023','Teknik Informatika',1,1,'Disetujui',1,'2026-09-02 20:45:44','2026-09-02 20:45:44','2026-09-02 20:46:01');
/*!40000 ALTER TABLE `laporans` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `mahasiswas`
--

DROP TABLE IF EXISTS `mahasiswas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `mahasiswas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `nim` varchar(20) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nik` varchar(16) DEFAULT NULL,
  `nisn` varchar(20) DEFAULT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `nama_ayah` varchar(100) DEFAULT NULL,
  `nama_ibu` varchar(100) DEFAULT NULL,
  `tel_ayah` varchar(20) DEFAULT NULL,
  `tel_ibu` varchar(20) DEFAULT NULL,
  `prodi_id` bigint(20) unsigned NOT NULL,
  `angkatan` year(4) NOT NULL,
  `kategori` enum('Reguler','Aspirasi') NOT NULL,
  `status` enum('Aktif','Nonaktif','Dicabut','Lulus') NOT NULL DEFAULT 'Aktif',
  `alasan_nonaktif` varchar(255) DEFAULT NULL,
  `tanggal_nonaktif` date DEFAULT NULL,
  `semester_dicabut` varchar(255) DEFAULT NULL,
  `tanggal_dicabut` date DEFAULT NULL,
  `alasan_dicabut` varchar(255) DEFAULT NULL,
  `dicabut_oleh` varchar(255) DEFAULT NULL,
  `nomor_sk` varchar(100) NOT NULL,
  `tanggal_sk` date NOT NULL,
  `file_sk` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mahasiswas_nim_unique` (`nim`),
  KEY `mahasiswas_user_id_foreign` (`user_id`),
  KEY `mahasiswas_prodi_id_foreign` (`prodi_id`),
  CONSTRAINT `mahasiswas_prodi_id_foreign` FOREIGN KEY (`prodi_id`) REFERENCES `prodis` (`id`),
  CONSTRAINT `mahasiswas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=208 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mahasiswas`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `mahasiswas` WRITE;
/*!40000 ALTER TABLE `mahasiswas` DISABLE KEYS */;
INSERT INTO `mahasiswas` VALUES
(96,228,'2306064','Kailla Salsabila',NULL,NULL,'London',NULL,'Perempuan',NULL,NULL,NULL,NULL,NULL,6,2023,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/2306064','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-02 11:46:34'),
(125,376,'2507077','Praja Muda',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2025,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'asdfghjkl','2026-09-01','sk_mahasiswa/2507077/fKKiUdWKIL21Uqbe6YAtXIY1YWKS1kB02YwT71x8.jpg','2026-09-01 00:03:09','2026-09-01 01:01:03'),
(126,377,'202206001','Samiah Prasasta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202206001','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:06'),
(127,378,'202206002','Kasiyah Yulianti',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202206002','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:07'),
(128,379,'202206003','Dirja Pradana',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202206003','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:08'),
(129,380,'202207001','Yunita Puspasari',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202207001','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:09'),
(130,381,'202207002','Shakila Hutasoit',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202207002','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:09'),
(131,382,'202207003','Kuncara Fujiati',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202207003','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:10'),
(132,383,'202203001','Karen Gunarto',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202203001','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:11'),
(133,384,'202203002','Titi Permata',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202203002','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:12'),
(134,385,'202203003','Dinda Tampubolon',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202203003','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:12'),
(135,386,'202211001','Belinda Pradana',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202211001','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:13'),
(136,387,'202211002','Eluh Widodo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202211002','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:14'),
(137,388,'202211003','Widya Kurniawan',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202211003','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:15'),
(138,389,'202224001','Kalim Saefullah',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202224001','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:16'),
(139,390,'202224002','Irsad Hariyah S.Kom',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202224002','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:16'),
(140,391,'202224003','Ulva Uyainah',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2022,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2022/202224003','2022-08-15',NULL,'2022-08-19 17:00:00','2026-09-01 04:55:17'),
(141,392,'202306001','Wisnu Fujiati',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202306001','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 04:55:18'),
(142,393,'202306002','Gina Haryanti S.T.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202306002','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 04:55:19'),
(143,394,'202306003','Danang Sitompul S.Ars',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202306003','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 04:55:19'),
(144,395,'202307001','Natalia Maulana',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202307001','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:32'),
(145,396,'202307002','Vega Haryanto',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2023,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202307002','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:33'),
(146,397,'202307003','Keisha Nasyidah',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202307003','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:34'),
(147,398,'202303001','Dadi Salahudin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202303001','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:34'),
(148,399,'202303002','Indah Pudjiastuti S.Kom',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202303002','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:35'),
(149,400,'202303003','Hafshah Adriansyah',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2023,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202303003','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:36'),
(150,401,'202311001','Harto Marpaung',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202311001','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:36'),
(151,402,'202311002','Widya Haryanto',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202311002','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:37'),
(152,403,'202311003','Safina Safitri S.T.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2023,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202311003','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:37'),
(153,404,'202324001','Estiono Utama',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202324001','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:38'),
(154,405,'202324002','Garang Nuraini',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2023,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202324002','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:38'),
(155,406,'202324003','Tira Januar',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2023,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2023/202324003','2023-08-15',NULL,'2023-08-19 17:00:00','2026-09-01 00:58:39'),
(156,407,'202406001','Bakda Rahayu',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2024,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202406001','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:40'),
(157,408,'202406002','Emas Suartini',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2024,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202406002','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:41'),
(158,409,'202406003','Juli Agustina',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2024,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202406003','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:41'),
(159,410,'202407001','Langgeng Utami',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2024,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202407001','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:42'),
(160,411,'202407002','Irfan Mayasari',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2024,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202407002','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:42'),
(161,412,'202407003','Olivia Mandasari',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2024,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202407003','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:43'),
(162,413,'202403001','Nalar Puspita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2024,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202403001','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:43'),
(163,414,'202403002','Lili Usada',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2024,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202403002','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:44'),
(164,415,'202403003','Bagya Gunarto',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2024,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202403003','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:45'),
(165,416,'202411001','Sabrina Santoso',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2024,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202411001','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:45'),
(166,417,'202411002','Kayla Hasanah S.Ars',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2024,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202411002','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:46'),
(167,418,'202411003','Eja Haryanti',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2024,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202411003','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:47'),
(168,419,'202424001','Ifa Suartini',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2024,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202424001','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:47'),
(169,420,'202424002','Prima Najmudin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2024,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202424002','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:48'),
(170,421,'202424003','Galang Wibowo S.T.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2024,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2024/202424003','2024-08-15',NULL,'2024-08-19 17:00:00','2026-09-01 00:58:48'),
(171,422,'202506001','Gina Uyainah',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202506001','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:49'),
(172,423,'202506002','Dono Siregar S.Kom',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2025,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202506002','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:50'),
(173,424,'202506003','Gamblang Utami',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202506003','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:50'),
(174,425,'202507001','Ida Handayani',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2025,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202507001','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:51'),
(175,426,'202507002','Dono Anggraini S.T.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202507002','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:52'),
(176,427,'202507003','Aisyah Purnawati',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202507003','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:52'),
(177,428,'202503001','Prasetyo Prakasa',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202503001','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:53'),
(178,429,'202503002','Widya Kusmawati',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202503002','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:54'),
(179,430,'202503003','Kenzie Mahendra',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2025,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202503003','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:54'),
(180,431,'202511001','Asmadi Hariyah',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202511001','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:55'),
(181,432,'202511002','Laksana Sinaga',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2025,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202511002','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:56'),
(182,433,'202511003','Marwata Waskita',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2025,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202511003','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:56'),
(183,434,'202524001','Alika Najmudin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202524001','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:57'),
(184,435,'202524002','Olivia Yuniar',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2025,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202524002','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:57'),
(185,436,'202524003','Pranawa Halim S.T.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/202524003','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-01 00:58:58'),
(186,437,'202606001','Jaya Lailasari',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2026,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202606001','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:58:58'),
(187,438,'202606002','Eko Kurniawan',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2026,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202606002','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:58:59'),
(188,439,'202606003','Puput Hardiansyah',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2026,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202606003','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:00'),
(189,440,'202607001','Prabowo Winarsih',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2026,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202607001','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:00'),
(190,441,'202607002','Vanya Waluyo S.Ars',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2026,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202607002','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:01'),
(191,442,'202607003','Ira Maryati S.Kom',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,2026,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202607003','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:01'),
(192,443,'202603001','Rahmi Salahudin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2026,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202603001','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:02'),
(193,444,'202603002','Jindra Purwanti S.T.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2026,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202603002','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:02'),
(194,445,'202603003','Muhammad Santoso S.Kom',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2026,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202603003','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:03'),
(195,446,'202611001','Kusuma Dabukke',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2026,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202611001','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:03'),
(196,447,'202611002','Paiman Purwanti',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2026,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202611002','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:04'),
(197,448,'202611003','Rama Agustina',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,2026,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202611003','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:05'),
(198,449,'202624001','Vivi Pranowo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2026,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202624001','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:05'),
(199,450,'202624002','Galih Wibisono S.T.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2026,'Aspirasi','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202624002','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:06'),
(200,451,'202624003','Nasrullah Purwanti',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,2026,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2026/202624003','2026-08-15',NULL,'2026-08-19 17:00:00','2026-09-01 00:59:07'),
(201,452,'2507101','Ahmad Rizky Pratama',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/2507101','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-02 15:53:00'),
(202,453,'2507102','Siti Nurhaliza',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/2507102','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-02 15:53:00'),
(203,454,'2507103','Muhammad Fadilah',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/2507103','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-02 15:53:01'),
(204,455,'2507104','Putri Amelia Sari',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/2507104','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-02 15:53:02'),
(205,456,'2507105','Dimas Agung Wicaksono',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/2507105','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-02 15:53:02'),
(206,457,'2507106','Rina Marlina',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2025,'Reguler','Lulus',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/2507106','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-02 16:16:00'),
(207,458,'2507107','Farhan Maulana Ibrahim',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2025,'Reguler','Aktif',NULL,NULL,NULL,NULL,NULL,NULL,'SK/KIP-K/ITG/2025/2507107','2025-08-15',NULL,'2025-08-19 17:00:00','2026-09-02 15:53:04');
/*!40000 ALTER TABLE `mahasiswas` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `mata_kuliahs`
--

DROP TABLE IF EXISTS `mata_kuliahs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `mata_kuliahs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ipk_semester_id` bigint(20) unsigned NOT NULL,
  `kode` varchar(20) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `sks` tinyint(3) unsigned NOT NULL,
  `nilai_huruf` enum('A','AB','B','BC','C','D','E') NOT NULL,
  `nilai_mutu` decimal(3,1) NOT NULL,
  `lulus` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mata_kuliahs_ipk_semester_id_foreign` (`ipk_semester_id`),
  CONSTRAINT `mata_kuliahs_ipk_semester_id_foreign` FOREIGN KEY (`ipk_semester_id`) REFERENCES `ipk_semestrs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1631 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mata_kuliahs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `mata_kuliahs` WRITE;
/*!40000 ALTER TABLE `mata_kuliahs` DISABLE KEYS */;
INSERT INTO `mata_kuliahs` VALUES
(385,79,'IF101','Mata Kuliah Dummy Semester 1',3,'A',3.8,1,'2026-08-31 22:05:40','2026-08-31 22:05:40'),
(386,80,'IF102','Mata Kuliah Dummy Semester 2',3,'A',3.8,1,'2026-08-31 22:05:40','2026-08-31 22:05:40'),
(995,430,'0712','Fisika Dasar',3,'AB',3.7,1,'2026-09-01 00:58:32','2026-09-01 00:58:32'),
(996,431,'0721','Basis Data',3,'A',3.8,1,'2026-09-01 00:58:32','2026-09-01 00:58:32'),
(997,432,'0736','Matematika Diskrit',2,'A',3.8,1,'2026-09-01 00:58:32','2026-09-01 00:58:32'),
(998,433,'0743','Jaringan Komputer',4,'A',3.9,1,'2026-09-01 00:58:32','2026-09-01 00:58:32'),
(999,434,'0759','Pemrograman Web',3,'A',3.9,1,'2026-09-01 00:58:32','2026-09-01 00:58:32'),
(1000,435,'0766','Jaringan Komputer',4,'A',3.9,1,'2026-09-01 00:58:32','2026-09-01 00:58:32'),
(1001,436,'0714','Kalkulus I',4,'B',3.4,1,'2026-09-01 00:58:33','2026-09-01 00:58:33'),
(1002,437,'0724','Jaringan Komputer',4,'AB',3.5,1,'2026-09-01 00:58:33','2026-09-01 00:58:33'),
(1003,438,'0735','Desain Grafis',4,'C',2.8,1,'2026-09-01 00:58:33','2026-09-01 00:58:33'),
(1004,439,'0741','Algoritma & Pemrograman',2,'BC',3.2,1,'2026-09-01 00:58:33','2026-09-01 00:58:33'),
(1005,440,'0757','Basis Data',2,'B',3.3,1,'2026-09-01 00:58:33','2026-09-01 00:58:33'),
(1006,441,'0766','Struktur Data',3,'B',3.5,1,'2026-09-01 00:58:33','2026-09-01 00:58:33'),
(1007,442,'0717','Matematika Diskrit',4,'C',2.9,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1008,443,'0721','Desain Grafis',3,'C',3.0,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1009,444,'0737','Sistem Operasi',2,'BC',3.1,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1010,445,'0741','Algoritma & Pemrograman',2,'BC',3.1,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1011,446,'0758','Kalkulus I',2,'BC',3.2,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1012,447,'0764','Rekayasa Perangkat Lunak',2,'BC',3.2,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1013,448,'0319','Algoritma & Pemrograman',2,'AB',3.7,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1014,449,'0325','Kecerdasan Buatan',4,'A',3.8,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1015,450,'0337','Rekayasa Perangkat Lunak',3,'A',3.8,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1016,451,'0347','Matematika Diskrit',3,'A',3.9,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1017,452,'0358','Pemrograman Web',4,'A',4.0,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1018,453,'0364','Basis Data',4,'A',3.9,1,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(1019,454,'0318','Basis Data',2,'B',3.4,1,'2026-09-01 00:58:35','2026-09-01 00:58:35'),
(1020,455,'0323','Algoritma & Pemrograman',4,'B',3.5,1,'2026-09-01 00:58:35','2026-09-01 00:58:35'),
(1021,456,'0335','Fisika Dasar',2,'C',2.8,1,'2026-09-01 00:58:35','2026-09-01 00:58:35'),
(1022,457,'0345','Jaringan Komputer',4,'BC',3.2,1,'2026-09-01 00:58:35','2026-09-01 00:58:35'),
(1023,458,'0353','Sistem Operasi',2,'B',3.3,1,'2026-09-01 00:58:35','2026-09-01 00:58:35'),
(1024,459,'0365','Algoritma & Pemrograman',3,'B',3.5,1,'2026-09-01 00:58:35','2026-09-01 00:58:35'),
(1025,460,'0318','Kecerdasan Buatan',2,'C',2.9,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1026,461,'0323','Pemrograman Web',3,'C',3.0,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1027,462,'0334','Statistika',4,'BC',3.1,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1028,463,'0344','Algoritma & Pemrograman',3,'BC',3.1,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1029,464,'0356','Desain Grafis',4,'BC',3.2,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1030,465,'0365','Basis Data',4,'BC',3.2,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1031,466,'1118','Pemrograman Web',2,'AB',3.7,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1032,467,'1127','Jaringan Komputer',3,'A',3.8,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1033,468,'1132','Basis Data',2,'A',3.9,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1034,469,'1146','Fisika Dasar',4,'A',3.9,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1035,470,'1151','Basis Data',2,'A',3.9,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1036,471,'1163','Struktur Data',4,'A',3.9,1,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(1037,472,'1118','Kalkulus I',4,'B',3.4,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1038,473,'1122','Jaringan Komputer',4,'AB',3.5,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1039,474,'1134','Desain Grafis',3,'C',2.9,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1040,475,'1141','Rekayasa Perangkat Lunak',4,'BC',3.2,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1041,476,'1151','Desain Grafis',2,'B',3.3,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1042,477,'1167','Pemrograman Web',4,'AB',3.5,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1043,478,'1119','Jaringan Komputer',2,'C',2.9,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1044,479,'1128','Pemrograman Web',4,'BC',3.0,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1045,480,'1133','Statistika',2,'BC',3.1,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1046,481,'1141','Basis Data',4,'BC',3.1,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1047,482,'1151','Kecerdasan Buatan',2,'BC',3.2,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1048,483,'1167','Matematika Diskrit',3,'B',3.3,1,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(1049,484,'2415','Desain Grafis',2,'AB',3.7,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1050,485,'2423','Kecerdasan Buatan',4,'A',3.8,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1051,486,'2437','Basis Data',4,'A',3.8,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1052,487,'2443','Sistem Operasi',3,'A',3.9,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1053,488,'2457','Desain Grafis',4,'A',3.9,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1054,489,'2467','Kecerdasan Buatan',3,'A',3.9,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1055,490,'2417','Kalkulus I',4,'B',3.4,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1056,491,'2426','Algoritma & Pemrograman',4,'B',3.5,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1057,492,'2436','Jaringan Komputer',3,'C',2.8,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1058,493,'2443','Algoritma & Pemrograman',4,'BC',3.2,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1059,494,'2451','Basis Data',2,'B',3.4,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1060,495,'2466','Basis Data',2,'B',3.4,1,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(1061,496,'2413','Statistika',3,'C',2.9,1,'2026-09-01 00:58:39','2026-09-01 00:58:39'),
(1062,497,'2425','Jaringan Komputer',2,'BC',3.0,1,'2026-09-01 00:58:39','2026-09-01 00:58:39'),
(1063,498,'2434','Kecerdasan Buatan',2,'BC',3.1,1,'2026-09-01 00:58:39','2026-09-01 00:58:39'),
(1064,499,'2449','Sistem Operasi',2,'BC',3.2,1,'2026-09-01 00:58:39','2026-09-01 00:58:39'),
(1065,500,'2456','Jaringan Komputer',4,'BC',3.2,1,'2026-09-01 00:58:39','2026-09-01 00:58:39'),
(1066,501,'2467','Basis Data',2,'B',3.3,1,'2026-09-01 00:58:39','2026-09-01 00:58:39'),
(1067,502,'0614','Algoritma & Pemrograman',4,'AB',3.7,1,'2026-09-01 00:58:40','2026-09-01 00:58:40'),
(1068,503,'0621','Rekayasa Perangkat Lunak',2,'A',3.8,1,'2026-09-01 00:58:40','2026-09-01 00:58:40'),
(1069,504,'0631','Kalkulus I',3,'A',3.8,1,'2026-09-01 00:58:40','2026-09-01 00:58:40'),
(1070,505,'0649','Algoritma & Pemrograman',2,'A',3.9,1,'2026-09-01 00:58:40','2026-09-01 00:58:40'),
(1071,506,'0611','Statistika',4,'B',3.4,1,'2026-09-01 00:58:41','2026-09-01 00:58:41'),
(1072,507,'0622','Matematika Diskrit',2,'AB',3.5,1,'2026-09-01 00:58:41','2026-09-01 00:58:41'),
(1073,508,'0634','Cloud Computing',4,'C',2.8,1,'2026-09-01 00:58:41','2026-09-01 00:58:41'),
(1074,509,'0641','Statistika',4,'BC',3.2,1,'2026-09-01 00:58:41','2026-09-01 00:58:41'),
(1075,510,'0613','Matematika Diskrit',4,'C',2.9,1,'2026-09-01 00:58:41','2026-09-01 00:58:41'),
(1076,511,'0621','Struktur Data',4,'C',3.0,1,'2026-09-01 00:58:41','2026-09-01 00:58:41'),
(1077,512,'0639','Basis Data',2,'BC',3.1,1,'2026-09-01 00:58:41','2026-09-01 00:58:41'),
(1078,513,'0641','Statistika',2,'BC',3.1,1,'2026-09-01 00:58:41','2026-09-01 00:58:41'),
(1079,514,'0718','Pemrograman Web',3,'AB',3.7,1,'2026-09-01 00:58:42','2026-09-01 00:58:42'),
(1080,515,'0726','Matematika Diskrit',4,'A',3.8,1,'2026-09-01 00:58:42','2026-09-01 00:58:42'),
(1081,516,'0734','Kecerdasan Buatan',4,'A',3.9,1,'2026-09-01 00:58:42','2026-09-01 00:58:42'),
(1082,517,'0741','Kalkulus I',3,'A',3.8,1,'2026-09-01 00:58:42','2026-09-01 00:58:42'),
(1083,518,'0718','Pemrograman Web',4,'B',3.4,1,'2026-09-01 00:58:42','2026-09-01 00:58:42'),
(1084,519,'0728','Cloud Computing',3,'B',3.5,1,'2026-09-01 00:58:42','2026-09-01 00:58:42'),
(1085,520,'0739','Algoritma & Pemrograman',4,'C',2.8,1,'2026-09-01 00:58:42','2026-09-01 00:58:42'),
(1086,521,'0749','Jaringan Komputer',4,'BC',3.2,1,'2026-09-01 00:58:42','2026-09-01 00:58:42'),
(1087,522,'0717','Kalkulus I',3,'C',2.9,1,'2026-09-01 00:58:43','2026-09-01 00:58:43'),
(1088,523,'0724','Pemrograman Web',3,'BC',3.0,1,'2026-09-01 00:58:43','2026-09-01 00:58:43'),
(1089,524,'0731','Algoritma & Pemrograman',3,'BC',3.1,1,'2026-09-01 00:58:43','2026-09-01 00:58:43'),
(1090,525,'0745','Kecerdasan Buatan',4,'BC',3.2,1,'2026-09-01 00:58:43','2026-09-01 00:58:43'),
(1091,526,'0315','Matematika Diskrit',3,'AB',3.7,1,'2026-09-01 00:58:43','2026-09-01 00:58:43'),
(1092,527,'0324','Statistika',4,'A',3.8,1,'2026-09-01 00:58:43','2026-09-01 00:58:43'),
(1093,528,'0337','Fisika Dasar',2,'A',3.8,1,'2026-09-01 00:58:43','2026-09-01 00:58:43'),
(1094,529,'0347','Jaringan Komputer',4,'A',3.9,1,'2026-09-01 00:58:43','2026-09-01 00:58:43'),
(1095,530,'0319','Pemrograman Web',3,'B',3.4,1,'2026-09-01 00:58:44','2026-09-01 00:58:44'),
(1096,531,'0326','Kecerdasan Buatan',3,'AB',3.5,1,'2026-09-01 00:58:44','2026-09-01 00:58:44'),
(1097,532,'0339','Rekayasa Perangkat Lunak',2,'C',2.8,1,'2026-09-01 00:58:44','2026-09-01 00:58:44'),
(1098,533,'0344','Basis Data',3,'BC',3.2,1,'2026-09-01 00:58:44','2026-09-01 00:58:44'),
(1099,534,'0313','Struktur Data',4,'C',2.9,1,'2026-09-01 00:58:45','2026-09-01 00:58:45'),
(1100,535,'0323','Matematika Diskrit',3,'C',3.0,1,'2026-09-01 00:58:45','2026-09-01 00:58:45'),
(1101,536,'0335','Cloud Computing',2,'BC',3.1,1,'2026-09-01 00:58:45','2026-09-01 00:58:45'),
(1102,537,'0349','Kalkulus I',3,'BC',3.2,1,'2026-09-01 00:58:45','2026-09-01 00:58:45'),
(1103,538,'1115','Fisika Dasar',3,'AB',3.7,1,'2026-09-01 00:58:45','2026-09-01 00:58:45'),
(1104,539,'1125','Sistem Operasi',3,'A',3.8,1,'2026-09-01 00:58:45','2026-09-01 00:58:45'),
(1105,540,'1131','Statistika',4,'A',3.8,1,'2026-09-01 00:58:45','2026-09-01 00:58:45'),
(1106,541,'1142','Kecerdasan Buatan',4,'A',3.9,1,'2026-09-01 00:58:45','2026-09-01 00:58:45'),
(1107,542,'1116','Rekayasa Perangkat Lunak',2,'B',3.4,1,'2026-09-01 00:58:46','2026-09-01 00:58:46'),
(1108,543,'1125','Jaringan Komputer',3,'AB',3.5,1,'2026-09-01 00:58:46','2026-09-01 00:58:46'),
(1109,544,'1137','Fisika Dasar',2,'C',2.8,1,'2026-09-01 00:58:46','2026-09-01 00:58:46'),
(1110,545,'1144','Jaringan Komputer',3,'BC',3.2,1,'2026-09-01 00:58:46','2026-09-01 00:58:46'),
(1111,546,'1112','Kalkulus I',3,'C',2.9,1,'2026-09-01 00:58:47','2026-09-01 00:58:47'),
(1112,547,'1123','Kecerdasan Buatan',4,'BC',3.0,1,'2026-09-01 00:58:47','2026-09-01 00:58:47'),
(1113,548,'1131','Rekayasa Perangkat Lunak',2,'BC',3.1,1,'2026-09-01 00:58:47','2026-09-01 00:58:47'),
(1114,549,'1146','Kecerdasan Buatan',3,'BC',3.2,1,'2026-09-01 00:58:47','2026-09-01 00:58:47'),
(1115,550,'2414','Algoritma & Pemrograman',2,'AB',3.7,1,'2026-09-01 00:58:47','2026-09-01 00:58:47'),
(1116,551,'2427','Cloud Computing',4,'A',3.8,1,'2026-09-01 00:58:47','2026-09-01 00:58:47'),
(1117,552,'2433','Jaringan Komputer',4,'A',3.8,1,'2026-09-01 00:58:47','2026-09-01 00:58:47'),
(1118,553,'2449','Kalkulus I',3,'A',3.9,1,'2026-09-01 00:58:47','2026-09-01 00:58:47'),
(1119,554,'2415','Jaringan Komputer',2,'B',3.4,1,'2026-09-01 00:58:48','2026-09-01 00:58:48'),
(1120,555,'2424','Kecerdasan Buatan',4,'AB',3.5,1,'2026-09-01 00:58:48','2026-09-01 00:58:48'),
(1121,556,'2431','Cloud Computing',3,'C',2.8,1,'2026-09-01 00:58:48','2026-09-01 00:58:48'),
(1122,557,'2449','Fisika Dasar',4,'BC',3.2,1,'2026-09-01 00:58:48','2026-09-01 00:58:48'),
(1123,558,'2416','Matematika Diskrit',2,'C',2.9,1,'2026-09-01 00:58:48','2026-09-01 00:58:48'),
(1124,559,'2421','Fisika Dasar',2,'C',3.0,1,'2026-09-01 00:58:48','2026-09-01 00:58:48'),
(1125,560,'2434','Struktur Data',2,'BC',3.1,1,'2026-09-01 00:58:48','2026-09-01 00:58:48'),
(1126,561,'2448','Sistem Operasi',3,'BC',3.2,1,'2026-09-01 00:58:49','2026-09-01 00:58:49'),
(1127,562,'0611','Pemrograman Web',3,'AB',3.7,1,'2026-09-01 00:58:49','2026-09-01 00:58:49'),
(1128,563,'0623','Pemrograman Web',4,'A',3.8,1,'2026-09-01 00:58:49','2026-09-01 00:58:49'),
(1129,564,'0611','Cloud Computing',3,'B',3.4,1,'2026-09-01 00:58:50','2026-09-01 00:58:50'),
(1130,565,'0629','Kecerdasan Buatan',4,'AB',3.5,1,'2026-09-01 00:58:50','2026-09-01 00:58:50'),
(1131,566,'0613','Struktur Data',3,'C',2.9,1,'2026-09-01 00:58:50','2026-09-01 00:58:50'),
(1132,567,'0629','Basis Data',2,'BC',3.0,1,'2026-09-01 00:58:50','2026-09-01 00:58:50'),
(1133,568,'0719','Rekayasa Perangkat Lunak',3,'AB',3.7,1,'2026-09-01 00:58:51','2026-09-01 00:58:51'),
(1134,569,'0728','Rekayasa Perangkat Lunak',4,'A',3.8,1,'2026-09-01 00:58:51','2026-09-01 00:58:51'),
(1135,570,'0718','Desain Grafis',2,'B',3.4,1,'2026-09-01 00:58:52','2026-09-01 00:58:52'),
(1136,571,'0721','Sistem Operasi',2,'B',3.5,1,'2026-09-01 00:58:52','2026-09-01 00:58:52'),
(1137,572,'0717','Kalkulus I',3,'C',2.9,1,'2026-09-01 00:58:52','2026-09-01 00:58:52'),
(1138,573,'0721','Statistika',2,'C',3.0,1,'2026-09-01 00:58:52','2026-09-01 00:58:52'),
(1139,574,'0313','Fisika Dasar',2,'AB',3.7,1,'2026-09-01 00:58:53','2026-09-01 00:58:53'),
(1140,575,'0328','Kalkulus I',3,'A',3.8,1,'2026-09-01 00:58:53','2026-09-01 00:58:53'),
(1141,576,'0311','Kalkulus I',2,'B',3.5,1,'2026-09-01 00:58:54','2026-09-01 00:58:54'),
(1142,577,'0328','Pemrograman Web',3,'AB',3.5,1,'2026-09-01 00:58:54','2026-09-01 00:58:54'),
(1143,578,'0317','Cloud Computing',2,'C',2.9,1,'2026-09-01 00:58:54','2026-09-01 00:58:54'),
(1144,579,'0322','Kecerdasan Buatan',3,'BC',3.1,1,'2026-09-01 00:58:54','2026-09-01 00:58:54'),
(1145,580,'1118','Fisika Dasar',4,'AB',3.7,1,'2026-09-01 00:58:55','2026-09-01 00:58:55'),
(1146,581,'1121','Statistika',4,'A',3.9,1,'2026-09-01 00:58:55','2026-09-01 00:58:55'),
(1147,582,'1113','Basis Data',3,'B',3.4,1,'2026-09-01 00:58:56','2026-09-01 00:58:56'),
(1148,583,'1122','Jaringan Komputer',2,'AB',3.6,1,'2026-09-01 00:58:56','2026-09-01 00:58:56'),
(1149,584,'1119','Pemrograman Web',4,'C',2.9,1,'2026-09-01 00:58:56','2026-09-01 00:58:56'),
(1150,585,'1128','Kalkulus I',4,'C',3.0,1,'2026-09-01 00:58:56','2026-09-01 00:58:56'),
(1151,586,'2414','Pemrograman Web',4,'AB',3.7,1,'2026-09-01 00:58:57','2026-09-01 00:58:57'),
(1152,587,'2428','Sistem Operasi',4,'A',3.8,1,'2026-09-01 00:58:57','2026-09-01 00:58:57'),
(1153,588,'2413','Sistem Operasi',4,'B',3.4,1,'2026-09-01 00:58:57','2026-09-01 00:58:57'),
(1154,589,'2425','Algoritma & Pemrograman',4,'AB',3.5,1,'2026-09-01 00:58:57','2026-09-01 00:58:57'),
(1155,590,'2417','Jaringan Komputer',3,'C',2.9,1,'2026-09-01 00:58:58','2026-09-01 00:58:58'),
(1156,591,'2427','Kalkulus I',4,'BC',3.1,1,'2026-09-01 00:58:58','2026-09-01 00:58:58'),
(1157,592,'0616','Fisika Dasar',4,'AB',3.7,1,'2026-09-01 00:58:58','2026-09-01 00:58:58'),
(1158,593,'0615','Cloud Computing',2,'B',3.4,1,'2026-09-01 00:58:59','2026-09-01 00:58:59'),
(1159,594,'0612','Jaringan Komputer',3,'C',2.9,1,'2026-09-01 00:59:00','2026-09-01 00:59:00'),
(1160,595,'0712','Statistika',3,'AB',3.7,1,'2026-09-01 00:59:00','2026-09-01 00:59:00'),
(1161,596,'0711','Struktur Data',2,'B',3.4,1,'2026-09-01 00:59:01','2026-09-01 00:59:01'),
(1162,597,'0712','Pemrograman Web',3,'C',2.9,1,'2026-09-01 00:59:01','2026-09-01 00:59:01'),
(1163,598,'0318','Rekayasa Perangkat Lunak',2,'AB',3.7,1,'2026-09-01 00:59:02','2026-09-01 00:59:02'),
(1164,599,'0319','Fisika Dasar',2,'B',3.4,1,'2026-09-01 00:59:02','2026-09-01 00:59:02'),
(1165,600,'0319','Jaringan Komputer',3,'C',2.9,1,'2026-09-01 00:59:03','2026-09-01 00:59:03'),
(1166,601,'1111','Struktur Data',4,'AB',3.7,1,'2026-09-01 00:59:03','2026-09-01 00:59:03'),
(1167,602,'1113','Algoritma & Pemrograman',4,'B',3.4,1,'2026-09-01 00:59:04','2026-09-01 00:59:04'),
(1168,603,'1114','Kalkulus I',4,'C',2.9,1,'2026-09-01 00:59:05','2026-09-01 00:59:05'),
(1169,604,'2413','Matematika Diskrit',4,'AB',3.7,1,'2026-09-01 00:59:05','2026-09-01 00:59:05'),
(1170,605,'2412','Desain Grafis',4,'B',3.4,1,'2026-09-01 00:59:06','2026-09-01 00:59:06'),
(1171,606,'2419','Kalkulus I',3,'C',2.9,1,'2026-09-01 00:59:07','2026-09-01 00:59:07'),
(1188,623,'0617','Sistem Operasi',4,'AB',3.7,1,'2026-09-01 04:55:06','2026-09-01 04:55:06'),
(1189,624,'0627','Desain Grafis',2,'A',3.8,1,'2026-09-01 04:55:06','2026-09-01 04:55:06'),
(1190,625,'0633','Rekayasa Perangkat Lunak',2,'A',3.9,1,'2026-09-01 04:55:06','2026-09-01 04:55:06'),
(1191,626,'0649','Statistika',3,'A',3.9,1,'2026-09-01 04:55:06','2026-09-01 04:55:06'),
(1192,627,'0658','Struktur Data',4,'A',3.9,1,'2026-09-01 04:55:06','2026-09-01 04:55:06'),
(1193,628,'0662','Sistem Operasi',3,'A',3.9,1,'2026-09-01 04:55:06','2026-09-01 04:55:06'),
(1194,629,'0678','Desain Grafis',2,'A',3.9,1,'2026-09-01 04:55:06','2026-09-01 04:55:06'),
(1195,630,'0689','Desain Grafis',3,'A',3.9,1,'2026-09-01 04:55:06','2026-09-01 04:55:06'),
(1196,631,'0614','Sistem Operasi',2,'B',3.4,1,'2026-09-01 04:55:07','2026-09-01 04:55:07'),
(1197,632,'0629','Matematika Diskrit',3,'AB',3.5,1,'2026-09-01 04:55:07','2026-09-01 04:55:07'),
(1198,633,'0632','Basis Data',4,'C',2.9,1,'2026-09-01 04:55:07','2026-09-01 04:55:07'),
(1199,634,'0648','Statistika',4,'BC',3.2,1,'2026-09-01 04:55:07','2026-09-01 04:55:07'),
(1200,635,'0652','Basis Data',2,'B',3.4,1,'2026-09-01 04:55:07','2026-09-01 04:55:07'),
(1201,636,'0662','Algoritma & Pemrograman',4,'B',3.5,1,'2026-09-01 04:55:07','2026-09-01 04:55:07'),
(1202,637,'0678','Jaringan Komputer',3,'AB',3.5,1,'2026-09-01 04:55:07','2026-09-01 04:55:07'),
(1203,638,'0684','Jaringan Komputer',4,'AB',3.5,1,'2026-09-01 04:55:07','2026-09-01 04:55:07'),
(1204,639,'0618','Struktur Data',3,'C',2.9,1,'2026-09-01 04:55:08','2026-09-01 04:55:08'),
(1205,640,'0625','Basis Data',4,'C',3.0,1,'2026-09-01 04:55:08','2026-09-01 04:55:08'),
(1206,641,'0637','Basis Data',4,'BC',3.1,1,'2026-09-01 04:55:08','2026-09-01 04:55:08'),
(1207,642,'0646','Matematika Diskrit',2,'BC',3.2,1,'2026-09-01 04:55:08','2026-09-01 04:55:08'),
(1208,643,'0658','Struktur Data',3,'BC',3.2,1,'2026-09-01 04:55:08','2026-09-01 04:55:08'),
(1209,644,'0664','Fisika Dasar',4,'BC',3.2,1,'2026-09-01 04:55:08','2026-09-01 04:55:08'),
(1210,645,'0677','Kecerdasan Buatan',2,'B',3.3,1,'2026-09-01 04:55:08','2026-09-01 04:55:08'),
(1211,646,'0682','Sistem Operasi',3,'B',3.3,1,'2026-09-01 04:55:08','2026-09-01 04:55:08'),
(1212,647,'0714','Kecerdasan Buatan',4,'AB',3.7,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1213,648,'0725','Basis Data',3,'A',3.8,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1214,649,'0737','Pemrograman Web',4,'A',3.9,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1215,650,'0747','Fisika Dasar',4,'A',3.9,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1216,651,'0759','Struktur Data',3,'A',3.9,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1217,652,'0768','Jaringan Komputer',3,'A',4.0,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1218,653,'0779','Fisika Dasar',3,'A',4.0,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1219,654,'0784','Fisika Dasar',2,'A',4.0,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1220,655,'0717','Rekayasa Perangkat Lunak',3,'B',3.4,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1221,656,'0726','Struktur Data',4,'B',3.5,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1222,657,'0736','Struktur Data',4,'C',2.8,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1223,658,'0748','Cloud Computing',4,'BC',3.2,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1224,659,'0756','Jaringan Komputer',3,'B',3.4,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1225,660,'0761','Kalkulus I',3,'B',3.5,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1226,661,'0775','Rekayasa Perangkat Lunak',4,'AB',3.5,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1227,662,'0783','Algoritma & Pemrograman',2,'AB',3.5,1,'2026-09-01 04:55:09','2026-09-01 04:55:09'),
(1228,663,'0716','Fisika Dasar',2,'C',2.9,1,'2026-09-01 04:55:10','2026-09-01 04:55:10'),
(1229,664,'0724','Desain Grafis',2,'C',3.0,1,'2026-09-01 04:55:10','2026-09-01 04:55:10'),
(1230,665,'0735','Cloud Computing',2,'BC',3.1,1,'2026-09-01 04:55:10','2026-09-01 04:55:10'),
(1231,666,'0743','Cloud Computing',2,'BC',3.2,1,'2026-09-01 04:55:10','2026-09-01 04:55:10'),
(1232,667,'0753','Rekayasa Perangkat Lunak',4,'BC',3.2,1,'2026-09-01 04:55:10','2026-09-01 04:55:10'),
(1233,668,'0763','Sistem Operasi',4,'B',3.3,1,'2026-09-01 04:55:10','2026-09-01 04:55:10'),
(1234,669,'0777','Struktur Data',4,'B',3.3,1,'2026-09-01 04:55:10','2026-09-01 04:55:10'),
(1235,670,'0783','Sistem Operasi',3,'B',3.3,1,'2026-09-01 04:55:10','2026-09-01 04:55:10'),
(1236,671,'0313','Kalkulus I',2,'AB',3.7,1,'2026-09-01 04:55:11','2026-09-01 04:55:11'),
(1237,672,'0323','Cloud Computing',4,'A',3.8,1,'2026-09-01 04:55:11','2026-09-01 04:55:11'),
(1238,673,'0336','Pemrograman Web',3,'A',3.9,1,'2026-09-01 04:55:11','2026-09-01 04:55:11'),
(1239,674,'0345','Pemrograman Web',2,'A',3.9,1,'2026-09-01 04:55:11','2026-09-01 04:55:11'),
(1240,675,'0352','Matematika Diskrit',3,'A',3.9,1,'2026-09-01 04:55:11','2026-09-01 04:55:11'),
(1241,676,'0364','Basis Data',2,'A',3.9,1,'2026-09-01 04:55:11','2026-09-01 04:55:11'),
(1242,677,'0378','Desain Grafis',4,'A',4.0,1,'2026-09-01 04:55:11','2026-09-01 04:55:11'),
(1243,678,'0383','Algoritma & Pemrograman',4,'A',3.9,1,'2026-09-01 04:55:11','2026-09-01 04:55:11'),
(1244,679,'0319','Matematika Diskrit',2,'B',3.5,1,'2026-09-01 04:55:12','2026-09-01 04:55:12'),
(1245,680,'0321','Desain Grafis',4,'B',3.5,1,'2026-09-01 04:55:12','2026-09-01 04:55:12'),
(1246,681,'0334','Matematika Diskrit',3,'C',2.8,1,'2026-09-01 04:55:12','2026-09-01 04:55:12'),
(1247,682,'0341','Kecerdasan Buatan',3,'BC',3.2,1,'2026-09-01 04:55:12','2026-09-01 04:55:12'),
(1248,683,'0352','Desain Grafis',3,'B',3.4,1,'2026-09-01 04:55:12','2026-09-01 04:55:12'),
(1249,684,'0364','Statistika',2,'B',3.4,1,'2026-09-01 04:55:12','2026-09-01 04:55:12'),
(1250,685,'0377','Sistem Operasi',4,'AB',3.5,1,'2026-09-01 04:55:12','2026-09-01 04:55:12'),
(1251,686,'0386','Kalkulus I',3,'AB',3.5,1,'2026-09-01 04:55:12','2026-09-01 04:55:12'),
(1252,687,'0314','Basis Data',2,'C',2.9,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1253,688,'0321','Statistika',4,'BC',3.0,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1254,689,'0333','Jaringan Komputer',3,'BC',3.1,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1255,690,'0341','Sistem Operasi',4,'BC',3.2,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1256,691,'0356','Algoritma & Pemrograman',3,'BC',3.2,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1257,692,'0366','Pemrograman Web',4,'B',3.3,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1258,693,'0373','Sistem Operasi',4,'B',3.3,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1259,694,'0388','Sistem Operasi',3,'B',3.3,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1260,695,'1113','Pemrograman Web',4,'AB',3.7,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1261,696,'1125','Rekayasa Perangkat Lunak',4,'A',3.8,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1262,697,'1139','Fisika Dasar',4,'A',3.8,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1263,698,'1142','Statistika',4,'A',3.9,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1264,699,'1155','Basis Data',3,'A',3.9,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1265,700,'1164','Cloud Computing',3,'A',3.9,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1266,701,'1174','Kalkulus I',2,'A',3.9,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1267,702,'1187','Kalkulus I',4,'A',3.9,1,'2026-09-01 04:55:13','2026-09-01 04:55:13'),
(1268,703,'1116','Desain Grafis',2,'B',3.4,1,'2026-09-01 04:55:14','2026-09-01 04:55:14'),
(1269,704,'1122','Matematika Diskrit',3,'B',3.5,1,'2026-09-01 04:55:14','2026-09-01 04:55:14'),
(1270,705,'1132','Matematika Diskrit',4,'C',2.8,1,'2026-09-01 04:55:14','2026-09-01 04:55:14'),
(1271,706,'1148','Statistika',4,'BC',3.2,1,'2026-09-01 04:55:14','2026-09-01 04:55:14'),
(1272,707,'1158','Statistika',2,'B',3.3,1,'2026-09-01 04:55:14','2026-09-01 04:55:14'),
(1273,708,'1162','Jaringan Komputer',2,'B',3.5,1,'2026-09-01 04:55:14','2026-09-01 04:55:14'),
(1274,709,'1177','Pemrograman Web',2,'AB',3.5,1,'2026-09-01 04:55:14','2026-09-01 04:55:14'),
(1275,710,'1185','Sistem Operasi',2,'AB',3.5,1,'2026-09-01 04:55:14','2026-09-01 04:55:14'),
(1276,711,'1119','Sistem Operasi',2,'C',2.9,1,'2026-09-01 04:55:15','2026-09-01 04:55:15'),
(1277,712,'1128','Sistem Operasi',4,'BC',3.0,1,'2026-09-01 04:55:15','2026-09-01 04:55:15'),
(1278,713,'1132','Sistem Operasi',2,'BC',3.1,1,'2026-09-01 04:55:15','2026-09-01 04:55:15'),
(1279,714,'1146','Struktur Data',3,'BC',3.1,1,'2026-09-01 04:55:15','2026-09-01 04:55:15'),
(1280,715,'1151','Pemrograman Web',3,'BC',3.2,1,'2026-09-01 04:55:15','2026-09-01 04:55:15'),
(1281,716,'1165','Algoritma & Pemrograman',2,'B',3.3,1,'2026-09-01 04:55:15','2026-09-01 04:55:15'),
(1282,717,'1175','Algoritma & Pemrograman',4,'BC',3.2,1,'2026-09-01 04:55:15','2026-09-01 04:55:15'),
(1283,718,'1187','Struktur Data',3,'B',3.3,1,'2026-09-01 04:55:15','2026-09-01 04:55:15'),
(1284,719,'2411','Fisika Dasar',2,'A',3.8,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1285,720,'2424','Matematika Diskrit',3,'A',3.8,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1286,721,'2433','Matematika Diskrit',4,'A',3.9,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1287,722,'2445','Statistika',3,'A',3.9,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1288,723,'2453','Struktur Data',4,'A',3.9,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1289,724,'2468','Jaringan Komputer',3,'A',3.9,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1290,725,'2476','Desain Grafis',2,'A',3.9,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1291,726,'2481','Kecerdasan Buatan',2,'A',4.0,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1292,727,'2415','Rekayasa Perangkat Lunak',2,'B',3.4,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1293,728,'2423','Algoritma & Pemrograman',2,'AB',3.5,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1294,729,'2438','Basis Data',2,'C',2.8,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1295,730,'2444','Kalkulus I',2,'BC',3.2,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1296,731,'2456','Jaringan Komputer',4,'B',3.3,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1297,732,'2464','Cloud Computing',2,'B',3.4,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1298,733,'2477','Struktur Data',2,'B',3.5,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1299,734,'2486','Statistika',2,'AB',3.5,1,'2026-09-01 04:55:16','2026-09-01 04:55:16'),
(1300,735,'2418','Pemrograman Web',2,'C',2.9,1,'2026-09-01 04:55:17','2026-09-01 04:55:17'),
(1301,736,'2421','Desain Grafis',2,'BC',3.0,1,'2026-09-01 04:55:17','2026-09-01 04:55:17'),
(1302,737,'2434','Sistem Operasi',4,'BC',3.1,1,'2026-09-01 04:55:17','2026-09-01 04:55:17'),
(1303,738,'2444','Algoritma & Pemrograman',3,'BC',3.2,1,'2026-09-01 04:55:17','2026-09-01 04:55:17'),
(1304,739,'2451','Basis Data',2,'BC',3.2,1,'2026-09-01 04:55:17','2026-09-01 04:55:17'),
(1305,740,'2464','Cloud Computing',2,'B',3.3,1,'2026-09-01 04:55:17','2026-09-01 04:55:17'),
(1306,741,'2474','Fisika Dasar',4,'B',3.3,1,'2026-09-01 04:55:17','2026-09-01 04:55:17'),
(1307,742,'2482','Desain Grafis',3,'B',3.3,1,'2026-09-01 04:55:17','2026-09-01 04:55:17'),
(1308,743,'0613','Jaringan Komputer',4,'AB',3.7,1,'2026-09-01 04:55:18','2026-09-01 04:55:18'),
(1309,744,'0624','Struktur Data',2,'A',3.8,1,'2026-09-01 04:55:18','2026-09-01 04:55:18'),
(1310,745,'0633','Basis Data',3,'A',3.8,1,'2026-09-01 04:55:18','2026-09-01 04:55:18'),
(1311,746,'0648','Struktur Data',2,'A',3.8,1,'2026-09-01 04:55:18','2026-09-01 04:55:18'),
(1312,747,'0653','Jaringan Komputer',2,'A',3.9,1,'2026-09-01 04:55:18','2026-09-01 04:55:18'),
(1313,748,'0666','Algoritma & Pemrograman',4,'A',3.9,1,'2026-09-01 04:55:18','2026-09-01 04:55:18'),
(1314,749,'0611','Desain Grafis',4,'B',3.4,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1315,750,'0622','Sistem Operasi',3,'B',3.5,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1316,751,'0635','Struktur Data',2,'C',2.8,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1317,752,'0642','Struktur Data',2,'B',3.3,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1318,753,'0654','Sistem Operasi',4,'B',3.3,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1319,754,'0667','Cloud Computing',3,'B',3.5,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1320,755,'0616','Cloud Computing',4,'C',2.9,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1321,756,'0626','Statistika',3,'BC',3.0,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1322,757,'0632','Fisika Dasar',2,'BC',3.1,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1323,758,'0643','Algoritma & Pemrograman',3,'BC',3.1,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1324,759,'0652','Algoritma & Pemrograman',4,'B',3.3,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1325,760,'0662','Jaringan Komputer',4,'B',3.3,1,'2026-09-01 04:55:19','2026-09-01 04:55:19'),
(1328,84,'IF106','Mata Kuliah Dummy Semester 6',3,'AB',3.5,1,'2026-09-01 22:13:36','2026-09-01 22:13:36'),
(1332,82,'IF104','Mata Kuliah Dummy Semester 4',3,'B',3.0,1,'2026-09-02 01:17:08','2026-09-02 01:17:08'),
(1334,81,'IF103','Mata Kuliah Dummy Semester 3',3,'C',2.0,1,'2026-09-02 01:17:38','2026-09-02 01:17:38'),
(1336,83,'IF105','Mata Kuliah Dummy Semester 5',3,'A',4.0,1,'2026-09-02 02:49:16','2026-09-02 02:49:16'),
(1337,761,'06001','Matematika Diskrit',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1338,761,'06002','Algoritma & Pemrograman',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1339,761,'06003','Struktur Data',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1340,761,'06004','Basis Data',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1341,761,'06005','Jaringan Komputer',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1342,761,'06006','Rekayasa Perangkat Lunak',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1343,762,'06007','Kalkulus I',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1344,762,'06008','Fisika Dasar',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1345,762,'06009','Pemrograman Web',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1346,762,'06010','Sistem Operasi',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1347,762,'06011','Statistika',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1348,762,'06012','Desain Grafis',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1349,763,'06011','Statistika',4,'B',3.5,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1350,763,'06012','Desain Grafis',4,'B',3.5,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1351,763,'06013','Kecerdasan Buatan',4,'B',3.5,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1352,763,'06014','Cloud Computing',3,'B',3.5,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1353,763,'06015','Pemrograman Mobile',3,'B',3.5,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1354,764,'06016','Interaksi Manusia Komputer',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1355,764,'06017','Machine Learning',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1356,764,'06018','Matematika Diskrit',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1357,764,'06019','Algoritma & Pemrograman',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1358,764,'06020','Struktur Data',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1359,765,'06021','Basis Data',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1360,765,'06022','Jaringan Komputer',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1361,765,'06023','Rekayasa Perangkat Lunak',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1362,765,'06024','Kalkulus I',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1363,765,'06025','Fisika Dasar',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1364,766,'06026','Pemrograman Web',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1365,766,'06027','Sistem Operasi',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1366,766,'06028','Statistika',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1367,766,'06029','Desain Grafis',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1368,766,'06030','Kecerdasan Buatan',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1369,767,'06031','Cloud Computing',4,'B',3.3,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1370,767,'06032','Pemrograman Mobile',4,'B',3.3,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1371,767,'06033','Interaksi Manusia Komputer',4,'B',3.3,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1372,767,'06034','Machine Learning',3,'B',3.3,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1373,767,'06035','Matematika Diskrit',3,'B',3.3,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1374,768,'06036','Algoritma & Pemrograman',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1375,768,'06037','Struktur Data',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1376,768,'06038','Basis Data',4,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1377,768,'06039','Jaringan Komputer',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1378,768,'06040','Rekayasa Perangkat Lunak',3,'B',3.4,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1379,769,'06001','Matematika Diskrit',4,'BC',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1380,769,'06002','Algoritma & Pemrograman',4,'BC',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1381,769,'06003','Struktur Data',4,'BC',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1382,769,'06004','Basis Data',3,'BC',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1383,769,'06005','Jaringan Komputer',3,'BC',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1384,769,'06006','Rekayasa Perangkat Lunak',3,'BC',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1385,770,'06007','Kalkulus I',4,'C',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1386,770,'06008','Fisika Dasar',4,'C',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1387,770,'06009','Pemrograman Web',4,'C',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1388,770,'06010','Sistem Operasi',3,'C',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1389,770,'06011','Statistika',3,'C',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1390,770,'06012','Desain Grafis',3,'C',3.0,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1391,771,'06011','Statistika',4,'BC',3.1,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1392,771,'06012','Desain Grafis',4,'BC',3.1,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1393,771,'06013','Kecerdasan Buatan',4,'BC',3.1,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1394,771,'06014','Cloud Computing',3,'BC',3.1,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1395,771,'06015','Pemrograman Mobile',3,'BC',3.1,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1396,772,'06016','Interaksi Manusia Komputer',4,'C',2.8,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1397,772,'06017','Machine Learning',4,'C',2.8,1,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(1398,772,'06018','Matematika Diskrit',4,'C',2.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1399,772,'06019','Algoritma & Pemrograman',3,'C',2.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1400,772,'06020','Struktur Data',3,'C',2.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1401,773,'06021','Basis Data',4,'BC',3.0,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1402,773,'06022','Jaringan Komputer',4,'BC',3.0,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1403,773,'06023','Rekayasa Perangkat Lunak',4,'BC',3.0,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1404,773,'06024','Kalkulus I',3,'BC',3.0,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1405,773,'06025','Fisika Dasar',3,'BC',3.0,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1406,774,'06026','Pemrograman Web',4,'C',2.9,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1407,774,'06027','Sistem Operasi',4,'C',2.9,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1408,774,'06028','Statistika',4,'C',2.9,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1409,774,'06029','Desain Grafis',3,'C',2.9,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1410,774,'06030','Kecerdasan Buatan',3,'C',2.9,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1411,775,'06031','Cloud Computing',4,'C',2.9,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1412,775,'06032','Pemrograman Mobile',4,'C',2.9,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1413,775,'06033','Interaksi Manusia Komputer',4,'C',2.9,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1414,775,'06034','Machine Learning',3,'C',2.9,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1415,775,'06035','Matematika Diskrit',3,'C',2.9,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1416,776,'06036','Algoritma & Pemrograman',4,'C',2.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1417,776,'06037','Struktur Data',4,'C',2.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1418,776,'06038','Basis Data',4,'C',2.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1419,776,'06039','Jaringan Komputer',3,'C',2.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1420,776,'06040','Rekayasa Perangkat Lunak',3,'C',2.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1421,777,'06001','Matematika Diskrit',4,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1422,777,'06002','Algoritma & Pemrograman',4,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1423,777,'06003','Struktur Data',4,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1424,777,'06004','Basis Data',3,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1425,777,'06005','Jaringan Komputer',3,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1426,777,'06006','Rekayasa Perangkat Lunak',3,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1427,778,'06007','Kalkulus I',4,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1428,778,'06008','Fisika Dasar',4,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1429,778,'06009','Pemrograman Web',4,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1430,778,'06010','Sistem Operasi',3,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1431,778,'06011','Statistika',3,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1432,778,'06012','Desain Grafis',3,'AB',3.7,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1433,779,'06011','Statistika',4,'AB',3.6,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1434,779,'06012','Desain Grafis',4,'AB',3.6,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1435,779,'06013','Kecerdasan Buatan',4,'AB',3.6,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1436,779,'06014','Cloud Computing',3,'AB',3.6,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1437,779,'06015','Pemrograman Mobile',3,'AB',3.6,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1438,780,'06016','Interaksi Manusia Komputer',4,'B',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1439,780,'06017','Machine Learning',4,'B',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1440,780,'06018','Matematika Diskrit',4,'B',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1441,780,'06019','Algoritma & Pemrograman',3,'B',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1442,780,'06020','Struktur Data',3,'B',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1443,781,'06021','Basis Data',4,'AB',3.6,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1444,781,'06022','Jaringan Komputer',4,'AB',3.6,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1445,781,'06023','Rekayasa Perangkat Lunak',4,'AB',3.6,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1446,781,'06024','Kalkulus I',3,'AB',3.6,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1447,781,'06025','Fisika Dasar',3,'AB',3.6,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1448,782,'06026','Pemrograman Web',4,'AB',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1449,782,'06027','Sistem Operasi',4,'AB',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1450,782,'06028','Statistika',4,'AB',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1451,782,'06029','Desain Grafis',3,'AB',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1452,782,'06030','Kecerdasan Buatan',3,'AB',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1453,783,'06031','Cloud Computing',4,'AB',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1454,783,'06032','Pemrograman Mobile',4,'AB',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1455,783,'06033','Interaksi Manusia Komputer',4,'AB',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1456,783,'06034','Machine Learning',3,'AB',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1457,783,'06035','Matematika Diskrit',3,'AB',3.5,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1458,784,'06036','Algoritma & Pemrograman',4,'A',3.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1459,784,'06037','Struktur Data',4,'A',3.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1460,784,'06038','Basis Data',4,'A',3.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1461,784,'06039','Jaringan Komputer',3,'A',3.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1462,784,'06040','Rekayasa Perangkat Lunak',3,'A',3.8,1,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(1463,785,'06001','Matematika Diskrit',4,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1464,785,'06002','Algoritma & Pemrograman',4,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1465,785,'06003','Struktur Data',4,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1466,785,'06004','Basis Data',3,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1467,785,'06005','Jaringan Komputer',3,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1468,785,'06006','Rekayasa Perangkat Lunak',3,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1469,786,'06007','Kalkulus I',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1470,786,'06008','Fisika Dasar',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1471,786,'06009','Pemrograman Web',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1472,786,'06010','Sistem Operasi',3,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1473,786,'06011','Statistika',3,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1474,786,'06012','Desain Grafis',3,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1475,787,'06011','Statistika',4,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1476,787,'06012','Desain Grafis',4,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1477,787,'06013','Kecerdasan Buatan',4,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1478,787,'06014','Cloud Computing',3,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1479,787,'06015','Pemrograman Mobile',3,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1480,788,'06016','Interaksi Manusia Komputer',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1481,788,'06017','Machine Learning',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1482,788,'06018','Matematika Diskrit',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1483,788,'06019','Algoritma & Pemrograman',3,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1484,788,'06020','Struktur Data',3,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1485,789,'06021','Basis Data',4,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1486,789,'06022','Jaringan Komputer',4,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1487,789,'06023','Rekayasa Perangkat Lunak',4,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1488,789,'06024','Kalkulus I',3,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1489,789,'06025','Fisika Dasar',3,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1490,790,'06026','Pemrograman Web',4,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1491,790,'06027','Sistem Operasi',4,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1492,790,'06028','Statistika',4,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1493,790,'06029','Desain Grafis',3,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1494,790,'06030','Kecerdasan Buatan',3,'BC',3.2,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1495,791,'06031','Cloud Computing',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1496,791,'06032','Pemrograman Mobile',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1497,791,'06033','Interaksi Manusia Komputer',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1498,791,'06034','Machine Learning',3,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1499,791,'06035','Matematika Diskrit',3,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1500,792,'06036','Algoritma & Pemrograman',4,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1501,792,'06037','Struktur Data',4,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1502,792,'06038','Basis Data',4,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1503,792,'06039','Jaringan Komputer',3,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1504,792,'06040','Rekayasa Perangkat Lunak',3,'B',3.4,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1505,793,'06001','Matematika Diskrit',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1506,793,'06002','Algoritma & Pemrograman',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1507,793,'06003','Struktur Data',4,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1508,793,'06004','Basis Data',3,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1509,793,'06005','Jaringan Komputer',3,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1510,793,'06006','Rekayasa Perangkat Lunak',3,'B',3.3,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1511,794,'06007','Kalkulus I',4,'BC',3.1,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1512,794,'06008','Fisika Dasar',4,'BC',3.1,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1513,794,'06009','Pemrograman Web',4,'BC',3.1,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1514,794,'06010','Sistem Operasi',3,'BC',3.1,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1515,794,'06011','Statistika',3,'BC',3.1,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1516,794,'06012','Desain Grafis',3,'BC',3.1,1,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(1517,795,'06011','Statistika',4,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1518,795,'06012','Desain Grafis',4,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1519,795,'06013','Kecerdasan Buatan',4,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1520,795,'06014','Cloud Computing',3,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1521,795,'06015','Pemrograman Mobile',3,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1522,796,'06016','Interaksi Manusia Komputer',4,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1523,796,'06017','Machine Learning',4,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1524,796,'06018','Matematika Diskrit',4,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1525,796,'06019','Algoritma & Pemrograman',3,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1526,796,'06020','Struktur Data',3,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1527,797,'06021','Basis Data',4,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1528,797,'06022','Jaringan Komputer',4,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1529,797,'06023','Rekayasa Perangkat Lunak',4,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1530,797,'06024','Kalkulus I',3,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1531,797,'06025','Fisika Dasar',3,'B',3.3,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1532,798,'06026','Pemrograman Web',4,'BC',3.2,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1533,798,'06027','Sistem Operasi',4,'BC',3.2,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1534,798,'06028','Statistika',4,'BC',3.2,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1535,798,'06029','Desain Grafis',3,'BC',3.2,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1536,798,'06030','Kecerdasan Buatan',3,'BC',3.2,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1537,799,'06031','Cloud Computing',4,'BC',3.2,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1538,799,'06032','Pemrograman Mobile',4,'BC',3.2,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1539,799,'06033','Interaksi Manusia Komputer',4,'BC',3.2,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1540,799,'06034','Machine Learning',3,'BC',3.2,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1541,799,'06035','Matematika Diskrit',3,'D',1.0,0,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1542,800,'06036','Algoritma & Pemrograman',4,'BC',3.1,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1543,800,'06037','Struktur Data',4,'BC',3.1,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1544,800,'06038','Basis Data',4,'BC',3.1,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1545,800,'06039','Jaringan Komputer',3,'BC',3.1,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1546,800,'06040','Rekayasa Perangkat Lunak',3,'BC',3.1,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1547,801,'06001','Matematika Diskrit',4,'A',3.9,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1548,801,'06002','Algoritma & Pemrograman',4,'A',3.9,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1549,801,'06003','Struktur Data',4,'A',3.9,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1550,801,'06004','Basis Data',3,'A',3.9,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1551,801,'06005','Jaringan Komputer',3,'A',3.9,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1552,801,'06006','Rekayasa Perangkat Lunak',3,'A',3.9,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1553,802,'06007','Kalkulus I',4,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1554,802,'06008','Fisika Dasar',4,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1555,802,'06009','Pemrograman Web',4,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1556,802,'06010','Sistem Operasi',3,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1557,802,'06011','Statistika',3,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1558,802,'06012','Desain Grafis',3,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1559,803,'06011','Statistika',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1560,803,'06012','Desain Grafis',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1561,803,'06013','Kecerdasan Buatan',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1562,803,'06014','Cloud Computing',3,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1563,803,'06015','Pemrograman Mobile',3,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1564,804,'06016','Interaksi Manusia Komputer',4,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1565,804,'06017','Machine Learning',4,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1566,804,'06018','Matematika Diskrit',4,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1567,804,'06019','Algoritma & Pemrograman',3,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1568,804,'06020','Struktur Data',3,'AB',3.6,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1569,805,'06021','Basis Data',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1570,805,'06022','Jaringan Komputer',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1571,805,'06023','Rekayasa Perangkat Lunak',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1572,805,'06024','Kalkulus I',3,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1573,805,'06025','Fisika Dasar',3,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1574,806,'06026','Pemrograman Web',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1575,806,'06027','Sistem Operasi',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1576,806,'06028','Statistika',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1577,806,'06029','Desain Grafis',3,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1578,806,'06030','Kecerdasan Buatan',3,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1579,807,'06031','Cloud Computing',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1580,807,'06032','Pemrograman Mobile',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1581,807,'06033','Interaksi Manusia Komputer',4,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1582,807,'06034','Machine Learning',3,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1583,807,'06035','Matematika Diskrit',3,'AB',3.7,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1584,808,'06036','Algoritma & Pemrograman',4,'A',3.8,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1585,808,'06037','Struktur Data',4,'A',3.8,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1586,808,'06038','Basis Data',4,'A',3.8,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1587,808,'06039','Jaringan Komputer',3,'A',3.8,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1588,808,'06040','Rekayasa Perangkat Lunak',3,'A',3.8,1,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(1589,809,'06001','Matematika Diskrit',4,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1590,809,'06002','Algoritma & Pemrograman',4,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1591,809,'06003','Struktur Data',4,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1592,809,'06004','Basis Data',3,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1593,809,'06005','Jaringan Komputer',3,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1594,809,'06006','Rekayasa Perangkat Lunak',3,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1595,810,'06007','Kalkulus I',4,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1596,810,'06008','Fisika Dasar',4,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1597,810,'06009','Pemrograman Web',4,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1598,810,'06010','Sistem Operasi',3,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1599,810,'06011','Statistika',3,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1600,810,'06012','Desain Grafis',3,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1601,811,'06011','Statistika',4,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1602,811,'06012','Desain Grafis',4,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1603,811,'06013','Kecerdasan Buatan',4,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1604,811,'06014','Cloud Computing',3,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1605,811,'06015','Pemrograman Mobile',3,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1606,812,'06016','Interaksi Manusia Komputer',4,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1607,812,'06017','Machine Learning',4,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1608,812,'06018','Matematika Diskrit',4,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1609,812,'06019','Algoritma & Pemrograman',3,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1610,812,'06020','Struktur Data',3,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1611,813,'06021','Basis Data',4,'B',3.4,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1612,813,'06022','Jaringan Komputer',4,'B',3.4,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1613,813,'06023','Rekayasa Perangkat Lunak',4,'B',3.4,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1614,813,'06024','Kalkulus I',3,'B',3.4,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1615,813,'06025','Fisika Dasar',3,'B',3.4,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1616,814,'06026','Pemrograman Web',4,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1617,814,'06027','Sistem Operasi',4,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1618,814,'06028','Statistika',4,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1619,814,'06029','Desain Grafis',3,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1620,814,'06030','Kecerdasan Buatan',3,'B',3.5,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1621,815,'06031','Cloud Computing',4,'B',3.4,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1622,815,'06032','Pemrograman Mobile',4,'B',3.4,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1623,815,'06033','Interaksi Manusia Komputer',4,'B',3.4,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1624,815,'06034','Machine Learning',3,'B',3.4,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1625,815,'06035','Matematika Diskrit',3,'B',3.4,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1626,816,'06036','Algoritma & Pemrograman',4,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1627,816,'06037','Struktur Data',4,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1628,816,'06038','Basis Data',4,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1629,816,'06039','Jaringan Komputer',3,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(1630,816,'06040','Rekayasa Perangkat Lunak',3,'AB',3.6,1,'2026-09-02 15:53:04','2026-09-02 15:53:04');
/*!40000 ALTER TABLE `mata_kuliahs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2026_08_22_000001_create_prodis_table',1),
(5,'2026_08_22_000002_create_mahasiswas_table',1),
(6,'2026_08_22_000003_create_ipk_semestrs_table',1),
(7,'2026_08_22_000004_create_dokumens_table',1),
(8,'2026_08_22_000005_create_surat_peringatans_table',1),
(9,'2026_08_22_000006_create_non_akademik_table',1),
(10,'2026_08_22_000007_create_bebas_tanggungans_table',1),
(11,'2026_08_22_000008_create_laporans_table',1),
(12,'2026_08_22_000009_create_konfigurasi_audit_notif_table',1),
(13,'2026_08_22_000010_add_prodi_id_to_users',2),
(14,'2026_08_22_041256_create_personal_access_tokens_table',2),
(15,'2026_08_26_233746_add_jenis_and_foto_to_non_akademik_tables',2),
(16,'2026_08_26_235300_patch_dokumens_and_surat_peringatans_for_phase6',2),
(17,'2026_08_27_000516_patch_laporans_table_for_phase7',2),
(18,'2026_08_27_193411_add_ips_to_ipk_semestrs_table',2),
(19,'2026_08_27_213300_add_personal_info_to_mahasiswas_table',2),
(20,'2026_08_27_214300_create_bebas_tanggungan_histories_table',2),
(21,'2026_08_28_003502_add_nomor_surat_to_surat_peringatans_table',2),
(22,'2026_08_28_010425_add_tel_ortu_to_mahasiswas_table',2),
(23,'2026_08_28_011431_create_contact_histories_table',2),
(24,'2026_08_28_020000_add_deskripsi_and_kode_to_dokumen_jenis_table',2),
(25,'2026_08_28_030801_create_nilai_mutus_table',2),
(26,'2026_08_28_030802_create_jenis_pelanggarans_table',2),
(27,'2026_08_28_030803_create_periode_akademiks_table',2),
(28,'2026_08_28_030804_patch_surat_peringatans_for_phase7',2),
(29,'2026_08_30_155751_create_catatan_internals_table',2),
(30,'2026_08_31_010623_modify_ipk_semestrs_add_status_and_catatan',2),
(31,'2026_08_31_010642_create_dokumen_jenis_fields_table',2),
(32,'2026_08_31_010648_create_dokumen_field_values_table',2),
(33,'2026_08_31_143454_create_notifications_table',2),
(34,'2026_09_01_224115_add_validated_fields_to_ipk_semestrs_table',3),
(35,'2026_08_31_200000_create_all_tables',4),
(36,'2026_09_02_013940_add_periode_input_tahun_ajaran_to_konfigurasis_table',5),
(37,'2026_09_02_051212_update_ipk_semestrs_add_missing_status_values',5);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `nilai_mutus`
--

DROP TABLE IF EXISTS `nilai_mutus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `nilai_mutus` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `min` decimal(4,1) NOT NULL,
  `max` decimal(4,1) NOT NULL,
  `huruf` varchar(5) NOT NULL,
  `poin` decimal(3,2) NOT NULL,
  `lulus` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nilai_mutus_huruf_unique` (`huruf`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nilai_mutus`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `nilai_mutus` WRITE;
/*!40000 ALTER TABLE `nilai_mutus` DISABLE KEYS */;
INSERT INTO `nilai_mutus` VALUES
(1,80.0,100.0,'A',4.00,1,NULL,NULL),
(2,75.0,79.9,'AB',3.50,1,NULL,NULL),
(3,70.0,74.9,'B',3.00,1,NULL,NULL),
(4,65.0,69.9,'BC',2.50,1,NULL,NULL),
(5,60.0,64.9,'C',2.00,1,NULL,NULL),
(6,55.0,59.9,'D',1.00,0,NULL,NULL),
(7,0.0,54.9,'E',0.00,0,NULL,NULL);
/*!40000 ALTER TABLE `nilai_mutus` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `judul` varchar(255) NOT NULL,
  `pesan` text NOT NULL,
  `tipe` enum('info','warning','success','error') NOT NULL DEFAULT 'info',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `link` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_foreign` (`user_id`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES
(1,376,'Surat Peringatan SP1 Diterbitkan','Anda mendapatkan SP1 atas pelanggaran: Akademik. Batas evaluasi: 01 Jan 1970','warning',0,'/mahasiswa/sp','2026-09-01 00:29:11','2026-09-01 00:29:11'),
(2,433,'Surat Peringatan SP1 Diterbitkan','Anda mendapatkan SP1 atas pelanggaran: Akademik. Batas evaluasi: 01 Jan 1970','warning',0,'/mahasiswa/sp','2026-09-01 01:17:25','2026-09-01 01:17:25'),
(3,422,'Surat Peringatan SP1 Diterbitkan','Anda mendapatkan SP1 atas pelanggaran: Non-Akademik. Batas evaluasi: 01 Jan 1970','warning',0,'/mahasiswa/sp','2026-09-01 01:28:37','2026-09-01 01:28:37'),
(4,377,'Surat Peringatan SP1 Diterbitkan','Anda mendapatkan SP1 atas pelanggaran: Akademik. Batas evaluasi: 01 Jan 1970','warning',0,'/mahasiswa/sp','2026-09-01 01:41:00','2026-09-01 01:41:00'),
(5,392,'Surat Peringatan SP1 Diterbitkan','Anda mendapatkan SP1 atas pelanggaran: Keuangan. Batas evaluasi: 01 Jan 1970','warning',0,'/mahasiswa/sp','2026-09-01 01:45:45','2026-09-01 01:45:45'),
(6,1,'Dokumen Baru: Berita Acara KP','Kailla Salsabila (2306064) mengunggah dokumen Berita Acara KP. Menunggu verifikasi.','info',0,'/admin/dokumen','2026-09-02 10:53:58','2026-09-02 10:53:58'),
(7,1,'Dokumen Baru: Berita Acara KP','Kailla Salsabila (2306064) mengunggah dokumen Berita Acara KP. Menunggu verifikasi.','info',0,'/admin/dokumen','2026-09-02 11:02:57','2026-09-02 11:02:57'),
(8,1,'Dokumen Baru: Bela Negara','Ahmad Rizky Pratama (2507101) mengunggah dokumen Bela Negara. Menunggu verifikasi.','info',0,'/admin/dokumen','2026-09-02 15:54:41','2026-09-02 15:54:41'),
(9,452,'Bebas Tanggungan Ditolak','Permohonan bebas tanggungan Anda ditolak. Alasan: gapapa mau aja','error',0,'/mahasiswa/bebas-tanggungan','2026-09-02 15:56:19','2026-09-02 15:56:19'),
(10,457,'Bebas Tanggungan Ditolak','Permohonan bebas tanggungan Anda ditolak. Alasan: karena apa we','error',0,'/mahasiswa/bebas-tanggungan','2026-09-02 16:00:06','2026-09-02 16:00:06'),
(11,457,'Bebas Tanggungan Ditolak','Permohonan bebas tanggungan Anda ditolak. Alasan: ajuin ulang','error',0,'/mahasiswa/bebas-tanggungan','2026-09-02 16:12:47','2026-09-02 16:12:47'),
(12,457,'Bebas Tanggungan Diterbitkan','Surat Keterangan Penyelesaian Studi Anda telah diterbitkan. Nomor: SKPS/KIP-K/ITG/09/2026/042','success',0,'/mahasiswa/bebas-tanggungan','2026-09-02 16:16:00','2026-09-02 16:16:00'),
(13,2,'Laporan Baru Menunggu Persetujuan','Laporan \"LAPORAN EVALUASI SEMESTER GENAP TA 2025/2026\" telah diajukan untuk ditinjau.','info',0,'/warek/laporan','2026-09-02 20:41:53','2026-09-02 20:41:53'),
(14,1,'Laporan Disetujui','Laporan \"LAPORAN EVALUASI SEMESTER GENAP TA 2025/2026\" telah disetujui oleh Warek.','success',0,'/admin/laporan/1','2026-09-02 20:42:36','2026-09-02 20:42:36'),
(15,2,'Laporan Baru Menunggu Persetujuan','Laporan \"LAPORAN EVALUASI SEMESTER GANJIL TA 2026/2027 — TEKNIK INFORMATIKA\" telah diajukan untuk ditinjau.','info',0,'/warek/laporan','2026-09-02 20:45:44','2026-09-02 20:45:44'),
(16,1,'Laporan Disetujui','Laporan \"LAPORAN EVALUASI SEMESTER GANJIL TA 2026/2027 — TEKNIK INFORMATIKA\" telah disetujui oleh Warek.','success',0,'/admin/laporan/2','2026-09-02 20:46:01','2026-09-02 20:46:01'),
(17,401,'Surat Peringatan SP1 Diterbitkan','Anda mendapatkan SP1 atas pelanggaran: Akademik. Batas evaluasi: 30 Sep 2026','warning',0,'/mahasiswa/sp','2026-09-04 17:53:39','2026-09-04 17:53:39');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `organisasis`
--

DROP TABLE IF EXISTS `organisasis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `organisasis` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mahasiswa_id` bigint(20) unsigned NOT NULL,
  `nama` varchar(255) NOT NULL,
  `jenis` enum('Organisasi','Kepanitiaan','Kegiatan') NOT NULL DEFAULT 'Organisasi',
  `jabatan` varchar(255) NOT NULL,
  `periode_mulai` date NOT NULL,
  `periode_selesai` date NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `file_sk` varchar(255) DEFAULT NULL,
  `foto_kegiatan` varchar(255) DEFAULT NULL,
  `status` enum('Menunggu','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu',
  `catatan_admin` text DEFAULT NULL,
  `validated_by` bigint(20) unsigned DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `organisasis_mahasiswa_id_foreign` (`mahasiswa_id`),
  KEY `organisasis_validated_by_foreign` (`validated_by`),
  CONSTRAINT `organisasis_mahasiswa_id_foreign` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `organisasis_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organisasis`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `organisasis` WRITE;
/*!40000 ALTER TABLE `organisasis` DISABLE KEYS */;
INSERT INTO `organisasis` VALUES
(21,96,'Himpunan Mahasiswa Informatika (HIMA-IF)','Organisasi','Anggota Divisi Kominfo','2024-03-01','2025-02-28','Aktif dalam pembuatan konten sosial media HIMA-IF.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-03-09 17:00:00','2024-03-14 17:00:00'),
(22,96,'XTC HIJRAH','Kegiatan','KETUA DPC ITG','2025-02-01','2026-01-01','GEGERENGSENG','uploads/organisasi/2306064/sk/mhQHURoNCYuKKdJHe8qLnobE7UiPiSRz8cg5JIcC.pdf','uploads/organisasi/2306064/foto/6OWhe7ZVf7A3bvPUB26S6R0ZUTdPn5pGDS8TNiv7.jpg','Disetujui',NULL,1,'2026-09-02 09:16:19','2025-10-04 17:00:00','2026-09-02 09:16:19'),
(40,126,'Badan Eksekutif Mahasiswa Fakultas Teknik','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Penalaran & Riset.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2026-09-01 00:55:24'),
(41,126,'Himpunan Mahasiswa Sistem Informasi','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Sistem Informasi.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(42,128,'Himpunan Mahasiswa Sistem Informasi','Organisasi','Anggota','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Sistem Informasi.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(43,129,'Himpunan Mahasiswa Informatika','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(44,126,'Unit Kegiatan Mahasiswa Seni & Budaya','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Seni & Budaya.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(45,129,'Unit Kegiatan Mahasiswa Penalaran & Riset','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Penalaran & Riset.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(46,126,'Unit Kegiatan Mahasiswa Penalaran & Riset','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Penalaran & Riset.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(47,128,'Unit Kegiatan Mahasiswa Penalaran & Riset','Organisasi','Anggota','2023-03-01','2024-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Penalaran & Riset.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(48,129,'Himpunan Mahasiswa Teknik Industri','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Industri.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(49,131,'Himpunan Mahasiswa Teknik Industri','Organisasi','Anggota','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Industri.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(50,132,'Badan Eksekutif Mahasiswa Fakultas Teknik','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Badan Eksekutif Mahasiswa Fakultas Teknik.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(51,134,'Unit Kegiatan Mahasiswa Penalaran & Riset','Organisasi','Anggota','2023-03-01','2024-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Penalaran & Riset.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(52,135,'Himpunan Mahasiswa Teknik Industri','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Industri.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(53,137,'Unit Kegiatan Mahasiswa Olahraga','Organisasi','Anggota','2023-03-01','2024-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Olahraga.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(54,138,'Himpunan Mahasiswa Sistem Informasi','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Sistem Informasi.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(55,140,'Himpunan Mahasiswa Informatika','Organisasi','Anggota','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(56,141,'Unit Kegiatan Mahasiswa Penalaran & Riset','Organisasi','Ketua Divisi','2024-03-01','2025-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Penalaran & Riset.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(57,143,'Badan Eksekutif Mahasiswa Fakultas Teknik','Organisasi','Anggota','2024-03-01','2025-02-28','Aktif dalam kegiatan Badan Eksekutif Mahasiswa Fakultas Teknik.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(58,144,'Himpunan Mahasiswa Informatika','Organisasi','Ketua Divisi','2024-03-01','2025-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(59,146,'Unit Kegiatan Mahasiswa Seni & Budaya','Organisasi','Anggota','2024-03-01','2025-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Seni & Budaya.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(60,147,'Himpunan Mahasiswa Sistem Informasi','Organisasi','Ketua Divisi','2024-03-01','2025-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Sistem Informasi.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(61,149,'Unit Kegiatan Mahasiswa Seni & Budaya','Organisasi','Anggota','2024-03-01','2025-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Seni & Budaya.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(62,150,'Unit Kegiatan Mahasiswa Olahraga','Organisasi','Ketua Divisi','2024-03-01','2025-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Olahraga.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(63,152,'Himpunan Mahasiswa Teknik Sipil & Arsitektur','Organisasi','Anggota','2024-03-01','2025-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Sipil & Arsitektur.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(64,153,'Unit Kegiatan Mahasiswa Olahraga','Organisasi','Ketua Divisi','2024-03-01','2025-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Olahraga.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(65,155,'Himpunan Mahasiswa Informatika','Organisasi','Anggota','2024-03-01','2025-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(66,156,'Himpunan Mahasiswa Sistem Informasi','Organisasi','Ketua Divisi','2025-03-01','2026-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Sistem Informasi.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-02-28 17:00:00','2025-03-05 17:00:00'),
(67,158,'Unit Kegiatan Mahasiswa Penalaran & Riset','Organisasi','Anggota','2025-03-01','2026-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Penalaran & Riset.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-02-28 17:00:00','2025-03-05 17:00:00'),
(68,159,'Himpunan Mahasiswa Informatika','Organisasi','Ketua Divisi','2025-03-01','2026-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-02-28 17:00:00','2025-03-05 17:00:00'),
(69,161,'Himpunan Mahasiswa Teknik Sipil & Arsitektur','Organisasi','Anggota','2025-03-01','2026-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Sipil & Arsitektur.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-02-28 17:00:00','2025-03-05 17:00:00'),
(70,162,'Himpunan Mahasiswa Teknik Industri','Organisasi','Ketua Divisi','2025-03-01','2026-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Industri.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-02-28 17:00:00','2025-03-05 17:00:00'),
(71,164,'Badan Eksekutif Mahasiswa Fakultas Teknik','Organisasi','Anggota','2025-03-01','2026-02-28','Aktif dalam kegiatan Badan Eksekutif Mahasiswa Fakultas Teknik.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-02-28 17:00:00','2025-03-05 17:00:00'),
(72,165,'Badan Eksekutif Mahasiswa Fakultas Teknik','Organisasi','Ketua Divisi','2025-03-01','2026-02-28','Aktif dalam kegiatan Badan Eksekutif Mahasiswa Fakultas Teknik.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-02-28 17:00:00','2025-03-05 17:00:00'),
(73,167,'Himpunan Mahasiswa Teknik Sipil & Arsitektur','Organisasi','Anggota','2025-03-01','2026-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Sipil & Arsitektur.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-02-28 17:00:00','2025-03-05 17:00:00'),
(74,168,'Unit Kegiatan Mahasiswa Seni & Budaya','Organisasi','Ketua Divisi','2025-03-01','2026-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Seni & Budaya.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-02-28 17:00:00','2025-03-05 17:00:00'),
(75,170,'Himpunan Mahasiswa Teknik Sipil & Arsitektur','Organisasi','Anggota','2025-03-01','2026-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Sipil & Arsitektur.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-02-28 17:00:00','2025-03-05 17:00:00'),
(76,171,'Unit Kegiatan Mahasiswa Penalaran & Riset','Organisasi','Ketua Divisi','2026-03-01','2027-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Penalaran & Riset.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-02-28 17:00:00','2026-03-05 17:00:00'),
(77,173,'Himpunan Mahasiswa Teknik Industri','Organisasi','Anggota','2026-03-01','2027-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Industri.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-02-28 17:00:00','2026-03-05 17:00:00'),
(78,174,'Himpunan Mahasiswa Informatika','Organisasi','Ketua Divisi','2026-03-01','2027-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-02-28 17:00:00','2026-03-05 17:00:00'),
(79,176,'Badan Eksekutif Mahasiswa Fakultas Teknik','Organisasi','Anggota','2026-03-01','2027-02-28','Aktif dalam kegiatan Badan Eksekutif Mahasiswa Fakultas Teknik.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-02-28 17:00:00','2026-03-05 17:00:00'),
(80,177,'Himpunan Mahasiswa Teknik Sipil & Arsitektur','Organisasi','Ketua Divisi','2026-03-01','2027-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Sipil & Arsitektur.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-02-28 17:00:00','2026-03-05 17:00:00'),
(81,179,'Himpunan Mahasiswa Teknik Industri','Organisasi','Anggota','2026-03-01','2027-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Industri.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-02-28 17:00:00','2026-03-05 17:00:00'),
(82,180,'Himpunan Mahasiswa Informatika','Organisasi','Ketua Divisi','2026-03-01','2027-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-02-28 17:00:00','2026-03-05 17:00:00'),
(83,182,'Unit Kegiatan Mahasiswa Penalaran & Riset','Organisasi','Anggota','2026-03-01','2027-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Penalaran & Riset.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-02-28 17:00:00','2026-03-05 17:00:00'),
(84,183,'Himpunan Mahasiswa Teknik Sipil & Arsitektur','Organisasi','Ketua Divisi','2026-03-01','2027-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Sipil & Arsitektur.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-02-28 17:00:00','2026-03-05 17:00:00'),
(85,185,'Himpunan Mahasiswa Sistem Informasi','Organisasi','Anggota','2026-03-01','2027-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Sistem Informasi.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-02-28 17:00:00','2026-03-05 17:00:00'),
(86,186,'Himpunan Mahasiswa Sistem Informasi','Organisasi','Ketua Divisi','2027-03-01','2028-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Sistem Informasi.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-02-28 17:00:00','2027-03-05 17:00:00'),
(87,188,'Unit Kegiatan Mahasiswa Olahraga','Organisasi','Anggota','2027-03-01','2028-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Olahraga.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-02-28 17:00:00','2027-03-05 17:00:00'),
(88,189,'Himpunan Mahasiswa Teknik Industri','Organisasi','Ketua Divisi','2027-03-01','2028-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Industri.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-02-28 17:00:00','2027-03-05 17:00:00'),
(89,191,'Unit Kegiatan Mahasiswa Olahraga','Organisasi','Anggota','2027-03-01','2028-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Olahraga.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-02-28 17:00:00','2027-03-05 17:00:00'),
(90,192,'Himpunan Mahasiswa Teknik Sipil & Arsitektur','Organisasi','Ketua Divisi','2027-03-01','2028-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Sipil & Arsitektur.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-02-28 17:00:00','2027-03-05 17:00:00'),
(91,194,'Badan Eksekutif Mahasiswa Fakultas Teknik','Organisasi','Anggota','2027-03-01','2028-02-28','Aktif dalam kegiatan Badan Eksekutif Mahasiswa Fakultas Teknik.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-02-28 17:00:00','2027-03-05 17:00:00'),
(92,195,'Himpunan Mahasiswa Teknik Industri','Organisasi','Ketua Divisi','2027-03-01','2028-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Industri.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-02-28 17:00:00','2027-03-05 17:00:00'),
(93,197,'Himpunan Mahasiswa Sistem Informasi','Organisasi','Anggota','2027-03-01','2028-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Sistem Informasi.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-02-28 17:00:00','2027-03-05 17:00:00'),
(94,198,'Unit Kegiatan Mahasiswa Olahraga','Organisasi','Ketua Divisi','2027-03-01','2028-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Olahraga.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-02-28 17:00:00','2027-03-05 17:00:00'),
(95,200,'Himpunan Mahasiswa Informatika','Organisasi','Anggota','2027-03-01','2028-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-02-28 17:00:00','2027-03-05 17:00:00'),
(96,126,'Himpunan Mahasiswa Teknik Sipil & Arsitektur','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Sipil & Arsitektur.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(97,131,'Unit Kegiatan Mahasiswa Olahraga','Organisasi','Anggota','2023-03-01','2024-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Olahraga.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(98,132,'Unit Kegiatan Mahasiswa Olahraga','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Olahraga.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(99,134,'Himpunan Mahasiswa Informatika','Organisasi','Anggota','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(100,137,'Himpunan Mahasiswa Informatika','Organisasi','Anggota','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(101,138,'Himpunan Mahasiswa Teknik Sipil & Arsitektur','Organisasi','Ketua Divisi','2023-03-01','2024-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Teknik Sipil & Arsitektur.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(102,140,'Unit Kegiatan Mahasiswa Olahraga','Organisasi','Anggota','2023-03-01','2024-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Olahraga.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2023-02-28 17:00:00','2023-03-05 17:00:00'),
(103,141,'Himpunan Mahasiswa Informatika','Organisasi','Ketua Divisi','2024-03-01','2025-02-28','Aktif dalam kegiatan Himpunan Mahasiswa Informatika.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(104,143,'Unit Kegiatan Mahasiswa Penalaran & Riset','Organisasi','Anggota','2024-03-01','2025-02-28','Aktif dalam kegiatan Unit Kegiatan Mahasiswa Penalaran & Riset.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-02-29 17:00:00','2024-03-05 17:00:00'),
(105,96,'UKM PENCAK SILAT TAPAK MERAH MUDA','Organisasi','KETUA DPC ITG','2023-09-01','2026-06-01','ROLLING ROLLING','uploads/organisasi/2306064/sk/vaAvmUpkVsnAPyDd9okFk0v5GmrWcd88ajr9gS0U.pdf','uploads/organisasi/2306064/foto/UcOP25G27QWMMTHLAoRwX9qU8iuFwDsJx2NhIVck.png','Disetujui',NULL,1,'2026-09-02 08:18:03','2026-09-02 08:16:39','2026-09-02 08:18:03'),
(106,96,'pkkmb','Kepanitiaan','konsumsi','2026-09-01','2026-09-01',NULL,'uploads/organisasi/2306064/sk/zgfqfxZ4oUL052q5JxLXJPbzPV5gVeRiR2RvjNSp.jpg','uploads/organisasi/2306064/foto/ynFVXCVacYdWTTAX0rv75aDzvXjQJNd9Hlzq4W0n.jpg','Disetujui',NULL,1,'2026-09-02 10:25:52','2026-09-02 09:08:54','2026-09-02 10:25:52');
/*!40000 ALTER TABLE `organisasis` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `pelatihans`
--

DROP TABLE IF EXISTS `pelatihans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pelatihans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mahasiswa_id` bigint(20) unsigned NOT NULL,
  `nama` varchar(255) NOT NULL,
  `jenis` enum('Akademik','Non-Akademik') NOT NULL,
  `penyelenggara` varchar(255) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `tempat` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `file_sertifikat` varchar(255) DEFAULT NULL,
  `foto_kegiatan` varchar(255) DEFAULT NULL,
  `status` enum('Menunggu','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu',
  `catatan_admin` text DEFAULT NULL,
  `validated_by` bigint(20) unsigned DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pelatihans_mahasiswa_id_foreign` (`mahasiswa_id`),
  KEY `pelatihans_validated_by_foreign` (`validated_by`),
  CONSTRAINT `pelatihans_mahasiswa_id_foreign` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pelatihans_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pelatihans`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `pelatihans` WRITE;
/*!40000 ALTER TABLE `pelatihans` DISABLE KEYS */;
INSERT INTO `pelatihans` VALUES
(26,96,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2024-11-01','2024-11-30','Online','Pelatihan intensif pembuatan aplikasi web modern.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-12-01 17:00:00','2024-12-04 17:00:00'),
(27,96,'Pelatihan Public Speaking & Leadership','Non-Akademik','Kementerian Pemuda dan Olahraga','2026-04-15','2026-04-17','Bandung','Meningkatkan kemampuan berbicara di depan umum.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-04-19 17:00:00','2026-04-21 17:00:00'),
(43,126,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2024-07-01','2024-09-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-07-04 17:00:00','2024-09-04 17:00:00'),
(44,126,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2024-07-01','2024-08-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-07-04 17:00:00','2024-08-04 17:00:00'),
(45,128,'Workshop Data Science with Python','Akademik','Dicoding','2024-04-01','2024-06-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-04-04 17:00:00','2024-06-04 17:00:00'),
(46,129,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2024-07-01','2024-08-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-07-04 17:00:00','2024-08-04 17:00:00'),
(47,126,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2024-05-01','2024-06-28','Online','Pelatihan intensif Bootcamp Fullstack Laravel & React selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-05-04 17:00:00','2024-06-04 17:00:00'),
(48,128,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2024-06-01','2024-07-28','Online','Pelatihan intensif Bootcamp Fullstack Laravel & React selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-06-04 17:00:00','2024-07-04 17:00:00'),
(49,129,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2024-03-01','2024-04-28','Online','Pelatihan intensif Bootcamp Fullstack Laravel & React selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-03-04 17:00:00','2024-04-04 17:00:00'),
(50,128,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2024-08-01','2024-10-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-08-04 17:00:00','2024-10-04 17:00:00'),
(51,131,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2024-03-01','2024-05-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-03-04 17:00:00','2024-05-04 17:00:00'),
(52,132,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2024-07-01','2024-09-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-07-04 17:00:00','2024-09-04 17:00:00'),
(53,134,'Workshop Data Science with Python','Akademik','Dicoding','2024-06-01','2024-08-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-06-04 17:00:00','2024-08-04 17:00:00'),
(54,135,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2024-05-01','2024-06-28','Online','Pelatihan intensif Bootcamp Fullstack Laravel & React selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-05-04 17:00:00','2024-06-04 17:00:00'),
(55,137,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2024-07-01','2024-08-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-07-04 17:00:00','2024-08-04 17:00:00'),
(56,138,'Pelatihan Public Speaking & Leadership','Non-Akademik','Kemendikbud','2024-08-01','2024-11-28','Bandung','Pelatihan intensif Pelatihan Public Speaking & Leadership selama 3 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-08-04 17:00:00','2024-11-04 17:00:00'),
(57,140,'Pelatihan Public Speaking & Leadership','Non-Akademik','Kemendikbud','2024-03-01','2024-06-28','Bandung','Pelatihan intensif Pelatihan Public Speaking & Leadership selama 3 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-03-04 17:00:00','2024-06-04 17:00:00'),
(58,141,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2025-04-01','2025-06-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-04-04 17:00:00','2025-06-04 17:00:00'),
(59,143,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2025-03-01','2025-04-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-03-04 17:00:00','2025-04-04 17:00:00'),
(60,144,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2025-04-01','2025-05-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-04-04 17:00:00','2025-05-04 17:00:00'),
(61,146,'Workshop Data Science with Python','Akademik','Dicoding','2025-05-01','2025-07-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-05-04 17:00:00','2025-07-04 17:00:00'),
(62,147,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2025-05-01','2025-06-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-05-04 17:00:00','2025-06-04 17:00:00'),
(63,149,'Workshop Data Science with Python','Akademik','Dicoding','2025-07-01','2025-09-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-07-04 17:00:00','2025-09-04 17:00:00'),
(64,150,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2025-07-01','2025-08-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-07-04 17:00:00','2025-08-04 17:00:00'),
(65,152,'Pelatihan Public Speaking & Leadership','Non-Akademik','Kemendikbud','2025-06-01','2025-09-28','Bandung','Pelatihan intensif Pelatihan Public Speaking & Leadership selama 3 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-06-04 17:00:00','2025-09-04 17:00:00'),
(66,153,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2025-06-01','2025-07-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-06-04 17:00:00','2025-07-04 17:00:00'),
(67,155,'Workshop Data Science with Python','Akademik','Dicoding','2025-08-01','2025-10-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-08-04 17:00:00','2025-10-04 17:00:00'),
(68,156,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2026-03-01','2026-04-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-03-04 17:00:00','2026-04-04 17:00:00'),
(69,158,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2026-03-01','2026-05-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-03-04 17:00:00','2026-05-04 17:00:00'),
(70,159,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2026-07-01','2026-09-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-07-04 17:00:00','2026-09-04 17:00:00'),
(71,161,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2026-06-01','2026-07-28','Online','Pelatihan intensif Bootcamp Fullstack Laravel & React selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-06-04 17:00:00','2026-07-04 17:00:00'),
(72,162,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2026-08-01','2026-10-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-08-04 17:00:00','2026-10-04 17:00:00'),
(73,164,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2026-04-01','2026-05-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-04-04 17:00:00','2026-05-04 17:00:00'),
(74,165,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2026-04-01','2026-05-28','Online','Pelatihan intensif Bootcamp Fullstack Laravel & React selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-04-04 17:00:00','2026-05-04 17:00:00'),
(75,167,'Pelatihan Public Speaking & Leadership','Non-Akademik','Kemendikbud','2026-06-01','2026-09-28','Bandung','Pelatihan intensif Pelatihan Public Speaking & Leadership selama 3 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-06-04 17:00:00','2026-09-04 17:00:00'),
(76,168,'Workshop Data Science with Python','Akademik','Dicoding','2026-06-01','2026-08-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-06-04 17:00:00','2026-08-04 17:00:00'),
(77,170,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2026-03-01','2026-04-28','Online','Pelatihan intensif Bootcamp Fullstack Laravel & React selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2026-03-04 17:00:00','2026-04-04 17:00:00'),
(78,171,'Pelatihan Public Speaking & Leadership','Non-Akademik','Kemendikbud','2027-05-01','2027-08-28','Bandung','Pelatihan intensif Pelatihan Public Speaking & Leadership selama 3 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-05-04 17:00:00','2027-08-04 17:00:00'),
(79,173,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2027-04-01','2027-06-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-04-04 17:00:00','2027-06-04 17:00:00'),
(80,174,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2027-05-01','2027-07-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-05-04 17:00:00','2027-07-04 17:00:00'),
(81,176,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2027-03-01','2027-05-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-03-04 17:00:00','2027-05-04 17:00:00'),
(82,177,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2027-05-01','2027-07-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-05-04 17:00:00','2027-07-04 17:00:00'),
(83,179,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2027-07-01','2027-08-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-07-04 17:00:00','2027-08-04 17:00:00'),
(84,180,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2027-07-01','2027-08-28','Online','Pelatihan intensif Bootcamp Fullstack Laravel & React selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-07-04 17:00:00','2027-08-04 17:00:00'),
(85,182,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2027-05-01','2027-06-28','Online','Pelatihan intensif Bootcamp Fullstack Laravel & React selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-05-04 17:00:00','2027-06-04 17:00:00'),
(86,183,'Bootcamp Fullstack Laravel & React','Akademik','BuildWithAngga','2027-03-01','2027-04-28','Online','Pelatihan intensif Bootcamp Fullstack Laravel & React selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-03-04 17:00:00','2027-04-04 17:00:00'),
(87,185,'Pelatihan Public Speaking & Leadership','Non-Akademik','Kemendikbud','2027-03-01','2027-06-28','Bandung','Pelatihan intensif Pelatihan Public Speaking & Leadership selama 3 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2027-03-04 17:00:00','2027-06-04 17:00:00'),
(88,186,'Workshop Data Science with Python','Akademik','Dicoding','2028-03-01','2028-05-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2028-03-04 17:00:00','2028-05-04 17:00:00'),
(89,188,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2028-08-01','2028-10-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2028-08-04 17:00:00','2028-10-04 17:00:00'),
(90,189,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2028-08-01','2028-09-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2028-08-04 17:00:00','2028-09-04 17:00:00'),
(91,191,'Workshop Data Science with Python','Akademik','Dicoding','2028-07-01','2028-09-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2028-07-04 17:00:00','2028-09-04 17:00:00'),
(92,192,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2028-03-01','2028-05-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2028-03-04 17:00:00','2028-05-04 17:00:00'),
(93,194,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2028-08-01','2028-10-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2028-08-04 17:00:00','2028-10-04 17:00:00'),
(94,195,'Workshop Data Science with Python','Akademik','Dicoding','2028-04-01','2028-06-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2028-04-04 17:00:00','2028-06-04 17:00:00'),
(95,197,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2028-08-01','2028-09-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2028-08-04 17:00:00','2028-09-04 17:00:00'),
(96,198,'Workshop Data Science with Python','Akademik','Dicoding','2028-03-01','2028-05-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2028-03-04 17:00:00','2028-05-04 17:00:00'),
(97,200,'Workshop Data Science with Python','Akademik','Dicoding','2028-06-01','2028-08-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2028-06-04 17:00:00','2028-08-04 17:00:00'),
(98,129,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2024-06-01','2024-08-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-06-04 17:00:00','2024-08-04 17:00:00'),
(99,131,'Workshop Data Science with Python','Akademik','Dicoding','2024-07-01','2024-09-28','Online','Pelatihan intensif Workshop Data Science with Python selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-07-04 17:00:00','2024-09-04 17:00:00'),
(100,134,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2024-07-01','2024-08-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-07-04 17:00:00','2024-08-04 17:00:00'),
(101,135,'Pelatihan Public Speaking & Leadership','Non-Akademik','Kemendikbud','2024-03-01','2024-06-28','Bandung','Pelatihan intensif Pelatihan Public Speaking & Leadership selama 3 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-03-04 17:00:00','2024-06-04 17:00:00'),
(102,137,'Pelatihan Public Speaking & Leadership','Non-Akademik','Kemendikbud','2024-07-01','2024-10-28','Bandung','Pelatihan intensif Pelatihan Public Speaking & Leadership selama 3 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-07-04 17:00:00','2024-10-04 17:00:00'),
(103,138,'Kelas Intensif TOEFL Preparation','Non-Akademik','ILEC Indonesia','2024-06-01','2024-08-28','Online','Pelatihan intensif Kelas Intensif TOEFL Preparation selama 2 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-06-04 17:00:00','2024-08-04 17:00:00'),
(104,140,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2024-03-01','2024-04-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2024-03-04 17:00:00','2024-04-04 17:00:00'),
(105,141,'Pelatihan Grafika Komputer & Blender 3D','Akademik','Gamelab Indonesia','2025-08-01','2025-09-28','Online','Pelatihan intensif Pelatihan Grafika Komputer & Blender 3D selama 1 bulan.',NULL,NULL,'Disetujui',NULL,NULL,NULL,'2025-08-04 17:00:00','2025-09-04 17:00:00'),
(106,96,'id camp','Akademik','Dicoding ID','2026-09-01','2026-09-02','zoom','gggg','uploads/pelatihan/2306064/sertifikat/nBRkLZfEKnbNiyzOQM0C6lgXjmWkFAhcdmRjGP9d.pdf','uploads/pelatihan/2306064/foto/MbY5AbCrYvqnCzjWTfxSC8HBWQ9J2khu8Fja7kCY.jpg','Disetujui',NULL,1,'2026-09-02 10:25:48','2026-09-02 10:07:28','2026-09-02 10:25:48');
/*!40000 ALTER TABLE `pelatihans` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `periode_akademiks`
--

DROP TABLE IF EXISTS `periode_akademiks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `periode_akademiks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tahun_akademik` varchar(20) NOT NULL,
  `semester` varchar(20) NOT NULL,
  `tanggal_buka` date NOT NULL,
  `tanggal_tutup` date NOT NULL,
  `is_aktif` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periode_akademiks`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `periode_akademiks` WRITE;
/*!40000 ALTER TABLE `periode_akademiks` DISABLE KEYS */;
INSERT INTO `periode_akademiks` VALUES
(1,'2025/2026','Genap','2026-08-01','2026-09-30',0,NULL,'2026-09-02 02:46:08'),
(2,'2025/2026','Ganjil','2026-08-05','2026-09-30',0,NULL,'2026-09-02 03:37:44'),
(3,'2024/2025','Genap','2025-08-01','2025-09-30',1,NULL,'2026-09-02 03:37:44');
/*!40000 ALTER TABLE `periode_akademiks` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES
(10,'App\\Models\\User',377,'simkip_token','741c92930dc9479ebc796e74ce5101aad1d0cfad374324c90a6c5f0f0aa8498b','[\"*\"]','2026-09-01 03:50:10',NULL,'2026-09-01 03:42:47','2026-09-01 03:50:10'),
(84,'App\\Models\\User',392,'simkip_token','0223fbcd508a0bde417eaa3b87d77c0d8ad211266a4adee8a6585a26b2e7c9fe','[\"*\"]','2026-09-02 13:25:47',NULL,'2026-09-02 12:17:33','2026-09-02 13:25:47'),
(85,'App\\Models\\User',398,'simkip_token','7f5284e89eb89b0f661a2c49af0c18d4c4ff5d8cbd003c6b4aed76dbf3391069','[\"*\"]','2026-09-02 15:45:54',NULL,'2026-09-02 13:33:02','2026-09-02 15:45:54'),
(87,'App\\Models\\User',401,'simkip_token','d9c57a570d2aeaaf49d5cdb55f118f34f98c7ceaaef0dedcac9a542308b4eeed','[\"*\"]','2026-09-02 15:52:59',NULL,'2026-09-02 15:47:21','2026-09-02 15:52:59'),
(88,'App\\Models\\User',452,'simkip_token','db53282a9fe8e6aa087a2f0e79d79b7fae6de55b2a4841a89ac2f12bfb60d638','[\"*\"]','2026-09-02 15:57:00',NULL,'2026-09-02 15:54:11','2026-09-02 15:57:00'),
(89,'App\\Models\\User',457,'simkip_token','93aac7e54fe685f11c200eba7f5b1b874608b0228cfb15e824a1f3115d0f6a6a','[\"*\"]','2026-09-02 16:15:42',NULL,'2026-09-02 15:58:33','2026-09-02 16:15:42'),
(115,'App\\Models\\User',2,'simkip_token','fcbb2d82d85a6b4fb28b5e8956d8a5d9fbd84fc69e021eadf53b722c754f24ea','[\"*\"]','2026-09-04 19:49:21',NULL,'2026-09-04 19:47:48','2026-09-04 19:49:21'),
(118,'App\\Models\\User',3,'simkip_token','7cfe2affb0eb020ed96bd0b147f8045a92d8de854c477a020f11815284da490e','[\"*\"]','2026-09-04 20:03:45',NULL,'2026-09-04 20:03:40','2026-09-04 20:03:45'),
(119,'App\\Models\\User',228,'simkip_token','aa4d99fe07ecefea4156d999f59bd057d52f6f0285e3aa46d7b873bcc5999ad3','[\"*\"]','2026-09-04 20:09:39',NULL,'2026-09-04 20:03:52','2026-09-04 20:09:39'),
(120,'App\\Models\\User',1,'simkip_token','05bfdcf343832e57d426728ef4f653801e7c58f9e1919e230125bb4d4582107d','[\"*\"]','2026-09-04 20:24:47',NULL,'2026-09-04 20:10:08','2026-09-04 20:24:47');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `prestasis`
--

DROP TABLE IF EXISTS `prestasis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestasis` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mahasiswa_id` bigint(20) unsigned NOT NULL,
  `nama_prestasi` varchar(255) NOT NULL,
  `tingkat` enum('Internasional','Nasional','Wilayah','Institusi') NOT NULL,
  `pencapaian` varchar(255) NOT NULL,
  `penyelenggara` varchar(255) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `tempat` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `link_penyelenggara` varchar(500) DEFAULT NULL,
  `file_sertifikat` varchar(255) DEFAULT NULL,
  `file_foto` varchar(255) DEFAULT NULL,
  `status` enum('Menunggu Validasi','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu Validasi',
  `catatan_admin` text DEFAULT NULL,
  `validated_by` bigint(20) unsigned DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prestasis_mahasiswa_id_foreign` (`mahasiswa_id`),
  KEY `prestasis_validated_by_foreign` (`validated_by`),
  CONSTRAINT `prestasis_mahasiswa_id_foreign` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prestasis_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestasis`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `prestasis` WRITE;
/*!40000 ALTER TABLE `prestasis` DISABLE KEYS */;
INSERT INTO `prestasis` VALUES
(30,96,'Juara 1 Lomba Web Design','Nasional','Juara 1','Kemenristekdikti','2025-05-10','2025-05-12','Jakarta',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2025-05-19 17:00:00','2025-05-14 17:00:00','2025-05-19 17:00:00'),
(64,126,'Juara 1 Lomba Web Design Nasional','Nasional','Juara 1','Kemendikbudristek','2024-05-10','2024-05-12','Jakarta',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-03-19 17:00:00','2024-04-14 17:00:00','2024-04-19 17:00:00'),
(65,126,'Finalis Lomba Cybersecurity Competition','Wilayah','Finalis','Politeknik Negeri Bandung','2024-06-10','2024-04-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-06-19 17:00:00','2024-04-14 17:00:00','2024-03-19 17:00:00'),
(66,126,'Juara 2 Hackathon ITG','Institusi','Juara 2','ITG','2024-04-10','2024-06-12','Garut',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-03-19 17:00:00','2024-04-14 17:00:00','2024-06-19 17:00:00'),
(67,129,'Best Presenter Seminar Nasional AI','Nasional','Best Presenter','UNDIP','2024-03-10','2024-04-12','Semarang',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-05-19 17:00:00','2024-03-14 17:00:00','2024-05-19 17:00:00'),
(68,126,'Juara 3 Lomba Debat Bahasa Inggris','Wilayah','Juara 3','Kanwil Dikti Jawa Barat','2024-05-10','2024-05-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-04-19 17:00:00','2024-03-14 17:00:00','2024-05-19 17:00:00'),
(69,129,'Finalis Lomba Cybersecurity Competition','Wilayah','Finalis','Politeknik Negeri Bandung','2024-05-10','2024-04-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-04-19 17:00:00','2024-05-14 17:00:00','2026-09-01 00:58:23'),
(70,132,'Best Presenter Seminar Nasional AI','Nasional','Best Presenter','UNDIP','2024-06-10','2024-06-12','Semarang',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-03-19 17:00:00','2024-06-14 17:00:00','2024-05-19 17:00:00'),
(71,135,'Juara 2 Hackathon ITG','Institusi','Juara 2','ITG','2024-04-10','2024-03-12','Garut',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-05-19 17:00:00','2024-05-14 17:00:00','2024-06-19 17:00:00'),
(72,138,'Juara 1 Lomba Web Design Nasional','Nasional','Juara 1','Kemendikbudristek','2024-03-10','2024-04-12','Jakarta',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-03-19 17:00:00','2024-06-14 17:00:00','2024-04-19 17:00:00'),
(73,141,'Juara 1 Lomba Web Design Nasional','Nasional','Juara 1','Kemendikbudristek','2025-03-10','2025-03-12','Jakarta',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2025-04-19 17:00:00','2025-04-14 17:00:00','2025-04-19 17:00:00'),
(74,144,'Juara 1 Lomba Web Design Nasional','Nasional','Juara 1','Kemendikbudristek','2025-06-10','2025-06-12','Jakarta',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2025-04-19 17:00:00','2025-05-14 17:00:00','2025-05-19 17:00:00'),
(75,147,'Juara 3 Lomba Debat Bahasa Inggris','Wilayah','Juara 3','Kanwil Dikti Jawa Barat','2025-06-10','2025-06-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2025-06-19 17:00:00','2025-03-14 17:00:00','2025-03-19 17:00:00'),
(76,150,'Juara 3 Lomba Debat Bahasa Inggris','Wilayah','Juara 3','Kanwil Dikti Jawa Barat','2025-06-10','2025-03-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2025-04-19 17:00:00','2025-05-14 17:00:00','2025-06-19 17:00:00'),
(77,153,'Juara 2 Hackathon ITG','Institusi','Juara 2','ITG','2025-06-10','2025-06-12','Garut',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2025-04-19 17:00:00','2025-05-14 17:00:00','2025-04-19 17:00:00'),
(78,156,'Finalis Lomba Cybersecurity Competition','Wilayah','Finalis','Politeknik Negeri Bandung','2026-04-10','2026-05-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2026-03-19 17:00:00','2026-05-14 17:00:00','2026-04-19 17:00:00'),
(79,159,'Juara 2 Hackathon ITG','Institusi','Juara 2','ITG','2026-03-10','2026-04-12','Garut',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2026-05-19 17:00:00','2026-03-14 17:00:00','2026-04-19 17:00:00'),
(80,162,'Finalis Lomba Cybersecurity Competition','Wilayah','Finalis','Politeknik Negeri Bandung','2026-04-10','2026-04-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2026-04-19 17:00:00','2026-04-14 17:00:00','2026-05-19 17:00:00'),
(81,165,'Juara 1 Lomba Web Design Nasional','Nasional','Juara 1','Kemendikbudristek','2026-03-10','2026-06-12','Jakarta',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2026-04-19 17:00:00','2026-06-14 17:00:00','2026-06-19 17:00:00'),
(82,168,'Juara 2 Hackathon ITG','Institusi','Juara 2','ITG','2026-05-10','2026-03-12','Garut',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2026-06-19 17:00:00','2026-05-14 17:00:00','2026-06-19 17:00:00'),
(83,171,'Juara 1 Lomba Web Design Nasional','Nasional','Juara 1','Kemendikbudristek','2027-04-10','2027-05-12','Jakarta',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2027-03-19 17:00:00','2027-04-14 17:00:00','2027-04-19 17:00:00'),
(84,174,'Juara 2 Hackathon ITG','Institusi','Juara 2','ITG','2027-03-10','2027-06-12','Garut',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2027-04-19 17:00:00','2027-05-14 17:00:00','2027-03-19 17:00:00'),
(85,177,'Juara 3 Lomba Debat Bahasa Inggris','Wilayah','Juara 3','Kanwil Dikti Jawa Barat','2027-05-10','2027-06-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2027-05-19 17:00:00','2027-06-14 17:00:00','2027-06-19 17:00:00'),
(86,180,'Finalis Lomba Cybersecurity Competition','Wilayah','Finalis','Politeknik Negeri Bandung','2027-03-10','2027-03-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2027-06-19 17:00:00','2027-05-14 17:00:00','2027-03-19 17:00:00'),
(87,183,'Juara 3 Lomba Debat Bahasa Inggris','Wilayah','Juara 3','Kanwil Dikti Jawa Barat','2027-05-10','2027-06-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2027-05-19 17:00:00','2027-03-14 17:00:00','2027-05-19 17:00:00'),
(88,186,'Finalis Lomba Cybersecurity Competition','Wilayah','Finalis','Politeknik Negeri Bandung','2028-03-10','2028-04-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2028-06-19 17:00:00','2028-05-14 17:00:00','2028-06-19 17:00:00'),
(89,189,'Juara 2 Hackathon ITG','Institusi','Juara 2','ITG','2028-05-10','2028-03-12','Garut',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2028-03-19 17:00:00','2028-03-14 17:00:00','2028-04-19 17:00:00'),
(90,192,'Juara 3 Lomba Debat Bahasa Inggris','Wilayah','Juara 3','Kanwil Dikti Jawa Barat','2028-04-10','2028-05-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2028-05-19 17:00:00','2028-03-14 17:00:00','2028-04-19 17:00:00'),
(91,195,'Juara 3 Lomba Debat Bahasa Inggris','Wilayah','Juara 3','Kanwil Dikti Jawa Barat','2028-03-10','2028-04-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2028-06-19 17:00:00','2028-06-14 17:00:00','2028-06-19 17:00:00'),
(92,198,'Juara 2 Hackathon ITG','Institusi','Juara 2','ITG','2028-03-10','2028-05-12','Garut',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2028-06-19 17:00:00','2028-06-14 17:00:00','2028-03-19 17:00:00'),
(93,126,'Best Presenter Seminar Nasional AI','Nasional','Best Presenter','UNDIP','2024-04-10','2024-05-12','Semarang',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-04-19 17:00:00','2024-05-14 17:00:00','2024-04-19 17:00:00'),
(94,129,'Juara 3 Lomba Debat Bahasa Inggris','Wilayah','Juara 3','Kanwil Dikti Jawa Barat','2024-06-10','2024-05-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-05-19 17:00:00','2024-06-14 17:00:00','2024-04-19 17:00:00'),
(95,132,'Juara 2 Hackathon ITG','Institusi','Juara 2','ITG','2024-06-10','2024-05-12','Garut',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-05-19 17:00:00','2024-06-14 17:00:00','2024-05-19 17:00:00'),
(96,138,'Juara 3 Lomba Debat Bahasa Inggris','Wilayah','Juara 3','Kanwil Dikti Jawa Barat','2024-06-10','2024-04-12','Bandung',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2024-04-19 17:00:00','2024-04-14 17:00:00','2024-04-19 17:00:00'),
(97,141,'Juara 2 Hackathon ITG','Institusi','Juara 2','ITG','2025-03-10','2025-03-12','Garut',NULL,NULL,NULL,NULL,'Disetujui',NULL,NULL,'2025-05-19 17:00:00','2025-06-14 17:00:00','2025-06-19 17:00:00'),
(98,96,'Juara 1 lomba marah marah','Wilayah','Juara 1','PT marah jaya','2025-03-31','2025-04-05','ITG',NULL,'https://www.instagram.com/marahfest2026/','uploads/prestasi/2306064/sertifikat/TfyZyZaSK6oaEncMyO94I0xp2WOIrzrIbqQkUo2T.pdf','uploads/prestasi/2306064/foto/0fXcexVppFC5Kv4K0kb9LilyVN2cUWsHN48KXDKN.jpg','Disetujui',NULL,1,'2026-09-02 06:02:21','2026-09-02 04:40:01','2026-09-02 06:02:21');
/*!40000 ALTER TABLE `prestasis` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `prodis`
--

DROP TABLE IF EXISTS `prodis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `prodis` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(20) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `is_aktif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prodis_kode_unique` (`kode`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prodis`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `prodis` WRITE;
/*!40000 ALTER TABLE `prodis` DISABLE KEYS */;
INSERT INTO `prodis` VALUES
(6,'06','Teknik Informatika',1,'2026-09-01 00:49:12','2026-09-01 00:49:12'),
(7,'07','Sistem Informasi',1,'2026-09-01 00:49:12','2026-09-01 00:49:12'),
(8,'03','Teknik Industri',1,'2026-09-01 00:49:12','2026-09-01 00:49:12'),
(9,'11','Teknik Sipil',1,'2026-09-01 00:49:12','2026-09-01 00:49:12'),
(10,'24','Arsitektur',1,'2026-09-01 00:49:12','2026-09-01 00:49:12');
/*!40000 ALTER TABLE `prodis` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES
('0fTNCYOpc40IZguzz2SeBHBbrej4qsWBEIYUj0HR',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJrdlhXakdUOHVCQnVROWpHNWJ4VkFudldTbEhaekp5RnlpdnNvQ0dKIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570307),
('3cHOUztOyVRNmpoEfcbTHwBE9wIXNiJ8ZSWK9ocj',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJDMjlpMlRmb2p1TGFNd0ZIQmNXUzJ6VVU3dFQ0dnRhbnFteWZBNnZqIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570213),
('3hazSAaIFfMVazQBKnWHtax69kiLUiKJzOixS3zf',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJrbWNQZ1JyZkF3T0ZYU0IxUkY0RklGNDNFVTVqV1A2aWFSRlNEd1pOIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570304),
('4k1ldSuCfOBzSdZlbAkZ4wFhooy3fAEwqwkVMlZs',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIyZGs5dGVUQjNyS3YxeXZ3WEpFaXV1Rk1QTm5vS2NMNmR4WlJjNXY0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC9wcm9maWxcLzIyOFwvTk83ZVVweDg3SWpBV2lqbVY2NlNvWmY2dUN3akpVSmUxcUdxbWVrRS5qcGciLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1788571762),
('4kGMPobvggJlBFwoFOLP9rHBdpUq5duW80RtFPf6',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJ3Y3g0czI2bVo1NHRYczNqS1lQRDNZaVlWR2RldDhsQzVUdktKbnk3IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566574),
('6ZbvRh0qNgyaZI1e4bECTR2Eg1oZ98tNc0ux8fZK',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJoOVltS2RkeW1yNkppWXRsVHVmeTRaRUtEczVJSFpiemRjUG9WMFpYIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788577231),
('7mCyxOvBQZ5dpjGYX9UScfd5rZ5izguCn05Thh4D',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJVZnBQYVRvbG5YanZxTWRyVzR0Uk5kOEZPbm9NWFE1TGVMR0NLem5TIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC9kb2t1bWVuXC9kdW1teV9iZWxhbmVnYXJhLnBkZiIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570918),
('8fFxMnHQLEe9pCJkbgLLfpGDFB3FAdgEWPA2R92r',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI0VFgxd0xFR0FHbmJpSTV0RWlZb1VkZjlnSzB2ak1qSnlaMHp6c1RXIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566527),
('a7jyIhToyodWxlEWqtwIVujgsFwpRrpQcUMf9ZSh',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJUVUY3RW5OQm1lbjduSkxjS0k4MVdhVlBUN2daUk9MWkViTXVZVTl4IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566636),
('ACbS8K3ODtl1xq2gVV5EiLKtdGb1o83iePV5ljr6',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJENm1oMTlkSTBSckpCeVFaaEJPUGhrNmpnbmR1Y01QQjRwQVJ5Sk4wIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570171),
('aYKagjBLNdsvTJHfv8SbH3f7ytVyoQsHrQKzNpG3',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiI2MkRJVVV4aDZqRVI0U2xsM3NRT3VZeTFVd1lFdXpsRWw4cWYzZmgwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC9kb2t1bWVuXC9kdW1teV9iZWxhbmVnYXJhLnBkZiIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788569061),
('B1JpQx7EsjmYJXRbrsmIzmiin2wdzbExoet7aM9s',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJPTUJ2d29jMDBTZFl0MkJtOE5WSUZlZ1JHSmdYRWVOQll4TU1Oa3JaIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570160),
('b7itG39l3SJrVJvUUmbhziqul367gKkBZDjNrDHa',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJ4aDNvSUhTQWRtbFBTdlZvMFZjaVB6YmRLUTZyMXZJT0JVczJTQng1IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570178),
('bKd07X15VThjCoKId2JIp2RWNX2lqFF91kGx0ylG',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI4TVEwekU2VnNjWUZGVTJnczN6d2Z5ajlqWmZFcWdRVU1uazYxRHE0IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788567077),
('BlwR53d3sf3h1Q9Njp1wtAxRfXNsrcBnmqtcMMp2',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI3d3dSVHJoRWR4dlVGc2hOaEJTMEU0d2V6QjZOdVZLVmxGS0lsdXpZIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788567045),
('Bof8tGdBu0SOBa2jjoyRDg50tytRrykGudUahHa9',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI4ZE1rcExlY3ROMFpkbWI2OExaWEZxaUR3SG9RU1lpUDd4WG5tcjJwIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566480),
('BU6GlqVcqlvkKtsFskxIJfxtF83Kbk5uaBc6RWiQ',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI1eTVFbzNiV1FhNmdCOTNKMzY1a29kY3B5ejlBWEtiaGEycll0QmhiIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC9wcm9maWxcLzIyOFwvTk83ZVVweDg3SWpBV2lqbVY2NlNvWmY2dUN3akpVSmUxcUdxbWVrRS5qcGciLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1788572743),
('bWtAuP8ZdzR0jx1GCH1zteuqi85lCrBP7k7gaPNa',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJZdkM4NU9xZmJlRzRPWlBTSm1Wc0VxdEVCeWg1Nk5lZ1F4QnBtckkyIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788567104),
('bxv8AfwSoXWt0zdPpct9d2CQwNueM2yF5bv0uYb1',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiIzV2IyWVZ1ZUdLVGowdUY5WmdTMFNOMnVNUXhZMDZyN0RaaEhJa0ZEIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC9wcm9maWxcLzIyOFwvTk83ZVVweDg3SWpBV2lqbVY2NlNvWmY2dUN3akpVSmUxcUdxbWVrRS5qcGciLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1788571619),
('bZ86jT9YE7qe0J6FTGzV2YnfqA2KlAULGFHwsEcE',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJxbnNOWWNydWlYNFNiRzBCZ0FUOHQ0QmN5YjJJWUNSVnYwZHBTMXhCIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC8ud2VsbC1rbm93blwvYXBwc3BlY2lmaWNcL2NvbS5jaHJvbWUuZGV2dG9vbHMuanNvbiIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788567053),
('ccTz2bduTOhlzO6RCUNlY3A21y4xDPTYLrKzaxSd',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJwWWh5RnU3RXBacG9jZU1Ic2tBWmZwRVF4cFMxZjF0a2o1WGZGb3FKIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566489),
('CczLqk9BBRJ7K21yBItAMDlSQJYjLceb9PThLrAm',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJCY3V3a1BXaVE0c3lLbGNndkdKbUFENXVMeE14ZVlkRHJUQWF6UHBjIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566476),
('cGCuwas2GwDaDuXYpVeMQvaWJut24RevWccQPhyi',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJpdlp6ajJ6R1hHbzdxZTkzZUt2MmJCQnVqOFZYYXhoSHVkcnBLdng3IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570304),
('csuxrGLleqvrSfVyru4MqO961nhG51zaUPEx4ieh',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJ6cXR2TWx0SGJsdG1DeFlHMWhoWm5VcnlVTGY0MlFTS3dhTVZKUjRRIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788577234),
('cU0rdHAYcrIMAvDpKFPoWvkIUDlw2oeKXMXi0Umw',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJHM25Gb1JQUW53ZWE4T1dHaldaNDRnQk9wZ1hVczNvTmhiem01bjJGIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570038),
('dVNLvs22f3vqgZqAGpyHOW3LvWhcPoOGZA3d3wh9',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJVYTJua2gwb2JOQXBXTFQxRzFHUWVSZEZXNDcwSTJlS2l2Yng1VThTIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570084),
('ecwLsExK8HYxEPXMS40BD2aZLo4ODa2JLqlgEJdZ',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIxenNkR2dnbk93bG8zQXdXUEVtOEQ0UmZ3am9XT29rWWpiTTl1dnFYIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC9wcm9maWxcLzIyOFwvTk83ZVVweDg3SWpBV2lqbVY2NlNvWmY2dUN3akpVSmUxcUdxbWVrRS5qcGciLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1788572741),
('EH9RKy5aWP3zZhauZ3a9WinKf0KwoTPmOj1sfe9y',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJDdmxBOU5Ddkw5MDRrU0xMWkFwbXBVVWtzVTV4MFZLaDIzbVJSbjdnIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566595),
('EiqKhb2ghCZ5vFb0PQWIHiz72HxOHHue2QPRPZWH',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJ0Z2tMR2NLQXVETEY0MEFHZjdTUGg4RzBXUGNBN1pvTmFjWnJKR2FLIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570212),
('eMrmbZXo5fczUzee71MKjXJB0CIA1XT8Hak6PmCu',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJtdlRTcU5yaTFNYWg2SEV1eDVuN01Mb3NCc1BhVUo4Z052T3lWOWNoIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570238),
('epXv4elh2CNtWlZP0NNHPsCBzVX2xYeV1EieBG0M',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJvc29UMGhTZ2lVUFhOclhuck54eEwyOWZrUmVQZHJVZm0yZlYxdG1mIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC9raHNfc2VtXzFfMjAyNjA2MDAxLnBkZiIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788569099),
('EwQmqRdYYzEbqucggE1AvhVf16tzUUfWzSh23qrK',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJkUG9DNnNEVDZ1dEg0a0NXQWY0UVNGelQ1VFBUZnFVQTlRWXIyQWpYIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570083),
('f1FdFWH5i39BLotc7qIXkTkijLQBDMa9X557YIIO',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJhQ253cHYwNlhCM0FBQllwQmM3NnlkVTM5UzZaYkl1SUVGaUhxMWNiIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC9kb2t1bWVuXC9kdW1teV9iZWxhbmVnYXJhLnBkZiIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788569075),
('FlDhr2Hy7PNqg2UxUNkusrMTbPHNYLWTiGHpFywD',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJYWnpHeUlEOGg2UXVHWU1sTlQ0VVpJWDYyWngzNzlXS2tXZWlDYkVBIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570213),
('FPlCD7z58GAtP6U9LkBwlvSC2ZmLNVr5H5lKBik7',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJaelUxd3dWNkJZWklyS0dsUGtLeHdJUXdtQ0VTUTljeldqbUVsdzhWIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570264),
('fV4CaqfD08MVCK3o2W30f2ZvRUaxCumbmXZOlYof',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJxbDFDRDlRM1BjU1drdTUyZzlqSWdBNWF3VXNMc09Pa1RJY3NMaVFkIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566485),
('g7KGtThUDi9WwwDPRnozAnlXp40w9qxIzWUGAshe',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJlcHdrdkEzc3VlOHg4ZU1OUFlBdkp6Z1FqZkxkMlpoYlB5d0Yyb0tPIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570172),
('GCsWJbpOIChAA8YrwKJEB9KbZjwKsGcudO8CHSjR',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJrSjBqa0dwUjBtZTluVjZidndDVTdwQzY5V2ZhYzM4aFFhWTRhUWx0IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566608),
('gdGGsgMN0leU1yWzk1ulrSTunhYRHTzKE9H8fVsD',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIyVFNwWXJIOVhENm5kN3lYcWFTZFViZWZWUEZSS1lxMGRWUTZhVTFwIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570169),
('geaX0ynfqnimeuHzv0xCEOjDmlgy9fmOp9BHGN9q',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJFY0s1c3JIRjI2dGlFVGZIeXRwZG15V1VTMjVDNkpURFZHb1RRWU5xIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788567102),
('gYfod5iqLoxTyTf7NVah2EIGEte3ZMsfPtWQRNtT',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJSUTc3QmxQV0F5R0VoNFR3ZzRMOWJteVpVTk1YUnNGUDdYSklhRGptIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570898),
('HBn3SDqJFHPW6T2QBjBEsAXUJBbPLJWqX1CFmGhf',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJ2TXVDMmpubERFNnRlY3BBOVZXdGdNZ0tJWGhkQnJwWXVXYTY0QkN2IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570172),
('hhzdWMt50B07nPvGJJWDzzZfsOm7IM639WjGd7uk',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJjWm5xblhqQUVnNGhuMnM2WEVrbEYxUUdNRUNWWXZxSU5UcTRCVm5MIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566628),
('hp4uSxy7qL2XqqB3qsQGB285zBEX7r5jS7nu5Xtt',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJkNnRpNUNjSmdkMUZ1QmdMeURSZzJEd3ZYcmFvcFVGZENtSzZYUFFDIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570855),
('hp4WycPCY4tEJTKCctOhKYzO1VFoPbQm3To7Lgjs',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJLMkNObTBjSDBrYXJxb3FLSnlHSFJ5MXVERG53TWZsbmpoZ3Y0YnA0IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570284),
('Hp6QR2O8tjNuTINrMxJT0TpKuf7IVYt4GNWHARrB',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJYYTBpclFuZ3RUaVY2Q0pwVFA5OXB0UHlyelQ3Rzh1SU9Ia1J6REQ5IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566591),
('I59riZFfQOPCQScSURPRl9ReWpTGLcgPHDYEk7lT',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJwT1J1dmZnS09jVmoyVGNTMXNuVzJzVGk4dEhydmFtelEyRGtySHUyIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788577234),
('ijBEeWtJS4RC7wbwzZIc9wTiDKxGTRV9mSpygiEE',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJhVUpxT3ZGZXZ5N1ZVVW8zenBPTmx2N2tJQnhWSjBick1TMGw0YnhFIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570132),
('ikjQS9Ul8cgEfJGFndm3HdXXqkyxzkc1HZCzmGTk',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJKbUFnYlRaR3E3Y1VUZEJEblI1YThiSDZzczNjNmh3bUIzcWx6SDIxIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570239),
('iLztCKRTwdSdirxvtvthuUYtZcZyZbtraCzVgJxR',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJ3aG5NOXlteEc0RnZhcFVmbnUzYlpyQk9DWDJ2QnlXdFhoSWFGZ2d2IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788567104),
('InenmksWHzA9nQgtqKhXNALlLcH4Tjm307j86Jam',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJ2UFNwa3BwcE9VejBmYnZXME9DOEc2bXlUN2pud2ZZaGlVMVUwRXRUIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566498),
('iTjudola1UwJhVdGrZXM8sRVArZqmQfFlmVxdF6a',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI0dTNKTnRORDlnakU3UnlHT0FoNjNNN2h3VUk0TDNuWnhSSnlBbGFrIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788577093),
('J8T6uemCpzetHyRSo1YvCZyHBsI7HAIIm3aSQRX3',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJpQVowZzNiWTdKbXNaSUxjRFBhSE5jd1N2ZHBWM0xlcUJhNUF4eWdJIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566581),
('JaEzdeaJgbx3ZHaan0D39gpe73BCzRQvz6RIeUaD',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJXZDlSOUhNWk9uSHNQbTF2OWJvaDBWa0M0d0YwdGdBWHdnNHU2SG45IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566615),
('JD07pOdfao6j7QxXuxcaKISyQustxnj2xpELGExK',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIxNlBxZEJDdGZBaWl5R0syOVluOHRoRWxsNGtHSENiaFR1M3didU93IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570324),
('jUg3jFMW90thpfV2FP6l54TM89G36OtLpo0x6jdX',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJlOXQ5SU45NGM1aEY4VW81U0l4c0dWRUNiU3dRRWdRTEdZbnBlR2ExIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788569498),
('JyRz1A8tEzOWfKKfKIjvaekHpFfPyWtGUIpzTlql',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJNTVZCcjJJTVJqZ0FhZ3BWMEI4WVFjN3VYODBQWTRpd0h5cm9sQ2FoIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC9wcm9maWxcLzIyOFwvTk83ZVVweDg3SWpBV2lqbVY2NlNvWmY2dUN3akpVSmUxcUdxbWVrRS5qcGciLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1788577432),
('k7IVPgANle1uDatsQGlQOb9GSdo9ex3K1pnNhaTU',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJpSUZxdXptd05YTk1XVms4T1JaY1cyNjlUV0tLWUpXS2NzWjRTSlZ2IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570284),
('KJrMAmwWS62rjSsd0bK2lmvVtEuOMptggg7KpWI4',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiIzMmpIMHhBTHFXWnhpVTQ4Ymh4SjFLWmxiZTFzQ0VSdWpxdVhTb2xQIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570097),
('kv0yj89MhcX497uABWn1whBzL8zwfplqLOArVa4t',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJBQlJjTE1JSlk3RmpkRHlCVDJoaFZaVVpNWHh2WFVlbEhXclBWYTdGIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566493),
('lkN4w52vCbBORtN3obRiyiMxftjrkq0glUxtmlPr',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJnY1U4S0NWWlNDTUs2SWlqclNjZjJ3eFlwWmdyVE9XSUZpYW96ZzNSIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788577406),
('mC6SW1292rYTZy6cpKVu8fB6yjl0O5o5kzGWAK9k',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJXQkVrZ2RuaERZaUgydEJSbTBLZVNmdjQwMVpaUURmSThHQkp6VE1KIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788577231),
('mdaXJvlXKemKKHcaXr7kBUlghg0bWd9uiP16XT9z',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI5V1dLZGx0b3p2SHc1MjVkbURhcEc5VTE2cWhWYk9ianhwR0RmeUk1IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570035),
('mI84mQHVD1RJI2AT1kSa7iMWUCrbCIyCbwoFKLAG',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI4OGFwdm9oZUxBWUFJcm1UZFhkWk13Tk96c3JXcUx1THJJdFZIYjdSIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788577407),
('mSD87nxlrNTZ9Zxn3MEnqglALIh807mBM2kIlw9Q',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJWWlU5enhJMUp2dmdMdnpXMjJLMXhkRUJ6ejJrT0ZabWNkNTdrdnRtIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570240),
('NK7FyxfdkI9OU8Dn3bvx1Xa1EuZJUdY1A1jie5So',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJGMlJRYXlTc1VORGtkYUN2M2NxOFNNeG45SFVvazNZZE1DUWlKa2VXIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570247),
('NLqVXmundXPhLZ6brcc1YAgVsYhcfaLkaTjkksAG',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIxcjVnN3paTjF0c0N5UldsOXN6T0hEZEk3RlpUeTV3bjRpcXlVSDhLIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570264),
('nn2A7hwYg554DZffZSzNQDtzLIFvfipbLrNbq6tb',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiIxZ1FsSzA4NXF1SzRORFd5dFd2RkhIUVozYm12V1pSSVJkWm5Ob0pWIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570038),
('nWPZ2JNIZNL2AIJD5pdH9m6nNGzOvyPUSd2EIvp1',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiIwamJVQ0d4SVNjUlpxYWVuYUpEeWhjSllnRGxRaFN3QWg4THhnbnJtIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570211),
('O0Xiikqprca3aulw1iFnZ3t6URa5JtF7ckkujDtl',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJreWpEU056bjlUR2lFenJjOG1FU2hkeVFCM0Q0U1BmbUtkcUxTSXVIIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566567),
('oeLEFPWyB9hUpTmc1GlrwJkOLBCViEY7VNjgpQ7a',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIyRXFORkxiNkFrdGVYWXFYMXVJWkdlZUJ5MTRjYVVSekVVV2o3NXRnIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566618),
('OiHgLCSrCI15g6E3QDGfKKsneOluMZWEcI3BPFke',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJuOFZlQkI1Z1pTQnJiUldPNUJXUW1ZYllxQm1BSWVkWnhUQnRZaWlyIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570249),
('okmwxEOArpWc584JMzSMdIaEWyjJWL1WXj20zcAU',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJwVm5OUjdlcDhuUEU0RzlETHM2QWl3TlE3NmxCdmM4SFJoNEVyaGF4IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788569628),
('Op8FGWlwdBjASRaOY7ctGY89UJNc4XwlObGfJvQk',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJWclNjWHk2Y05DMzUybm5saVhGcTZYbUR3a1k4WllNUFhYa0VQaEFQIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788569644),
('P04R7Ywc3pxJTFl8aAOCsygx9HkKcLHzWe4QPmFU',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJjUWtJc2pDZ2lPTmVGUVE0NWJWNlp5WHdlU2dHSUdVbFVZSHFHQ1h0IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570035),
('pljWTJ5N3AhAepSTE6h3TGRmywUTl9djqroxq4F7',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJIQzR1dDNyYmF3c3p3ZWdSUmJOZ0xDc3drREE4b3JqeGZYWjZINnptIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566578),
('pWPJ3aJyDxHVbK54Ksb1OqOfxJ2s2PJV3SRs25bY',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJpWFlHSmluTGxrNTRnZlRLc0ZHaWxkV3ZSRGUzb3lhNUxWTjFweWdiIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570132),
('PXiq4iBZgmQjg35AjaTM19przKg9oyEdWTQUvQXO',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJhUGR3SFBUaG1IY1RsaFBBRVg5c1dNdkdZa3c3aGhqSFdOQmRSWnMwIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566611),
('QfK2i0KOoxY476An9Cv2X7HUB2zPGZEI8GppUy7t',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiI1SlU1QlFqSEJEdE9FZklSWW5ZZURsTko2eW1EY0dLOTdkSEJ2RlFhIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570083),
('QmJynbyCZ4KZIqN7Y17J1AjJw6sVxfiAz3PtsQui',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJtRENpMHBIdGxkbkhmWG81SmdEVHVwdDl6WktVbUhJVHJYejdNV2RmIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566539),
('qRLS5flwdA1HoalrAEQClbUN6wAnMJUIEjQzubhE',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJuNXYzeVQ4c0NQeTQyVmdVRFVTam9XdEF0MzFFaWJXelBLMk9DUEZwIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570169),
('rmn6nzBv0TGzfgYrGVWJaV7hsQA0qdcyl340TL2X',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJzM3ZuTGNpQnFKYWVha3RObWRXNTJHek15NjhKVHdnR0FOeUZLYU5yIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566605),
('RuSqqGO5ioj4EOI4tZOed0SzNJWGvX4IV6Ed3l8g',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI0OXB1alJCY0tXRWdsY3NmeGVJTlZzSEd3Nlh1N3h3ckQ5QkxabWF5IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570178),
('s9LAKh7kbeyhgOffOcuC8czIH4sghdGMPLUrq7Vm',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJuTXFjVmJ0MVpBM1NvMnU1bkltNXBHeEw5QWUyOTJPTEwxY0l6TVpkIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570240),
('SBpNguRItGbJWUfTGcrxtRIMlLVaQLU4VALs5oEn',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI0d1RSaHprZVVHT2JnclYweGlkVUVDQzdUOHNBVHNzZHdGcWN3TjdyIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566552),
('seL9GZGb42qaVEtAZeuypoyF564io08FV9XzPK7s',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIzVEFPN0ZST1FHdnVjZlcwWWNuRWVtRHJBYzdybmp5ckt6S3lWbVM1IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570324),
('SiVx4mhq6iKZXnGwj6IMZlEBZ6dvQj83RrTCyTL6',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJXQjFVVE8waHk3T2dIT0pwUzQwTFJvdG53a2lDNWFlcWZBOTFTYzhKIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566624),
('sJ5t527tqvo94ZawBkKmGbUKNd7j7qqabfaq3MzC',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJycFN4QjJTNzFaYzhDYkxYV0tTTkZacXBMbGxYSVdpYVZiN0dMTGswIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788569644),
('SkbQTQH4smizoUAg6qm3MlABbpeNKhCc9Uv3s6Va',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJHOTlhNE03aFZqWVFZVlZvakdoTE12bWdMeWtVQjVpcU9tZ1ZSdXpUIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566570),
('smYZiR5xuActoGRpkt5Kan2ufQsnTP5xBbxmQ8CT',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJqdlB2YWlWV2FteHcxNHNmWm55MnhYUGQwR1ZqU05tYWxPc1RVRG93IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570171),
('SqM7ABiApTjwxpX22HJCTqqqXTQLhTpObK7I2D0T',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJrV040dU5SUGZHNXdQZGdwQ0doOHFNeWNTdll2VTVLWUU3VUY1cFdQIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788569628),
('StlLMZV5d6deGE10Us5A0EKqdpZT2n0rWb0rhxL0',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJ0TWtvdEdxMGJjZkhQYUZST1hMVnpUSDdrVkt3M0ZDYkZwNElWd1paIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570856),
('Su9fbD1wGmDxXxOWHpkF8aiERQEiE4Q7QIObnbLh',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJxamxvaXRBTkNGckVzb0lUTWsyWlN4VEpIRml2WXd4SG1kV09CMGVrIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566597),
('szqwtnBPNnSEfaACMH4h8sl2TVormkyMIJjs9PXa',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJsVXdoNGlGWG1FSDVhQzd3TXF2dGo2ZTRJeExFdlViWUJLSkg0dGZZIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566621),
('TdYu8pkA06CfzS7pxLuYVJ2X96o5AB9BWthQVfOg',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJ4ZFdCdndjUFBISkI1Z0w5Mm9hV0tGSWtRbmk0WW9KcFduWlhpcHk0IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566543),
('TMppBuCKnuCRQdAcidT42BifgoUiF8gYdVVpC6NI',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJndFRvYTJGdlpsNldZRDgweW81T3BnZU40c1EybjU1ajVxdVhhMkkxIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788569498),
('toEvqfzyhBv2iPnWEgkVILahNqQ50vlwN73bztIm',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJhRXRaRUJzRHZqTlpqTnBwQmZlRkYzbUVBenFYQkZNQm9kUTcxZUl0IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788567077),
('u2qtgZd6atXBJE9Pg8qTVBE0my8PJTc6vyUjkIak',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJiYlJVcW9BVXZNMVpwUjVRcG04aFFmdmRORmR4bG9zbzBYbVlqMnFSIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788567102),
('uqfCLoZLnIQ0FLCE1G1pk2rOEurYLG2oaM8zVjHk',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJqSWNYQnBvNkVpTm1kYTIwTVF2eTJFVDZQVHp4ZzFHaXo4SmpTSkRCIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566559),
('VMd1z5z1mJRcPvilMpu1mE3AMQJVPvscDh2CYneV',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiI4MHVRTks2SFlmU3RaNWhwZUFRaTR5aVpyWThBMFV2dTBwWk5FUG1CIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC9wcm9maWxcLzIyOFwvTk83ZVVweDg3SWpBV2lqbVY2NlNvWmY2dUN3akpVSmUxcUdxbWVrRS5qcGciLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1788572577),
('W0r8qywBalS7hCV4t4L0CiWlrO8dY7C1N3mcou2k',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJwNUtZT2N3S0hOUnF1aGlZSE9FMm9CM1JUcUdEZnY5clhKM0FncDJPIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566633),
('wbINPDVPLGHbfmKk5kuIq3mc1N2U961nBl0JLAx6',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJZWnVveFgwYng3eko5ZmZLN0lqSVp1U2psZTRVbGVSN1g1TGtqUDl2IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570238),
('WD79X6UYBT9NGw5YoZI5UloghDa3ByrhdMRdiFcL',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJGYTFpY2NkelhpZFdNZHppajBLZVlVTFFxcWF1YVFzODBFak1TRU1RIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC91cGxvYWRzXC9vcmdhbmlzYXNpXC8yMzA2MDY0XC9mb3RvXC95bkZWWENWYWNZZFdUVEFYMHJ2NzVhRHp2WGpRSk5kOUhsenE0VzBuLmpwZyIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788569111),
('wKJNKEjEioI72T0t7s8DSubwZGOWUoXmeIOmoaGX',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJua2FrTTJzTzJjc0lkc1IyeGpPTG5CZG9JZE5PNUt1Y3ZxRkxUTDRwIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566547),
('wQBG1s2VY1lNdebnxeJjJGtZgEutvodfgv9Zzy6y',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIyVkttNmtiNTJxYnNpWk1iV3U4SE1CNkpPMGJRQUhPMUdCVzZ4emNhIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788577811),
('wXUzFfq8EKZk7KvmW8syiNN1klnIklyb7f49eqPL',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJNQUFkQlpaMDVqMzR1dHJwcU5HbndENWY1eEFsaFJhQ3JSTU1YNFg3IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570306),
('xJnoJAnphcvDQj81MGx7PX5CehKSEbNL6efkQoKZ',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIxbU1zaGVQQWE3M3F6ZktUSnZNZHhmU045RHdqWUNuWFg5ZTAxZ3dXIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788577812),
('xpQO8fupkg3fLi82X4POeGxIu13tzsfwV7GCJm2a',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJXMUpBcDJFcHpERHlJak1EanFYa1hZZEdBNXY1U0lERVlWdFQyYnRvIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788567045),
('XPVztib6DfcYh5kyXgzargqQTekCm61AU5YKzTNb',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJmY2h4TG1XTTNhVW13N2ZKNzlXSjB3Z3R3YUNBUVR5OU1YREVHaU8yIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788570233),
('yis0rK5WrOVPvNbZ2OkkjbS9FdP8cyWtjgG6KDrR',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJraWtwSTFXUVhlQXRrT2I4dDBHQ28wSDZ2NThRNmJHQUhrVUtJSlpyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9zdG9yYWdlXC91cGxvYWRzXC9vcmdhbmlzYXNpXC8yMzA2MDY0XC9za1wvemdmcWZ4WjRvVUwwNTJxNUp4TFhKUGJ6UFY1Z1ZlUmlSMlJ2ak5TcC5qcGciLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1788569111),
('YU2jf1fRZizJXzWt2WcgbemomqdcQNI7ZFUCOs0N',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJhMlFIR0NjVXVWWVVrOHE3VnlHREdRM3BaVzdwMWpWVkVCNFl4WU53IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC8ud2VsbC1rbm93blwvYXBwc3BlY2lmaWNcL2NvbS5jaHJvbWUuZGV2dG9vbHMuanNvbiIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788578443),
('YV0vstVX1T3XYn3NvFEJq2YjgEmt9h6nP8WKSWf1',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJjalN3aXhUUEQxbWpQZUlyYVVGZHJiRjVLMUpVaUZEWEVyUGlhVktMIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788577093),
('zZSzJPpK5TybVMK7fQ6HYe0MK03CO5PYDt5hwMUk',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJqTzlTRGJ4Y0hxNWFSMmpFbDdMcDlUZUZBcXduVURYbU03VXhjMjVLIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1788566601);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `surat_peringatans`
--

DROP TABLE IF EXISTS `surat_peringatans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `surat_peringatans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mahasiswa_id` bigint(20) unsigned NOT NULL,
  `nomor_surat` varchar(255) DEFAULT NULL,
  `level` enum('SP1','SP2','SP3') NOT NULL,
  `jenis_pelanggaran` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `tanggal_terbit` date NOT NULL,
  `batas_evaluasi` date DEFAULT NULL,
  `status` enum('Aktif','Masa Tenggang','Pemberhentian','Selesai') NOT NULL DEFAULT 'Aktif',
  `diterbitkan_oleh` bigint(20) unsigned NOT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `surat_peringatans_nomor_surat_unique` (`nomor_surat`),
  KEY `surat_peringatans_mahasiswa_id_foreign` (`mahasiswa_id`),
  KEY `surat_peringatans_diterbitkan_oleh_foreign` (`diterbitkan_oleh`),
  CONSTRAINT `surat_peringatans_diterbitkan_oleh_foreign` FOREIGN KEY (`diterbitkan_oleh`) REFERENCES `users` (`id`),
  CONSTRAINT `surat_peringatans_mahasiswa_id_foreign` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surat_peringatans`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `surat_peringatans` WRITE;
/*!40000 ALTER TABLE `surat_peringatans` DISABLE KEYS */;
INSERT INTO `surat_peringatans` VALUES
(7,96,'001/SP/SIMKIP/2025','SP1','Akademik','IPK Semester 3 turun di bawah 3.00 (2.90).','2025-02-20','2025-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan pada Semester 4.','2025-02-19 17:00:00','2025-08-19 17:00:00'),
(8,96,'050/SP2/SIMKIP/2025','SP2','Non-Akademik','Melanggar kode etik asrama (terlambat pulang 3x).','2025-11-15','2026-01-31','Selesai',1,'Selesai menjalani sanksi pembinaan dan tidak mengulangi kesalahan.','2025-11-14 17:00:00','2026-01-30 17:00:00'),
(15,125,'015/SP/KIP-K/ITG/IX/2026','SP1','Akademik','idk mengikuti perkuliahan','2026-09-01',NULL,'Aktif',1,NULL,'2026-09-01 00:29:11','2026-09-01 00:29:11'),
(16,127,'005/SP1/SIMKIP/2024','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2024-02-20','2024-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2024-02-19 17:00:00','2024-08-19 17:00:00'),
(19,130,'130/SP1/SIMKIP/2024','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2024-02-20','2024-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2024-02-19 17:00:00','2024-08-19 17:00:00'),
(20,133,'133/SP1/SIMKIP/2024','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2024-02-20','2024-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2024-02-19 17:00:00','2024-08-19 17:00:00'),
(21,136,'136/SP1/SIMKIP/2024','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2024-02-20','2024-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2024-02-19 17:00:00','2024-08-19 17:00:00'),
(22,139,'139/SP1/SIMKIP/2024','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2024-02-20','2024-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2024-02-19 17:00:00','2024-08-19 17:00:00'),
(23,142,'142/SP1/SIMKIP/2025','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2025-02-20','2025-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2025-02-19 17:00:00','2025-08-19 17:00:00'),
(24,145,'145/SP1/SIMKIP/2025','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2025-02-20','2025-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2025-02-19 17:00:00','2025-08-19 17:00:00'),
(25,148,'148/SP1/SIMKIP/2025','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2025-02-20','2025-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2025-02-19 17:00:00','2025-08-19 17:00:00'),
(26,151,'151/SP1/SIMKIP/2025','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2025-02-20','2025-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2025-02-19 17:00:00','2025-08-19 17:00:00'),
(27,154,'154/SP1/SIMKIP/2025','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2025-02-20','2025-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2025-02-19 17:00:00','2025-08-19 17:00:00'),
(28,157,'157/SP1/SIMKIP/2026','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2026-02-20','2026-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2026-02-19 17:00:00','2026-08-19 17:00:00'),
(29,160,'160/SP1/SIMKIP/2026','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2026-02-20','2026-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2026-02-19 17:00:00','2026-08-19 17:00:00'),
(30,163,'163/SP1/SIMKIP/2026','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2026-02-20','2026-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2026-02-19 17:00:00','2026-08-19 17:00:00'),
(31,166,'166/SP1/SIMKIP/2026','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2026-02-20','2026-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2026-02-19 17:00:00','2026-08-19 17:00:00'),
(32,169,'169/SP1/SIMKIP/2026','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2026-02-20','2026-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2026-02-19 17:00:00','2026-08-19 17:00:00'),
(33,172,'172/SP1/SIMKIP/2027','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2027-02-20','2027-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2027-02-19 17:00:00','2027-08-19 17:00:00'),
(34,175,'175/SP1/SIMKIP/2027','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2027-02-20','2027-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2027-02-19 17:00:00','2027-08-19 17:00:00'),
(35,178,'178/SP1/SIMKIP/2027','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2027-02-20','2027-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2027-02-19 17:00:00','2027-08-19 17:00:00'),
(36,181,'181/SP1/SIMKIP/2027','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2027-02-20','2027-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2027-02-19 17:00:00','2027-08-19 17:00:00'),
(37,184,'184/SP1/SIMKIP/2027','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2027-02-20','2027-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2027-02-19 17:00:00','2027-08-19 17:00:00'),
(38,187,'187/SP1/SIMKIP/2028','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2028-02-20','2028-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2028-02-19 17:00:00','2028-08-19 17:00:00'),
(39,190,'190/SP1/SIMKIP/2028','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2028-02-20','2028-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2028-02-19 17:00:00','2028-08-19 17:00:00'),
(40,193,'193/SP1/SIMKIP/2028','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2028-02-20','2028-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2028-02-19 17:00:00','2028-08-19 17:00:00'),
(41,196,'196/SP1/SIMKIP/2028','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2028-02-20','2028-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2028-02-19 17:00:00','2028-08-19 17:00:00'),
(42,199,'199/SP1/SIMKIP/2028','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum (2.80)','2028-02-20','2028-08-20','Selesai',1,'Dievaluasi dan dinyatakan perbaikan.','2028-02-19 17:00:00','2028-08-19 17:00:00'),
(43,182,'043/SP/KIP-K/ITG/IX/2026','SP1','Akademik','ipk di bawah standar','2026-09-01',NULL,'Aktif',1,NULL,'2026-09-01 01:17:25','2026-09-01 01:17:25'),
(44,171,'044/SP/KIP-K/ITG/IX/2026','SP1','Non-Akademik','melepas hijab di lingkungan kampus','2026-09-01',NULL,'Aktif',1,NULL,'2026-09-01 01:28:37','2026-09-01 01:28:37'),
(45,126,'045/SP/KIP-K/ITG/IX/2026','SP1','Akademik','Uji coba penerbitan SP dari Claude untuk test.','2026-09-01',NULL,'Selesai',1,NULL,'2026-09-01 01:41:00','2026-09-02 12:31:45'),
(46,141,'046/SP/KIP-K/ITG/IX/2026','SP1','Keuangan','asdfghjkjhgfdscvjkjgfds','2026-09-01',NULL,'Selesai',1,NULL,'2026-09-01 01:45:45','2026-09-02 12:18:20'),
(47,203,'203/SP1/SIMKIP/2026','SP1','Akademik','IPK Semester 3 turun di bawah standar minimum','2026-03-15','2026-09-15','Aktif',1,NULL,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(48,150,'048/SP/KIP-K/ITG/IX/2026','SP1','Akademik','sasasasasasasasasasasasasa','2026-09-05','2026-09-30','Aktif',1,'sasasa','2026-09-04 17:53:39','2026-09-04 17:53:39');
/*!40000 ALTER TABLE `surat_peringatans` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','mahasiswa','prodi','warek') NOT NULL DEFAULT 'mahasiswa',
  `prodi_id` bigint(20) unsigned DEFAULT NULL,
  `is_password_changed` tinyint(1) NOT NULL DEFAULT 0,
  `foto_profil` varchar(255) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  KEY `users_prodi_id_foreign` (`prodi_id`),
  CONSTRAINT `users_prodi_id_foreign` FOREIGN KEY (`prodi_id`) REFERENCES `prodis` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=462 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'Encep Jianul Hayat','admin','admin@itg.ac.id',NULL,'$2y$12$5WDkZ53UqtearxLluWHxqeK.SPSHLt7tjD6o7Zk0PRlzF6GF5hk5e','admin',NULL,1,NULL,'+62 822-1907-2212',NULL,'2026-08-31 07:54:56','2026-09-02 11:33:26'),
(2,'Dr. Rina Kurniawati, S.E., M.Si.','warek3','warek3@itg.ac.id',NULL,'$2y$12$C/Lb5Mv.YWgRY6d2FTc0KOE/K/H9Xfyks.NJwAm3yPsNEiseOXKj2','warek',NULL,1,NULL,NULL,NULL,'2026-08-31 07:54:57','2026-08-31 07:54:57'),
(3,'Kaprodi Teknik Informatika','prodi_ti','prodi.ti@itg.ac.id',NULL,'$2y$12$Taxi/F.lFAidXpu/kLkpMOBLGMh5edwj7gdVHzMDTBX8W37H0xoQ6','prodi',6,1,NULL,NULL,NULL,'2026-08-31 07:54:58','2026-09-01 01:01:03'),
(4,'Kaprodi Sistem Informasi','prodi_si','prodi.si@itg.ac.id',NULL,'$2y$12$Wv3jeMGnlWLA3glXMiYZHOq3WWE/zg9x8WZrpnkM2RwZSNSNScZlG','prodi',7,1,NULL,NULL,NULL,'2026-08-31 07:54:58','2026-09-01 01:01:03'),
(228,'Kailla Salsabila','2306064','kailla@student.itg.ac.id',NULL,'$2y$12$3HrymesaN.7AEDrNghl6guiZm33NTSD3BXCuhJtvFQzW5rCNbBEz.','mahasiswa',6,0,'profil/228/NO7eUpx87IjAWijmV66SoZf6uCwjJUJe1qGqmekE.jpg',NULL,NULL,'2026-08-31 22:05:40','2026-09-02 11:46:34'),
(376,'Praja Muda','2507077','praja.muda@student.itg.ac.id',NULL,'$2y$12$88dz5XR3o2C5OCLJLNV05ubh34jb/7X2CqeeXPJ7oOTfZPV3gFIa.','mahasiswa',NULL,0,NULL,NULL,NULL,'2026-09-01 00:03:09','2026-09-01 00:03:09'),
(377,'Samiah Prasasta','202206001','202206001@student.itg.ac.id',NULL,'$2y$12$VTbBp9lx4HvZ28AdXRpmq.GxhYmJWAEpUFQIpjK0uWiFap3v0iXCG','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:49:12','2026-09-01 04:55:06'),
(378,'Kasiyah Yulianti','202206002','202206002@student.itg.ac.id',NULL,'$2y$12$5IAj2tBVWhbGNwTzNlMWF.ML1knIzOndoDezWnqY8S6I0OveFRdOm','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:54:15','2026-09-01 04:55:07'),
(379,'Dirja Pradana','202206003','202206003@student.itg.ac.id',NULL,'$2y$12$8aAUFrbIGMjQszSEYuzBUea66scsxrTfnQLLeo4nbMf7iI8hJpKmS','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:55:25','2026-09-01 04:55:08'),
(380,'Yunita Puspasari','202207001','202207001@student.itg.ac.id',NULL,'$2y$12$pLcxKijiNx5R/31dA49R.OYSR1TAigeqcwF/aUcEaI/t1nGNi3xca','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:56:05','2026-09-01 04:55:09'),
(381,'Shakila Hutasoit','202207002','202207002@student.itg.ac.id',NULL,'$2y$12$1CDzKtwDK5ScRJWXpllUteuXeKFpu8mKp.CPadzns7cy9m9hLQMG.','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:56:06','2026-09-01 04:55:09'),
(382,'Kuncara Fujiati','202207003','202207003@student.itg.ac.id',NULL,'$2y$12$WnmnuSwZms/YCCu12cFMHevRJPsC6Wxf2PwozCMrLmx2iOR5xgfwG','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:58:25','2026-09-01 04:55:10'),
(383,'Karen Gunarto','202203001','202203001@student.itg.ac.id',NULL,'$2y$12$UHRtfitFt3Z7rf37ddAjs.91/FW2hO7nvmBDWr/D9GPY1FU9gH2o6','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:25','2026-09-01 04:55:11'),
(384,'Titi Permata','202203002','202203002@student.itg.ac.id',NULL,'$2y$12$h38PXj1OHDHz5ncpYpaIDebiiuLfkxMx8AEK8cN.8Z1uO0VtEuybu','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:26','2026-09-01 04:55:12'),
(385,'Dinda Tampubolon','202203003','202203003@student.itg.ac.id',NULL,'$2y$12$3DCa9EDTb3lba7T7K5LNXOszIwAFUSaVr0SwfdeEu97nPYQ6ui4GS','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:26','2026-09-01 04:55:12'),
(386,'Belinda Pradana','202211001','202211001@student.itg.ac.id',NULL,'$2y$12$h2X/T/.jcb6//BKiCThfCeAdj5IHKAGK2guvb2PU76vle2XkLRyP6','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:27','2026-09-01 04:55:13'),
(387,'Eluh Widodo','202211002','202211002@student.itg.ac.id',NULL,'$2y$12$2U6SLMzH35jAGX9ncz1JL.X//mTmWQGNmyvUW0h7THWeGF12xMhja','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:27','2026-09-01 04:55:14'),
(388,'Widya Kurniawan','202211003','202211003@student.itg.ac.id',NULL,'$2y$12$2ux9vXudwLeDCXjIt90rNub4Uv7wsq9FKBMgQID8tOcxGjcK4TtTG','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:28','2026-09-01 04:55:15'),
(389,'Kalim Saefullah','202224001','202224001@student.itg.ac.id',NULL,'$2y$12$x2GM9CnA2war8uCNl44fduaE1R4w7CJPFuSZFdEsMIgoEkxg8XUWC','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:29','2026-09-01 04:55:15'),
(390,'Irsad Hariyah S.Kom','202224002','202224002@student.itg.ac.id',NULL,'$2y$12$CsPtmi9F6N.33FJ5BuRhgeaOgZoxCergciDOqbAiITzMyb.oFGa.S','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:29','2026-09-01 04:55:16'),
(391,'Ulva Uyainah','202224003','202224003@student.itg.ac.id',NULL,'$2y$12$5HmYqZxTUQp/MKj0goC4R.ndbTk1f/9rx6nZxV5QYYzwz63McTxmC','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:30','2026-09-01 04:55:17'),
(392,'Wisnu Fujiati','202306001','202306001@student.itg.ac.id',NULL,'$2y$12$FgcndM9cNJ8dEjtorT18QuMEJYEFCA1/TGlEEmcWtx9aEWHhRLv26','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:31','2026-09-01 04:55:18'),
(393,'Gina Haryanti S.T.','202306002','202306002@student.itg.ac.id',NULL,'$2y$12$BDW1b8AbMCAKL6CqokoyHOMmNmUu9GySuFyESb7D.LkPLL2OBaEam','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:31','2026-09-01 04:55:19'),
(394,'Danang Sitompul S.Ars','202306003','202306003@student.itg.ac.id',NULL,'$2y$12$Jnev8Kosj23pd9JDj5PmUO3skvurwJXPKq1wLyjBEKJv4Y.jPSSrK','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:32','2026-09-01 04:55:19'),
(395,'Natalia Maulana','202307001','202307001@student.itg.ac.id',NULL,'$2y$12$0GC/ok71Xv49UCLgvtHOe.hpTO8V9naEhvD7nV60oM4iS/n6wZIfO','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:58:32','2026-09-01 00:58:32'),
(396,'Vega Haryanto','202307002','202307002@student.itg.ac.id',NULL,'$2y$12$zbaaOvMPjKcCy2q6Tm1Vje57z3twJ5FLWm1xyljimzoY.XXire2T.','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:58:33','2026-09-01 00:58:33'),
(397,'Keisha Nasyidah','202307003','202307003@student.itg.ac.id',NULL,'$2y$12$ARCs0rAP.fUEm/8Pp0S7TePsVpbyZ9VdO.IAZ82ngvqfZwNkk.kFy','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(398,'Dadi Salahudin','202303001','202303001@student.itg.ac.id',NULL,'$2y$12$LLJCYUw0SIYpt08cFQVC6.CLcstxs5r3IMN1HX0LhbQrSzVqqP5pa','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:34','2026-09-01 00:58:34'),
(399,'Indah Pudjiastuti S.Kom','202303002','202303002@student.itg.ac.id',NULL,'$2y$12$91IaeCyPk3r7xQ5D2GJFKeqNKnYvLVi6s4/SQDcbcXLjl06JLiavO','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:35','2026-09-01 00:58:35'),
(400,'Hafshah Adriansyah','202303003','202303003@student.itg.ac.id',NULL,'$2y$12$C3lBcrVZ7/3WwF9j1F3QJOo8alcSn2ciK8LP6hvk17AEfnOl3Lc4C','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(401,'Harto Marpaung','202311001','202311001@student.itg.ac.id',NULL,'$2y$12$aDXLAMxp1zvCg1lv.4gd5.85gwilMxgUeMw9gSGABBTVh1sjXr23i','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:36','2026-09-01 00:58:36'),
(402,'Widya Haryanto','202311002','202311002@student.itg.ac.id',NULL,'$2y$12$zUl7hJtC0VzbuvgsAUwuKu41g81hBuEcjIq8oWm1l6JiT2KIMXXA.','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(403,'Safina Safitri S.T.','202311003','202311003@student.itg.ac.id',NULL,'$2y$12$9J3EbhMjKd6QNnKrk.NYGeZJlAwk3iW58zBK3qjJJ.smQghQvBSwy','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:37','2026-09-01 00:58:37'),
(404,'Estiono Utama','202324001','202324001@student.itg.ac.id',NULL,'$2y$12$mBklkJgtjbWkehv9Fje9jOj3d1zui9lHYRLbzDwH4I3W8M7pH7YCy','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(405,'Garang Nuraini','202324002','202324002@student.itg.ac.id',NULL,'$2y$12$u64Rtd3MzprOuHsGWQPFFe4hFgQDR2YS3ftxNAGUUG9Fjv7tNjIO2','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:38','2026-09-01 00:58:38'),
(406,'Tira Januar','202324003','202324003@student.itg.ac.id',NULL,'$2y$12$EnqJrGaj.ffzly7rheAC9OcbKWwqzyw0wXWe4dUubpZf2w9/8Paiq','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:39','2026-09-01 00:58:39'),
(407,'Bakda Rahayu','202406001','202406001@student.itg.ac.id',NULL,'$2y$12$JWyxiYmm.llGL/M/cLKTfOv95LR2n/fysnysMLoAvkYVLhreSSRy2','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:40','2026-09-01 00:58:40'),
(408,'Emas Suartini','202406002','202406002@student.itg.ac.id',NULL,'$2y$12$jrmel79wmfTZzQVshArB9O3rifu00DE9P.wU4hb2Kqxq3Qp9G.jNi','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:41','2026-09-01 00:58:41'),
(409,'Juli Agustina','202406003','202406003@student.itg.ac.id',NULL,'$2y$12$R.t8nw7cxkDzVEzWGmWleuDO0fkvUGXX1mIK1hBCdCLRBwz3eGTBi','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:41','2026-09-01 00:58:41'),
(410,'Langgeng Utami','202407001','202407001@student.itg.ac.id',NULL,'$2y$12$OuJwrJFU92MPKaVOKiEzzeKcDs3oKVEDMq5Rugh7kwlQreS7c0CZ2','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:58:42','2026-09-01 00:58:42'),
(411,'Irfan Mayasari','202407002','202407002@student.itg.ac.id',NULL,'$2y$12$wpTVCSGyQ1rsG64W.I0ddehZD6dHBJo0GF.0BJuBTL1NR3CjAeeWO','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:58:42','2026-09-01 00:58:42'),
(412,'Olivia Mandasari','202407003','202407003@student.itg.ac.id',NULL,'$2y$12$SJJJqvgBwOLzWX/5RpVhseY0iSqeS15N9zGnR/o2N8DGDqmhSwGW6','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:58:43','2026-09-01 00:58:43'),
(413,'Nalar Puspita','202403001','202403001@student.itg.ac.id',NULL,'$2y$12$32AbfyHqFqvHhT5BgQ3Cl.zHoVUNxjcEAt9BjPk7SztWWzpQZz43q','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:43','2026-09-01 00:58:43'),
(414,'Lili Usada','202403002','202403002@student.itg.ac.id',NULL,'$2y$12$D2KrdC/gdlI8u9KvXOvMTOtzzVuHGCxN1qkvumeX0GkvdNY47MAZa','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:44','2026-09-01 00:58:44'),
(415,'Bagya Gunarto','202403003','202403003@student.itg.ac.id',NULL,'$2y$12$X8CdIudhxYMVufnmpU.r5OskzBFu4rgC/F./V5dmVhWd4Nzep5A1i','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:45','2026-09-01 00:58:45'),
(416,'Sabrina Santoso','202411001','202411001@student.itg.ac.id',NULL,'$2y$12$ek45wOLspZr9hRwgHq8bTetroBm2Yj1g/CloWhsxjnoHHHigb5rS.','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:45','2026-09-01 00:58:45'),
(417,'Kayla Hasanah S.Ars','202411002','202411002@student.itg.ac.id',NULL,'$2y$12$A1UuBappjqlXgOa3r0QwNO/P4LB56XwXopd3NAGPpn5UynamWfRzu','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:46','2026-09-01 00:58:46'),
(418,'Eja Haryanti','202411003','202411003@student.itg.ac.id',NULL,'$2y$12$I0kQJ8v5RpZ.l2.PTslddeUYDRdAja6l6z.o7vDGV6OYGuWRWUR66','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:47','2026-09-01 00:58:47'),
(419,'Ifa Suartini','202424001','202424001@student.itg.ac.id',NULL,'$2y$12$.ztdqIqa185pSpvumJz6ruRCrRPme46QkHpq2vVbWM9B5rfLciTii','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:47','2026-09-01 00:58:47'),
(420,'Prima Najmudin','202424002','202424002@student.itg.ac.id',NULL,'$2y$12$cEcciBHReBjnfWkyCc6hEOEFFr0uPt9VHjlzGp8mZQNLc9i25sk0K','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:48','2026-09-01 00:58:48'),
(421,'Galang Wibowo S.T.','202424003','202424003@student.itg.ac.id',NULL,'$2y$12$w6Evtd8AK0Ai6zHG9kZxbOyRK/XkKNl4d1cnpdridtwKICKbmux1S','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:48','2026-09-01 00:58:48'),
(422,'Gina Uyainah','202506001','202506001@student.itg.ac.id',NULL,'$2y$12$rdnPHhJB5SL8nAor9oZbPucCURQqpsrD.0OB9vnWd5n4riFoV.FBa','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:49','2026-09-01 00:58:49'),
(423,'Dono Siregar S.Kom','202506002','202506002@student.itg.ac.id',NULL,'$2y$12$S0TWWtWZGTMCgDFqrtd9B.s9GsgQsaBD4ldMoGJgKmjrr0Wb71b0O','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:50','2026-09-01 00:58:50'),
(424,'Gamblang Utami','202506003','202506003@student.itg.ac.id',NULL,'$2y$12$htmquYG9BIuDT1C6YKSED.99SmA/MXJNK3gcWqkpsJE5DgRvAjmRG','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:50','2026-09-01 00:58:50'),
(425,'Ida Handayani','202507001','202507001@student.itg.ac.id',NULL,'$2y$12$nkO4lY1sSuwZmqy9qCuiNeZoCwH7Eyr.5TpqyfEcq0ghO32Hmjjqi','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:58:51','2026-09-01 00:58:51'),
(426,'Dono Anggraini S.T.','202507002','202507002@student.itg.ac.id',NULL,'$2y$12$cvE4ALNh.fSKwQQ6CkvykuOQSkWwcgODqhUjFPFCF9GzloT6UlZ96','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:58:52','2026-09-01 00:58:52'),
(427,'Aisyah Purnawati','202507003','202507003@student.itg.ac.id',NULL,'$2y$12$TVI6e17aQGVm5b9PbwNaQex4UNgmGwNWQbyY57tIqUxHRp4g1vu22','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:58:52','2026-09-01 00:58:52'),
(428,'Prasetyo Prakasa','202503001','202503001@student.itg.ac.id',NULL,'$2y$12$BOatkHuCOyTftjvvzUeZUeWsOJse7Qfr7q5YDs/e7kS/9SCLiiPA6','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:53','2026-09-01 00:58:53'),
(429,'Widya Kusmawati','202503002','202503002@student.itg.ac.id',NULL,'$2y$12$cdIELI/.7JyEkinPg6RjOeUHSlIQyA5G5Y9iAGLh5Jb/oozAsJIeu','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:54','2026-09-01 00:58:54'),
(430,'Kenzie Mahendra','202503003','202503003@student.itg.ac.id',NULL,'$2y$12$VND5to3IrmOcjrAwWQ3ovO4.muacoIX7SrZLCpfgkm7OCmODno55W','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:58:54','2026-09-01 00:58:54'),
(431,'Asmadi Hariyah','202511001','202511001@student.itg.ac.id',NULL,'$2y$12$zCcgCY5LcGklzi1s1.AY2eMG55GdxjvH8ADS8SZBkXiJb.16qgRv2','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:55','2026-09-01 00:58:55'),
(432,'Laksana Sinaga','202511002','202511002@student.itg.ac.id',NULL,'$2y$12$HP1Ppwjq96QHOCCqYHUH8OcCl8TFNOwDkgzBPT4O/spYyldLzBI12','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:55','2026-09-01 00:58:55'),
(433,'Marwata Waskita','202511003','202511003@student.itg.ac.id',NULL,'$2y$12$rqz0MY4P0rD5ExOYs9pCZeSODSWUNL1wC3DP5QYhan5Zx3p5YFwvC','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:58:56','2026-09-01 00:58:56'),
(434,'Alika Najmudin','202524001','202524001@student.itg.ac.id',NULL,'$2y$12$smt1ybl8o0pVtHEeAl00eutNOkGU43z1d/kND2HRffij9vhdYkCfi','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:57','2026-09-01 00:58:57'),
(435,'Olivia Yuniar','202524002','202524002@student.itg.ac.id',NULL,'$2y$12$WFAgsUt2gmGFzqLN7FSZnekgrJ6ZiFfvgVr7H9L10b6FzklRNHu2e','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:57','2026-09-01 00:58:57'),
(436,'Pranawa Halim S.T.','202524003','202524003@student.itg.ac.id',NULL,'$2y$12$sqch5.7Udn9qL.LIBwi/J./lzrH6TpNjIPxci2YpKGMLCR4AdOcOC','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:58:58','2026-09-01 00:58:58'),
(437,'Jaya Lailasari','202606001','202606001@student.itg.ac.id',NULL,'$2y$12$HorPP6vqKh7n7VuwYDNw5u7b0wCmBAOm7CIYkTC03M4EI2sM9JXqu','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:58','2026-09-01 00:58:58'),
(438,'Eko Kurniawan','202606002','202606002@student.itg.ac.id',NULL,'$2y$12$bzg5yqPvOSGtUgUfVTdkduir9niydF/3tu84BNNSfsnIcTQsGZBnu','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:58:59','2026-09-01 00:58:59'),
(439,'Puput Hardiansyah','202606003','202606003@student.itg.ac.id',NULL,'$2y$12$bawtH.4f8WfUYJmaX32P0OUu.5YSRtu987iH6G5cufOM92yBQ9LZi','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-01 00:59:00','2026-09-01 00:59:00'),
(440,'Prabowo Winarsih','202607001','202607001@student.itg.ac.id',NULL,'$2y$12$6N13c1E5VhcrBDim6wCzHe8.caH9v/sCmOk51cC4Rr54MPcucHH7q','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:59:00','2026-09-01 00:59:00'),
(441,'Vanya Waluyo S.Ars','202607002','202607002@student.itg.ac.id',NULL,'$2y$12$cVIZ3g9Pz/q5fVHqiAU22OdiZBSqRU8lcYEUAW2R1zO57/76uEOdq','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:59:01','2026-09-01 00:59:01'),
(442,'Ira Maryati S.Kom','202607003','202607003@student.itg.ac.id',NULL,'$2y$12$z/laO9P9SdnugSiqlc2YBOko6nRNSznX8Hw0gJySLccZW8gDx3Eyi','mahasiswa',7,0,NULL,NULL,NULL,'2026-09-01 00:59:01','2026-09-01 00:59:01'),
(443,'Rahmi Salahudin','202603001','202603001@student.itg.ac.id',NULL,'$2y$12$3SZBMB5K6rjj7QsDAmNr9urHZWfuSMFLWkn3Qi/oc6G9dWciW2HwW','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:59:02','2026-09-01 00:59:02'),
(444,'Jindra Purwanti S.T.','202603002','202603002@student.itg.ac.id',NULL,'$2y$12$LJEoZWKfbCV5xk1Cz4q3GeuAKUC32ggfsuzZOAWPx08umK3gHCGVK','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:59:02','2026-09-01 00:59:02'),
(445,'Muhammad Santoso S.Kom','202603003','202603003@student.itg.ac.id',NULL,'$2y$12$OPG0Ym9cU2PPtMlcuUWGiu0pWTSd37Uo0xEJ/DOmf0Nl9/7o6tf7i','mahasiswa',8,0,NULL,NULL,NULL,'2026-09-01 00:59:03','2026-09-01 00:59:03'),
(446,'Kusuma Dabukke','202611001','202611001@student.itg.ac.id',NULL,'$2y$12$tNn/KQ0qCkfyBLpedwPA8eigiJm2nY2uShs9fBiHqFk4r5tnwio8.','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:59:03','2026-09-01 00:59:03'),
(447,'Paiman Purwanti','202611002','202611002@student.itg.ac.id',NULL,'$2y$12$Pl.Alv1wvalAmwnU4PHfM.OIY.t0E9wdSX1UMyOBgqj9Ed9AviqrK','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:59:04','2026-09-01 00:59:04'),
(448,'Rama Agustina','202611003','202611003@student.itg.ac.id',NULL,'$2y$12$9D7PMTDcqxbJleIKqFuvl.DrVb02p1F2XhwSJEbpc4ftgXw6sRL6S','mahasiswa',9,0,NULL,NULL,NULL,'2026-09-01 00:59:05','2026-09-01 00:59:05'),
(449,'Vivi Pranowo','202624001','202624001@student.itg.ac.id',NULL,'$2y$12$MmPDQN0Hil9AGEP.6Kzlo.dteGe9C9JDYzXfg10wCUU1eKRpOJ8Ee','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:59:05','2026-09-01 00:59:05'),
(450,'Galih Wibisono S.T.','202624002','202624002@student.itg.ac.id',NULL,'$2y$12$0GCFE2czbd5/sHx0kok/K.8izjSOV4.VobfAQDQRsHD00lF8B0VkO','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:59:06','2026-09-01 00:59:06'),
(451,'Nasrullah Purwanti','202624003','202624003@student.itg.ac.id',NULL,'$2y$12$dQ.OB6pgqAWouSJ.outF8OjLULflFjXRjpoSlYk0h3u0NvC1ZeE9a','mahasiswa',10,0,NULL,NULL,NULL,'2026-09-01 00:59:07','2026-09-01 00:59:07'),
(452,'Ahmad Rizky Pratama','2507101','2507101@student.itg.ac.id',NULL,'$2y$12$bQcCirQJyKGuyogseOAFY.ltVOUxVyFBGvNp.w85a6.Ej.Tt6MiFW','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-02 15:52:42','2026-09-02 15:53:00'),
(453,'Siti Nurhaliza','2507102','2507102@student.itg.ac.id',NULL,'$2y$12$2DINWDQFF9bn8n72fkjbduwF1XtgoboIRM/p7o.APTnilruitGbne','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-02 15:53:00','2026-09-02 15:53:00'),
(454,'Muhammad Fadilah','2507103','2507103@student.itg.ac.id',NULL,'$2y$12$tmddquFJd2a5Qu4Lu10SMe5qjmgVPeqGCcN2fg2bMVvJJhXYEHfkW','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-02 15:53:01','2026-09-02 15:53:01'),
(455,'Putri Amelia Sari','2507104','2507104@student.itg.ac.id',NULL,'$2y$12$3sQvcjKNQVC.pzD3Pjjl8OL2FCPb41QrwVBs/9eWsRxwVkVwG7Vba','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(456,'Dimas Agung Wicaksono','2507105','2507105@student.itg.ac.id',NULL,'$2y$12$ikpM7STelcD6tE1Vz16FDuoTHXD09P9Il4MaRpInfDAZ1.GhLp0Be','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-02 15:53:02','2026-09-02 15:53:02'),
(457,'Rina Marlina','2507106','2507106@student.itg.ac.id',NULL,'$2y$12$XfpSPt6p48hanTe2NhFXD.1XTCJEnkf8BJVXf.lmP0Tzku3RNIu16','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-02 15:53:03','2026-09-02 15:53:03'),
(458,'Farhan Maulana Ibrahim','2507107','2507107@student.itg.ac.id',NULL,'$2y$12$BlMVKz5wrLefODlYeTgRMe88mze/rtjDCb281vst.pJohoiFFyQtm','mahasiswa',6,0,NULL,NULL,NULL,'2026-09-02 15:53:04','2026-09-02 15:53:04'),
(459,'Kaprodi Teknik Industri','prodi_industri',NULL,NULL,'$2y$12$GdjnlahWznAqbsZFXKcoouitbBw18YW38wDERzWkPz2DbX6PiTDyG','prodi',8,0,NULL,NULL,NULL,'2026-09-02 17:18:47','2026-09-02 17:18:47'),
(460,'Kaprodi Teknik Sipil','prodi_sipil',NULL,NULL,'$2y$12$ToipuKLMRyFoEYURzZYzhObb9nqBJVYaWkwuGNT8fMhiS7BTi2oEW','prodi',9,0,NULL,NULL,NULL,'2026-09-02 17:18:48','2026-09-02 17:18:48'),
(461,'Kaprodi Arsitektur','prodi_arsitektur',NULL,NULL,'$2y$12$4f1Y/T1bTiAvmTNtT4ulYu6FwDftxjB8YmTWwA5/2AFdyAuDcX53C','prodi',10,0,NULL,NULL,NULL,'2026-09-02 17:18:48','2026-09-02 17:18:48');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-09-07 18:03:28
