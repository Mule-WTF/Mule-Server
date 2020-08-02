CREATE TABLE tokens (
    "token_id"      BIGSERIAL PRIMARY KEY,
    "network"       NETWORK,
    "symbol"        TEXT,
    "name"          TEXT,
    "address"       TEXT NOT NULL,
    "user_added"    BOOLEAN NOT NULL
);

CREATE TABLE favorite_tokens (
    "user_uuid"     UUID REFERENCES "account" (user_uuid) ON DELETE CASCADE,
    "token_ids"      BIGINT[]
);

