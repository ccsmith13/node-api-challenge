const express = require('express');
const db = require('../data/helpers/projectModel');
const actionDb = require('../data/helpers/actionModel');
const router = express.Router();

router.get('/', logger, (req, res) => {
    const projects = db.get()
        .then(results => {
            res.status(200).json(results)
        })
        .catch(err => {
            res.status(500).json({ error: "The users could not be retrieved." })
        })
});

router.get('/:id', logger, validateProjectId, (req, res) => {
    const id = req.params.id
    const project = db.get(id)
        .then(results => {
            res.status(200).json(results)
        })
        .catch(err => {
            res.status(500).json({ error: "The user could not be retrieved." })
        })
});

router.get('/:id/actions', logger, validateProjectId, (req, res) => {
    const id = parseInt(req.params.id)
    const projectActions = db.getProjectActions(id)
        .then(results => {
            res.status(200).json(results)
        })
        .catch(err => {
            res.status(500).json({ error: "The user's posts could not be retrieved." })
        })
});

router.delete('/:id', logger, validateProjectId, (req, res) => {
    const id = req.params.id
    db.remove(id)
        .then(results => {
            res.json(results)
        })
        .catch(err => {
            res.status(500).json({ error: "Could not delete post." })
        })
});

router.post('/', logger, validateProject, (req, res) => {
    const project = (req.body)
    db.insert(project)
        .then(results => {
            res.status(201).json(results);
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the new project to the database" })
        })
});

router.post('/:id/actions', logger, validateAction, (req, res) => {
    const id = req.params.id
    const action = req.body
    actionDb.insert(action)
        .then(results => {
            res.status(201).json(results);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the user's new action to the database." })
        })

});

router.put('/:id', logger, validateProject, (req, res) => {
    const id = parseInt(req.params.id)
    const user = req.body
    db.update(id, user)
        .then(results => {
            res.status(200).json(results)
        })
        .catch(err => {
            res.status(500).json({ error: "Could not update post." })
        })
});

//custom middleware
function logger(req, res, next) {
    console.log(
        `[${new Date().toISOString()}] ${req.method} to ${req.url}`
    );
    next();
};

function validateProjectId(req, res, next) {
    if (db.get(req.id)) {
        next();
    }
    else {
        res.status(400).json({ message: "invalid user id" })
        next();
    }
}

function validateProject(req, res, next) {
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        res.status(400).json({ message: "missing user data" })
        next();
    }
    else if (!req.body.name) {
        res.status(400).json({ message: "missing required name field" })
        next();
    }
    else if (!req.body.description) {
        res.status(400).json({ message: "missing required description field" })
        next();
    }
    else {
        next();
    }
}

function validateAction(req, res, next) {
    if (Object.entries(req.body).length === 0) {
        res.status(400).json({ message: "missing post data" })
        next();
    }
    else if (!req.body.description) {
        res.status(400).json({ message: "missing required description field" })
        next();
    }
    else if (!req.body.notes) {
        res.status(400).json({ message: "missing required notes field" })
        next();
    }
    else if (!req.body.project_id) {
        res.status(400).json({ message: "missing required project_id in the body of the request" })
        next();
    }
    else {
        next();
    }
}

module.exports = router;
