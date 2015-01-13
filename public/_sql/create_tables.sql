CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	login varchar(26),
	password varchar(30)
) DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

CREATE TABLE images (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(48),
	title varchar(48),
	author varchar(26),
	data_dodania TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;