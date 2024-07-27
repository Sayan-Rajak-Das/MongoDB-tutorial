import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());


// mongodb://localhost:27017/

const port = 3000;
mongoose.connect('mongodb://127.0.0.1:27017/test');
const model = new mongoose.Schema({ ID: { type: String, unique: true, required: true }, fname: String, lname: String });

const MyModel = mongoose.model('Test', model);

// app.get("/", async (req, res) => {
//     // console.log("req received");
//     // const data = await MyModel.create({ fname: "labani", lname: "das" });
//     // res.send({ name: "Labani" });
//     // data.save();
//     res.status(200).send({message: "get request"});

// });

app.post("/", async(req, res)=>{
    console.log(req.body)
    const {ID, rfname, rlname} = req.body;
    try {
        const data = await MyModel.create({ ID: ID, fname: rfname, lname: rlname });
        console.log(data);
        res.status(200).send({ fname: data.fname, lname: data.lname });
    } catch (error) {
        res.status(400).send({ message: "Error creating record", error });
    }
});

app.get("/all", async(req, res) =>{
    try {
        const data = await MyModel.find();
        res.status(200).send(data);
    } catch(error){
        res.status(500).send({message: error.message});
    }

});

app.get("/data/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await MyModel.findOne({ ID: id });
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(404).send({ message: "Data not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.put("/data/:id", async (req, res) => {
    const { id } = req.params;
    const { fname, lname } = req.body;

    try {
        const updatedData = await MyModel.findOneAndUpdate(
            { ID: id },
            { fname, lname },
            { new: true, runValidators: true } // Return the updated document and validate updates
        );

        if (updatedData) {
            res.status(200).send(updatedData);
        } else {
            res.status(404).send({ message: "Data not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.delete("/data/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await MyModel.deleteOne({ ID: id });
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Record not found" });
      }
      res.status(200).send({ message: "Record deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });



app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

// npm run dev