INSERT INTO users (name, email, created_at, updated_at, is_admin, vote_banned_until, propose_banned_until) VALUES
('santi', 'santi@gmail.com', NOW(), NOW(), 0, '2024-06-29', '2024-06-29'),
('alvaro', 'alvaro@gmail.com', NOW(), NOW(), 0, '2024-06-29', '2024-06-29'),
('david', 'david@gmail.com', NOW(), NOW(), 0, null, null),
('miquel', 'miquel@gmail.com', NOW(), NOW(), 0, null, null),
('pedro', 'pedro@gmail.com', NOW(), NOW(), 0, null, '2024-05-15'),
('raul', 'raul@gmail.com', NOW(), NOW(), 0, '2024-04-02', null),
('admin', 'admin@gmail.com', NOW(), NOW(), 1, null, null);

INSERT INTO blacklist (nom, spotify_id) VALUES
('Anaconda', 1),
('Drugstory', 2),
('Bitch Mode', 3);

INSERT INTO class_groups (name, abbreviation, is_public) VALUES
('ESO', 'ES', 1),
('Batxillerat', 'BAT', 1),
('SMX', 'SMX', 1),
('DAW', 'DAW', 1),
('DAM', 'DAM', 1),
('DAM-VOID', 'DAMV', 1),
('ASIX', 'ASIX', 1),
('A3D', 'A3D', 1),
('Professors', 'PROF', 0),
('Administració', 'ADM', 0),
('Secretaria', 'SEC', 0),
('Cuina', 'CUIN', 0),
('Neteja', 'NET', 0),
('Direcció', 'DIR', 0);
