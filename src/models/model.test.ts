// Import necessary modules and classes for testing
import { TodoRepository, TodoItem } from './model';
import { Database } from './database';
import config from './config';

describe('TodoRepository Integration Tests', () => {
    let database: Database;
    let todoRepository: TodoRepository;

    // Set up the database and repository before all tests
    beforeAll(async () => {
        database = new Database({
            ...config,
            DATABASE_NAME: 'test-db', // Use a test-specific database name
        });
        await database.connect();

        todoRepository = new TodoRepository(database);
    });

    // Disconnect from the database after all tests
    afterAll(async () => {
        await database.disconnect();
    });

    // Clear the database before each test to ensure isolation
    beforeEach(async () => {
        await todoRepository.clearAll();
    });

    test('should insert a new TodoItem', async () => {
        // Arrange: Create a new TodoItem
        const todo: TodoItem = {
            id: 0, // ID will be auto-generated
            description: 'Test Todo',
            tags: ['test'],
            deadline: '2025-12-31',
        };

        // Act: Insert the TodoItem into the repository
        const insertedTodo = await todoRepository.insert(todo);

        // Assert: Verify the inserted TodoItem has a valid ID and matches all properties of the input
        expect(insertedTodo.id).toBeGreaterThan(0);
        expect(insertedTodo).toEqual(
            expect.objectContaining({
                description: todo.description,
                tags: todo.tags,
                deadline: todo.deadline,
            })
        );
    });

    test('should list all TodoItems', async () => {
        // Arrange: Create multiple TodoItems
        const todos: TodoItem[] = [
            { id: 0, description: 'Todo 1', tags: ['tag1'], deadline: '2025-12-31' },
            { id: 0, description: 'Todo 2', tags: ['tag2'], deadline: '2025-12-31' },
        ];

        // Act: Insert the TodoItems and retrieve all items from the repository
        for (const todo of todos) {
            await todoRepository.insert(todo);
        }
        const allTodos = await todoRepository.listAll();

        // Assert: Verify the retrieved items match the inserted items, excluding the id property
        expect(allTodos).toHaveLength(2);
        allTodos.forEach((retrievedTodo, index) => {
            const originalTodo = todos[index];
            expect(retrievedTodo).toEqual(
                expect.objectContaining({
                    description: originalTodo.description,
                    tags: originalTodo.tags,
                    deadline: originalTodo.deadline,
                })
            );
        });
    });

    test('should find a TodoItem by ID', async () => {
        // Arrange: Create and insert a TodoItem
        const todo: TodoItem = {
            id: 0,
            description: 'Find Me',
            tags: ['find'],
            deadline: '2025-12-31',
        };
        // Act: Insert TodoItem and receive the inserted item
        const insertedTodo = await todoRepository.insert(todo);

        // Assert: Verify the retrieved item matches all properties of the original item
        expect(insertedTodo).toEqual(
            expect.objectContaining({
                description: todo.description,
                tags: todo.tags,
                deadline: todo.deadline,
            })
        );
    });

    test('should update a TodoItem', async () => {
        // Arrange: Create and insert a TodoItem
        const todo: TodoItem = {
            id: 0,
            description: 'Update Me',
            tags: ['update'],
            deadline: '2025-12-31',
        };
        const insertedTodo = await todoRepository.insert(todo);

        // Act: Mutate all properties of the TodoItem
        insertedTodo.description = 'Updated Description';
        insertedTodo.tags = ['updated', 'tags'];
        insertedTodo.deadline = '2026-01-01';
        const updateResult = await todoRepository.update(insertedTodo);
        const updatedTodo = await todoRepository.findById(insertedTodo.id);

        // Assert: Verify the update was successful and all properties were updated
        expect(updateResult).toBe(true);
        expect(updatedTodo).toEqual(
            expect.objectContaining({
                description: 'Updated Description',
                tags: ['updated', 'tags'],
                deadline: '2026-01-01',
            })
        );
    });

    test('should remove a TodoItem by ID', async () => {
        // Arrange: Create and insert a TodoItem
        const todo: TodoItem = {
            id: 0,
            description: 'Remove Me',
            tags: ['remove'],
            deadline: '2025-12-31',
        };
        const insertedTodo = await todoRepository.insert(todo);

        // Act: Remove the TodoItem by its ID and retrieve all items
        const removeResult = await todoRepository.removeById(insertedTodo.id);
        const allTodos = await todoRepository.listAll();

        // Assert: Verify the item was removed successfully
        expect(removeResult).toBe(true);
        expect(allTodos).toHaveLength(0);
    });
});