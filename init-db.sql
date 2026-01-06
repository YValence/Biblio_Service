-- Créer les 3 bases de données
CREATE DATABASE IF NOT EXISTS userdb;
CREATE DATABASE IF NOT EXISTS livredb;
CREATE DATABASE IF NOT EXISTS empruntdb;

-- Donner tous les droits
GRANT ALL PRIVILEGES ON userdb.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON livredb.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON empruntdb.* TO 'root'@'%';
FLUSH PRIVILEGES;

