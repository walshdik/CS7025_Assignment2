-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 09, 2023 at 01:22 AM
-- Server version: 8.0.32
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inkspots`
--
CREATE DATABASE IF NOT EXISTS `inkspots` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `inkspots`;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int NOT NULL,
  `image_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `comment_text` text NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `image_id`, `username`, `comment_text`, `user_id`, `created_at`) VALUES
(2, 1, 'Kitty', 'why did my database delete itself :-(', '1', '2023-04-04 13:15:13'),
(3, 5, 'Kitty', 'hello', '1', '2023-04-04 14:09:09'),
(4, 5, 'Lana', 'are comments working??', '2', '2023-04-04 14:23:06'),
(5, 5, 'Lana', 'nice', '2', '2023-04-04 14:23:10'),
(6, 11, 'Lana', 'cool staute!', '2', '2023-04-04 16:51:09'),
(7, 14, 'Chuck', 'test', '3', '2023-04-04 19:02:53'),
(8, 14, 'Chuck', 'nice', '3', '2023-04-04 19:03:02'),
(9, 12, 'Lana', 'what does a really really really really really really really really really really really really really really really really really really really really really really long comment look like?', '2', '2023-04-04 20:18:16'),
(10, 12, 'Lana', 'ok cool', '2', '2023-04-04 20:18:23'),
(11, 13, 'Kathryn', 'so true', '4', '2023-04-05 09:22:42'),
(12, 10, 'Kitty', 'nerds\r\n', '1', '2023-04-05 11:52:21'),
(13, 12, 'Kitty', 'what', '1', '2023-04-05 19:46:47'),
(14, 12, 'Kitty', 'would', '1', '2023-04-05 19:46:53'),
(15, 12, 'Kitty', 'a', '1', '2023-04-05 19:46:56'),
(16, 12, 'Kitty', 'full', '1', '2023-04-05 19:47:01'),
(17, 12, 'Kitty', 'comment', '1', '2023-04-05 19:47:05'),
(18, 12, 'Kitty', 'section', '1', '2023-04-05 19:47:10'),
(19, 12, 'Kitty', 'look', '1', '2023-04-05 19:47:14'),
(20, 12, 'Kitty', 'like', '1', '2023-04-05 19:47:18'),
(21, 12, 'Kitty', '?', '1', '2023-04-05 19:47:23'),
(22, 11, 'Kitty', 'wow!', '1', '2023-04-05 22:03:13'),
(25, 2, 'Kitty', 'cool', '1', '2023-04-06 16:09:07'),
(27, 58, 'Kitty', 'I hope you like my website, which is held together mostly by sellotape and hope', '1', '2023-04-09 01:15:57');

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` int NOT NULL,
  `filename` varchar(255) NOT NULL,
  `uploader` varchar(255) NOT NULL,
  `upload_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `filename`, `uploader`, `upload_time`) VALUES
