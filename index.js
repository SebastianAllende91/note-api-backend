require("./mongo");
const express = require("express");
// CON EXPRESS
const app = express();
const cors = require("cors");
// const http = require("http") // CommomJs
// import http from "http" - ECMAS6 AHROA TIENE SOPORTE PARA IMPORTAR ESTOS MODULOS
const Note = require("./models/Note");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");

app.use(cors());
app.use(express.json());

//middleware : funcion que intercepta la peticion que esta pasando por nuestra api
// app.use(logger);

// CON NODE JS
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  //   console.log(request.params);
  Note.findById(id)
    .then((note) => {
      note ? response.json(note) : response.status(404).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.put("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  const note = request.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then((result) => {
    response.json(result);
  });
});

app.delete("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  //   console.log(request.params);

  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((err) => next(err));
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note.content) {
    return response.status(400).json({
      error: "required content field is missing",
    });
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false,
  });

  newNote.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
