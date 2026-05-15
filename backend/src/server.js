const path = require("path");
const dotenv = require("dotenv");;
const app = require("./app");

dotenv.config();
const connectDB = require("./config/db");

const PORT = process.env.PORT 

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});