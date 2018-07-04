var mongoose = require( "mongoose" );
var Schema = mongoose.Schema;

var Todo = new Schema({
    user_id    : String,
    content    : String,
    updated_at : Date
});
 
mongoose.model( 'Todo', Todo );
mongoose.connect( 'mongodb://127.0.0.1:27017/express-todo', {}).then(
  () => { console.log("Connected");/** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
  err => { console.log(err);}
);

console.log("Required db");
