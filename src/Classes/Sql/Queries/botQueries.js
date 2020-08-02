const getUser = (id) => {
    return {
        text: `
            SELECT
                linked.user_uuid,
                linked.discord_id,
                linked.discord_username,
                linked.telegram_id,
                linked.telegram_username,
                account.user_uuid,
                account.mule_name,
                account.address,
                account.e_address,
                account.is_internal,
                account.network
            FROM
                linked
            LEFT JOIN
                account
            ON
                linked.user_uuid = account.user_uuid
            WHERE
                linked.discord_id = $1
            OR
                linked.telegram_id = $1;
        `,
        values: [id]
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

/** Bot db queries */
module.exports = {
  getUser,
  setNetwork,
  setWallet
}
