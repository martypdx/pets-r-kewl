const Router = require('express').Router;
const router = Router();
const Store = require('../models/store');
const Pet = require('../models/pet');

router
    .get('/', (req, res, next) => {
        Store.find()
            .lean()
            .then(store => res.send(store))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        const storeId = req.params.id;
        Promise.all([
            Store.findById(storeId).lean(),
            Pet.find({ store: storeId }).lean()
        ])
            .then(([ store, pets ]) => {
                store.pets = pets;
                res.send(store);
            })
            .catch(next);
            
    })
    
    .post('/', (req, res, next) => {
        new Store(req.body)
            .save()
            .then(store => res.send(store))
            .catch(next);
    })
    
    .delete('/:id', (req, res) => {
        Store.findByIdAndRemove(req.params.id)
            .then(store => res.send({ removed: !!store }));
    });


module.exports = router;