import { MongoDriverFactory } from "./MongoConnectorFactory";
import { disconnect } from "cluster";
import { MongoDriver } from "./MongoConnector";
import * as bodyParser from "body-parser"; 
import * as express from "express"; 

const app = express() 
const port = 3000

MongoDriverFactory.build()
  .then(async (datastore) => {
    /*console.log("Is the datastore a mongodriver?", datastore instanceof MongoDriver); 
    await datastore.createTask({
      name: "Homeworkx2"
    });*/
    app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    app.use(bodyParser.json());

    app.get('/', (req, res) => res.send('Hello World!'))

    

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