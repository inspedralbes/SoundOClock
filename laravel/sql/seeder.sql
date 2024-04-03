INSERT INTO `roles` (name, description) VALUES 
('Administrator', 'All power'),
('Moderator', 'Censor users and songs'),
('Professor', 'User that will vote on more than one group (class)'),
('Student', 'User that will vote in only one group (class)');

INSERT INTO `users` (`id`, `name`, `email`, `role_id`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@gmail.com', 1, NULL, NULL, '2024-04-02 09:46:01', '2024-04-02 09:46:01'),
(2, 'moderator', 'moderator@gmail.com', 2, NULL, NULL, '2024-04-02 09:46:01', '2024-04-02 09:46:01'),
(3, 'professor', 'professor@gmail.com', 3, NULL, NULL, '2024-04-02 09:46:01', '2024-04-02 09:46:01'),
(4, 'student', 'student@gmail.com', 4, NULL, NULL, '2024-04-02 09:46:01', '2024-04-02 09:46:01'),
(5, 'santi', 'santi@gmail.com', 4, NULL, NULL, '2024-04-02 09:46:01', '2024-04-02 09:46:01'),
(6, 'alvaro', 'alvaro@gmail.com', 4, NULL, NULL, '2024-04-02 09:46:01', '2024-04-02 09:46:01'),
(7, 'david', 'david@gmail.com', 4, NULL, NULL, '2024-04-02 09:46:01', '2024-04-02 09:46:01'),
(8, 'miquel', 'miquel@gmail.com', 4, NULL, NULL, '2024-04-02 09:46:01', '2024-04-02 09:46:01'),
(9, 'pedro', 'pedro@gmail.com', 4, NULL, NULL, '2024-04-02 09:46:01', '2024-04-02 09:46:01'),
(10, 'Raúl A22 Espinosa Gómez', 'a22rauespgom@inspedralbes.cat', 1, NULL, NULL, '2024-04-02 10:55:36', '2024-04-02 10:55:36');


INSERT INTO blacklist (nom, spotify_id) VALUES
('Anaconda', 1),
('Drugstory', 2),
('Bitch Mode', 3);

INSERT INTO `groups` (name, abbreviation, is_public, max_courses, max_lines) VALUES
('Escola Secundaria Obligatoria', 'ESO', 1, 4, 26),
('Batxillerat', 'BAT', 1, 2, 26),
('Sistemes Microinformàtics i Xarxes', 'SMX', 1, 2, 26),
('Desenvolupament d''Aplicacions Web', 'DAW', 1, 2, 26),
('Desenvolupament d''Aplicacions Multimplataforma', 'DAM', 1, 2, 26),
('Desenvolupament d''Aplicacions Multimplataforma - Videojocs i Oci Digital', 'DAM-VI', 1, 2, 26),
('Administració de Sistemes Informàtics en Xarxa', 'ASIX', 1, 2, 26),
('Animació 3D, Jocs i Entorns Interactius', 'A3D', 1, 2, 26),
('Curs d''especialització en Desenvolupament de Videojocs', 'CE', 1, 2, 26),
('Programes de Formació i Inserció', 'PFI', 1, 2, 26),
('Direcció','DIR',0,1,1);
