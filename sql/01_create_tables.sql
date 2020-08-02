CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE NETWORK as ENUM('mainnet', 'rinkeby', 'kovan', 'matic', 'matic-mumbai');

CREATE TABLE account (
    "account_id"      BIGSERIAL PRIMARY KEY,
    "user_uuid"       UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "keystore_uuid"   UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "mule_name"       TEXT,
    "password_hash"   TEXT NOT NULL,
    "address"         TEXT UNIQUE,
    "e_address"       TEXT UNIQUE,
    "is_internal"     BOOLEAN NOT NULL DEFAULT TRUE,
    "network"         NETWORK
);

CREATE TABLE linked (
    "user_uuid"         UUID REFERENCES "account" (user_uuid) ON DELETE CASCADE,
    "discord_id"        TEXT UNIQUE,
    "discord_username"  TEXT UNIQUE,
    "telegram_id"       TEXT UNIQUE,
    "telegram_username" TEXT
);

CREATE TABLE keystore (
    "keystore_id"       BIGSERIAL PRIMARY KEY,
    "keystore_uuid"     UUID REFERENCES "account" (keystore_uuid) ON DELETE CASCADE,
    "keystore"          TEXT
);
