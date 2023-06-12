const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// const requestLogger = (request, response, next) => {
//   console.log("method", request.method);
//   console.log("body", request.body);
//   console.log("path", request.path);
//   next();
// };
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);
app.use(express.json());
app.use(express.static("build"));
app.use(cors());
// app.use(requestLogger);

app.get("/api/persons", (request, response) => {
  response.status(200).json(persons);
});

app.get("/info", (request, response) => {
  const num = persons.length;
  const date = new Date();
  response.send(`<p>Phonebook has info for ${num} people</p><p>${date}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.status(200).json(person);
  }
  response.status(404).send("person not found");
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).send("no content");
});

const userExists = (name) => {
  return persons.some((phone) => phone.name === name);
};

app.post("/api/persons", (request, response) => {
  const personId = persons.length;
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).send("bad request, name or number missing");
  }
  if (userExists(body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }
  const person = {
    id: personId + 1,
    name: body.name,
    number: body.number,
  };
  persons = [...persons, person];
  response.status(201).json(person);
});
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT);
console.log(`server running on port ${PORT}`);
