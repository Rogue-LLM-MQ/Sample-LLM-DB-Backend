// controllers/llmsController.js
module.exports.getAllLLMs = async (req, res, db) => {
  try {
    const collection = db.collection("LLMs");
    const llms = await collection.find({}).toArray();
    res.json(llms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
