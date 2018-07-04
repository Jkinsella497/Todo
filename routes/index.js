var express = require('express');
var router = express.Router();
var mongoose = require( "mongoose" );
var Todo = mongoose.model( "Todo" );
var utils = require('utils');

/* GET home page. */
router.get('/', function(req, res, next) {
    var user_id = req.cookies ?
        req.cookies.user_id : undefined;
    
    Todo
        .find({ user_id : user_id})
        .sort( '-updated_at' )
        .exec(function ( err, todos, count ){
            res.render( 'index', {
                title: 'Express Todo Example',
                todos: todos
            });
        });
});

router.post('/create', function ( req, res ){
    new Todo({
        user_id    : req.cookies.user_id,
        content    : req.body.content,
        updated_at : Date.now()
    }).save( function( err, todo, count ){
        res.redirect( '/' );
    });
});

router.get('/destroy/:id', function ( req, res, next) {
    Todo.findById( req.params.id, function ( err, todo ){
        var user_id = req.cookies ?
            req.cookies.user_id : undefined;
        
            if( todo.user_id !== req.cookies.user_id ){
                return utils.forbidden( res );
            }
        todo.remove(function ( err, todo ){
            res.redirect( '/' );
        });
    });
});

router.get('/edit/:id', function ( req, res, next){
    var user_id = req.cookies ?
        req.cookies.user_id : undefined;
    
    Todo
        .find()
        .sort( '-updated_at' )
        .exec(function ( err, todos ){
        res.render( 'edit', {
            title   : 'Express Todo Example',
            todos   : todos,
            current : req.params.id
        });
    });
});

router.post('/update/:id', function ( req, res, next){
    Todo.findById( req.params.id, function ( err, todo ){
        var user_id = req.cookies ?
            req.cookies.user_id : undefined;
 
        if( todo.user_id !== user_id ){
            return utils.forbidden( res );
        }
        
        todo.content    = req.body.content;
        todo.updated_at = Date.now();
        todo.save( function ( err, todo, count ){
          res.redirect( '/' );
        });
    });
});

// ** express turns the cookie key to lowercase **
exports.current_user = function ( req, res, next ){
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;
 
  if( !user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }
 
  next();
};

module.exports = router;
