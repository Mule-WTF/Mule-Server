const platformToQuery = (platform, idOrUsername) => {
  let q = ''
  switch(platform) {
    case 'mule':
      q = 'account.mule_name ILIKE $1'
      break;
    case 'discord':
      q = 'linked.discord_' + idOrUsername + ' ILIKE $1'
      break;
    case 'telegram':
      q = 'linked.telegram_' + idOrUsername + ' ILIKE $1'
      break;
    default:
      q = 'account.mule_name ILIKE $1'
      break;
  }
  return q;
}

const usernameToAddress = (username, platform) => {
    let q = platformToQuery(platform, 'username');
    return {
        text: `
            SELECT
                linked.discord_username,
                linked.telegram_username,
                linked.user_uuid,
                account.mule_name,
                account.address,
                account.e_address,
                account.is_internal
            FROM
                linked
            LEFT JOIN
                account
            ON
                linked.user_uuid = account.user_uuid
            WHERE
                `+ q + `;
        `,
        values: [username]
    }
}

const idToAddress = (id, platform) => {
    let q = platformToQuery(platform, 'id');
    return {
        text: `
            SELECT
                linked.discord_id,
                linked.discord_username,
                linked.telegram_id,
                linked.telegram_username,
                linked.user_uuid,
                account.mule_name,
                account.address,
                account.e_address,
                account.is_internal
            FROM
                linked
            LEFT JOIN
                account
            ON
                linked.user_uuid = account.user_uuid
            WHERE
                ` + q + `;
        `,
        values: [id]
    }
}

const addressToMule = (address) => {
    return {
        text: `
            SELECT
                mule_name
            FROM
                account
            WHERE
                address = $1
            OR
                e_address = $1;
        `,
        values: [address]
    }
}

const getWeb3Info = (user) => {
    return {
        text: `
          SELECT
                mule_name,
                user_uuid,
                address,
                e_address,
                is_internal,
                network
            FROM
                account
            WHERE
                address = $1
            OR
                e_address = $1
            OR
                user_uuid::text = $1;
        `,
        values: [user]
    }
}

const profileSearch = (search) => {
    return {
        text: `
            SELECT
                account.user_uuid,
                account.mule_name,
                account.address,
                account.e_address,
                account.is_internal
            FROM
                linked
            LEFT JOIN
                account
            ON
                linked.user_uuid = account.user_uuid
            WHERE
                account.mule_name ILIKE $1
            OR
                linked.discord_username ILIKE $1
            OR
                linked.discord_id = $1
            OR
                linked.telegram_id = $1
            OR
                linked.telegram_username ILIKE $1
            OR
                account.address = $1
            OR
                account.e_address = $1;
        `,
        values: [search]
    }
}

const multiAddress = (idOrUsername, platform) => {
    if (platform == 'mule') {
      let q = platformToQuery(platform, false);
      return {
        text: `
            SELECT
                address,
                e_address
            FROM
                account
            WHERE
                `+ q + `;
        `,
        values: [idOrUsername]
      }
    } else {
      let q1 = platformToQuery(platform, 'username');
      let q2 = platformToQuery(platform, 'id');
      return {
        text: `
            SELECT
                linked.discord_username,
                linked.discord_id,
                linked.telegram_username,
                linked.telegram_id,
                linked.user_uuid,
                account.mule_name,
                account.address,
                account.e_address
            FROM
                linked
            LEFT JOIN
                account
            ON
                linked.user_uuid = account.user_uuid
            WHERE
                `+ q1 + `
            OR
                `+ q2 + `;
        `,
        values: [idOrUsername]
      }
    }
}

/** Api db queries */
module.exports = {
  usernameToAddress,
  idToAddress,
  addressToMule,
  getWeb3Info,
  profileSearch,
  multiAddress
}
