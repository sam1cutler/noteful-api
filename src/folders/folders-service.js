const foldersService = {
    getAllFolders(knex) {
        return knex
            .select('*')
            .from('noteful_folders')
    },
    getFolderById(knex, id) {
        return knex
            .from('noteful_folders')
            .select('*')
            .where('id', id)
            .first()
    },
    insertFolder(knex, newFolder) {
        return knex
            .insert(newFolder)
            .into('noteful_folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteFolder(knex, id) {
        return knex
            .from('noteful_folders')
            .where( { id } )
            .delete()
    },
    updateFolder(knex, id, newFolderName) {
        return knex
            .from('noteful_folders')
            .where( { id } )
            .update(newFolderName)
    },
};

module.exports = foldersService;