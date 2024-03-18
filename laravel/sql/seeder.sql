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

INSERT INTO class_groups (name, is_public) VALUES
('ESO',1),
('Batxillerat',1),
('Batxillerat Internacional',1),
('SMX',1),
('DAW',1),
('DAM',1),
('DAM-VIOD',1),
('ASIX',1),
('A3D',1),
('Direcció',0);
