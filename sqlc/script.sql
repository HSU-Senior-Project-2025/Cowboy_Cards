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

insert into
  users (username, email, password, first_name, last_name)
values
  (
    'john_doe',
    'john@example.com',
    'edededed',
    'John',
    'Doe'
  ),
  (
    'jane_smith',
    'jane@example.com',
    'edededed',
    'Jane',
    'Smith'
  ),
  (
    'bob_johnson',
    'bob@example.com',
    'edededed',
    'Bob',
    'Johnson'
  ),
  (
    'alice_brown',
    'alice@example.com',
    'edededed',
    'Alice',
    'Brown'
  ),
  (
    'charlie_davis',
    'charlie@example.com',
    'edededed',
    'Charlie',
    'Davis'
  ),
  (
    'david_wilson',
    'david@example.com',
    'edededed',
    'David',
    'Wilson'
  ),
  (
    'emily_taylor',
    'emily@example.com',
    'edededed',
    'Emily',
    'Taylor'
  ),
  (
    'frank_martin',
    'frank@example.com',
    'edededed',
    'Frank',
    'Martin'
  ),
  (
    'grace_hall',
    'grace@example.com',
    'edededed',
    'Grace',
    'Hall'
  ),
  (
    'henry_baker',
    'henry@example.com',
    'edededed',
    'Henry',
    'Baker'
  ),
  (
    'isabella_clark',
    'isabella@example.com',
    'edededed',
    'Isabella',
    'Clark'
  ),
  (
    'james_parker',
    'james@example.com',
    'edededed',
    'James',
    'Parker'
  ),
  (
    'katherine_white',
    'katherine@example.com',
    'edededed',
    'Katherine',
    'White'
  ),
  (
    'lucas_garcia',
    'lucas@example.com',
    'edededed',
    'Lucas',
    'Garcia'
  ),
  (
    'mary_lewis',
    'mary@example.com',
    'edededed',
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
  card_history (
    user_id,
    card_id,
    score,
    times_attempted
  )
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

create or replace function update_set_score () RETURNS TRIGGER
set
  SEARCH_PATH = public as $$

DECLARE
   setid INTEGER;

BEGIN
    setid = (SELECT set_id FROM flashcards WHERE id = NEW.card_id);
	INSERT INTO set_user (user_id, set_id, role, set_score) VALUES (NEW.user_id, setid, 'user', 2, DEFAULT)
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

INSERT INTO flashcard_sets (set_name, set_description)
VALUES ('Basic Koiné Greek', 'Common vocabulary words for students of Biblical (Koiné) Greek.');

greek_set_id = (SELECT id FROM flashcard_sets WHERE set_name = 'Basic Koiné Greek');

INSERT INTO flashcards (set_id, front, back) VALUES
  (greek_set_id, 'ἀγάπη', 'Love (noun, fem.)'),
  (greek_set_id, 'ἁμαρτία', 'Sin (noun, fem.)'),
  (greek_set_id, 'ἄνθρωπος', 'Man, person, human being (noun, masc.)'),
  (greek_set_id, 'ἀπόστολος', 'Apostle, envoy, messenger (noun, masc.)'),
  (greek_set_id, 'βασιλεία', 'Kingdom (noun, fem.)'),
  (greek_set_id, 'γῆ', 'Earth, land, region (noun, fem.)'),
  (greek_set_id, 'γραφή', 'Writing, Scripture (noun, fem.)'),
  (greek_set_id, 'διδάσκαλος', 'Teacher (noun, masc.)'),
  (greek_set_id, 'δόξα', 'Glory, majesty, fame (noun, fem.)'),
  (greek_set_id, 'ἐγώ', 'I (pronoun)'),
  (greek_set_id, 'ἐκκλησία', 'Church, assembly, congregation (noun, fem.)'),
  (greek_set_id, 'ἔργον', 'Work, deed, action (noun, neut.)'),
  (greek_set_id, 'εὐαγγέλιον', 'Good news, Gospel (noun, neut.)'),
  (greek_set_id, 'ζωή', 'Life (noun, fem.)'),
  (greek_set_id, 'θεός', 'God, god (noun, masc.)'),
  (greek_set_id, 'Ἰησοῦς', 'Jesus, Joshua (noun, masc.)'),
  (greek_set_id, 'καρδία', 'Heart, inner self (noun, fem.)'),
  (greek_set_id, 'κόσμος', 'World, universe, mankind (noun, masc.)'),
  (greek_set_id, 'κύριος', 'Lord, master, sir (noun, masc.)'),
  (greek_set_id, 'λόγος', 'Word, statement, message, reason (noun, masc.)'),
  (greek_set_id, 'νόμος', 'Law, principle, rule (noun, masc.)'),
  (greek_set_id, 'οἶκος', 'House, home, household (noun, masc.)'),
  (greek_set_id, 'οὐρανός', 'Heaven, sky (noun, masc.)'),
  (greek_set_id, 'πνεῦμα', 'Spirit, wind, breath (noun, neut.)'),
  (greek_set_id, 'προφήτης', 'Prophet (noun, masc.)'),
  (greek_set_id, 'σάρξ', 'Flesh, body, human nature (noun, fem.)'),
  (greek_set_id, 'σύ', 'You (singular pronoun)'),
  (greek_set_id, 'τέκνον', 'Child, descendant (noun, neut.)'),
  (greek_set_id, 'υἱός', 'Son, descendant (noun, masc.)'),
  (greek_set_id, 'Χριστός', 'Christ, Messiah, Anointed One (noun, masc.)'),
  (greek_set_id, 'ψυχή', 'Soul, life, self (noun, fem.)'),
  (greek_set_id, 'ὥρα', 'Hour, occasion, moment (noun, fem.)'),
  (greek_set_id, 'λέγω', 'I say, speak (verb)'),
  (greek_set_id, 'εἰμί', 'I am, exist (verb)'),
  (greek_set_id, 'ποιέω', 'I do, make (verb)'),
  (greek_set_id, 'ἀκούω', 'I hear, listen to, obey (verb)'),
  (greek_set_id, 'ἔχω', 'I have, hold (verb)'),
  (greek_set_id, 'γινώσκω', 'I know, come to know, realize (verb)'),
  (greek_set_id, 'πιστεύω', 'I believe, have faith (in), trust (verb)'),
  (greek_set_id, 'γράφω', 'I write (verb)'),
  (greek_set_id, 'θέλω', 'I wish, desire, want (verb)'),
  (greek_set_id, 'καί', 'And, also, even (conjunction)'),
  (greek_set_id, 'ὁ, ἡ, τό', 'The (definite article)'),
  (greek_set_id, 'αὐτός, -ή, -ό', 'He, she, it, self, same (pronoun/adjective)'),
  (greek_set_id, 'δέ', 'But, and, now (conjunction, postpositive)'),
  (greek_set_id, 'ἐν', 'In, on, among (preposition + dative)'),
  (greek_set_id, 'εἰς', 'Into, in, among (preposition + accusative)'),
  (greek_set_id, 'ἐκ, ἐξ', 'From, out of (preposition + genitive)'),
  (greek_set_id, 'ὅτι', 'That, since, because (conjunction)'),
  (greek_set_id, 'οὐ, οὐκ, οὐχ', 'Not (adverb)');

INSERT INTO flashcard_sets (set_name, set_description)
VALUES ('Basic Biblical Hebrew', 'Common vocabulary words for students of Biblical Hebrew.');

hebrew_set_id = (SELECT id FROM flashcard_sets WHERE set_name = 'Basic Biblical Hebrew');

INSERT INTO flashcards (set_id, front, back) VALUES
  (hebrew_set_id, 'אֱלֹהִים', 'God, gods (noun, masc. pl.)'),
  (hebrew_set_id, 'יהוה', 'YHWH, the LORD (proper noun, masc.)'),
  (hebrew_set_id, 'אָדָם', 'Man, mankind, Adam (noun, masc.)'),
  (hebrew_set_id, 'אֶרֶץ', 'Earth, land, country (noun, fem.)'),
  (hebrew_set_id, 'שָׁמַיִם', 'Heaven(s), sky (noun, masc. pl.)'),
  (hebrew_set_id, 'דָּבָר', 'Word, matter, thing (noun, masc.)'),
  (hebrew_set_id, 'תּוֹרָה', 'Law, instruction, teaching, Torah (noun, fem.)'),
  (hebrew_set_id, 'בַּיִת', 'House, household, temple (noun, masc.)'),
  (hebrew_set_id, 'יוֹם', 'Day (noun, masc.)'),
  (hebrew_set_id, 'לַיְלָה', 'Night (noun, fem.)'),
  (hebrew_set_id, 'אִישׁ', 'Man, husband, each (noun, masc.)'),
  (hebrew_set_id, 'אִשָּׁה', 'Woman, wife (noun, fem.)'),
  (hebrew_set_id, 'בֵּן', 'Son (noun, masc.)'),
  (hebrew_set_id, 'בַּת', 'Daughter (noun, fem.)'),
  (hebrew_set_id, 'יִשְׂרָאֵל', 'Israel (proper noun, masc.)'),
  (hebrew_set_id, 'מֹשֶׁה', 'Moses (proper noun, masc.)'),
  (hebrew_set_id, 'מֶלֶךְ', 'King (noun, masc.)'),
  (hebrew_set_id, 'עַם', 'People, nation (noun, masc.)'),
  (hebrew_set_id, 'יָד', 'Hand, power (noun, fem.)'),
  (hebrew_set_id, 'לֵב / לֵבָב', 'Heart, mind, will (noun, masc.)'),
  (hebrew_set_id, 'נֶפֶשׁ', 'Soul, life, person, self (noun, fem.)'),
  (hebrew_set_id, 'רוּחַ', 'Spirit, wind, breath (noun, fem./masc.)'),
  (hebrew_set_id, 'הָיָה', 'To be, become, happen (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'אָמַר', 'To say, speak (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'עָשָׂה', 'To do, make, create (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'בּוֹא', 'To come, enter, go in (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'הָלַךְ', 'To go, walk (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'שָׁמַע', 'To hear, listen to, obey (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'רָאָה', 'To see, perceive (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'נָתַן', 'To give, put, set (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'יָדַע', 'To know, realize (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'דִּבֶּר', 'To speak (verb - Piel Perf 3ms)'),
  (hebrew_set_id, 'יָצָא', 'To go out, go forth (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'יָשַׁב', 'To sit, dwell, inhabit (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'לָקַח', 'To take, receive (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'עָלָה', 'To go up, ascend (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'קָרָא', 'To call, cry out, read aloud (verb - Qal Perf 3ms)'),
  (hebrew_set_id, 'אֲשֶׁר', 'Who, which, that (relative pronoun)'),
  (hebrew_set_id, 'הַ־', 'The (definite article prefix)'),
  (hebrew_set_id, 'וְ־', 'And, but, also, even, then (conjunction prefix)'),
  (hebrew_set_id, 'בְּ־', 'In, at, with, by, against (preposition prefix)'),
  (hebrew_set_id, 'כְּ־', 'As, like, according to (preposition prefix)'),
  (hebrew_set_id, 'לְ־', 'To, for, belonging to (preposition prefix)'),
  (hebrew_set_id, 'מִן / מִ־', 'From, out of, part of, than (preposition)'),
  (hebrew_set_id, 'עַל', 'On, upon, over, against, concerning (preposition)'),
  (hebrew_set_id, 'אֶל', 'To, toward, into (preposition)'),
  (hebrew_set_id, 'כֹּל / כָּל־', 'All, every, whole (noun, masc.)'),
  (hebrew_set_id, 'אֶחָד', 'One (adj./number, masc.)'),
  (hebrew_set_id, 'טוֹב', 'Good, pleasant (adjective, masc.)'),
  (hebrew_set_id, 'גָּדוֹל', 'Great, large (adjective, masc.)'),
  (hebrew_set_id, 'קָדוֹשׁ', 'Holy, set apart (adjective, masc.)'),
  (hebrew_set_id, 'רַע', 'Bad, evil, wicked (adjective, masc.)'),
  (hebrew_set_id, 'לֹא', 'Not, no (negative particle)'),
  (hebrew_set_id, 'כִּי', 'That, because, for, when (conjunction)'),
  (hebrew_set_id, 'הוּא', 'He, it (pronoun, 3ms)'),
  (hebrew_set_id, 'הִיא', 'She, it (pronoun, 3fs)'),
  (hebrew_set_id, 'אַתָּה', 'You (pronoun, 2ms)'),
  (hebrew_set_id, 'אֲנִי / אָנֹכִי', 'I (pronoun, 1cs)');

INSERT INTO flashcard_sets (set_name, set_description)
VALUES ('Intermediate Biblical Hebrew', 'Expanding vocabulary and grammar for Biblical Hebrew.');

hebrew2_set_id = (SELECT id FROM flashcard_sets WHERE set_name = 'Intermediate Biblical Hebrew');

INSERT INTO flashcards (set_id, front, back) VALUES
  (hebrew2_set_id, 'שָׁפַט', 'To judge, govern (verb - Qal Perf 3ms)'),
  (hebrew2_set_id, 'זָכַר', 'To remember, recall (verb - Qal Perf 3ms)'),
  (hebrew2_set_id, 'כָּתַב', 'To write (verb - Qal Perf 3ms)'),
  (hebrew2_set_id, 'עָבַר', 'To cross over, pass through (verb - Qal Perf 3ms)'),
  (hebrew2_set_id, 'קֹדֶשׁ', 'Holiness, sanctuary (noun, masc.)'),
  (hebrew2_set_id, 'מִשְׁפָּט', 'Judgment, justice, ordinance (noun, masc.)'),
  (hebrew2_set_id, 'צֶדֶק / צְדָקָה', 'Righteousness, justice (noun, masc./fem.)'),
  (hebrew2_set_id, 'חֶסֶד', 'Lovingkindness, steadfast love, mercy (noun, masc.)'),
  (hebrew2_set_id, 'אֲדֹנָי', 'Lord (title for God, noun, masc.)'),
  (hebrew2_set_id, 'נָבִיא', 'Prophet (noun, masc.)'),
  (hebrew2_set_id, 'עֵת', 'Time, season (noun, fem.)'),
  (hebrew2_set_id, 'עוֹלָם', 'Eternity, forever, world (noun, masc.)'),
  (hebrew2_set_id, 'פָּנִים', 'Face, presence (noun, common pl.)'),
  (hebrew2_set_id, 'נִלְחַם', 'To fight, wage war (verb - Niphal Perf 3ms)'),
  (hebrew2_set_id, 'הִגִּיד', 'To tell, declare (verb - Hiphil Perf 3ms)');

INSERT INTO flashcard_sets (set_name, set_description)
VALUES ('Advanced Biblical Hebrew', 'Less common words, rarer stems, and complex concepts.');

hebrew3_set_id = (SELECT id FROM flashcard_sets WHERE set_name = 'Advanced Biblical Hebrew');

INSERT INTO flashcards (set_id, front, back) VALUES
  (hebrew3_set_id, 'הִתְהַלֵּךְ', 'To walk about, live (verb - Hithpael Perf 3ms)'),
  (hebrew3_set_id, 'נוֹדַע', 'To be known, reveal oneself (verb - Niphal Perf 3ms)'),
  (hebrew3_set_id, 'קִדֵּשׁ', 'To sanctify, consecrate (verb - Piel Perf 3ms)'),
  (hebrew3_set_id, 'שִׁחֵת', 'To corrupt, destroy (verb - Piel/Hiphil Perf 3ms)'),
  (hebrew3_set_id, 'שִׂמְחָה', 'Joy, gladness (noun, fem.)'),
  (hebrew3_set_id, 'גְּבוּרָה', 'Strength, might (noun, fem.)'),
  (hebrew3_set_id, 'תְּהִלָּה', 'Praise, song of praise (noun, fem.)'),
  (hebrew3_set_id, 'מוֹעֵד', 'Appointed time, meeting place, festival (noun, masc.)'),
  (hebrew3_set_id, 'מִזְבֵּחַ', 'Altar (noun, masc.)'),
  (hebrew3_set_id, 'דּוֹר', 'Generation (noun, masc.)'),
  (hebrew3_set_id, 'לְמַעַן', 'In order that, for the sake of (conjunction/preposition)'),
  (hebrew3_set_id, 'בִּלְתִּי', 'Not, except (negative particle, often with לְ־ infinitive)'),
  (hebrew3_set_id, 'יַחְדָּו', 'Together, alike (adverb)'),
  (hebrew3_set_id, 'נָא', 'Please, now (particle of entreaty)'),
  (hebrew3_set_id, 'זָר', 'Strange, foreign; stranger (adj./noun, masc.)');

insert into
  set_user (user_id, set_id, role, set_score)
values
  (1, greek_set_id, 'owner', 0),
  (1, hebrew_set_id, 'owner', 0),
  (1, hebrew2_set_id, 'owner', 0),
  (1, hebrew3_set_id, 'owner', 0);

INSERT INTO classes (class_name, class_description)
VALUES ('Biblical Hebrew Studies', 'Comprehensive course covering Basic to Advanced Biblical Hebrew.');

insert into
  class_user (user_id, class_id, role)
values
  (1, (SELECT id FROM classes WHERE class_name = 'Biblical Hebrew Studies'), 'teacher'),

INSERT INTO flashcard_sets (set_name, set_description)
VALUES ('Intermediate Koiné Greek', 'Expanding vocabulary, verb forms, and syntax.');

greek2_set_id = (SELECT id FROM flashcard_sets WHERE set_name = 'Intermediate Koiné Greek');

INSERT INTO flashcards (set_id, front, back) VALUES
  (greek2_set_id, 'πιστεύω', 'To believe, trust, have faith in (verb)'),
  (greek2_set_id, 'γινώσκω', 'To know, understand, perceive (verb)'),
  (greek2_set_id, 'ἔρχομαι', 'To come, go (verb)'),
  (greek2_set_id, 'βλέπω', 'To see, look at (verb)'),
  (greek2_set_id, 'ἀκούω', 'To hear, listen to (verb)'),
  (greek2_set_id, 'δίδωμι', 'To give (verb)'),
  (greek2_set_id, 'καρδία', 'Heart (noun, fem.)'),
  (greek2_set_id, 'χάρις', 'Grace, favor, kindness (noun, fem.)'),
  (greek2_set_id, 'ἔργον', 'Work, deed, action (noun, neut.)'),
  (greek2_set_id, 'ἡμέρα', 'Day (noun, fem.)'),
  (greek2_set_id, 'ἀγαθός', 'Good, useful (adjective)'),
  (greek2_set_id, 'δίκαιος', 'Righteous, just (adjective)'),
  (greek2_set_id, 'δέ', 'But, and, now (conjunction, postpositive)'),
  (greek2_set_id, 'ἀλλά', 'But, yet, rather (conjunction)'),
  (greek2_set_id, 'γάρ', 'For, because (conjunction, postpositive)');

INSERT INTO flashcard_sets (set_name, set_description)
VALUES ('Advanced Koiné Greek', 'Less common words, participles, subjunctive/optative moods.');

greek3_set_id = (SELECT id FROM flashcard_sets WHERE set_name = 'Advanced Koiné Greek');

INSERT INTO flashcards (set_id, front, back) VALUES
  (greek3_set_id, 'ἀποστέλλω', 'To send away, send out (verb)'),
  (greek3_set_id, 'βαπτίζω', 'To baptize, dip, immerse (verb)'),
  (greek3_set_id, 'εὑρίσκω', 'To find (verb)'),
  (greek3_set_id, 'μένω', 'To remain, stay, abide (verb)'),
  (greek3_set_id, 'πράσσω', 'To do, practice (verb)'),
  (greek3_set_id, 'σοφία', 'Wisdom (noun, fem.)'),
  (greek3_set_id, 'ἐλπίς', 'Hope, expectation (noun, fem.)'),
  (greek3_set_id, 'πίστις', 'Faith, belief, trust (noun, fem.)'),
  (greek3_set_id, 'αἰώνιος', 'Eternal (adjective)'),
  (greek3_set_id, 'ἕκαστος', 'Each, every (adjective)'),
  (greek3_set_id, 'ἵνα', 'In order that, that (conjunction + subjunctive)'),
  (greek3_set_id, 'ὅπως', 'In order that, how (conjunction + subjunctive/indicative)'),
  (greek3_set_id, 'οὖν', 'Therefore, then, accordingly (conjunction, postpositive)'),
  (greek3_set_id, 'μή', 'Not, lest (negative particle, often with non-indicative moods)'),
  (greek3_set_id, 'παρά', 'From, beside, contrary to (preposition + gen/dat/acc)');

insert into
  set_user (user_id, set_id, role, set_score)
values
  (2, greek2_set_id, 'owner', 0),
  (2, greek3_set_id, 'owner', 0);

INSERT INTO classes (class_name, class_description)
VALUES ('Biblical Greek Studies', 'Comprehensive course covering Basic to Advanced Biblical Greek.');

insert into
  class_user (user_id, class_id, role)
values
  (2, (SELECT id FROM classes WHERE class_name = 'Biblical Greek Studies'), 'teacher'),



