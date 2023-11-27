const express = require('express');
const routing = express.Router();
const notesController = require('./myNotes');
routing.get('/notes', notesController.getNotes);
routing.post('/notes', notesController.newNotes);
routing.put('/notes/:id', notesController.updateNotes);
routing.delete('/notes/:id', notesController.deleteNotes);
routing.patch('/notes/:id', notesController.patchNote);
  
routing.all('*', notesController.invalid);
module.exports = routing;
