drop schema public CASCADE;

create schema public;

set
  SEARCH_PATH to public;

create table users (
  id SERIAL,
  username TEXT not null unique,
  first_name TEXT not null,
  last_name TEXT not null,
  email TEXT not null unique,
  password TEXT not null,
  last_login DATE not null default CURRENT_DATE,
  login_streak INTEGER not null default 1,
  created_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  updated_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  check (LENGTH(password) >= 8),
  primary key (id)
) TABLESPACE pg_default;

create table flashcard_sets (
  id SERIAL,
  set_name TEXT not null,
  set_description TEXT not null,
  created_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  updated_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  primary key (id)
) TABLESPACE pg_default;

create table flashcards (
  id SERIAL,
  front TEXT not null,
  back TEXT not null,
  set_id INTEGER not null,
  created_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  updated_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  primary key (id),
  foreign KEY (set_id) references flashcard_sets (id) on delete CASCADE on update CASCADE
) TABLESPACE pg_default;

create table classes (
  id SERIAL,
  class_name TEXT not null,
  class_description TEXT not null,
  created_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  updated_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  primary key (id)
) TABLESPACE pg_default;

create table card_history (
  user_id INTEGER not null,
  card_id INTEGER not null,
  score INTEGER default 0 not null,
  times_attempted INTEGER default 1 not null,
  is_mastered BOOLEAN not null default false,
  created_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  primary key (user_id, card_id),
  foreign KEY (user_id) references users (id) on delete CASCADE on update CASCADE,
  foreign KEY (card_id) references flashcards (id) on delete CASCADE on update CASCADE
) TABLESPACE pg_default;

create table class_user (
  user_id INTEGER not null,
  class_id INTEGER not null,
  role TEXT not null check (role in ('student', 'teacher')) default 'student',
  primary key (user_id, class_id),
  foreign KEY (user_id) references users (id) on delete CASCADE on update CASCADE,
  foreign KEY (class_id) references classes (id) on delete CASCADE on update CASCADE
) TABLESPACE pg_default;

create table class_set (
  class_id INTEGER,
  set_id INTEGER,
  primary key (class_id, set_id),
  foreign KEY (class_id) references classes (id) on delete CASCADE on update CASCADE,
  foreign KEY (set_id) references flashcard_sets (id) on delete CASCADE on update CASCADE
) TABLESPACE pg_default;

create table set_user (
  user_id INTEGER,
  set_id INTEGER,
  role TEXT not null check (role in ('user', 'owner')) default 'user',
  set_score INTEGER not null default 0,
  is_private BOOLEAN not null default false,
  primary key (user_id, set_id),
  foreign KEY (user_id) references users (id) on delete CASCADE on update CASCADE,
  foreign KEY (set_id) references flashcard_sets (id) on delete CASCADE on update CASCADE
) TABLESPACE pg_default;

insert into
  users (username, email, password, first_name, last_name)
values
  (
    'john_doe',
    'john@example.com',
    'password123',
    'John',
    'Doe'
  ),
  (
    'jane_smith',
    'jane@example.com',
    'password456',
    'Jane',
    'Smith'
  ),
  (
    'bob_johnson',
    'bob@example.com',
    'password789',
    'Bob',
    'Johnson'
  ),
  (
    'alice_brown',
    'alice@example.com',
    'password012',
    'Alice',
    'Brown'
  ),
  (
    'charlie_davis',
    'charlie@example.com',
    'password345',
    'Charlie',
    'Davis'
  ),
  (
    'david_wilson',
    'david@example.com',
    'password678',
    'David',
    'Wilson'
  ),
  (
    'emily_taylor',
    'emily@example.com',
    'password234',
    'Emily',
    'Taylor'
  ),
  (
    'frank_martin',
    'frank@example.com',
    'password890',
    'Frank',
    'Martin'
  ),
  (
    'grace_hall',
    'grace@example.com',
    'password567',
    'Grace',
    'Hall'
  ),
  (
    'henry_baker',
    'henry@example.com',
    'password123',
    'Henry',
    'Baker'
  ),
  (
    'isabella_clark',
    'isabella@example.com',
    'password456',
    'Isabella',
    'Clark'
  ),
  (
    'james_parker',
    'james@example.com',
    'password789',
    'James',
    'Parker'
  ),
  (
    'katherine_white',
    'katherine@example.com',
    'password345',
    'Katherine',
    'White'
  ),
  (
    'lucas_garcia',
    'lucas@example.com',
    'password012',
    'Lucas',
    'Garcia'
  ),
  (
    'mary_lewis',
    'mary@example.com',
    'password678',
    'Mary',
    'Lewis'
  );

