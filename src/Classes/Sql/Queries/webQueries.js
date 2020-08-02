const dotenv = require('dotenv');
dotenv.config();
const keystore_enc_key = process.env.KEYSTORE_ENC_KEY ? process.env.KEYSTORE_ENC_KEY : 'DEV_ENC_KEY';

const getAccount = (user_uuid) => {
    return {
        text: `
            SELECT
                account.account_id,
                account.user_uuid,
                account.keystore_uuid,
                account.address,
                account.e_address,
                account.is_internal,
                account.network,
                account.mule_name,
                PGP_SYM_DECRYPT(keystore.keystore::bytea, $2) AS keystore,
                linked.user_uuid,
                linked.discord_id,
                linked.discord_username,
                linked.telegram_id,
                linked.telegram_username
            FROM
                account
            LEFT JOIN
                keystore
            ON
                account.keystore_uuid = keystore.keystore_uuid
            LEFT JOIN
                linked
            ON
                account.user_uuid = linked.user_uuid
            WHERE
                account.user_uuid = $1;
            `,
        values: [user_uuid, keystore_enc_key]
    }
}

const getUser = (user) => {
    return {
        text: `
            SELECT
                account.user_uuid,
                account.address,
                account.e_address,
                account.is_internal,
                account.mule_name,
                linked.user_uuid,
                linked.discord_id,
                linked.discord_username,
                linked.telegram_id,
                linked.telegram_username
            FROM
                account
            LEFT JOIN
                linked
            ON
                account.user_uuid = linked.user_uuid
            WHERE
                account.mule_name = $1
            OR
                linked.discord_username = $1
            OR
                linked.discord_id = $1
            OR
                linked.telegram_username = $1
            OR
                linked.telegram_id = $1
            OR
                account.address = $1
            OR
                account.e_address = $1;
        `,
        values: [user]
    }
}

const getMule = (user) => {
    return {
        text: `
            SELECT
                account.user_uuid,
                account.address,
                account.e_address,
                account.is_internal,
                account.mule_name,
                linked.user_uuid,
                linked.discord_id,
                linked.discord_username,
                linked.telegram_id,
                linked.telegram_username
            FROM
                account
            LEFT JOIN
                linked
            ON
                account.user_uuid = linked.user_uuid
            WHERE
                account.mule_name = $1
        `,
        values: [user]
    }
}

const getPasswordHash = (name) => {
    return {
        text: `
            SELECT
                password_hash,
                user_uuid,
                address
            FROM
                account
            WHERE
                mule_name = $1;
        `,
        values: [name]
    }
}

const createUser = (name, address, password_hash, keystore) => {
  return {
    text: `
        WITH
            acct
        AS (
            INSERT INTO account
                (mule_name, address, password_hash, network)
            VALUES
                ($1, $2, $3, $4)
            RETURNING
                user_uuid, keystore_uuid
            ),
            keystore
        AS
            (
            INSERT INTO
                keystore
                (keystore_uuid, keystore)
            VALUES
                ((SELECT keystore_uuid FROM acct), PGP_SYM_ENCRYPT($5, $6))
            RETURNING
                keystore_id
            )
        INSERT INTO
            favorite_tokens
            (user_uuid)
        VALUES
            ((SELECT user_uuid FROM acct))
        RETURNING
            user_uuid;

    `,
    values:[name, address, password_hash, 'mainnet', keystore, keystore_enc_key]
  }
}

const addLink = (user) => {
    return {
        text: `
            INSERT INTO
                linked
                (user_uuid)
            VALUES
                ($1);
            `,
        values: [user]
    }
}

const updateLink = (platform, user, id, username) => {
    return {
        text: `
            UPDATE
                linked
            SET
                `+platform+`_id = $2,
                `+platform+`_username = $3
            WHERE
                user_uuid = $1
            RETURNING
                user_uuid;
            `,
        values: [user, id, username]
    }
}

