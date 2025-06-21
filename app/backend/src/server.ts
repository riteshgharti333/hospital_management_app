import app from "./app";
import { checkDB } from "./utils/checkPrismaConnection";

checkDB();

const PORT = process.env.PORT || 5000;
console.log(process.env.DATABASE_URL)

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
