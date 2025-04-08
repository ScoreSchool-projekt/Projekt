CREATE DATABASE scoreschool
    CHARACTER SET utf8
    COLLATE utf8_general_ci;

USE scoreschool;
    
CREATE TABLE profil (
    id INT AUTO_INCREMENT PRIMARY KEY,
   nev VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    jelszo VARCHAR(255) NOT NULL
);

CREATE TABLE torna (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profilid INT NOT NULL,
    tornaneve VARCHAR(255),
    ev YEAR,
    csoportokszama INT DEFAULT 0,
    csapatokszama INT DEFAULT 0,
    gyoztescsapat VARCHAR(255) NULL,
    FOREIGN KEY (profilid) REFERENCES profil(id) ON DELETE CASCADE
);

CREATE TABLE csapat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tornaid INT NOT NULL,
    profilid INT NOT NULL,
    gyozelmek INT DEFAULT 0,
    veresegek INT DEFAULT 0,
    dontetlenek INT DEFAULT 0,
    csapatneve VARCHAR(255),
    FOREIGN KEY (profilid) REFERENCES profil(id) ON DELETE CASCADE,
   FOREIGN KEY (tornaid) REFERENCES torna(id) ON DELETE CASCADE
);

CREATE TABLE jatekos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    csapatid INT NOT NULL,
    golokszama INT DEFAULT 0,
    sargalapok INT DEFAULT 0,
    piroslapok INT DEFAULT 0,
    nev VARCHAR(255),
    pozicio VARCHAR(255),
    FOREIGN KEY (csapatid) REFERENCES csapat(id) ON DELETE CASCADE
);

CREATE TABLE meccs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tornaid INT NOT NULL,
    meccstipusa VARCHAR(255),
    csapat1 INT,
    csapat2 INT,
    cs1gol INT DEFAULT 0,
    cs2gol INT DEFAULT 0,
    datum VARCHAR(255) NOT NULL,
    FOREIGN KEY (csapat1) REFERENCES csapat(id) ON DELETE CASCADE,
    FOREIGN KEY (csapat2) REFERENCES csapat(id) ON DELETE CASCADE,
  FOREIGN KEY (tornaid) REFERENCES torna(id) ON DELETE CASCADE
);

CREATE TABLE csoport (
    id INT AUTO_INCREMENT PRIMARY KEY,
    csoportid INT,
    tornaid INT NOT NULL,
    csapatid INT,
    kapottgolok INT DEFAULT 0,
    rugottgolok INT DEFAULT 0,
    golkulonbseg INT DEFAULT 0,
    pontok INT DEFAULT 0,
    FOREIGN KEY (tornaid) REFERENCES torna(id) ON DELETE CASCADE,
    FOREIGN KEY (csapatid) REFERENCES csapat(id) ON DELETE CASCADE
);