const express = require('express');
const db = require('../data/helpers/actionModel');
const router = express.Router();

router.get('/', logger, (req, res) => {
    const actions = db.get()
        .then(results => {
            res.status(200).json(results)
        })
        .catch(err => {
            res.status(500).json({ error: "The actions could not be retrieved." })
        })
});

router.get('/:id', logger, validateActionId, (req, res) => {
    const id = req.params.id
    const action = db.get(id)
        .then(results => {
            res.status(200).json(results)
        })
        .catch(err => {
            res.status(500).json({ error: "The action could not be retrieved." })
        })
});

router.delete('/:id', logger, validateActionId, (req, res) => {
    const id = req.params.id
    const action = db.get(id)
    db.remove(id)
        .then(results => {
            res.json(results)
        })
        .catch(err => {
            res.status(500).json({ error: "Could not delete action." })
        })
});

router.put('/:id', logger, validateActionId, validateAction, (req, res) => {
    const id = req.params.id
    const changes = req.body
    db.update(id, changes)
        .then(results => {
            res.status(200).json(results)
        })
        .catch(err => {
            res.status(500).json({ error: "Could not update action." })
        })

});

// custom middleware
function logger(req, res, next) {
    console.log(
        `[${new Date().toISOString()}] ${req.method} to ${req.url}`
    );
    next();
};

function validateActionId(req, res, next) {
    if (db.get(req.id)) {
        next();
    }
    else {
        res.status(400).json({ message: "invalid post id" });
        next();
    }
}
function validateAction(req, res, next) {
    //console.log(req.body);
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        res.status(400).json({ message: "missing action data" })
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
    else {
        next();
    }
}

module.exports = router;
