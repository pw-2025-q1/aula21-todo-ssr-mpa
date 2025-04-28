import { TodoItem, TodoRepository } from "../src/models/model";
import { Database } from "../src/models/database";
import config from "../src/models/config";

const sampleTodos: TodoItem[] = [
  { id: 0, description: "Buy groceries", deadline: "2025-04-27", tags: ["shopping"] },
  { id: 0, description: "Complete project report", deadline: "2025-04-28", tags: ["work", "urgent"] },
  { id: 0, description: "Call plumber", deadline: "2025-04-29", tags: ["home", "maintenance"] },
  { id: 0, description: "Schedule dentist appointment", deadline: "2025-05-01", tags: ["health"] },
  { id: 0, description: "Plan weekend trip", deadline: "2025-05-02", tags: ["leisure", "travel"] },
  { id: 0, description: "Read a book", deadline: "2025-05-03", tags: ["personal", "relaxation"] },
  { id: 0, description: "Organize closet", deadline: "2025-05-04", tags: ["home", "cleaning"] },
  { id: 0, description: "Prepare presentation", deadline: "2025-05-05", tags: ["work", "important"] },
  { id: 0, description: "Exercise", deadline: "2025-05-06", tags: ["health", "fitness"] },
  { id: 0, description: "Watch a movie", deadline: "2025-05-07", tags: ["leisure", "entertainment"] },
];

const database = new Database(config);
const todoRepository = new TodoRepository(database);

async function populateDatabase() {
    await database.connect();

    // Clear existing data
    await todoRepository.clearAll();
    console.log("Existing todo items have been cleared.");
    // Insert sample data
    for (const todo of sampleTodos) {
        console.log(`Inserting todo: ${JSON.stringify(todo)}`);
        await todoRepository.insert(todo);
    }

    console.log("Sample todo items have been added to the database.");
    await database.disconnect();
}

populateDatabase()
    .then(() => console.log("Database population completed."))
    .catch((error) => console.error("Error populating database:", error));