import { MongoDriverFactory } from "./MongoConnectorFactory";
import { disconnect } from "cluster";
import { MongoDriver } from "./MongoConnector";
import * as bodyParser from "body-parser"; 
import * as express from "express"; 

const app = express() 
const port = 3000

MongoDriverFactory.build()
  .then(async (datastore) => {
    app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    app.use(bodyParser.json());

    app.get('/', (req, res) => res.send('Hello World!'))

    
    //create a new task 
    app.post('/tasks', async (req, res) => {
      const name = req.body.name;
      const id = await datastore.createTask({
        name 
      });
      res.json ({id});
    });

    //return a specific task 
    app.get('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const task = await datastore.readTask(id); 
      return res.json(task); 
    }); 

    //update a specific task 
    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id; 
      const task = req.body.task; 
      await datastore.updateTask(task); 
      return res.sendStatus(200); 
    }); 
    
     //delete a specific task 
     app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      await datastore.deleteTask(id); 
      return res.sendStatus(200); 
    }); 

    //create a new category 
    app.post('/categories', async (req, res) => {
      const name = req.body.id; 
      const id = await datastore.createCategory(name); 
      res.json({id}); 
    });
    //returns all categories 
    app.get('/categories', async(req, res) => {
      const categories = await datastore.listCategories(); 
      return res.json({categories}); 
    }); 
    app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 
  })
  .catch(e => {
    throw e;
  });