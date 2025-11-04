const mongoose = require('mongoose');
const { PRODUCT } = require('./models/user');
const data = require('./PRODUCTS/products');
require('dotenv').config();

async function InsertData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("CONNECTION STARTED");

        for (const item of data) {
            await PRODUCT.findOneAndUpdate({ name: item.name },
                item, { upsert: true, new: true }
            );
        }

        console.log("Data inserted/updated successfully");
    } catch (err) {
        console.log("ERROR WHILE INSERTING:", err);
    } finally {
        await mongoose.connection.close();
        console.log("CONNECTION CLOSED");
    }
}

InsertData();