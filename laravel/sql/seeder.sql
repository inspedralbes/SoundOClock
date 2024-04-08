INSERT INTO `roles` (name, description) VALUES 
('Administrator', 'All power'),
('Moderator', 'Censor users and songs'),
('Professor', 'User that will vote on more than one group (class)'),
('Student', 'User that will vote in only one group (class)');

INSERT INTO users (name, email, created_at, updated_at, role_id, vote_banned_until, propose_banned_until) VALUES
('admin', 'admin@gmail.com', NOW(), NOW(), 1, null, null),
('moderator', 'moderator@gmail.com', NOW(), NOW(), 2, null, null),
('professor', 'professor@gmail.com', NOW(), NOW(), 3, null, null),
('student', 'student@gmail.com', NOW(), NOW(), 4, null, null),
('santi', 'santi@gmail.com', NOW(), NOW(), 4, '2024-06-29', '2024-06-29'),
('alvaro', 'alvaro@gmail.com', NOW(), NOW(), 4, null, '2024-05-15'),
('david', 'david@gmail.com', NOW(), NOW(), 4, '2024-04-02', null),
('miquel', 'miquel@gmail.com', NOW(), NOW(), 4, null, null),
('pedro', 'pedro@gmail.com', NOW(), NOW(), 4, null, null),
('raul', 'raul@gmail.com', NOW(), NOW(), 4, null, null);

INSERT INTO blacklist (spotify_id, title, artist, image, preview_url) VALUES
('0TlLq3lA83rQOYtrqBqSct', 'Nonstop', 'Drake', 'https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5',''),
('5lwWpQ71GKN3sWmk8zZr9g', 'Red Sun', 'Dreamcatcher', 'https://i.scdn.co/image/ab67616d00001e0219224fae0aa53341020f5b12', '');

INSERT INTO `groups` (name, abbreviation, is_public, max_courses) VALUES
('Escola Secundaria Obligatoria', 'ESO', 1, 4),
('Batxillerat', 'BATX', 1, 2),
('Sistemes Microinformàtics i Xarxes', 'SMX', 1, 2),
('Desenvolupament d''Aplicacions Web', 'DAW', 1, 2),
('Desenvolupament d''Aplicacions Multiplataforma', 'DAM', 1, 2),
('Desenvolupament d''Aplicacions Multiplataforma - Videojocs i Oci Digital', 'DAM-VI', 1, 2),
('Administració de Sistemes Informàtics en Xarxa', 'ASIX', 1, 2),
('Animació 3D, Jocs i Entorns Interactius', 'A3D', 1, 2),
('Curs d''especialització en Desenvolupament de Videojocs', 'CE', 1, 2),
('Programes de Formació i Inserció', 'PFI', 1, 2),
('Direcció', 'DIR', 0, 1);

INSERT INTO `bells` (hour) VALUES
('08:00'),
('09:00'),
('10:00'),
('11:00'),
('11:30'),
('12:30'),
('13:30'),
('14:30'),
('15:30'),
('16:30'),
('17:30'),
('18:00'),
('19:00'),
('20:00'),
('21:00');

INSERT INTO `bell_group` (bell_id, group_id) VALUES
(1, 1), (2, 1), (2, 2),(2, 3), (3, 2), (3, 4), (4, 5), (5, 6);
