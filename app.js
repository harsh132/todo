const { MongoClient, ObjectID, Int32 } = require("mongodb");
const express = require("express");
const uri = "mongodb://127.0.0.1:27017";

const app = express();
app.use(express.static("public"));
app.use(express.json());
const port = 3000;

app.post("/api/add", async (req, res) => {
	const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();
		const items = client.db("todo").collection("items");
		const result = await items.insertOne({ ...req.body, done: Int32(0) });
	} finally {
		await client.close();
	}
	res.send("done");
});

app.get("/api/get", async (req, res) => {
	let items = [];
	const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();
		items = await client.db("todo").collection("items").find().toArray();
	} finally {
		await client.close();
	}
	res.json(items);
});

app.post("/api/done", async (req, res) => {
	const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();
		let items = client.db("todo").collection("items");
		await items.updateOne({ _id: new ObjectID(req.body.id) }, { $bit: { done: { xor: Int32(1) } } });
	} finally {
		await client.close();
	}
	res.send("done");
});

app.post("/api/edit", async (req, res) => {
	const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();
		let items = client.db("todo").collection("items");
		await items.updateOne({ _id: new ObjectID(req.body.id) }, { $set: { item: req.body.item, done: Int32(0) } });
	} finally {
		await client.close();
	}
	res.send("done");
});

app.post("/api/delete", async (req, res) => {
	const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();
		let items = client.db("todo").collection("items");
		await items.deleteOne({ _id: new ObjectID(req.body.id) });
	} finally {
		await client.close();
	}
	res.send("done");
});

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
