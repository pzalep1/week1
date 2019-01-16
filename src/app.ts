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

      //delete a specific task 
      app.delete('/tasks/:id', async (req, res) => {
        const id = req.params.id; 
        await datastore.deleteTask(id);
        return res.sendStatus(200); 
      });  
    app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 
  })
  .catch(e => {
    throw e;
  });