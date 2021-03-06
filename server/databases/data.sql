SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `mydb`;

INSERT INTO `groups` (`id`, `group_name`) VALUES
(2, 'admin');

INSERT INTO `sessions` (`id`, `name`) VALUES
(1, '/manage'),
(2, '/client');

INSERT INTO `users` (`user_id`, `password`) VALUES
('test', 'test');

INSERT INTO `loc_keys` (`loc_id`) VALUES
('category_##57'),
('category_##62'),
('category_##76'),
('category_##77'),
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
(233, 'category_##57', 'Tech', 'en'),
(234, 'category_##57', 'Technologie', 'fr'),
(248, 'category_##62', 'Lave-vaiselle', 'en'),
(249, 'category_##62', 'Lave-vaiselle', 'fr'),
(426, 'category_##76', 'kiki', 'en'),
(427, 'category_##76', 'kiki', 'fr'),
(460, 'category_##77', 'nouvelle', 'en'),
(461, 'category_##77', 'nouvelle', 'fr'),
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
(769, 'MUpdateKeyVal_core', '', 'de');

INSERT INTO `categories` (`id`, `loc_id`, `parent_cat`) VALUES
(57, 'category_##57', NULL),
(77, 'category_##77', 57);
INSERT INTO `admin` (`user_id`, `password`, `group_id`) VALUES
('test', 'test', 2);

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
(13, NULL, NULL, NULL, 0, 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
