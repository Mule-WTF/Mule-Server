const favoriteTokens = (user) => {
    return {
        text: `
            SELECT
                f.favorites,
                f.user_uuid,
                t.token_id,
                t.name,
                t.symbol,
                t.address,
                t.network
            FROM
                (
                    SELECT
                        user_uuid,
                        UNNEST(token_ids) as favorites
                    FROM
                        favorite_tokens
                    WHERE
                        user_uuid = $1
                ) f
            LEFT JOIN
                tokens t
            ON
                f.favorites = t.token_id;
        `,
        values: [user]
    }
}

const tokenList = (network) => {
    return {
        text: `
            SELECT
                symbol,
                name,
                address,
                network
            FROM
                tokens
            WHERE
                network = $1;
        `,
        values: [network]
    }
}

const getToken = (token_id) => {
    return {
        text: `
            SELECT
                name,
                symbol,
                address,
                network
            FROM
                tokens
            WHERE
                token_id = $1;
        `,
        values: [token_id]
    }
}

const findToken = (search, network) => {
    return {
        text: `
            SELECT
                address
            FROM
                tokens
            WHERE
            (
                    LOWER(name) = LOWER($1)
                OR
                    LOWER(symbol) = LOWER($1)
            )
            AND
                network = $2;
        `,
        values: [search, network]
    }
}

const getTokenId = (search, network) => {
    return {
        text: `
            SELECT
                token_id
            FROM
                tokens
            WHERE
            (
                    address = $1
                OR
                    LOWER(name) = LOWER($1)
                OR
                    LOWER(symbol) = LOWER($1)
            )
            AND
                network = $2;
        `,
        values: [search, network]
    }
}

const addToken = (symbol, name, address, network) => {
    return {
        text: `
            INSERT INTO
                tokens
                (symbol, name, address, network, user_added)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING
                token_id;
        `,
        values: [symbol, name, address, network, 't']
    }
}

const addFavorite = (user, token_id) => {
    return {
        text: `
            UPDATE
                favorite_tokens
            SET
                token_ids = array_append(token_ids, $2)
            WHERE
                user_uuid = $1
        `,
        values: [user, token_id]
    }
}

const delFavorite = (user, token_id) => {
    return {
        text: `
            UPDATE
                favorite_tokens
            SET
                token_ids = array_remove(token_ids, $2)
            WHERE
                user_uuid = $1

        `,
        values: [user, token_id]
    }
}

/** Token db queries */
module.exports = {
  favoriteTokens,
  tokenList,
  findToken,
  getToken,
  getTokenId,
  addToken,
  addFavorite,
  delFavorite
}
