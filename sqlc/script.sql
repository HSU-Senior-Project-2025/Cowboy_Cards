
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
	set_name TEXT NOT NULL,
	set_description TEXT NOT NULL,
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
	class_name TEXT NOT NULL,
	class_description TEXT NOT NULL,
	join_code TEXT,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	PRIMARY KEY (id)
) TABLESPACE pg_default;


INSERT INTO classes VALUES (DEFAULT, '3rd Grade Math', 'Elementary math, 3rd grade', 'lemmein1',DEFAULT,DEFAULT);
INSERT INTO classes VALUES (DEFAULT, '1st Grade Math', 'Elementary math, 1st grade', 'lemmein2',DEFAULT,DEFAULT);
INSERT INTO classes VALUES (DEFAULT, '2nd Grade Math', 'Elementary math, 2nd grade', 'lemmein3',DEFAULT,DEFAULT);
INSERT INTO classes VALUES (DEFAULT, '4th Grade Math', 'Elementary math, 4th grade', 'lemmein4',DEFAULT,DEFAULT);
INSERT INTO classes VALUES (DEFAULT, '5th Grade Math', 'Elementary math, 5th grade', 'lemmein5',DEFAULT,DEFAULT);


CREATE TABLE card_history (
	user_id INTEGER NOT NULL,
	card_id INTEGER NOT NULL,
	score INTEGER DEFAULT 0 NOT NULL,
	times_attempted INTEGER DEFAULT 1 NOT NULL,
	is_mastered BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
	PRIMARY KEY (user_id,card_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (card_id) REFERENCES flashcards(id) ON DELETE CASCADE ON UPDATE CASCADE
) TABLESPACE pg_default;

INSERT INTO card_history VALUES (1,1,DEFAULT,DEFAULT,DEFAULT,DEFAULT);
INSERT INTO card_history VALUES (1,2,DEFAULT,DEFAULT,DEFAULT,DEFAULT);
INSERT INTO card_history VALUES (1,3,DEFAULT,DEFAULT,DEFAULT,DEFAULT);
INSERT INTO card_history VALUES (2,1,DEFAULT,DEFAULT,DEFAULT,DEFAULT);
INSERT INTO card_history VALUES (2,2,DEFAULT,DEFAULT,DEFAULT,DEFAULT);


CREATE TABLE class_user (
	user_id INTEGER NOT NULL,
	class_id INTEGER NOT NULL, 
	role TEXT NOT NULL CHECK (role IN ('student', 'teacher')) DEFAULT 'student',
	PRIMARY KEY(user_id, class_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE ON UPDATE CASCADE
) TABLESPACE pg_default;

INSERT INTO class_user VALUES (1,1,DEFAULT);
INSERT INTO class_user VALUES (1,2,DEFAULT);
INSERT INTO class_user VALUES (2,1,'teacher');
INSERT INTO class_user VALUES (2,2,DEFAULT);
INSERT INTO class_user VALUES (3,1,DEFAULT);


CREATE TABLE class_set (
	class_id INTEGER,
	set_id INTEGER,
	PRIMARY KEY(class_id, set_id),
	FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (set_id) REFERENCES flashcard_sets(id) ON DELETE CASCADE ON UPDATE CASCADE
) TABLESPACE pg_default;

INSERT INTO class_set VALUES (3,1);
INSERT INTO class_set VALUES (1,1);
INSERT INTO class_set VALUES (2,1);
INSERT INTO class_set VALUES (3,3);
INSERT INTO class_set VALUES (3,2);

CREATE TABLE set_user (
	user_id INTEGER, 
	set_id INTEGER, 
	set_score INTEGER DEFAULT 0,
	is_private BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (user_id, set_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (set_id) REFERENCES flashcard_sets(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE FUNCTION update_set_score() RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO set_user (user_id, set_id, set_score, is_private) VALUES (NEW.user_id, (SELECT set_id FROM flashcards WHERE id = NEW.card_id), NEW.score, DEFAULT)
	ON CONFLICT (user_id, set_id)
	DO UPDATE SET set_score = (set_user.set_score + 1) 
	WHERE NEW.user_id = set_user.user_id AND set_user.set_id = (SELECT set_id FROM flashcards WHERE id = NEW.card_id);
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leaderboard
BEFORE UPDATE ON card_history
FOR EACH ROW 
WHEN (OLD.score IS DISTINCT FROM NEW.score)
EXECUTE FUNCTION update_set_score();