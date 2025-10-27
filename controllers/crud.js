// controllers/llmsController.js
const { ObjectId } = require("mongodb");

module.exports.getAllLLMs = async (req, res, db) => {
  try {
    const collection = db.collection("LLMs");
    const llms = await collection.find({}).toArray();
    res.json(llms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.createLLM = async (req, res, db) => {
  try {
    const { domain } = req.body;

    if (!domain)
      return res.status(400).json({ message: "domain is required" });

    const collection = db.collection("LLMs");

    // Check if the domain already exists
    const existing = await collection.findOne({ domain });
    if (existing) {
      return res.status(409).json({ message: "Domain already exists" });
    }

    const newLLM = { domain };
    const result = await collection.insertOne(newLLM);

    res.status(201).json({ _id: result.insertedId, ...newLLM });
  } catch (err) {
    // Handle duplicate key error if unique index is present
    if (err.code === 11000) {
      return res.status(409).json({ message: "Domain already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};


module.exports.updateLLM = async (req, res, db) => {
  try {
    const { id } = req.params;
    const { domain } = req.body;

    const collection = db.collection("LLMs");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { domain } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "LLM not found" });

    res.json({ message: "LLM updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteLLM = async (req, res, db) => {
  try {
    const { id } = req.params;

    const collection = db.collection("LLMs");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "LLM not found" });

    res.json({ message: "LLM deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