(1, 'SA504490.JPG', 'Kitty', '2023-04-04 11:45:29'),
(2, 'Oisin.Kitty.Hammy.JPG', 'Kitty', '2023-04-04 11:46:05'),
(4, 'P1000506.JPG', 'Kitty', '2023-04-04 11:46:41'),
(5, 'P1000523.JPG', 'Kitty', '2023-04-04 11:46:50'),
(10, '7643764.jpg', 'Lana', '2023-04-04 15:34:32'),
(11, '536242514.jpg', 'Lana', '2023-04-04 15:34:49'),
(12, '467876867.jpg', 'Lana', '2023-04-04 15:34:56'),
(13, 'unnamed.jpg', 'Chuck', '2023-04-04 19:41:25'),
(23, 'Italy.2005.JPG', 'Gerard', '2023-04-05 23:07:24'),
(25, 'kit2 and rian.JPG', 'Kitty', '2023-04-05 23:18:42'),
(27, 'IMG-20180918-WA0003.jpg', 'Gerard', '2023-04-05 23:21:48'),
(28, 'IMG-20180704-WA0009.jpg', 'Gerard', '2023-04-05 23:22:51'),
(29, '65093899_3085582178149041_8549423644420341760_o.jpg', 'Gerard', '2023-04-05 23:24:49'),
(31, 'Image022.jpg', 'Kathryn', '2023-04-06 11:25:54'),
(33, 'SA500169.JPG', 'Chuck', '2023-04-06 14:17:05'),
(39, 'IMG-20180514-WA0135.jpg', 'Kitty', '2023-04-06 23:28:10'),
(40, 'IMG-20180702-WA0173.jpg', 'Kitty', '2023-04-06 23:29:13'),
(42, '89139983_10156572381826058_7577231082274160640_n.jpg', 'Kathryn', '2023-04-07 17:16:09'),
(43, 'Hadiya.jpg', 'Dan', '2023-04-07 21:40:07'),
(45, 'Illustration6.png', 'Dan', '2023-04-07 21:41:41'),
(46, 'Screenshot 2023-04-07 214624.png', 'Dan', '2023-04-07 21:47:00'),
(48, 'kitten.jpg', 'Dan', '2023-04-07 22:01:12'),
(58, 'SIX_12426916-7F15-4D56-B52D-04E15D1057F1.jpg', 'Kitty', '2023-04-09 02:15:39');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
  `id` int NOT NULL,
  `image_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `image_id`, `user_id`, `name`) VALUES
(12, 1, NULL, 'Lana'),
(13, 5, NULL, 'Lana'),
(16, 11, NULL, 'Lana'),
(20, 12, NULL, 'Chuck'),
(21, 5, NULL, 'Chuck'),
(23, 12, NULL, 'Lana'),
(24, 13, NULL, 'Kathryn'),
(29, 10, NULL, 'Kitty'),
(32, 13, NULL, 'Gerard'),
(34, 28, NULL, 'Gerard'),
(38, 31, NULL, 'Kitty'),
(40, 1, NULL, 'Kitty'),
(42, 29, NULL, 'Kitty'),
(43, 12, NULL, 'Kitty'),
(44, 31, NULL, 'Deirdre'),
(45, 27, NULL, 'Kitty'),
(46, 5, NULL, 'Kathryn'),
(47, 13, NULL, 'Kitty'),
(48, 45, NULL, 'Dan'),
(49, 40, NULL, 'Dan'),
(52, 43, NULL, 'Dan'),
(54, 58, NULL, 'Kitty');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('2cMnGeMARtaTEmm38aj2MBp8r7-I80fP', 1681089646, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loggedin\":true,\"username\":\"Kitty\"}');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`) VALUES
(1, 'Kitty', '$2a$10$BUeLWoBzv7PiyUdpZWB3h..sUkz1QiX02ncAsYd99llOIfpkqpIyq'),
(2, 'Lana', '$2a$10$6BP7nhWTCO8L1Cmh1rDBc.f58VZNnnmDl5HwKPGXwNO6ZiM8rm4AG'),
(3, 'Chuck', '$2a$10$JmQveXpRxEKlbzw8P6xRwOa4VF0IeVj787W0CYUdOkn19sl4Bkvwy'),
(4, 'Kathryn', '$2a$10$mmm3vApRqedyUuK7A7hr2eVp27K5qAKKmZIUHS2jVZfF.mLpJ3yiK'),
(5, 'Dylan', '$2a$10$NZ1/HlQqbmf45ADxzM4x1.z.Xj9T83AmdATMVRAbdochBe0s8DEBe'),
(6, 'Gerard', '$2a$10$aibZJv4kf76pwhdtRyIWBO56UD4YR/..elgtP9EVQv5rs3lYAabO2'),
(7, 'Deirdre', '$2a$10$a5IKHgNhAe5vnBsDGqKXh.nPVnYVWptPI3JKndLenoyNCGTbkdO.m'),
(8, 'Dan', '$2a$10$65NzxwGqUKSb1jIwKA2E8uJT9JGRlP53FJ9p8mslIByKBgl2yYpea'),
(9, 'Kathryn', '$2a$10$7JR0lTNYOt7.nvJtXKLm5./ApL7L3KGdkci3Ev4mbHeIHQdE6sJMq');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `image_id` (`image_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
