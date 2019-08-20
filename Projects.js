const express=require('express');
const server= express();
const db=require('./data/helpers/projectModel');
const router = express.Router();


router.get('/', (req, res) => {
    db.get(1)
     .then(projects => {
        res.status(200).json(projects)
          }
     )
    .catch(err => {
        res.status(500).json({
            err:err,
          message: 'Could not retrieve projects.'
        })
      })
     })
  

     router.post('/', (req, res) => {
      const object = req.body;
      db.insert(object)
      .then(added => {
        res.status(200).json(added)

      })
      .catch(err => {
        res.status(500).json({
          message: 'Could not add at this time.'
        })
      })
    })
  
    // server.put('/:id', (req, res) => {
    //   const { id } = req.params;
    //   const { object } = req.body;
      
    //   db.update( id, object )
    //   .then( updated => {
    //     if(!id || !object)
    //       res.status(404).json({
    //         error: null
    //       })
    //     else {
    //       res.status(200).json(updated)
    //     }
    //   }
    //   )
    //   .catch(err => {
    //     res.status(500).json({
    //       message: 'Could not update at this time.'
    //     })
    //   })
    // })
  
    // server.delete('/:id', (req, res) => {
    //   const { id } = req.params;
    //   db.remove(id)
    //   .then(deleted => {
    //     if(deleted)
    //     res.status(200).json({
    //       message: 'Deleted.'
    //     })
    //     else{
    //       res.status(404).json({
    //         message: 'Invalid ID.'
    //       })
    //     }
    //   })
    //   .catch(err => {
    //     res.status(500).json({
    //       Message: 'Could not delete at this time.'
    //     })
    //   })
    // })

     module.exports= router;