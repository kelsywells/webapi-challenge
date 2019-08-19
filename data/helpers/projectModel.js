const db = require('../dbConfig.js');
const server= express();


module.exports = {
  get,
  insert,
  update,
  remove,
  getProjectActions,
};

function get(id) {
  let query = db('projects as p');

  if (id) {
    query.where('p.id', id).first();

    const promises = [query, this.getProjectActions(id)]; // [ projects, actions ]

    return Promise.all(promises).then(function(results) {
      let [project, actions] = results;

      if (project) {
        project.actions = actions;

        return mappers.projectToBody(project);
      } else {
        return null;
      }
    });
  }

  return query.then(projects => {
    return projects.map(project => mappers.projectToBody(project));
  });
}

function insert(project) {
  return db('projects')
    .insert(project)
    .then(([id]) => this.get(id));
}

function update(id, changes) {
  return db('projects')
    .where('id', id)
    .update(changes)
    .then(count => (count > 0 ? this.get(id) : null));
}

function remove(id) {
  return db('projects')
    .where('id', id)
    .del();
}

function getProjectActions(projectId) {
  return db('actions')
    .where('project_id', projectId)
    .then(actions => actions.map(action => mappers.actionToBody(action)));
}

server.get('/:id', (req, res) => {
  const { description, name } = req.body;

  db.find(description, name)

   .then(projects => {
     if (!description || !name)
      res.status(400).json({
        message: 'Please use a valid name and description.'
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