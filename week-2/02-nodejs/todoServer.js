/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
let todoList = [];

let sequentialIdCounter = todoList.length + 1;

function generateSequentialId() {
  return sequentialIdCounter++;
}

app.get("/todos", function (req, res) {
  if (todoList.length === 0) {
    return res.status(404).send("Not Found");
  } else {
    return res.status(200).send(todoList);
  }
});
app.get("/todos/:id", function (req, res) {
  const id = req.params.id;
  const todoMatchingRequestId = todoList.filter((item) => item.id == id);
  if (todoMatchingRequestId.length !== 0) {
    return res.status(200).json(todoMatchingRequestId[0]);
  } else {
    return res.status(404).send("Not Found");
  }
});
app.post("/todos", function (req, res) {
  const todoBody = req.body;
  let newId = generateSequentialId();
  todoBody.id = newId;
  todoList.push(todoBody);
  return res.status(201).send({ id: newId });
});
app.put("/todos/:id", function (req, res) {
  const id = req.params.id;
  const todoMatchingRequestIdIndex = todoList.findIndex(
    (item) => item.id == id
  );
  todoList[todoMatchingRequestIdIndex] = {
    ...todoList[todoMatchingRequestIdIndex],
    ...req.body,
  };
  if (todoMatchingRequestIdIndex === -1) {
    return res.status(404).send("Not Found");
  } else {
    return res.status(200).send("OK");
  }
});
app.delete("/todos/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const todoMatchingRequestId = todoList.filter((item) => item.id === id);
  console.log(todoMatchingRequestId);
  if (todoMatchingRequestId.length > 0) {
    todoList = todoList.filter((item) => item.id !== id);
    sequentialIdCounter =
      todoList.length > 0 ? todoList[todoList.length - 1].id : 0;
    return res.status(200).send("OK");
  } else {
    return res.status(404).send("Not Found");
  }
});

app.all("*", function (req, res) {
  return res.status(404).send("Not Found");
});
app.listen(3001);

module.exports = app;

//todoServer solution with file read-write

// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const bodyParser = require("body-parser");

// const app = express();

// app.use(bodyParser.json());

// const todosPath = "./todos.json";

// function generateSequentialId(todoList) {
//   let existingIds = new Set(todoList.map((todo) => todo.id));

//   let sequentialIdCounter = 1;
//   while (existingIds.has(sequentialIdCounter)) {
//     sequentialIdCounter++;
//   }

//   return sequentialIdCounter;
// }

// app.get("/todos", function (req, res) {
//   fs.readFile(path.join(__dirname, todosPath), "utf-8", function (err, data) {
//     if (err) {
//       res.status(404).send("Not Found");
//     } else {
//       let todoList = JSON.parse(data);
//       if (todoList.length === 0) {
//         return res.status(404).send("Not Found");
//       } else {
//         return res.status(200).json(todoList);
//       }
//     }
//   });
// });
// app.get("/todos/:id", function (req, res) {
//   const id = req.params.id;
//   fs.readFile(path.join(__dirname, todosPath), "utf-8", function (err, data) {
//     if (err) {
//       res.status(404).send("Not Found");
//     } else {
//       let todoList = JSON.parse(data);
//       if (data.length === 0) {
//         return res.status(404).send("Not Found");
//       } else {
//         const todoMatchingRequestId = todoList.filter((item) => item.id == id);
//         if (todoMatchingRequestId.length !== 0) {
//           return res.status(200).json(todoMatchingRequestId[0]);
//         } else {
//           return res.status(404).send("Not Found");
//         }
//       }
//     }
//   });
// });
// app.post("/todos", function (req, res) {
//   const todoBody = req.body;
//   fs.readFile(path.join(__dirname, todosPath), function (err, data) {
//     if (err) {
//       return res.status(404).send("Not Found");
//     } else {
//       let todoList = JSON.parse(data);
//       let newId = generateSequentialId(todoList);
//       todoBody.id = newId;
//       todoList.push(todoBody);
//       let updatedTodoList = JSON.stringify(todoList, null, 2);
//       fs.writeFile(path.join(__dirname, todosPath), updatedTodoList, (err) => {
//         if (err) {
//           return res.status(500).send("Internal Server Error");
//         }
//       });
//       return res.status(201).send({ id: newId });
//     }
//   });
// });
// app.put("/todos/:id", function (req, res) {
//   const id = req.params.id;
//   fs.readFile(path.join(__dirname, todosPath), function (err, data) {
//     if (err) {
//       return res.status(404).send("Not Found");
//     } else {
//       let todoList = JSON.parse(data);
//       const todoMatchingRequestIdIndex = todoList.findIndex(
//         (item) => item.id == id
//       );
//       if (todoMatchingRequestIdIndex === -1) {
//         return res.status(404).send("Not Found");
//       } else {
//         todoList[todoMatchingRequestIdIndex] = {
//           ...todoList[todoMatchingRequestIdIndex],
//           ...req.body,
//         };
//         let updatedTodoList = JSON.stringify(todoList, null, 2);
//         fs.writeFile(
//           path.join(__dirname, todosPath),
//           updatedTodoList,
//           (err) => {
//             if (err) {
//               return res.status(500).send("Internal Server Error");
//             }
//           }
//         );
//         return res.status(200).send("OK");
//       }
//     }
//   });
// });
// app.delete("/todos/:id", function (req, res) {
//   const id = parseInt(req.params.id);
//   fs.readFile(path.join(__dirname, todosPath), function (err, data) {
//     if (err) {
//       return res.status(404).send("Not Found");
//     } else {
//       let todoList = JSON.parse(data);
//       const todoMatchingRequestId = todoList.filter((item) => item.id === id);
//       if (todoMatchingRequestId.length > 0) {
//         todoList = todoList.filter((item) => item.id !== id);
//         let updatedTodoList = JSON.stringify(todoList, null, 2);
//         fs.writeFile(
//           path.join(__dirname, todosPath),
//           updatedTodoList,
//           (err) => {
//             if (err) {
//               return res.status(500).send("Internal Server Error");
//             }
//           }
//         );
//         return res.status(200).send("OK");
//       } else {
//         return res.status(404).send("Not Found");
//       }
//     }
//   });
// });

// app.all("*", function (req, res) {
//   return res.status(404).send("Not Found");
// });
// app.listen(3001);

// module.exports = app;
