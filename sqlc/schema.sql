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
);

create table flashcard_sets (
  id SERIAL,
  set_name TEXT not null,
  set_description TEXT not null,
  created_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  updated_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  primary key (id)
);

create table flashcards (
  id SERIAL,
  front TEXT not null,
  back TEXT not null,
  set_id INTEGER not null,
  created_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  updated_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  primary key (id),
  foreign KEY (set_id) references flashcard_sets (id) on delete CASCADE on update CASCADE
);

create table classes (
  id SERIAL,
  class_name TEXT not null,
  class_description TEXT not null,
  created_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  updated_at TIMESTAMP not null default LOCALTIMESTAMP(2),
  primary key (id)
);

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
);

create table class_user (
  user_id INTEGER not null,
  class_id INTEGER not null,
  role TEXT not null check (role in ('student', 'teacher')) default 'student',
  primary key (user_id, class_id),
  foreign KEY (user_id) references users (id) on delete CASCADE on update CASCADE,
  foreign KEY (class_id) references classes (id) on delete CASCADE on update CASCADE
);

create table class_set (
  class_id INTEGER,
  set_id INTEGER,
  primary key (class_id, set_id),
  foreign KEY (class_id) references classes (id) on delete CASCADE on update CASCADE,
  foreign KEY (set_id) references flashcard_sets (id) on delete CASCADE on update CASCADE
);

create table set_user (
  user_id INTEGER,
  set_id INTEGER,
  role TEXT not null check (role in ('user', 'owner')) default 'user',
  set_score INTEGER not null default 0,
  is_private BOOLEAN not null default false,
  primary key (user_id, set_id),
  foreign KEY (user_id) references users (id) on delete CASCADE on update CASCADE,
  foreign KEY (set_id) references flashcard_sets (id) on delete CASCADE on update CASCADE
);