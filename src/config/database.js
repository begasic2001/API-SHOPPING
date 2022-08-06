const mongoose = require("mongoose");
async function connect() {
	try {
		await mongoose.connect("mongodb://localhost/API-SHOPPING");
		console.log(`Connect successfully mongo`);
	} catch (error) {
        console.log(error)
    }
}

module.exports = {connect}
