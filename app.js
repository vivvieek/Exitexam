const express=require('express');
const app= express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const cors=require('cors');
app.use(cors());

// connecting db
const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://spvivekbabu:fsda123@cluster0.h7vuisq.mongodb.net/exittest', { useNewUrlParser: true, useUnifiedTopology: true,})
.then(() => {console.log('Connected to MongoDB Atlas'); })
.catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// todo Schema
const todoSchema=new mongoose.Schema({
    todolist:String,
    status:String
})
const Todo=mongoose.model('todo',todoSchema);

// todo cruds
// Add
app.post('/api/addtodo', (req,res)=>{
    console.log(req.body);
    const newtodo=new Todo({
      todolist:req.body.todolist,
      status:req.body.status
    });
    newtodo.save()
      .then(()=>{
        res.status(200).json({message:'Todo Added'});
      })
      .catch((error)=>{
        res.status(500).json({error:'Failed to Add Todo list detail'});
      })
})

// View all
app.get('/api/viewtodo',(req,res)=>{
    Todo.find()
    .then((todo)=>{
      res.status(200).json(todo);
    })
    .catch((error)=>{
      res.status(500).json({error:'Failed to Fetch'});
    })
});

// Delete todo
app.delete('/api/deletetodo/:_id',(req, res) => {
    Todo.findByIdAndRemove(req.params._id)
    .then((todo)=>{
      if (todo){
        res.status(200).json({message:'To do Deleted'});
      }else{
        res.status(404).json({error:'To do Not Found'});
      }
    })
    .catch((error)=>{
      res.status(500).json({error:'Failed to delete To do'});
    });
});

// frontend integration
const path=require('path');
app.use(express.static(`./dist/frontend`));
app.get('/*', function (req, res){
  res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
});

const PORT=3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});