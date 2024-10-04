-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Sep 04, 2024 at 05:03 AM
-- Server version: 10.6.18-MariaDB-ubu2004
-- PHP Version: 8.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `waterpump`
--

-- --------------------------------------------------------

--
-- Table structure for table `humiditytemp`
--

CREATE TABLE `humiditytemp` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `topic` varchar(20) DEFAULT NULL,
  `temp1c` float NOT NULL,
  `temp2c` float NOT NULL,
  `temp1f` float NOT NULL,
  `temp2f` float NOT NULL,
  `humidity1` float NOT NULL,
  `humidity2` float NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `humiditytemp`
--

INSERT INTO `humiditytemp` (`id`, `topic`, `temp1c`, `temp2c`, `temp1f`, `temp2f`, `humidity1`, `humidity2`, `time`) VALUES
(1, NULL, 30.0199, 30.0199, 30.0199, 30.0199, 30.0199, 30.0199, '2024-09-03 01:48:40'),

-- --------------------------------------------------------

--
-- Table structure for table `nodedata_logs`
--

CREATE TABLE `nodedata_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `topic` varchar(20) NOT NULL,
  `temp1` float NOT NULL,
  `temp2` float NOT NULL,
  `humi1` float NOT NULL,
  `humi2` float NOT NULL,
  `pump1` int(1) NOT NULL,
  `pump2` int(1) NOT NULL,
  `fan` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `power` float NOT NULL,
  `node_id` varchar(50) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nodedata_logs`
--

INSERT INTO `nodedata_logs` (`id`, `topic`, `temp1`, `temp2`, `humi1`, `humi2`, `pump1`, `pump2`, `fan`, `power`, `node_id`, `timestamp`) VALUES
(1, 'esp32/node1', 30, 31.1, 90, 91.2, 1, 0, '[0,0,0,0,1,1,1,1]', 1222, 'node1', '2024-08-19 06:37:52'),

-- --------------------------------------------------------

--
-- Table structure for table `OnOffFan`
--

CREATE TABLE `OnOffFan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fan_name` varchar(10) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `OnOffFan`
--

INSERT INTO `OnOffFan` (`id`, `fan_name`, `status`, `timestamp`) VALUES
(1, 'Fan1', 1, '2024-09-04 04:31:52'),
(2, 'Fan2', 1, '2024-09-04 04:31:52'),
(3, 'Fan3', 1, '2024-09-04 04:31:52'),
(4, 'Fan4', 1, '2024-09-04 04:31:52'),
(5, 'Fan5', 0, '2024-09-03 13:38:01'),
(6, 'Fan6', 0, '2024-09-03 13:38:01'),
(7, 'Fan7', 0, '2024-09-03 13:38:01'),
(8, 'Fan8', 0, '2024-09-03 13:38:01');

-- --------------------------------------------------------

--
-- Table structure for table `OnOffWaterPumps`
--

CREATE TABLE `OnOffWaterPumps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `waterpump_name` varchar(20) NOT NULL,
  `status` int(1) NOT NULL,
  `details` varchar(50) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `OnOffWaterPumps`
--

INSERT INTO `OnOffWaterPumps` (`id`, `waterpump_name`, `status`, `details`, `timestamp`) VALUES
(1, 'waterpump1', 1, 'ปั้มน้ำ 1', '2024-09-04 04:33:06'),
(3, 'waterpump2', 1, 'ปั้มน้ำ 2', '2024-09-03 14:39:37');

-- --------------------------------------------------------

--
-- Table structure for table `setPoint`
--

CREATE TABLE `setPoint` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `num` int(3) NOT NULL,
  `condition_set` varchar(100) NOT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `setPoint`
--

INSERT INTO `setPoint` (`id`, `num`, `condition_set`, `update_at`) VALUES
(1, 30, 'on fan row one', '2024-09-04 04:31:16'),
(2, 30, 'off fan row two', '2024-09-03 06:55:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `humiditytemp`
--
ALTER TABLE `humiditytemp`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `nodedata_logs`
--
ALTER TABLE `nodedata_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `OnOffFan`
--
ALTER TABLE `OnOffFan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `OnOffWaterPumps`
--
ALTER TABLE `OnOffWaterPumps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `setPoint`
--
ALTER TABLE `setPoint`
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `humiditytemp`
--
ALTER TABLE `humiditytemp`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40898;

--
-- AUTO_INCREMENT for table `nodedata_logs`
--
ALTER TABLE `nodedata_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6604;

--
-- AUTO_INCREMENT for table `OnOffFan`
--
ALTER TABLE `OnOffFan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `OnOffWaterPumps`
--
ALTER TABLE `OnOffWaterPumps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `setPoint`
--
ALTER TABLE `setPoint`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
