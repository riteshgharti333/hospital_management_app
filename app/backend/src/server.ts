import app from "./app";
import { getAllAdmissionsService } from "./services/admissionService";
import { checkDB } from "./utils/checkPrismaConnection";

const PORT = process.env.PORT || 5000;

export async function warmAdmissionCache() {
  console.time("🟡 Warmup admissions");

  // Example: warm first 2 pages with 50 items each
  await Promise.all([ 
    getAllAdmissionsService(undefined, 50), // page 1
    getAllAdmissionsService("50", 50), // page 2 (cursor example)
  ]);
 
  console.timeEnd("🟡 Warmup admissions");
}    
 
(async () => { 
  try {
    await checkDB();
    // 🔥 Cache warm-up before server goes live
    await warmAdmissionCache();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
