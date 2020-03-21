const express = require('express');

const actionRoutes = require('./actions/actionRoutes');
const projectRoutes = require('./projects/projectRoutes');

const server = express();

server.use(express.json())

server.use('/api/actions', actionRoutes);
server.use('/api/projects', projectRoutes);

server.listen(5000, () => console.log('API running on port 5000'));