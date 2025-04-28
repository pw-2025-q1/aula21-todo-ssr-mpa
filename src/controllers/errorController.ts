import { Request, Response, NextFunction } from "express";
import { ValidationError, AddError, EditError, RemoveError } from "./todoController";

/**
 * Handles validation errors.
 * Error Code: 'validation'
 * - Indicates that the input data failed validation checks.
 * - Example: Missing required fields or invalid data format.
 */
export function handleValidationError(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ValidationError) {
        console.error("Validation Error:", err.message, err.stack);
        return res.status(400).render('error', {
            code: 'validation',
            message: err.message
        });
    }
    next(err);
}

/**
 * Handles errors that occur during the addition of a new item.
 * Error Code: 'item_add'
 * - Indicates that the item could not be added to the database.
 * - Example: Duplicate item ID or database insertion failure.
 */
export function handleAddError(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AddError) {
        console.error("Add Error:", err.message, err.stack);
        return res.status(400).render('error', {
            code: 'item_add',
            message: err.message
        });
    }
    next(err);
}

/**
 * Handles errors that occur during the editing of an item.
 * Error Code: 'item_edit'
 * - Indicates that the item could not be updated in the database.
 * - Example: Item not found or database update failure.
 */
export function handleEditError(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof EditError) {
        console.error("Edit Error:", err.message, err.stack);
        return res.status(400).render('error', {
            code: 'item_edit',
            message: err.message
        });
    }
    next(err);
}

/**
 * Handles errors that occur during the removal of an item.
 * Error Code: 'item_remove'
 * - Indicates that the item could not be removed from the database.
 * - Example: Item not found or database deletion failure.
 */
export function handleRemoveError(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof RemoveError) {
        console.error("Remove Error:", err.message, err.stack);
        return res.status(400).render('error', {
            code: 'item_remove',
            message: err.message
        });
    }
    next(err);
}

/**
 * Handles generic errors that are not specifically categorized.
 * Error Code: 'exception'
 * - Indicates an unexpected error occurred in the application.
 * - Example: Unhandled exceptions or server-side failures.
 */
export function handleGenericError(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error("Unhandled Error:", err.message, err.stack);
    res.status(500).render('error', {
        code: 'exception',
        message: 'An unexpected error occurred. Please try again later.'
    });
}