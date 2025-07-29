import app from "./app";
import { checkDB } from "./utils/checkPrismaConnection";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await checkDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1); 
  }
})();
