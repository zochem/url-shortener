const express = require('express');
const mongoose = require('mongoose'); //   mongodb+srv://maxon:1234@shorturl.fhqr8.mongodb.net/shorturl?retryWrites=true&w=majority
let router = express.Router();
const shortUrl = require('../models/shortUrl');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true,
})
.then(() => console.log('Connected to DB'))
.catch(e => console.error('Error during the connection to DB', e.stack))

// UPDATE AND CREATE SHORT URL PAGE 
router.get('/', (req,res) => {
    return res.render('urls/page', {
        viewTitle: 'Let`s create short url, man',
    })
})

// SEND URL TO SERVER 
router.post('/', (req,res) => { 
    console.log(req.body.id);
     if(req.body.id === '')
        insertRecord(req,res);
    else 
        updateRecord(req,res);
})

function insertRecord(req,res){
    shortUrl.create({url: req.body.url, name: req.body.name})
            .then( console.log('Record was inserted!'))
            .catch( e => console.error('Error while inserting the record', e.stack))
            .finally(() => {return res.redirect('/shorturl/list')} )
}

function updateRecord(req,res){
    shortUrl.updateOne({_id: req.body.id}, {url: req.body.url, name: req.body.name}).exec()
            .then( console.log('Record was updated!'))
            .catch( e => console.error('Error while updating the record', e.stack))
            .finally(() => {return res.redirect('/shorturl/list')})
}

// LIST OF URLS 
router.get('/list',(req,res) => {
    shortUrl.find()
            .lean()
            .then((result) => {
                    res.render('urls/list', {
                            shortUrls: result
                        })
            })
            .catch(e => console.error('Error while showing the list', e.stack))
            .finally(() => {
                        console.log('List on the board!')
             })
})

//TO DELETE ONE 
router.get('/delete/:id', (req,res) => {
    shortUrl.findByIdAndDelete(req.params.id)
            .then( console.log(`Record with ${req.params.id} was removed!`))
            .catch(e => console.error('Error while removing the item!', e.stack))
            .finally(() => res.redirect('/shorturl/list'))
})

//TO UPDATE ONE
router.get('/update/:id', (req,res) => {
    shortUrl.findById(req.params.id)
            .lean()
            .then(result => {
                res.render('urls/page', {
                    viewTitle: 'Let`s update shortUrl, man',
                    shortUrl: result,
                })
            })
            .catch(e => console.error('Error while wgetting update page', e.stack))
            .finally(()=>console.log('Updage page'))
})

//REDIRECT TO SPECIFIC LINK 
router.get('/:short', (req,res) => {
    let find = req.params.short; 

    shortUrl.findOne({name: find})
            .lean()
            .then((result) => { 
                if(result == null) return res.sendStatus(404);
                    
                    result.clicks += 1;
                    res.redirect(result.url);
                })
            .catch(e => console.error('Error while finding specific url' , e.stack))
            .finally(() => {
                console.log('Redirected to specific url');
                shortUrl.updateOne( {name: find}, { $inc: {clicks: 1} }).exec();
            })
})


module.exports = router;