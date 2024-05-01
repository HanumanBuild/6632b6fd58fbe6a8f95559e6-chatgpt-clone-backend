const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGODB_DBNAME
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.log(err));

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: message}],
        });
        res.json({ message: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error connecting to OpenAI:', error);
        res.status(500).json({ error: 'Error processing your request' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});