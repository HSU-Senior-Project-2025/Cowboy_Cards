
create table classes (
  id uuid primary key,
  name text not null,
  description text not null,
  join_code text not null unique,
  teacher_id uuid not null,
  created_at timestamp without time zone not null,
  updated_at timestamp without time zone not null
);

create table flashcard_sets (
  id numeric primary key,
  name text not null,
  description text not null,
  user_id uuid not null,
  class_id uuid not null,
  created_at timestamp without time zone not null,
  updated_at timestamp without time zone not null
);


-- CREATE TABLE classes (
--     id          SERIAL                          PRIMARY KEY, 
--     name        TEXT                            NOT NULL,
--     description TEXT                            NOT NULL,
--     student_ids INTEGER[]                       NOT NULL DEFAULT '{}'::INTEGER[],
--     join_code   TEXT                            NOT NULL UNIQUE,
--     teacher_id  INTEGER                         NOT NULL,
--     created_at  TIMESTAMP WITHOUT TIME ZONE     NOT NULL DEFAULT CURRENT_DATE,
--     updated_at TIMESTAMP WITHOUT TIME ZONE      NOT NULL DEFAULT CURRENT_DATE
-- );

-- CREATE TABLE users (
--     id          SERIAL                          PRIMARY KEY,
--     username    TEXT                            NOT NULL,
--     first_name  TEXT                            NOT NULL,
--     last_name   TEXT                            NOT NULL,
--     role        TEXT                            NOT NULL DEFAULT 'regular'::TEXT,
--     created_at  TIMESTAMP WITHOUT TIME ZONE     NOT NULL DEFAULT CURRENT_DATE,
--     updated_at  TIMESTAMP WITHOUT TIME ZONE     NOT NULL DEFAULT CURRENT_DATE,
--     CONSTRAINT valid_role CHECK ((role = ANY (array['teacher'::TEXT,'student'::TEXT,'regular'::TEXT])))
-- )