const muleExists = (name) => {
    return {
        text: `
            SELECT
                user_uuid,
                mule_name
            FROM
                account
            WHERE
                mule_name ILIKE $1;
            `,
        values: [name]
    }
}

const addressExists = (address) => {
    return {
        text: `
            SELECT
                user_uuid,
                address
            FROM
                account
            WHERE
                address ILIKE $1
            OR
                e_address ILIKE $1;
            `,
        values: [address]
    }
}

const socialIdExists = (id) => {
    return {
        text: `
            SELECT
                user_uuid
            FROM
                linked
            WHERE
                discord_id = $1
            OR
                telegram_id = $1;
            `,
        values: [id]
    }
}

const checkStash = (user) => {
    return {
        text: `
            SELECT
                e_address
            FROM
                account
            WHERE
                user_uuid = $1;
        `,
        values: [user]
    }
}

const addStash = (user, address) => {
    return {
        text: `
            UPDATE
                account
            SET
                e_address = $2,
                is_internal = $3
            WHERE
                user_uuid = $1
            RETURNING
                e_address;
        `,
        values: [user, address, 'f']
    }
}

const delStash = (user) => {
    return {
        text: `
            UPDATE
                account
            SET
                e_address = null,
                is_internal = $2
            WHERE
                user_uuid = $1
            RETURNING
                e_address;
        `,
        values: [user, 't']
    }
}

const defaultWallet = (user) => {
    return {
        text: `
            SELECT
                is_internal
            FROM
                account
            WHERE
                user_uuid = $1;
        `,
        values: [user]
    }
}

const setWallet = (user, internal) => {
    return {
        text: `
            UPDATE
                account
            SET
                is_internal = $2
            WHERE
                user_uuid = $1
            RETURNING
                user_uuid;
        `,
        values: [user, internal]
    }
}

const delLink = (platform, user) => {
    return {
        text: `
            UPDATE
                linked
            SET
                `+platform+`_id = null,
                `+platform+`_username = null
            WHERE
                user_uuid = $1
            RETURNING
                user_uuid;
        `,
        values: [user]
    }
}

const setNetwork = (user, network) => {
    return {
        text: `
            UPDATE
                account
            SET
                network = $2
            WHERE
                user_uuid = $1
            RETURNING
                network;
        `,
        values: [user, network]
    }
}

const deleteAccount = (user) => {
    return {
        text: `
            DELETE FROM
                account
            WHERE
                user_uuid = $1;
        `,
        values: [user]
    }
}

const updateKeystore = (user, keystore, address) => {
    return {
        text: `
            WITH
                acct
            AS (
                UPDATE
                    account
                SET
                    address = $3
                WHERE
                    user_uuid = $1
                RETURNING
                    keystore_uuid
            )
            UPDATE
                keystore
            SET
                keystore = PGP_SYM_ENCRYPT($2, $4)
            WHERE
                keystore_uuid = (SELECT keystore_uuid FROM acct);
        `,
        values: [user, keystore, address, keystore_enc_key]
    }
}

const updatePassword = (user, keystore, address, password_hash) => {
    return {
        text: `
            WITH
                acct
            AS (
                UPDATE
                    account
                SET
                    address = $3,
                    password_hash = $4
                WHERE
                    user_uuid = $1
                RETURNING
                    keystore_uuid
            )
            UPDATE
                keystore
            SET
                keystore = PGP_SYM_ENCRYPT($2, $5)
            WHERE
                keystore_uuid = (SELECT keystore_uuid FROM acct);
        `,
        values: [user, keystore, address, password_hash, keystore_enc_key]
    }
}

/** Web db queries */
module.exports = {
  getAccount,
  getUser,
  getMule,
  getPasswordHash,
  createUser,
  addLink,
  updateLink,
  muleExists,
  addressExists,
  socialIdExists,
  checkStash,
  addStash,
  delStash,
  defaultWallet,
  setWallet,
  delLink,
  setNetwork,
  deleteAccount,
  updateKeystore,
  updatePassword
}
