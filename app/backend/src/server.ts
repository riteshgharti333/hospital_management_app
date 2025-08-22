import app from "./app";
import { checkDB } from "./utils/checkPrismaConnection";
import { services } from "./utils/modelServices";

const PORT = process.env.PORT || 5000;

async function warmCaches() {
  console.time("🔄 Cache warming");

  await Promise.all([
    
  ]); 

  console.timeEnd("🔄 Cache warming"); 
}

(async () => {
  try {
    await warmCaches();
    await checkDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
