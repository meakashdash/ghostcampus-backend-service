import * as dotenv from 'dotenv'

dotenv.config()


export const ERROR_MESSAGES={

}

export const SUCCESS_MESSAGES={

}

export const NETWORK='DEV'

const CONFIG_PARA={
    DEV:{
        PORT:process.env.DEV_PORT,
        JWT_KEY:process.env.DEV_JWT_KEY,
        TABLE_NAMES:{
            USERS:"USERS"
        }
    },
    PROD:{
        PORT:process.env.PROD_PORT,
        JWT_KEY:process.env.PROD_JWT_KEY,
        TABLE_NAMES:{
            USERS:"USERS"
        }
    }
}


export const PORT=CONFIG_PARA[NETWORK].PORT;
export const MONGO_URI=process.env.MONGO_URI;
export const DATABASE_NAME="GHOSTCAMPUS"
export const TABLE_NAMES=CONFIG_PARA[NETWORK].TABLE_NAMES;
export const JWT_KEY=CONFIG_PARA[NETWORK].JWT_KEY;