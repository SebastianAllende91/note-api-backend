const express = require("express");
const cors = require("cors");
// const http = require("http") // CommomJs
// import http from "http" - ECMAS6 AHROA TIENE SOPORTE PARA IMPORTAR ESTOS MODULOS

// CON EXPRESS
const app = express();
const logger = require("./loggerMiddleware");

app.use(cors());
app.use(express.json());

//middleware : funcion que intercepta la peticion que esta pasando por nuestra api
app.use(logger);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];
// CON NODE JS
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  //   console.log(request.params);
  const note = notes.find((note) => note.id === id);
  //   console.log({ note });

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  //   console.log(request.params);
  notes = notes.filter((note) => note.id !== id);
  console.log({ note });

  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.content) {
    return response.status(400).json({
      error: "note.content is missing",
    });
  }

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);

  const newNote = {
    id: maxId + 1,
    content: note.content,
    import: typeof note.important !== "undefined" ? note.important : false,
    date: new Date().toISOString(),
  };

  notes = [...notes, newNote];

  response.status(201).json(note);
});

app.use((request, response) => {
  console.log(request.path);
  console.log("llegue aca");
  response.status(404).json({
    error: "Not Found",
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
