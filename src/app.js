const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if(repoIndex < 0 ) {
    return response.status(400).json({error: 'Project not found'});
  }

  const repository = {
    ...repositories[repoIndex],
    title,
    url,
    techs
  }

  repositories[repoIndex]= repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if(repoIndex < 0 ) {
    return response.status(400).json({error: 'Project not found'});
  }

  repositories.splice(repoIndex);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if(repoIndex < 0 ) {
    return response.status(400).json({error: 'Project not found'});
  }

  repositories[repoIndex].likes+= 1;

  return response.send({likes: repositories[repoIndex].likes});
});

module.exports = app;
