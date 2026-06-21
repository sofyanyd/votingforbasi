import express from "express";
import cors from "cors";
import categoryRoute from "./routes/categoryRoute.js";
import speakerRoute from "./routes/speakerRoute.js";
import eventRoute from "./routes/eventRoute.js";    

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend berjalan");
});


app.use("/categories", categoryRoute);
app.use("/speakers", speakerRoute);  
app.use("/events", eventRoute);      

app.listen(3000, () => {
  console.log("Server running di port 3000");
});