import "dotenv/config";
import mongoose from "mongoose";
import app from "./server";
import { populateStatistics } from "./controllers/statisticController";

// database connection
const dbUser = process.env.USER_DB;
const dbPwd = process.env.USER_PWD;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbURI = `mongodb+srv://${dbUser}:${dbPwd}@${dbHost}/${dbName}?retryWrites=true&w=majority`;
console.log('dbUri', dbURI);
mongoose
  .connect(dbURI)
  .then(async () => {
    //Populate Initial Data
    await populateStatistics().catch((err) => console.log(err.message));

    // Start the application by listening to specific port
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.info("COVID 19 statistics server started on port: " + port);
    });
  })
  .catch((err) => console.log(err));