insert into
  flashcard_sets (set_name, set_description)
values
  ('Basic Spanish', 'Common Spanish phrases'),
  (
    'Python Basics',
    'Python programming fundamentals'
  ),
  ('US History', 'Key events in US history'),
  ('Chemistry Elements', 'Basic chemistry elements'),
  ('French Vocabulary', 'Common French words'),
  (
    'Advanced Spanish',
    'Complex Spanish grammar and phrases'
  ),
  (
    'Data Structures',
    'Python data structures and algorithms'
  ),
  ('World History', 'Global historical events'),
  (
    'Organic Chemistry',
    'Chemistry of organic compounds'
  ),
  (
    'German Vocabulary',
    'Common German words and phrases'
  ),
  ('Statistics', 'Statistical concepts and formulas'),
  ('Philosophy', 'Major philosophical concepts'),
  ('Biology', 'Basic biology concepts'),
  ('Economics', 'Economic principles and theories'),
  ('Physics', 'Basic physics concepts');

insert into
  flashcards (set_id, front, back)
values
  (1, 'Hello', 'Hola'),
  (1, 'Goodbye', 'Adiós'),
  (1, 'Thank you', 'Gracias'),
  (2, 'print()', 'Output function'),
  (2, 'len()', 'Length function'),
  (2, 'list()', 'Create list object'),
  (3, '1776', 'Declaration of Independence'),
  (3, '1861', 'Start of Civil War'),
  (3, '1945', 'End of World War II'),
  (4, 'H', 'Hydrogen'),
  (4, 'He', 'Helium'),
  (4, 'Li', 'Lithium'),
  (5, 'Bonjour', 'Hello'),
  (5, 'Au revoir', 'Goodbye'),
  (5, 'Merci', 'Thank you'),
  (6, 'list.sort()', 'Sorts list in-place'),
  (6, 'list.reverse()', 'Reverses list in-place'),
  (6, 'dict.keys()', 'Returns dictionary keys'),
  (7, '1776', 'American Revolution'),
  (7, '1914', 'Start of WWI'),
  (7, '1945', 'End of WWII'),
  (8, 'H2O', 'Water'),
  (8, 'CO2', 'Carbon dioxide'),
  (8, 'NaCl', 'Sodium chloride'),
  (9, 'Bonjour', 'Hello'),
  (9, 'Danke', 'Thank you'),
  (9, 'Auf Wiedersehen', 'Goodbye'),
  (10, 'mean()', 'Average value'),
  (10, 'median()', 'Middle value'),
  (10, 'std()', 'Standard deviation'),
  (11, 'Plato', 'Greek philosopher'),
  (11, 'Aristotle', 'Student of Plato'),
  (11, 'Socrates', 'Questioning method'),
  (12, 'cell', 'Basic unit of life'),
  (12, 'DNA', 'Genetic material'),
  (12, 'RNA', 'Protein synthesis'),
  (13, 'supply', 'Producer offerings'),
  (13, 'demand', 'Consumer desire'),
  (13, 'market', 'Buyer/seller interaction'),
  (14, 'force', 'Push/pull interaction'),
  (14, 'energy', 'Ability to do work'),
  (14, 'momentum', 'Mass x velocity');

insert into
  classes (class_name, class_description)
values
  ('Spanish 101', 'Beginner Spanish course'),
  ('Python Programming', 'Introduction to Python'),
  ('US History Survey', 'Overview of US history'),
  (
    'Chemistry Fundamentals',
    'Basic chemistry concepts'
  ),
  ('French 101', 'Beginner French course'),
  ('Spanish 202', 'Intermediate Spanish course'),
  ('Data Science', 'Introduction to data analysis'),
  ('World History', 'Global historical perspectives'),
  (
    'Chemistry Lab',
    'Practical chemistry experiments'
  ),
  ('German 101', 'Beginner German course'),
  ('Statistics', 'Statistical analysis methods'),
  ('Philosophy 101', 'Introduction to philosophy'),
  ('Biology Lab', 'Practical biology experiments'),
  ('Economics 101', 'Basic economic principles'),
  ('Physics Lab', 'Practical physics experiments');

