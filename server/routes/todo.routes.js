const TodoListController = require('../controllers/todo.controller');

module.exports = (app) => {
    app.get('/api/list', TodoListController.showLists)
    app.get('/api/item/:itemId', TodoListController.showItem)
    app.post('/api/create/list', TodoListController.newList)
    app.post('/api/create/item/:id', TodoListController.addItemToList)
    app.put('/api/update/item/:id/:itemId', TodoListController.updateItem)
    app.delete('/api/delete/all', TodoListController.deleteALL)
    app.delete('/api/delete/list/:id', TodoListController.deleteList)
}