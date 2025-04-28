import { Request, Response, NextFunction } from "express";
import { TodoRepository, TodoItem } from "../models/model";
import { ascComparator, descComparator, groupByTags } from "./sorting";

/**
 * Classes for typed errors.
 */
export class ValidationError extends Error {}
export class AddError extends Error {}
export class EditError extends Error {}
export class RemoveError extends Error {}

/**
 * Controller for handling operations related to Todo items.
 * This includes listing, adding, editing, and removing Todo items.
 */
export class TodoController {
    /**
     * Constructs a new TodoController instance.
     * @param todoRepository - The repository for interacting with Todo items in the database.
     */
    constructor(private todoRepository: TodoRepository) {}

    /**
     * Lists all Todo items sorted by ascending deadline.
     * Renders the 'newest' view with the sorted items.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    async listNewest(req: Request, res: Response) {
        const items = await this.todoRepository.listAll();
        items.sort(ascComparator);
        res.render('newest', { items });
    }

    /**
     * Lists all Todo items sorted by descending deadline.
     * Renders the 'oldest' view with the sorted items.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    async listOldest(req: Request, res: Response) {
        const items = await this.todoRepository.listAll();
        items.sort(descComparator);
        res.render('oldest', { items });
    }

    /**
     * Groups Todo items by their tags.
     * Renders the 'tags' view with the grouped items.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    async listByTags(req: Request, res: Response) {
        const groupedItems = groupByTags(await this.todoRepository.listAll());
        res.render('tags', {
            tags: Object.keys(groupedItems).sort(),
            items: groupedItems
        });
    }

    /**
     * Renders the 'add' view for creating a new Todo item.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    addPage(req: Request, res: Response) {
        res.render('add');
    }

    /**
     * Adds a new Todo item to the database.
     * Renders the 'success' view if the operation is successful.
     * Throws an AddError if the operation fails.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    async addItem(req: Request, res: Response) {
        await this.todoRepository.insert(req.body);
        res.render('success', { code: 'item_add' });
    }

    /**
     * Renders the 'add' view for editing an existing Todo item.
     * Passes the item to the view for pre-filling the form.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    async editPage(req: Request, res: Response) {
        const item = await this.todoRepository.findById(parseInt(req.params.id));

        res.render('add', {
            item: item,
            edit: true
        });
    }

    /**
     * Edits an existing Todo item in the database.
     * Renders the 'success' view if the operation is successful.
     * Throws an EditError if the operation fails.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    async editItem(req: Request, res: Response) {
        const result = await this.todoRepository.update(req.body);
        if (!result) {
            throw new EditError(`Failed to update item with ID: ${req.body.id}`);
        }
        res.render('success', { code: 'item_update' });
    }

    /**
     * Removes a Todo item from the database.
     * Renders the 'success' view if the operation is successful.
     * Throws a RemoveError if the operation fails.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    async removeItem(req: Request, res: Response) {
        const result = await this.todoRepository.removeById(parseInt(req.params.id));
        
        if (!result) {
            throw new RemoveError(`Failed to remove the item with ID ${req.params.id}.`);
        }
        res.render('success', { code: 'item_remove_success' });
    }


    /**
     * Validates the request body for Todo item operations.
     * Throws a ValidationError if validation fails.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function.
     */
    validate(req: Request, res: Response, next: NextFunction) {
        // check if id is present and is a number
        if (req.body.id && isNaN(parseInt(req.body.id))) {
            throw new ValidationError(`Invalid ID format: ${req.body.id}`);
        }
        // check if description is present and is not empty
        if (!req.body.description || req.body.description.trim() === '') {
            throw new ValidationError(`Description is required: ${JSON.stringify(req.body)}`);
        }
        // check if deadline is a valid date
        if (req.body.deadline && isNaN(Date.parse(req.body.deadline))) {
            throw new ValidationError(`Invalid date format: ${req.body.deadline}`);
        }

        const todoItem: TodoItem = {
            id: req.body.id ? parseInt(req.body.id) : 0,
            description: req.body.description,
            tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : [],
            deadline: req.body.deadline ? req.body.deadline : ''
        };

        req.body = todoItem;
        next();
    }
}