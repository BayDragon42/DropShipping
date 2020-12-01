-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mar. 01 déc. 2020 à 11:15
-- Version du serveur :  10.4.14-MariaDB
-- Version de PHP : 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mydb`
--
CREATE DATABASE IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `mydb`;

-- --------------------------------------------------------

--
-- Structure de la table `addresses`
--

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

--
-- Déchargement des données de la table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `last_used`, `name`, `surname`, `address`, `npa`, `town`, `country`, `phone`, `society`, `floor`, `batiment`, `door_code1`, `door_code2`, `interphone`, `instructions`) VALUES
(1, 'user1', '2020-11-26 12:52:02', 'Camesi', 'Jean-Noël', 'Ch. des Champs-de-Vaux 24', 1246, 'Corsier', 'Suisse', '0227513238', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'user1', '2020-11-26 12:52:04', 'Camesi', 'Jean-Noël', 'Ch. De-L\'Autre-Adresse 42', 1201, 'Genève', 'Suisse', '0762044491', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `user_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`user_id`, `password`, `group_id`) VALUES
('test', 'test', 2);

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `loc_id` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parent_cat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `loc_id`, `parent_cat`) VALUES
(81, 'category_##81', NULL),
(82, 'category_##82', 81);

-- --------------------------------------------------------

--
-- Structure de la table `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `group_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `groups`
--

INSERT INTO `groups` (`id`, `group_name`) VALUES
(2, 'admin');

-- --------------------------------------------------------

--
-- Structure de la table `images`
--

