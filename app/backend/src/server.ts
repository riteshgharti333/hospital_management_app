import app from "./app";
import { checkDB } from "./utils/checkPrismaConnection";

checkDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});