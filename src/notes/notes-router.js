const path = require('path');
const express = require('express');
const xss = require('xss');
const notesService = require('./notes-service');

const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = note => ({
    id: note.id,
    name: xss(note.name),
    modified: note.modified,
    folder_id: note.folder_id,
    content: xss(note.content),
})

notesRouter
    .route('/')
    .get( (req, res, next) => {
        notesService.getAllNotes(
            req.app.get('db')
        )
            .then(notes => {
                res.json(notes.map(serializeNote))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, modified, folder_id, content } = req.body;
        const newNote = { name, folder_id, content };

        for (const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res
                    .status(400)
                    .json({
                        error: {message: `New note have '${key}' in request body.`}
                    })
            }
        }

        newNote.modified = modified;

        notesService.insertNote(
            req.app.get('db'),
            newNote
        )
            .then(note => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${note.id}`))
                    .json(serializeNote(note))
            })
            .catch(next)
    })

notesRouter
    .route('/:noteId')
    .all( (req, res, next) => {
        notesService.getNoteById(
            req.app.get('db'),
            req.params.noteId
        )
            .then(note => {
                if (!note) {
                    console.log('nothin')
                    return res
                        .status(404)
                        .json({
                            error: { message: `The note with the ID '${req.params.noteId}' does not exist.`}
                        })
                }
                res.note = note;
                next()
            })
            .catch(next)
    })
    .get( (req, res, next) => {
        res.json(serializeNote(res.note))
    })
    .delete( (req, res, next) => {
        notesService.deleteNote(
            req.app.get('db'),
            req.params.noteId
        )
            .then( () => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, modified, folder_id, content } = req.body;
        const updatedNoteContent = { name, modified, folder_id, content };
        const numberOfChanges = Object.values(updatedNoteContent).filter(Boolean).length;
        
        if (numberOfChanges === 0) {
            return res
                .status(400)
                .json({
                    error: { message: `Must update at least one of 'name', 'modified', 'folder_id', or 'content'.`}
                })
        }

        notesService.updateNote(
            req.app.get('db'),
            req.params.noteId,
            updatedNoteContent
        )
            .then( () => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = notesRouter;