const db = require('../dbConfig.js');
const mappers = require('./mappers');
const express= require('express');
const server = express();

module.exports = {
  get: function(id) {
    let query = db('actions');

    if (id) {
      return query
        .where('id', id)
        .first()
        .then(action => {
          if (action) {
            return mappers.actionToBody(action);
          } else {
            return action;
          }
        });
    }

    return query.then(actions => {
      return actions.map(action => mappers.actionToBody(action));
    });
  },
  insert: function(action) {
    return db('actions')
      .insert(action)
      .then(([id]) => this.get(id));
  },
  update: function(id, changes) {
    return db('actions')
      .where('id', id)
      .update(changes)
      .then(count => (count > 0 ? this.get(id) : null));
  },
  remove: function(id) {
    return db('actions')
      .where('id', id)
      .del();
  },
};

server.get('/:id', (req, res) => {
  const { project_id } = req.params;
  const { description, notes } = req.body;

  db.find(project_id, description, notes)

   .then(projects => {
     if (!project_id)
      res.status(400).json({
        message: 'Please use a valid Project ID.'
      })
      else if (!description || !notes)
        res.status(400).json({
          message: 'Please add notes and a description.'
        })
        else {
          res.status(200).json(projects)
        }
      }
   )
  .catch(err => {
      res.status(500).json({
        message: 'Could not retrieve projects.'
      })
    })
   })

server.put('/', (req, res) => {
  const { object } = req.body;
  db.insert(object)
  .then(added => {
    if(added)
    res.status(200).json(added)
    else {
      res.status(400).json({
        message: 'Invalid update.'
      })
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Could not add at this time.'
    })
  })
})

server.update('/:id', (req, res) => {
  const { id } = req.params;
  const { object } = req.body;
  
  db.put( id, object )
  .then( updated => {
    if(!id || !object)
      res.status(404).json({
        error: null
      })
    else {
      res.status(200).json(updated)
    }
  }
  )
  .catch(err => {
    res.status(500).json({
      message: 'Could not update at this time.'
    })
  })
})

server.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
  .then(deleted => {
    if(deleted)
    res.status(200).json({
      message: 'Deleted.'
    })
    else{
      res.status(404).json({
        message: 'Invalid ID.'
      })
    }
  })
  .catch(err => {
    res.status(500).json({
      Message: 'Could not delete at this time.'
    })
  })
})