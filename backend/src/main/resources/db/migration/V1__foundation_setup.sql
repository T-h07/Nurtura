CREATE TABLE app_role (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_account (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_account_status CHECK (status IN ('INVITED', 'ACTIVE', 'SUSPENDED'))
);

CREATE TABLE user_account_role (
    user_account_id UUID NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_account_id, role_id),
    CONSTRAINT fk_user_account_role_user_account
        FOREIGN KEY (user_account_id) REFERENCES user_account (id) ON DELETE RESTRICT,
    CONSTRAINT fk_user_account_role_role
        FOREIGN KEY (role_id) REFERENCES app_role (id) ON DELETE RESTRICT
);

CREATE INDEX idx_user_account_status ON user_account (status);
CREATE INDEX idx_user_account_role_role_id ON user_account_role (role_id);

INSERT INTO app_role (code, display_name)
VALUES ('PLATFORM_ADMIN', 'Platform Admin'),
       ('MANAGEMENT', 'Management'),
       ('TEACHER', 'Teacher'),
       ('PARENT', 'Parent');
