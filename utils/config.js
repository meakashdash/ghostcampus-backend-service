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
            USERS:"USERS",
            TAGS:"TAGS",
            POSTS:"POSTS",
            LIKES:"LIKES",
            COMMENT:"COMMENT",
            BOOKMARK:"BOOKMARK",
            DOWNVOTE:"DOWNVOTE",
            MOOD_CALENDER:"MOOD_CALENDER",
            MARKET_ITEM_CATEGORY:"MARKET_ITEM_CATEGORY"
        }
    },
    PROD:{
        PORT:process.env.PROD_PORT,
        JWT_KEY:process.env.PROD_JWT_KEY,
        TABLE_NAMES:{
            USERS:"USERS",
            TAGS:"TAGS",
            POSTS:"POSTS",
            LIKES:"LIKES",
            COMMENT:"COMMENT",
            BOOKMARK:"BOOKMARK",
            DOWNVOTE:"DOWNVOTE",
            MOOD_CALENDER:"MOOD_CALENDER",
            MARKET_ITEM_CATEGORY:"MARKET_ITEM_CATEGORY"
        }
    }
}


export const PORT=CONFIG_PARA[NETWORK].PORT;
export const MONGO_URI=process.env.MONGO_URI;
export const DATABASE_NAME="GHOSTCAMPUS"
export const TABLE_NAMES=CONFIG_PARA[NETWORK].TABLE_NAMES;
export const JWT_KEY=CONFIG_PARA[NETWORK].JWT_KEY;
export const ACCESS_KEY=process.env.ACCESS_KEY_ID;
export const SECRET_ACCESS_KEY=process.env.SECRET_ACCESS_KEY_ID;
export const BUCKET_NAME=process.env.BUCKET_NAME;
export const REGION=process.env.REGION;