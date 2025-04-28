/**
 * Entry point for the ToDo application server.
 *
 * This file sets up the Express server, configures middleware, and defines routes for the application.
 * It also handles server startup, shutdown, and error handling.
 */

import express from "express";
import { Server } from "http";
import { engine } from "express-handlebars";
import * as path from "path";
import { Database } from "./models/database";
import config from "./models/config";
import { TodoItem, TodoRepository } from "./models/model";
import Joi from "joi";
import { TodoController } from "./controllers/todoController";
import * as errorController from './controllers/errorController';

const app = express();

/**
 * Path to the static directory for serving static assets.
 */
const STATIC_DIR = path.join(__dirname, '..', 'static');

// Serve static files from the static directory
app.use('/static', express.static(STATIC_DIR));

// Configure Handlebars as the view engine
app.engine('handlebars', engine({
    helpers: {
        formatDate: (date: string) => (date) ? date.substring(0, 16) : '',
        fillDate: (dateStr: string) => (dateStr) ? Intl.DateTimeFormat("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date(Date.parse(dateStr))) : '',
        equals: (a: string, b: string) => a == b
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, '..', 'views'));

// Initialize database and repository
const database = new Database(config);
const todoRepository = new TodoRepository(database);
const todoController = new TodoController(todoRepository);

/**
 * Define application routes.
 */
app.get('/', (req, res) => res.redirect('/newest'))
    .get('/newest', (req, res) => todoController.listNewest(req, res))
    .get('/oldest', (req, res) => todoController.listOldest(req, res))
    .get('/tags', (req, res) => todoController.listByTags(req, res))
    .get('/add', (req, res) => todoController.addPage(req, res))
    .post('/add',
        express.urlencoded({ extended: true }),
        (req, res, next) => todoController.validate(req, res, next),
        (req, res) => todoController.addItem(req, res))
    .get('/edit/:id', (req, res) => todoController.editPage(req, res))
    .post('/edit',
        express.urlencoded({ extended: true }),
        (req, res, next) => todoController.validate(req, res, next),
        (req, res) => todoController.editItem(req, res))
    .post('/remove/:id', (req, res) => todoController.removeItem(req, res));

/**
 * Error handling middleware.
 */
app.use(errorController.handleValidationError);
app.use(errorController.handleGenericError);

/**
 * Gracefully shuts down the server and disconnects the database.
 * @param server - The HTTP server instance.
 */
function shutdownServer(server: Server) {
    console.log("Shutting down server...");
    server.close(async () => {
        await database.disconnect();
        process.exit(0);
    });
}

/**
 * Starts the Express server and connects to the database.
 */
async function startServer() {
    await database.connect();

    const port = process.env.PORT || 3000;

    const server = app.listen(port, () => {
        console.log(`ToDo! server listening on port ${port}!`);
    });

    process.on('SIGINT', () => {
        shutdownServer(server);
    });

    process.on('SIGTERM', () => {
        shutdownServer(server);
    });
}

// Start the server
startServer().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
});