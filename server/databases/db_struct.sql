SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `mydb`;

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `user_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `last_used` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `npa` int(11) NOT NULL,
  `town` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `country` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `society` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `floor` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `batiment` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `door_code1` varchar(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `door_code2` varchar(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `interphone` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `instructions` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `admin` (
  `user_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `loc_id` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parent_cat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `group_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `images` (
  `img_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `img` mediumblob NOT NULL,
  `default_img` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `locale` (
  `id` int(11) NOT NULL,
  `loc_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `name` mediumtext COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `loc` varchar(4) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `loc_keys` (
  `loc_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `parent_menu` int(11) DEFAULT NULL,
  `value` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `href` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `item_order` int(11) NOT NULL,
  `item_group` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `short_description` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `price` decimal(5,2) NOT NULL DEFAULT 0.00,
  `category` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `users` (
  `user_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `admin`
  ADD PRIMARY KEY (`user_id`,`group_id`) USING BTREE,
  ADD KEY `fk_group_id` (`group_id`);

ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_parent_cat` (`parent_cat`),
  ADD KEY `fk_loc_id` (`loc_id`);

ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `images`
  ADD PRIMARY KEY (`img_id`),
  ADD UNIQUE KEY `img` (`img`,`product_id`) USING HASH,
  ADD KEY `fk_product_id` (`product_id`);

ALTER TABLE `locale`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `loc` (`loc`,`loc_id`) USING BTREE,
  ADD KEY `fk_locale_id` (`loc_id`);

ALTER TABLE `loc_keys`
  ADD PRIMARY KEY (`loc_id`);

ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_order` (`item_order`,`item_group`,`parent_menu`) USING BTREE,
  ADD KEY `fk_value` (`value`),
  ADD KEY `fk_parent_menu` (`parent_menu`);

ALTER TABLE `products`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_category` (`category`),
  ADD KEY `fk_title` (`title`),
  ADD KEY `fk_short_description` (`short_description`),
  ADD KEY `fk_description` (`description`);

ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`) USING BTREE;


ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `images`
  MODIFY `img_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `locale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `admin`
  ADD CONSTRAINT `fk_group_id` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `categories`
  ADD CONSTRAINT `fk_loc_id` FOREIGN KEY (`loc_id`) REFERENCES `loc_keys` (`loc_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_parent_cat` FOREIGN KEY (`parent_cat`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `images`
  ADD CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `locale`
  ADD CONSTRAINT `fk_locale_id` FOREIGN KEY (`loc_id`) REFERENCES `loc_keys` (`loc_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `menus`
  ADD CONSTRAINT `fk_parent_menu` FOREIGN KEY (`parent_menu`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_value` FOREIGN KEY (`value`) REFERENCES `loc_keys` (`loc_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `products`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_description` FOREIGN KEY (`description`) REFERENCES `loc_keys` (`loc_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_short_description` FOREIGN KEY (`short_description`) REFERENCES `loc_keys` (`loc_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_title` FOREIGN KEY (`title`) REFERENCES `loc_keys` (`loc_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
