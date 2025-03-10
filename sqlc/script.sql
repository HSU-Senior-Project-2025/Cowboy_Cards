
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
SET SEARCH_PATH TO public;

CREATE TABLE users (
	id SERIAL,
	username TEXT NOT NULL UNIQUE,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	CHECK (LENGTH(password) >= 8),
	PRIMARY KEY (id)
) TABLESPACE pg_default;

INSERT INTO users VALUES (DEFAULT, 'abebell',  'Abe', 'Bell', 'abell@mail', 'lleba123', DEFAULT,DEFAULT);
INSERT INTO users VALUES (DEFAULT, 'caldwyer', 'Cal', 'Dwyer', 'cdwyer@mail', 'reywdc12', DEFAULT,DEFAULT);
INSERT INTO users VALUES (DEFAULT, 'edfritz',  'Ed',  'Fritz', 'efritz@mail', 'ztirfe12', DEFAULT,DEFAULT);
INSERT INTO users VALUES (DEFAULT, 'guyhyde',  'Guy', 'Hyde', 'ghyde@mail', 'edyhg123', DEFAULT,DEFAULT);
INSERT INTO users VALUES (12, 'ikeknight','Ike', 'Knight',	'iknight@mail', 'thginki1', DEFAULT,DEFAULT);


CREATE TABLE flashcard_sets (
	id SERIAL, 
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	PRIMARY KEY (id)
) TABLESPACE pg_default;


INSERT INTO flashcard_sets VALUES (DEFAULT, 'arithmetic', 'simple addition', DEFAULT,DEFAULT);
INSERT INTO flashcard_sets VALUES (DEFAULT, 'arithmetic', 'simple subtraction' ,DEFAULT,DEFAULT);
INSERT INTO flashcard_sets VALUES (DEFAULT, 'arithmetic', 'simple multiplication',DEFAULT,DEFAULT);
INSERT INTO flashcard_sets VALUES (DEFAULT, 'arithmetic', 'simple division', DEFAULT,DEFAULT);
INSERT INTO flashcard_sets VALUES (DEFAULT, 'calculus', 'simple derivatives', DEFAULT,DEFAULT);

CREATE TABLE flashcards (
	id SERIAL, 
	front TEXT NOT NULL,
	back TEXT NOT NULL,
	set_id INTEGER NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	PRIMARY KEY (id),
	FOREIGN KEY (set_id) REFERENCES flashcard_sets(id) ON DELETE CASCADE ON UPDATE CASCADE
) TABLESPACE pg_default;


INSERT INTO flashcards VALUES (DEFAULT, '1 + 1 =', '2', 1, DEFAULT,DEFAULT);
INSERT INTO flashcards VALUES (DEFAULT, '2 + 3 =', '5', 1, DEFAULT,DEFAULT);
INSERT INTO flashcards VALUES (DEFAULT, '4 + 5 =', '9', 1, DEFAULT,DEFAULT);
INSERT INTO flashcards VALUES (DEFAULT, '0 + 3 =', '3', 1, DEFAULT,DEFAULT);
INSERT INTO flashcards VALUES (DEFAULT, '7 + 2 =', '9', 1, DEFAULT,DEFAULT);


CREATE TABLE classes (
	id SERIAL, 
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	join_code TEXT NOT NULL,
	teacher_id INTEGER,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	PRIMARY KEY (id),
	FOREIGN KEY (teacher_id) REFERENCES users(id),
	UNIQUE (join_code)
) TABLESPACE pg_default;


INSERT INTO classes VALUES (DEFAULT, '3rd Grade Math', 'Elementary math, 3rd grade', 'lemmein1', 12,DEFAULT,DEFAULT);
INSERT INTO classes VALUES (DEFAULT, '1st Grade Math', 'Elementary math, 1st grade', 'lemmein2', 12,DEFAULT,DEFAULT);
INSERT INTO classes VALUES (DEFAULT, '2nd Grade Math', 'Elementary math, 2nd grade', 'lemmein3', 12,DEFAULT,DEFAULT);
INSERT INTO classes VALUES (DEFAULT, '4th Grade Math', 'Elementary math, 4th grade', 'lemmein4', 12,DEFAULT,DEFAULT);
INSERT INTO classes VALUES (DEFAULT, '5th Grade Math', 'Elementary math, 5th grade', 'lemmein5', 12,DEFAULT,DEFAULT);


CREATE TABLE user_card_history (
	user_id INTEGER NOT NULL,
	card_id INTEGER NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	times_seen INTEGER DEFAULT 0, 
	is_mastered BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (user_id,card_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (card_id) REFERENCES flashcards(id) ON DELETE CASCADE ON UPDATE CASCADE
) TABLESPACE pg_default;

CREATE TABLE class_user (
	user_id INTEGER NOT NULL,
	class_id INTEGER NOT NULL, 
	role TEXT NOT NULL,
	PRIMARY KEY(user_id, class_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE ON UPDATE CASCADE
) TABLESPACE pg_default;

CREATE TABLE class_set (
	class_id INTEGER,
	set_id INTEGER,
	PRIMARY KEY(class_id, set_id),
	FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (set_id) REFERENCES flashcard_sets(id) ON DELETE CASCADE ON UPDATE CASCADE
) TABLESPACE pg_default;