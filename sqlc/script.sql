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
  reset_token TEXT,
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
  primary key (user_id, set_id),
  foreign KEY (user_id) references users (id) on delete CASCADE on update CASCADE,
  foreign KEY (set_id) references flashcard_sets (id) on delete CASCADE on update CASCADE
) TABLESPACE pg_default;

--pws are 4ededed$ED
insert into
  users (username, email, password, first_name, last_name)
values
  (
    'john_doe',
    'john@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'John',
    'Doe'
  ),
  (
    'jane_smith',
    'jane@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Jane',
    'Smith'
  ),
  (
    'bob_johnson',
    'bob@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Bob',
    'Johnson'
  ),
  (
    'alice_brown',
    'alice@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Alice',
    'Brown'
  ),
  (
    'charlie_davis',
    'charlie@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Charlie',
    'Davis'
  ),
  (
    'david_wilson',
    'david@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'David',
    'Wilson'
  ),
  (
    'emily_taylor',
    'emily@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Emily',
    'Taylor'
  ),
  (
    'frank_martin',
    'frank@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Frank',
    'Martin'
  ),
  (
    'grace_hall',
    'grace@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Grace',
    'Hall'
  ),
  (
    'henry_baker',
    'henry@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Henry',
    'Baker'
  ),
  (
    'isabella_clark',
    'isabella@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Isabella',
    'Clark'
  ),
  (
    'james_parker',
    'james@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'James',
    'Parker'
  ),
  (
    'katherine_white',
    'katherine@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Katherine',
    'White'
  ),
  (
    'lucas_garcia',
    'lucas@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
    'Lucas',
    'Garcia'
  ),
  (
    'mary_lewis',
    'mary@example.com',
    '$2a$10$NeGG/swWku/ZWPVXmfBZiuj9l7.1AMmzb/Mgzl8awfTFV1Uqh5C8y',
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
  (9, 'Hallo', 'Hello'),
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
  card_history (user_id, card_id, score, times_attempted)
values
  (1, 1, 2, 17),
  (1, 2, 8, 12),
  (2, 4, 9, 11),
  (3, 7, 8, 12),
  (4, 10, 8, 15),
  (5, 13, 9, 12),
  (1, 5, 7, 11),
  (3, 15, 8, 12),
  (4, 12, 9, 19),
  (6, 15, 6, 12),
  (7, 16, 9, 11),
  (8, 17, 8, 13),
  (9, 18, 9, 12),
  (10, 19, 7, 11),
  (11, 20, 9, 16),
  (12, 21, 9, 12),
  (13, 22, 8, 12),
  (6, 23, 7, 11),
  (8, 24, 9, 12);

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
  set_user (user_id, set_id, role, set_score)
values
  (1, 1, 'user', 45),
  (2, 2, 'owner', 50),
  (3, 1, 'user', 38),
  (4, 3, 'user', 42),
  (5, 4, 'owner', 48),
  (1, 5, 'user', 40),
  (6, 6, 'user', 38),
  (7, 7, 'owner', 50),
  (8, 8, 'user', 42),
  (9, 9, 'user', 40),
  (10, 10, 'owner', 48),
  (11, 11, 'user', 44),
  (12, 12, 'user', 46),
  (13, 13, 'owner', 45),
  (6, 13, 'user', 39),
  (8, 10, 'user', 41);

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

insert into
  flashcard_sets (set_name, set_description)
values
  (
    'Basic Koiné Greek',
    'Common vocabulary words for students of Biblical (Koiné) Greek'
  ),
  (
    'Intermediate Koiné Greek',
    'Expanding vocabulary, verb forms, and syntax'
  ),
  (
    'Advanced Koiné Greek',
    'Less common words, participles, subjunctive/optative moods'
  ),
  (
    'Basic Biblical Hebrew',
    'Common vocabulary words for students of Biblical Hebrew'
  ),
  (
    'Intermediate Biblical Hebrew',
    'Expanding vocabulary and grammar for Biblical Hebrew'
  ),
  (
    'Advanced Biblical Hebrew',
    'Less common words, rarer stems, and complex concepts'
  );

insert into
  classes (class_name, class_description)
values
  (
    'Biblical Greek Studies',
    'Comprehensive course covering Basic to Advanced Biblical Greek'
  ),
  (
    'Biblical Hebrew Studies',
    'Comprehensive course covering Basic to Advanced Biblical Hebrew'
  );

insert into
  class_user (user_id, class_id, role)
values
  (
    1,
    (
      select
        id
      from
        classes
      where
        class_name = 'Biblical Hebrew Studies'
    ),
    'teacher'
  ),
  (
    2,
    (
      select
        id
      from
        classes
      where
        class_name = 'Biblical Greek Studies'
    ),
    'teacher'
  );