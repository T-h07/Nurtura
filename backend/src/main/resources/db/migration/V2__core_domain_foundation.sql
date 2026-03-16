CREATE TABLE organization (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    legal_name VARCHAR(180) NOT NULL,
    display_name VARCHAR(140) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_organization_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE TABLE site (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    timezone VARCHAR(60) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_site_organization_code UNIQUE (organization_id, code),
    CONSTRAINT chk_site_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT fk_site_organization
        FOREIGN KEY (organization_id) REFERENCES organization (id) ON DELETE RESTRICT
);

CREATE TABLE room (
    id UUID PRIMARY KEY,
    site_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(120) NOT NULL,
    capacity INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_room_site_code UNIQUE (site_id, code),
    CONSTRAINT chk_room_capacity CHECK (capacity > 0),
    CONSTRAINT chk_room_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT fk_room_site
        FOREIGN KEY (site_id) REFERENCES site (id) ON DELETE RESTRICT
);

CREATE TABLE staff_member (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    site_id UUID NOT NULL,
    room_id UUID,
    user_account_id UUID UNIQUE,
    staff_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(120) NOT NULL,
    employment_status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_staff_member_organization_staff_code UNIQUE (organization_id, staff_code),
    CONSTRAINT chk_staff_member_employment_status CHECK (employment_status IN ('ACTIVE', 'ON_LEAVE', 'INACTIVE')),
    CONSTRAINT fk_staff_member_organization
        FOREIGN KEY (organization_id) REFERENCES organization (id) ON DELETE RESTRICT,
    CONSTRAINT fk_staff_member_site
        FOREIGN KEY (site_id) REFERENCES site (id) ON DELETE RESTRICT,
    CONSTRAINT fk_staff_member_room
        FOREIGN KEY (room_id) REFERENCES room (id) ON DELETE RESTRICT,
    CONSTRAINT fk_staff_member_user_account
        FOREIGN KEY (user_account_id) REFERENCES user_account (id) ON DELETE RESTRICT
);

CREATE INDEX idx_site_organization_id ON site (organization_id);
CREATE INDEX idx_room_site_id ON room (site_id);
CREATE INDEX idx_staff_member_organization_id ON staff_member (organization_id);
CREATE INDEX idx_staff_member_site_id ON staff_member (site_id);
CREATE INDEX idx_staff_member_room_id ON staff_member (room_id);
CREATE INDEX idx_staff_member_user_account_id ON staff_member (user_account_id);

INSERT INTO organization (id, code, legal_name, display_name, status)
VALUES ('06c8e689-0874-4e3f-8335-d205f29018f8', 'NURTURA_MAIN', 'Nurtura Early Learning', 'Nurtura', 'ACTIVE');

INSERT INTO site (id, organization_id, code, name, timezone, status)
VALUES ('f8de5d4c-8757-4ddd-a36c-aea12f7f6cf4', '06c8e689-0874-4e3f-8335-d205f29018f8', 'CAMPUS_NORTH', 'North Campus', 'Europe/Berlin', 'ACTIVE'),
       ('f09080d9-7f9d-412f-b664-c7798a3902fd', '06c8e689-0874-4e3f-8335-d205f29018f8', 'CAMPUS_WEST', 'West Campus', 'Europe/Berlin', 'ACTIVE');

INSERT INTO room (id, site_id, code, name, capacity, status)
VALUES ('2e1645ea-e1f3-4f17-9957-2cc4d5d4b17c', 'f8de5d4c-8757-4ddd-a36c-aea12f7f6cf4', 'ROOM_SPROUTS', 'Sprouts', 18, 'ACTIVE'),
       ('e80f0ab5-4c2a-4890-a80e-90c0aec5d2fe', 'f8de5d4c-8757-4ddd-a36c-aea12f7f6cf4', 'ROOM_SEEDLINGS', 'Seedlings', 16, 'ACTIVE'),
       ('910e973a-d35e-4fa6-ac50-b8035ff7cef4', 'f09080d9-7f9d-412f-b664-c7798a3902fd', 'ROOM_SUNBEAMS', 'Sunbeams', 20, 'ACTIVE'),
       ('8efdd85f-2921-4fa7-a769-7309ad7cf825', 'f09080d9-7f9d-412f-b664-c7798a3902fd', 'ROOM_RAINBOW', 'Rainbow', 15, 'ACTIVE');

INSERT INTO staff_member (
    id,
    organization_id,
    site_id,
    room_id,
    user_account_id,
    staff_code,
    first_name,
    last_name,
    job_title,
    employment_status
)
VALUES ('40f8fc31-cdc2-49f6-b93d-83f01ecde4d4', '06c8e689-0874-4e3f-8335-d205f29018f8', 'f8de5d4c-8757-4ddd-a36c-aea12f7f6cf4', NULL, NULL, 'STF-1001', 'Anika', 'Keller', 'Center Director', 'ACTIVE'),
       ('7158770c-35c5-4568-be8d-cd53eb6e025e', '06c8e689-0874-4e3f-8335-d205f29018f8', 'f8de5d4c-8757-4ddd-a36c-aea12f7f6cf4', '2e1645ea-e1f3-4f17-9957-2cc4d5d4b17c', NULL, 'STF-1002', 'Marco', 'Schneider', 'Lead Teacher', 'ACTIVE'),
       ('711346cf-a2e6-4726-9d60-0a9772d2f8e7', '06c8e689-0874-4e3f-8335-d205f29018f8', 'f09080d9-7f9d-412f-b664-c7798a3902fd', '910e973a-d35e-4fa6-ac50-b8035ff7cef4', NULL, 'STF-1003', 'Lea', 'Mayer', 'Teacher', 'ON_LEAVE');
