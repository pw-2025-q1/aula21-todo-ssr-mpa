import {Database} from "./database"
import { Collection, ObjectId } from "mongodb";

/**
 * Represents a sequence in the database.
 */
interface SequenceDTO {
    _id?: ObjectId,
    name: string,
    seq: number
}

/**
 * Represents a Todo item.
 */
interface TodoItem {
    id: number;
    description: string;
    tags?: string[];
    deadline?: string;
}

/**
 * Represents a Todo item Data Transfer Object (DTO).
 */
interface TodoItemDTO extends TodoItem{
    _id?: ObjectId,
}

/**
 * Enum for sequence names.
 */
enum SequenceName {
    TODO_ITEM_ID = "todo-item-id"
}

/**
 * Custom error class for repository-related errors.
 */
class RepositoryError extends Error {}

/**
 * Repository class for managing Todo items in the database.
 */
class TodoRepository {

    private database: Database;

    /**
     * Constructs a new TodoRepository instance.
     * @param database - The database instance to use for operations.
     */
    constructor(database: Database) {
        this.database = database;
    }

    /**
     * Retrieves the MongoDB collection for TodoItemDTO.
     * @returns The MongoDB collection for TodoItemDTO.
     */
    private getCollection(): Collection<TodoItemDTO> {
        return this.database.getDb().collection<TodoItemDTO>(this.database.config.collections.TODO_ITEMS);
    }

    /**
     * Converts a TodoItemDTO object to a TodoItem object.
     * @param dto - The TodoItemDTO object to convert.
     * @returns The converted TodoItem object.
     */
    private fromDTO(dto: TodoItemDTO): TodoItem {
        return {
            id: dto.id,
            description: dto.description,
            tags: dto.tags || [],
            deadline: dto.deadline || ''
        };
    }

    /**
     * Converts a TodoItem object to a TodoItemDTO object.
     * @param item - The TodoItem object to convert.
     * @returns The converted TodoItemDTO object.
     */
    private toDTO(item: TodoItem): TodoItemDTO {
        return item as TodoItemDTO;
    }

    /**
     * Inserts a new TodoItem into the database.
     * @param toDoItem - The TodoItem to insert.
     * @returns A promise that resolves to the newly inserted TodoItem.
     * @throws RepositoryError if the insertion fails.
     */
    async insert(toDoItem: TodoItem): Promise<TodoItem> {
        const newItem = { ...this.toDTO(toDoItem), id: await this.nextId(SequenceName.TODO_ITEM_ID) };
        const response = await this.getCollection().insertOne(newItem);

        if (response.acknowledged) {
            const insertedItem = await this.getCollection().findOne({ _id: response.insertedId }, { projection: { _id: 0 } });
            if (insertedItem) {
                return this.fromDTO(insertedItem);
            }
        }
        throw new RepositoryError("Insertion failed");
    }

    /**
     * Retrieves all TodoItems from the database.
     * @returns A promise that resolves to an array of TodoItems.
     * @throws RepositoryError if the retrieval fails.
     */
    async listAll(): Promise<TodoItem[]> {
        return await this.getCollection()
                .find()
                .map(item => this.fromDTO(item))
                .sort({ id: 1 })
                .toArray();
    }

    /**
     * Finds a TodoItem by its ID.
     * @param id - The ID of the TodoItem to find.
     * @returns A promise that resolves to the found TodoItem.
     * @throws RepositoryError if the retrieval fails or no item is found.
     */
    async findById(id: number): Promise<TodoItem> {
        const dto = await this.getCollection().findOne({ id });
            if (dto) return this.fromDTO(dto);
            throw new RepositoryError("No element with the given id found");
    }

    /**
     * Updates an existing TodoItem in the database.
     * @param toDoItem - The TodoItem to update.
     * @returns A promise that resolves to true if the update was successful, otherwise false.
     * @throws RepositoryError if the update fails.
     */
    async update(toDoItem: TodoItem): Promise<boolean> {
        const response = await this.getCollection().replaceOne(
            { id: toDoItem.id },
            this.toDTO(toDoItem)
        );
        return response.modifiedCount > 0;
    }

    /**
     * Removes a TodoItem from the database by its ID.
     * @param id - The ID of the TodoItem to remove.
     * @returns A promise that resolves to true if the removal was successful, otherwise false.
     * @throws RepositoryError if the removal fails.
     */
    async removeById(id: number): Promise<boolean> {
        const response = await this.getCollection().deleteOne({ id });
        return response.deletedCount ? response.deletedCount > 0 : false;
    }

    /**
     * Removes all documents from the underlying collection.
     * @returns A promise that resolves to the number of deleted documents.
     * @throws RepositoryError if the operation fails.
     */
    async clearAll(): Promise<number> {
        const response = await this.getCollection().deleteMany({});
        
        return response.deletedCount;
    }

    /**
     * Generates the next ID for a sequence.
     * @param sequenceName - The name of the sequence to increment.
     * @returns A promise that resolves to the next ID in the sequence.
     * @throws RepositoryError if the sequence update fails.
     */
    private async nextId(sequenceName: SequenceName): Promise<number> {
        const seqColl = this.database.getDb().collection<SequenceDTO>(this.database.config.collections.SEQUENCES);
        const result = await seqColl.findOneAndUpdate(
            { name: sequenceName },
            { $inc: { seq: 1 } },
            { upsert: true, returnDocument: "after" }
        );

        if (result && result.seq) {
            return result.seq;
        }

        throw new RepositoryError("No updated sequence value found");
    }
}

export {
    TodoRepository, RepositoryError
    };

export type {
    TodoItem
};
