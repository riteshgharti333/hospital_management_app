import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function countTotalPatients() {
    try {
        console.log("📊 Counting total patients...");
        
        const totalPatients = await prisma.patient.count();
        
        console.log(`\n✅ Total patients in database: ${totalPatients.toLocaleString()}`);
        
        return totalPatients;
    } catch (error) {
        console.error("❌ Error counting patients:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the function
countTotalPatients();