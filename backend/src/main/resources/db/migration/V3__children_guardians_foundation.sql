CREATE TABLE child_profile (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    site_id UUID NOT NULL,
    room_id UUID,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    preferred_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    status VARCHAR(30) NOT NULL,
    notes VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_child_profile_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT fk_child_profile_organization
        FOREIGN KEY (organization_id) REFERENCES organization (id) ON DELETE RESTRICT,
    CONSTRAINT fk_child_profile_site
        FOREIGN KEY (site_id) REFERENCES site (id) ON DELETE RESTRICT,
    CONSTRAINT fk_child_profile_room
        FOREIGN KEY (room_id) REFERENCES room (id) ON DELETE RESTRICT
);

CREATE TABLE guardian_contact (
    id UUID PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_guardian_contact_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE TABLE child_guardian_link (
    id UUID PRIMARY KEY,
    child_id UUID NOT NULL,
    guardian_id UUID NOT NULL,
    relationship_to_child VARCHAR(80) NOT NULL,
    is_primary_contact BOOLEAN NOT NULL DEFAULT FALSE,
    is_emergency_contact BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_child_guardian_link UNIQUE (child_id, guardian_id),
    CONSTRAINT chk_child_guardian_link_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT fk_child_guardian_link_child
        FOREIGN KEY (child_id) REFERENCES child_profile (id) ON DELETE RESTRICT,
    CONSTRAINT fk_child_guardian_link_guardian
        FOREIGN KEY (guardian_id) REFERENCES guardian_contact (id) ON DELETE RESTRICT
);

CREATE INDEX idx_child_profile_organization_id ON child_profile (organization_id);
CREATE INDEX idx_child_profile_site_id ON child_profile (site_id);
CREATE INDEX idx_child_profile_room_id ON child_profile (room_id);
CREATE INDEX idx_child_profile_status ON child_profile (status);
CREATE INDEX idx_child_profile_last_name_first_name ON child_profile (last_name, first_name);

CREATE INDEX idx_guardian_contact_status ON guardian_contact (status);
CREATE INDEX idx_guardian_contact_last_name_first_name ON guardian_contact (last_name, first_name);

CREATE INDEX idx_child_guardian_link_child_id ON child_guardian_link (child_id);
CREATE INDEX idx_child_guardian_link_guardian_id ON child_guardian_link (guardian_id);

INSERT INTO child_profile (
    id,
    organization_id,
    site_id,
    room_id,
    first_name,
    last_name,
    preferred_name,
    date_of_birth,
    status,
    notes
)
VALUES ('69ed0e48-2ff2-44dc-b4c4-0379c9162b18', '06c8e689-0874-4e3f-8335-d205f29018f8', 'f8de5d4c-8757-4ddd-a36c-aea12f7f6cf4', '2e1645ea-e1f3-4f17-9957-2cc4d5d4b17c', 'Mila', 'Neumann', 'Mimi', '2020-04-16', 'ACTIVE', 'Settles quickly with visual transition cues.'),
       ('183ca03d-dca8-436f-99fc-53f213957f00', '06c8e689-0874-4e3f-8335-d205f29018f8', 'f8de5d4c-8757-4ddd-a36c-aea12f7f6cf4', 'e80f0ab5-4c2a-4890-a80e-90c0aec5d2fe', 'Jonas', 'Hartmann', NULL, '2019-11-03', 'ACTIVE', NULL),
       ('5ed7fb53-723f-4efd-a84f-05367a429ae8', '06c8e689-0874-4e3f-8335-d205f29018f8', 'f09080d9-7f9d-412f-b664-c7798a3902fd', '910e973a-d35e-4fa6-ac50-b8035ff7cef4', 'Lena', 'Kaya', NULL, '2020-07-22', 'ACTIVE', 'Prefers contact handoff to primary guardian first.');

INSERT INTO guardian_contact (
    id,
    first_name,
    last_name,
    phone_number,
    email,
    status
)
VALUES ('f5825768-4038-4507-aee6-8b8ec0a9a5ac', 'Sophie', 'Neumann', '+49 171 234 5678', 'sophie.neumann@example.com', 'ACTIVE'),
       ('99ec10e2-b65a-4ea7-b755-f9ad2ad5af69', 'Lukas', 'Neumann', '+49 176 222 1199', 'lukas.neumann@example.com', 'ACTIVE'),
       ('f3f5a3a8-e072-4247-bc84-a580b9cef30f', 'Mara', 'Hartmann', '+49 152 778 4411', 'mara.hartmann@example.com', 'ACTIVE'),
       ('30f9577f-a562-4ebe-b621-dfa8ad3e08f2', 'Derya', 'Kaya', '+49 173 441 8822', 'derya.kaya@example.com', 'ACTIVE');

INSERT INTO child_guardian_link (
    id,
    child_id,
    guardian_id,
    relationship_to_child,
    is_primary_contact,
    is_emergency_contact,
    status
)
VALUES ('df2d19ca-c14e-4fba-87d9-03fd6d315f41', '69ed0e48-2ff2-44dc-b4c4-0379c9162b18', 'f5825768-4038-4507-aee6-8b8ec0a9a5ac', 'Mother', TRUE, TRUE, 'ACTIVE'),
       ('0d64234b-c9c9-4680-9709-8d3f5466ee3f', '69ed0e48-2ff2-44dc-b4c4-0379c9162b18', '99ec10e2-b65a-4ea7-b755-f9ad2ad5af69', 'Father', FALSE, TRUE, 'ACTIVE'),
       ('11d9cc56-8a68-4043-b294-b0708f4ea2e5', '183ca03d-dca8-436f-99fc-53f213957f00', 'f3f5a3a8-e072-4247-bc84-a580b9cef30f', 'Mother', TRUE, TRUE, 'ACTIVE'),
       ('3f1c2283-cdc7-4150-8f1d-ec2cdb5bb55f', '5ed7fb53-723f-4efd-a84f-05367a429ae8', '30f9577f-a562-4ebe-b621-dfa8ad3e08f2', 'Mother', TRUE, TRUE, 'ACTIVE');
