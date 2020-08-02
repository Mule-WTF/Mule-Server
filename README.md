> Make sure your system meets the requirements before installation.
> The following has been tested on Arch and Ubuntu Linux. Systems not based on Arch/Ubuntu may require different syntax for commands and should proceed with caution.
    
#### Requirements
- `Postgresql 10+`
- `Redis 5+`
- `Nodejs 10+`
- `NPM 6+`
- `Nginx 1.16+`

Read and follow installation instructions for each of these on your specific Operating System.

#### Install

1. Run `npm install`
    - `npm install`
2. Copy the dotenv file to .env
    - `cp dotenv .env`
3. Install the postgresql files in order.
    - `cd sql && sudo -i -u postgres`
    - `psql`
    - `\i `[PATH TO THIS REPO]`/server/sql/00-XX`
        - For each .sql file.
    - `\q`
4. Enter in the the required values in the `.env` file.
    - Required:
```
PORT=(PORT #)
SESSION_SECRET=(RANDOM / UUIDv4)
DISCORD_BOT_KEY=(Discord Bot Key)
SQL_HOST=(Postgresql Host)
SQL_USER=(Postgresql User)
SQL_PASSWD=(Postgresql Password)
SQL_PORT=(Postgresql Port)
SQL_DB=(Database Name)
SQL_LIMIT=(Postgresql Connection Limit)
OS_KEY=(OpenSea API Key)
CLIENT_URL=(Client URL for this server)
VERSION=(Mule.[DEV, LAB, WTF] [v0.0.0])
DISCORD_CLIENT_ID=(Discord Application ID)
DISCORD_SECRET=(Discord Application Secret)
API_URL=(BASE URL for the client)
PRODUCTION=(0 = dev, 1 = production, 2 = LAB)
INFURA_ID=(INFURA Project ID)
MAINNET_MULE_FACTORY=(0xAddress)
RINKEBY_MULE_FACTORY=(0xAddress)
KOVAN_MULE_FACTORY=(0xAddress)
MATICV3_MULE_FACTORY=(0xAddress)
```

#### Run
- All services - `npm start`
- Discord - `npm run start-discord`
- Telegram - `npm run start-telegram`
- API - `npm run start-api`
- Factory Monitor - `npm run start-monitor`
- Build Docs - `npm run build-docs`
