CREATE TABLE users (
	id SERIAL,
	username TEXT NOT NULL UNIQUE,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
    last_login TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    login_streak INTEGER NOT NULL DEFAULT 1,
	created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP(2),
	updated_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP(2),
	CHECK (LENGTH(password) >= 8),
	PRIMARY KEY (id)
);

CREATE TABLE flashcard_sets (
	id SERIAL, 
	set_name TEXT NOT NULL,
	set_description TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP(2),
	updated_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP(2),
	PRIMARY KEY (id)
);

CREATE TABLE flashcards (
	id SERIAL, 
	front TEXT NOT NULL,
	back TEXT NOT NULL,
	set_id INTEGER NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP(2),
	updated_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP(2),
	PRIMARY KEY (id,set_id),
	FOREIGN KEY (set_id) REFERENCES flashcard_sets(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE classes (
	id SERIAL, 
	class_name TEXT NOT NULL,
	class_description TEXT NOT NULL,
	join_code TEXT,
	created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP(2),
	updated_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP(2),
	PRIMARY KEY (id)
);

CREATE TABLE card_history (
	user_id INTEGER NOT NULL,
	card_id INTEGER NOT NULL,
	score INTEGER DEFAULT 0 NOT NULL,
	times_attempted INTEGER DEFAULT 1 NOT NULL,
	is_mastered BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP(2),
	PRIMARY KEY (user_id,card_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (card_id) REFERENCES flashcards(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE class_user (
	user_id INTEGER NOT NULL,
	class_id INTEGER NOT NULL, 
	role TEXT NOT NULL CHECK (role IN ('student', 'teacher')) DEFAULT 'student',
	PRIMARY KEY(user_id, class_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE class_set (
	class_id INTEGER,
	set_id INTEGER,
	PRIMARY KEY(class_id, set_id),
	FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (set_id) REFERENCES flashcard_sets(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE set_user (
	user_id INTEGER, 
	set_id INTEGER, 
	role TEXT NOT NULL CHECK (role IN ('user', 'owner')) DEFAULT 'user',
	set_score INTEGER NOT NULL DEFAULT 0,
	is_private BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (user_id, set_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (set_id) REFERENCES flashcard_sets(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE FUNCTION update_set_score() RETURNS TRIGGER SET SEARCH_PATH = public AS $$

DECLARE
   setid INTEGER;

BEGIN
    setid = (SELECT set_id FROM flashcards WHERE id = NEW.card_id);
	INSERT INTO set_user (user_id, set_id, DEFAULT, set_score, is_private) VALUES (NEW.user_id, setid, NEW.score, DEFAULT)
	ON CONFLICT (user_id, set_id)
	DO UPDATE SET set_score = (set_user.set_score + 1) 
	WHERE NEW.user_id = set_user.user_id AND set_user.set_id = setid;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leaderboard
BEFORE UPDATE ON card_history
FOR EACH ROW 
WHEN (OLD.score IS DISTINCT FROM NEW.score)
EXECUTE FUNCTION update_set_score();