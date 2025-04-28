import * as dotenv from 'dotenv';

dotenv.config(); 

/**
 * Represents the configuration settings for the application.
 */
interface Config {
    readonly DATABASE_NAME: string;
    readonly collections: {
        readonly TODO_ITEMS: string;
        readonly SEQUENCES: string;
    };
}


/**
 * Configuration object for the application.
 * Contains database name and collection names.
 */
const config: Config = {
    DATABASE_NAME: "todo-spa",
    collections: {
        /**
         * Collection name for todo items.
         */
        TODO_ITEMS: "todo-items",

        /**
         * Collection name for sequences.
         */
        SEQUENCES: "sequences",
    }
};

export default config;
export type { Config };

