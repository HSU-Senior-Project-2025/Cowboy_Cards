CREATE TABLE classes (
    id          SERIAL                          PRIMARY KEY, 
    name        TEXT                            NOT NULL,
    description TEXT                            NOT NULL,
    student_ids INTEGER[]                       NOT NULL DEFAULT '{}'::INTEGER[],
    join_code   TEXT                            NOT NULL UNIQUE,
    teacher_id  INTEGER                         NOT NULL,
    created_at  TIMESTAMP WITHOUT TIME ZONE     NOT NULL DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITHOUT TIME ZONE      NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE users (
    id          SERIAL                          PRIMARY KEY,
    username    TEXT                            NOT NULL,
    first_name  TEXT                            NOT NULL,
    last_name   TEXT                            NOT NULL,
    role        TEXT                            NOT NULL DEFAULT 'regular'::TEXT,
    created_at  TIMESTAMP WITHOUT TIME ZONE     NOT NULL DEFAULT CURRENT_DATE,
    updated_at  TIMESTAMP WITHOUT TIME ZONE     NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT valid_role CHECK ((role = ANY (array['teacher'::TEXT,'student'::TEXT,'regular'::TEXT])))
);

CREATE TABLE flashcard_sets (
    id SERIAL, 
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
);

CREATE TABLE flashcards (
    id SERIAL, 
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    set_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (set_id) REFERENCES flashcard_sets(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE user_card_history (
    user_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_DATE,
    times_seen INTEGER, 
    is_mastered BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_id,card_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (card_id) REFERENCES flashcards(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE class_user (
    user_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE ON UPDATE CASCADE
);
