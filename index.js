require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const Phone = require("./models/phone");

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

app.get("/api/persons", (request, response) => {
  Phone.find({}).then((result) => {
    response.status(200).json(result);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Phone.findById(request.params.id)
    .then((person) => {
      response.status(200).json(person);
    })
    .catch((err) => {
      response.status(404).send("person not found");
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
    .then((person) => {
      if (person) {
        response.status(204).send("no content");
      }
    })
    .catch((err) => next(err));
});

// const userExists = (name) => {
//   return persons.some((phone) => phone.name === name);
// };

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).send("bad request, name or number missing");
  }
  // if (userExists(body.name)) {
  //   return response.status(400).json({ error: "name must be unique" });
  // }
  const person = {
    name: body.name,
    number: body.number,
  };
  const newPerson = new Phone(person);
  newPerson
    .save()
    .then((returnedPerson) => {
      response.status(201).json(returnedPerson);
    })
    .catch((err) => next(err));
});
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const phone = {
    name: body.name,
    number: body.number,
  };
  Phone.findByIdAndUpdate(request.params.id, phone, { new: true })
    .then((updatedPerson) => {
      response.status(200).json(updatedPerson);
    })
    .catch((err) => next(err));
});
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT);
console.log(`server running on port ${PORT}`);
