INSERT INTO users (name, email, created_at, updated_at, is_admin) VALUES
('santi', 'santi@gmail.com', NOW(), NOW(), 0),
('alvaro', 'alvaro@gmail.com', NOW(), NOW(), 0),
('david', 'david@gmail.com', NOW(), NOW(), 0),
('miquel', 'miquel@gmail.com', NOW(), NOW(), 0),
('pedro', 'pedro@gmail.com', NOW(), NOW(), 0),
('raul', 'raul@gmail.com', NOW(), NOW(), 0),
('admin', 'admin@gmail.com', NOW(), NOW(), 1);

INSERT INTO blacklist (nom, spotify_id) VALUES
('Anaconda', 1),
('Drugstory', 2),
('Bitch Mode', 3);

INSERT INTO class_groups (name, abbreviation, is_public, max_courses, max_lines) VALUES
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

