INSERT INTO `roles` (id, name, description) VALUES 
(1,'Tech', 'User that will have access to the tech section'),
(2,'Administrator', 'All power'),
(3,'Moderator', 'Censor users and songs'),
(4,'Professor', 'User that will vote on more than one group (class)'),
(5,'Student', 'User that will vote in only one group (class)');

INSERT INTO `group_categories` (id, name, abbreviation, is_public) VALUES
(1, 'Educació Secundària Obligatòria', 'ESO', 1),
(2, 'Batxillerat', 'BATX', 1),
(3, 'Cicles Formatius', 'CF', 1),
(4, 'Programes de Formació i Inserció', 'PFI', 1),
(5, 'Professorat', 'PROF', 0);

INSERT INTO `groups` (name, abbreviation, is_public, category_id) VALUES
('1er Educació Secundària Obligatòria', '1 ESO', 1, 1),
('2on Educació Secundària Obligatòria', '2 ESO', 1, 1),
('3er Educació Secundària Obligatòria', '3 ESO', 1, 1),
('4rt Educació Secundària Obligatòria', '4 ESO', 1, 1),
('1er Batxillerat', '1 BATX', 1, 2),
('2on Batxillerat', '2 BATX', 1, 2),
('1er Sistemes Microinformàtics i Xarxes', '1 SMX', 1, 3),
('2on Sistemes Microinformàtics i Xarxes', '2 SMX', 1, 3),
('1er Desenvolupament d''Aplicacions Web', '1 DAW', 1, 3),
('2on Desenvolupament d''Aplicacions Web', '2 DAW', 1, 3),
('1er Desenvolupament d''Aplicacions Multiplataforma', '1 DAM', 1, 3),
('2on Desenvolupament d''Aplicacions Multiplataforma', '2 DAM', 1, 3),
('1er Desenvolupament d''Aplicacions Multiplataforma - Videojocs i Oci Digital', '1 DAM-VI', 1, 3),
('2on Desenvolupament d''Aplicacions Multiplataforma - Videojocs i Oci Digital', '2 DAM-VI', 1, 3),
('1er Administració de Sistemes Informàtics en Xarxa', '1 ASIX', 1, 3),
('2on Administració de Sistemes Informàtics en Xarxa', '2 ASIX', 1, 3),
('1er Animació 3D, Jocs i Entorns Interactius', '1 A3D', 1, 3),
('2on Animació 3D, Jocs i Entorns Interactius', '2 A3D', 1, 3),
('1er Curs d''especialització en Desenvolupament de Videojocs', '1 CE', 1, 3),
('2on Curs d''especialització en Desenvolupament de Videojocs', '2 CE', 1, 3),
('1er Programes de Formació i Inserció', '1 PFI', 1, 4),
('2on Programes de Formació i Inserció', '2 PFI', 1, 4),
('Direcció', 'DIR', 0, 5),
('Secretaria', 'SECR', 0, 5),
('Professorat Música', 'PROF MUS', 0, 5);

INSERT INTO `bells` (hour) VALUES
('08:00'),
('09:00'),
('10:00'),
('11:00'),
('11:30'),
('12:30'),
('13:30'),
('14:30'),
('15:00'),
('15:30'),
('16:00'),
('16:30'),
('17:00'),
('17:30'),
('18:00'),
('19:00'),
('20:00'),
('21:00');

INSERT INTO `bell_group` (bell_id, group_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (2, 1), (2, 2),(2, 3), (3, 2), (3, 4), (4, 5), (5, 6);

INSERT INTO `settings` (`start_vote`, `end_vote`, `start_moderation`, `end_moderation`, `theme`) VALUES
 ('2024-05-15', '2024-05-31', '2024-06-01', '2024-06-02', 'Hola');