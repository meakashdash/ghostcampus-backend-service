import * as dotenv from 'dotenv'

dotenv.config()


export const ERROR_MESSAGES={

}

export const SUCCESS_MESSAGES={

}

export const NETWORK='DEV'

const CONFIG_PARA={
    DEV:{
        PORT:process.env.DEV_PORT
    },
    PROD:{
        PORT:process.env.PROD_PORT
    }
}


export const PORT=CONFIG_PARA[NETWORK].PORT;