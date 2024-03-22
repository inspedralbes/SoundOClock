INSERT INTO `roles` (name, description) VALUES 
('Administrator', 'All power'),
('Moderator', 'Censor users and songs'),
('Professor', 'User that will vote on more than one group (class)'),
('Student', 'User that will vote in only one group (class)');

INSERT INTO users (name, email, created_at, updated_at, role_id) VALUES
('admin', 'admin@gmail.com', NOW(), NOW(), 1),
('moderator', 'moderator@gmail.com', NOW(), NOW(), 2),
('professor', 'professor@gmail.com', NOW(), NOW(), 3),
('student', 'student@gmail.com', NOW(), NOW(), 4),
('santi', 'santi@gmail.com', NOW(), NOW(), 4),
('alvaro', 'alvaro@gmail.com', NOW(), NOW(), 4),
('david', 'david@gmail.com', NOW(), NOW(), 4),
('miquel', 'miquel@gmail.com', NOW(), NOW(), 4),
('pedro', 'pedro@gmail.com', NOW(), NOW(), 4),
('raul', 'raul@gmail.com', NOW(), NOW(), 4);

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