insert into
  class_user (user_id, class_id, role)
values
  (1, 1, 'student'),
  (2, 2, 'teacher'),
  (3, 1, 'student'),
  (4, 3, 'student'),
  (5, 4, 'teacher'),
  (1, 2, 'student'),
  (3, 5, 'student'),
  (4, 4, 'student'),
  (6, 6, 'student'),
  (7, 7, 'teacher'),
  (8, 8, 'student'),
  (9, 9, 'student'),
  (10, 10, 'teacher'),
  (11, 11, 'student'),
  (12, 12, 'student'),
  (13, 13, 'teacher'),
  (6, 7, 'student'),
  (8, 10, 'student');

insert into
  card_history (
    user_id,
    card_id,
    score,
    times_attempted,
    is_mastered
  )
values
  (1, 1, 90, 3, true),
  (1, 2, 80, 2, false),
  (2, 4, 95, 1, true),
  (3, 7, 85, 2, false),
  (4, 10, 88, 3, false),
  (5, 13, 92, 2, true),
  (1, 5, 75, 1, false),
  (3, 15, 85, 2, false),
  (4, 12, 90, 3, true),
  (6, 15, 85, 2, false),
  (7, 16, 95, 1, true),
  (8, 17, 88, 3, false),
  (9, 18, 92, 2, true),
  (10, 19, 75, 1, false),
  (11, 20, 90, 3, true),
  (12, 21, 80, 2, false),
  (13, 22, 85, 2, false),
  (6, 23, 78, 1, false),
  (8, 24, 95, 2, true);

insert into
  class_set (class_id, set_id)
values
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5),
  (2, 3),
  (6, 6),
  (7, 7),
  (8, 8),
  (9, 9),
  (10, 10),
  (11, 11),
  (12, 12),
  (13, 13),
  (14, 14),
  (6, 13);

insert into
  set_user (user_id, set_id, role, set_score, is_private)
values
  (1, 1, 'user', 450, false),
  (2, 2, 'owner', 500, false),
  (3, 1, 'user', 380, false),
  (4, 3, 'user', 420, false),
  (5, 4, 'owner', 480, false),
  (1, 5, 'user', 400, false),
  (6, 6, 'user', 380, false),
  (7, 7, 'owner', 500, false),
  (8, 8, 'user', 420, false),
  (9, 9, 'user', 400, false),
  (10, 10, 'owner', 480, false),
  (11, 11, 'user', 440, false),
  (12, 12, 'user', 460, false),
  (13, 13, 'owner', 450, false),
  (6, 13, 'user', 390, false),
  (8, 10, 'user', 410, false);

create or replace function update_set_score () RETURNS TRIGGER
set
  SEARCH_PATH = public as $$

DECLARE
   setid INTEGER;

BEGIN
    setid = (SELECT set_id FROM flashcards WHERE id = NEW.card_id);
	INSERT INTO set_user (user_id, set_id, role, set_score, is_private) VALUES (NEW.user_id, setid, NEW.role, NEW.score, DEFAULT)
	ON CONFLICT (user_id, set_id)
	DO UPDATE SET set_score = (set_user.set_score + 1) 
	WHERE NEW.user_id = set_user.user_id AND set_user.set_id = setid;
  
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create
or replace trigger update_score_trigger BEFORE
update on card_history for EACH row when (OLD.score is distinct from NEW.score)
execute FUNCTION update_set_score ();

create or replace function update_login_streak () RETURNS TRIGGER
set
  SEARCH_PATH = public as $$

BEGIN
    IF NEW.last_login::date - OLD.last_login::date = 1 THEN
        NEW.login_streak := OLD.login_streak + 1;
    ELSIF NEW.last_login::date - OLD.last_login::date > 1 THEN
        NEW.login_streak := 1;
    END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create
or replace trigger update_streak_trigger BEFORE
update on users for EACH row when (NEW.last_login is distinct from OLD.last_login)
execute PROCEDURE update_login_streak ();