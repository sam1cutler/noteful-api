const path = require('path');
const express = require('express');
const xss = require('xss');
const foldersService = require('./folders-service');

const foldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
    id: folder.id,
    name: xss(folder.name),
})

foldersRouter
    .route('/')
    .get( (req, res, next) => {
        foldersService.getAllFolders(
            req.app.get('db')
        )
            .then(folders => {
                res.json(folders.map(serializeFolder))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body;
        const newFolder = { name };

        if (!newFolder.name) {
            return res
                .status(400)
                .json({
                    error: {message: 'New folder must be named.'}
                })
        }

        foldersService.insertFolder(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(serializeFolder(folder))
            })
            .catch(next)
    })

foldersRouter
    .route('/:folderId')
    .all( (req, res, next) => {
        foldersService.getFolderById(
            req.app.get('db'),
            req.params.folderId
        )
            .then(folder => {
                if (!folder) {
                    console.log('nothin')
                    return res
                        .status(404)
                        .json({
                            error: { message: `The folder with the ID '${req.params.folderId}' does not exist.`}
                        })
                }
                res.folder = folder;
                next()
            })
            .catch(next)
    })
    .get( (req, res, next) => {
        res.json(serializeFolder(res.folder))
    })
    .delete( (req, res, next) => {
        foldersService.deleteFolder(
            req.app.get('db'),
            req.params.folderId
        )
            .then( () => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name } = req.body;
        const updatedFolderName = { name };

        if (!updatedFolderName.name) {
            return res
                .status(400)
                .json({
                    error: { message: `Request body must include new folder name.`}
                })
        }

        foldersService.updateFolder(
            req.app.get('db'),
            req.params.folderId,
            updatedFolderName
        )
            .then( () => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = foldersRouter;