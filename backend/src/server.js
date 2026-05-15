const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();
app.locals.startedAt = new Date().toISOString();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
