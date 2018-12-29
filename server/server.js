const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const {ObjectID} =require('mongodb'); 

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');


let app = express();

app.use(cors());
app.use(express.json);
app.use(bodyParser.json());


app.post('/todos', (req, res) => {
    let todo = new Todo({
        title: req.body.title,
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }

    Todo.findOne({
        _id: id
    }).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
    
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(400).send();
    }

    Todo.findOneAndRemove({
        _id: id
    }).then((todo) => {
        if(!todo) {
           return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});




