const express = require('express');

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((r) => r.id == id);

  if (repositoryIndex == -1) return response.status(404).json({ error: 'Repository not found' });

  request.repositoryIndex = repositoryIndex;

  return next();
}

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', checkRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;
  const { title, url, techs } = request.body;

  const repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete('/repositories/:id', checkRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', checkRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;

  repositories[repositoryIndex].likes += 1;

  return response.json({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