CREATE TABLE `images` (
  `img_id` int(11) NOT NULL,
  `img` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `locale`
--

CREATE TABLE `locale` (
  `id` int(11) NOT NULL,
  `loc_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `name` mediumtext COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `loc` varchar(4) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `locale`
--

INSERT INTO `locale` (`id`, `loc_id`, `name`, `loc`) VALUES
(79, 'documentTitleIndex_core', 'Index', 'fr'),
(80, 'documentTitleManage_core', 'Administration', 'fr'),
(95, 'FooterInfos_core', '', 'fr'),
(96, 'MAdd_core', 'Ajouter', 'fr'),
(97, 'MMenuCommands_core', 'Commandes', 'fr'),
(98, 'MMenuConfigLocFiles_core', 'Localisations', 'fr'),
(99, 'MMenuConfig_core', 'Configuration', 'fr'),
(100, 'MMenuProductsCat_core', 'Catégories de produits', 'fr'),
(101, 'MMenuProductsVisits_core', 'Produits visités', 'fr'),
(102, 'MMenuProducts_core', 'Produits', 'fr'),
(103, 'MMenuStats_core', 'Statistiques', 'fr'),
(104, 'MMenuUsers_core', 'Utilisateurs', 'fr'),
(105, 'MMenuVisits_core', 'Visites', 'fr'),
(106, 'MNewLocFile_core', '', 'fr'),
(107, 'MUpdateKeyVal_core', 'Mettre à jour', 'fr'),
(123, 'documentTitleIndex_core', 'Index', 'en'),
(124, 'documentTitleManage_core', 'Management', 'en'),
(125, 'FooterInfos_core', 'Information', 'en'),
(126, 'MAdd_core', '', 'en'),
(127, 'MMenuCommands_core', '', 'en'),
(128, 'MMenuConfig_core', '', 'en'),
(129, 'MMenuConfigLocFiles_core', '', 'en'),
(130, 'MMenuProducts_core', '', 'en'),
(131, 'MMenuProductsCat_core', '', 'en'),
(132, 'MMenuProductsVisits_core', '', 'en'),
(133, 'MMenuStats_core', '', 'en'),
(134, 'MMenuUsers_core', '', 'en'),
(135, 'MMenuVisits_core', '', 'en'),
(136, 'MNewLocFile_core', '', 'en'),
(137, 'MUpdateKeyVal_core', '', 'en'),
(231, 'MDeleteVal_core', 'Supprimer', 'fr'),
(232, 'MDeleteVal_core', 'Delete', 'en'),
(754, 'documentTitleIndex_core', '', 'de'),
(755, 'documentTitleManage_core', '', 'de'),
(756, 'FooterInfos_core', '', 'de'),
(757, 'MAdd_core', '', 'de'),
(758, 'MDeleteVal_core', '', 'de'),
(759, 'MMenuCommands_core', '', 'de'),
(760, 'MMenuConfig_core', '', 'de'),
(761, 'MMenuConfigLocFiles_core', '', 'de'),
(762, 'MMenuProducts_core', '', 'de'),
(763, 'MMenuProductsCat_core', '', 'de'),
(764, 'MMenuProductsVisits_core', '', 'de'),
(765, 'MMenuStats_core', '', 'de'),
(766, 'MMenuUsers_core', '', 'de'),
(767, 'MMenuVisits_core', '', 'de'),
(768, 'MNewLocFile_core', '', 'de'),
(769, 'MUpdateKeyVal_core', '', 'de'),
(1044, 'category_##81', 'Tech', 'de'),
(1045, 'category_##81', 'Tech', 'en'),
(1046, 'category_##81', 'Tech', 'fr'),
(1047, 'category_##82', 'PC', 'de'),
(1048, 'category_##82', 'PC', 'en'),
(1049, 'category_##82', 'PC', 'fr');

-- --------------------------------------------------------

--
-- Structure de la table `loc_keys`
--

CREATE TABLE `loc_keys` (
  `loc_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `loc_keys`
--

INSERT INTO `loc_keys` (`loc_id`) VALUES
('category_##81'),
('category_##82'),
('documentTitleIndex_core'),
('documentTitleManage_core'),
('FooterInfos_core'),
('MAdd_core'),
('MDeleteVal_core'),
('MMenuCommands_core'),
('MMenuConfig_core'),
('MMenuConfigLocFiles_core'),
('MMenuProducts_core'),
('MMenuProductsCat_core'),
('MMenuProductsVisits_core'),
('MMenuStats_core'),
('MMenuUsers_core'),
('MMenuVisits_core'),
('MNewLocFile_core'),
('MUpdateKeyVal_core');

-- --------------------------------------------------------

--
-- Structure de la table `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `parent_menu` int(11) DEFAULT NULL,
  `value` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `href` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `item_order` int(11) NOT NULL,
  `item_group` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `menus`
--

INSERT INTO `menus` (`id`, `parent_menu`, `value`, `href`, `item_order`, `item_group`) VALUES
(1, NULL, 'MMenuStats_core', NULL, 0, 0),
(2, NULL, 'MMenuProducts_core', NULL, 1, 0),
(3, NULL, 'MMenuUsers_core', NULL, 2, 0),
(4, NULL, 'MMenuConfig_core', NULL, 3, 0),
(7, 1, 'MMenuVisits_core', '/manage?page=visits', 0, 0),
(8, 1, 'MMenuCommands_core', '/manage?page=commands', 1, 0),
(9, 1, 'MMenuProductsVisits_core', '/manage?page=visitedProducts', 2, 0),
(10, 4, 'MMenuProductsCat_core', '/manage?page=productsCategories', 0, 0),
(11, 4, 'MMenuProducts_core', '/manage?page=productsConfig', 1, 0),
(12, 4, 'MMenuConfigLocFiles_core', '/manage?page=localeConfig', 2, 0),
(14, NULL, NULL, NULL, 0, 1);

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `short_description` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `price` decimal(5,2) NOT NULL DEFAULT 0.00,
  `category` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `products_img`
--

CREATE TABLE `products_img` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `img` int(11) NOT NULL,
  `default_img` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `name`) VALUES
(1, '/manage'),
(2, '/client');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`user_id`, `password`) VALUES
('user1', 'user'),
('user2', 'user');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`user_id`,`group_id`) USING BTREE,
  ADD KEY `fk_group_id` (`group_id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_parent_cat` (`parent_cat`),
  ADD KEY `fk_loc_id` (`loc_id`);

--
-- Index pour la table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`img_id`) USING HASH,
  ADD UNIQUE KEY `img` (`img`) USING HASH;

--
-- Index pour la table `locale`
--
ALTER TABLE `locale`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `loc` (`loc`,`loc_id`) USING BTREE,
  ADD KEY `fk_locale_id` (`loc_id`);

--
-- Index pour la table `loc_keys`
--
ALTER TABLE `loc_keys`
  ADD PRIMARY KEY (`loc_id`);

--
-- Index pour la table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_order` (`item_order`,`item_group`,`parent_menu`) USING BTREE,
  ADD KEY `fk_value` (`value`),
  ADD KEY `fk_parent_menu` (`parent_menu`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_title` (`title`),
  ADD KEY `fk_short_description` (`short_description`),
  ADD KEY `fk_description` (`description`),
  ADD KEY `fk_category` (`category`);

--
-- Index pour la table `products_img`
--
ALTER TABLE `products_img`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product_id` (`product_id`),
  ADD KEY `fk_img_id` (`img`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`) USING BTREE;

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `images`
--
ALTER TABLE `images`
  MODIFY `img_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `locale`
--
ALTER TABLE `locale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `products_img`
--
ALTER TABLE `products_img`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `fk_group_id` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_loc_id` FOREIGN KEY (`loc_id`) REFERENCES `loc_keys` (`loc_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_parent_cat` FOREIGN KEY (`parent_cat`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `locale`
--
ALTER TABLE `locale`
  ADD CONSTRAINT `fk_locale_id` FOREIGN KEY (`loc_id`) REFERENCES `loc_keys` (`loc_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `fk_parent_menu` FOREIGN KEY (`parent_menu`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_value` FOREIGN KEY (`value`) REFERENCES `loc_keys` (`loc_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_description` FOREIGN KEY (`description`) REFERENCES `loc_keys` (`loc_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_short_description` FOREIGN KEY (`short_description`) REFERENCES `loc_keys` (`loc_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_title` FOREIGN KEY (`title`) REFERENCES `loc_keys` (`loc_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `products_img`
--
ALTER TABLE `products_img`
  ADD CONSTRAINT `fk_img_id` FOREIGN KEY (`img`) REFERENCES `images` (`img_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
