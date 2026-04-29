"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrescriptionsByAdmission = exports.filterPrescriptionsService = exports.searchPrescription = exports.deletePrescription = exports.updatePrescription = exports.getPrescriptionById = exports.getAllPrescriptions = exports.getPrescriptionByNo = exports.createPrescription = void 0;
const prisma_1 = require("../lib/prisma");
const cacheVersion_1 = require("../utils/cacheVersion");
const filterPaginate_1 = require("../utils/filterPaginate");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_client_1 = require("../aws/s3.client");
// Helper to extract S3 key from URL
const extractS3KeyFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.substring(1); // Remove leading slash
    }
    catch {
        return null;
    }
};
// Helper to delete file from S3
const deleteFileFromS3 = async (fileUrl) => {
    if (!fileUrl)
        return;
    const key = extractS3KeyFromUrl(fileUrl);
    if (!key)
        return;
    try {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });
        await s3_client_1.s3Client.send(command);
    }
    catch (error) {
        console.error("Failed to delete file from S3:", error);
    }
};
const generatePrescriptionNo = async () => {
    const year = new Date().getFullYear();
    // Get the HIGHEST number ever created, not just the last one
    const allPrescriptions = await prisma_1.prisma.prescription.findMany({
        where: {
            prescriptionNo: {
                startsWith: `PRESC-${year}-`,
            },
        },
        select: {
            prescriptionNo: true,
        },
    });
    let maxNumber = 0;
    allPrescriptions.forEach((p) => {
        const parts = p.prescriptionNo.split("-");
        const num = parseInt(parts[parts.length - 1]);
        if (num > maxNumber)
            maxNumber = num;
    });
    const nextNumber = maxNumber + 1;
    return `PRESC-${year}-${nextNumber}`;
};
const createPrescription = async (data) => {
    const { medicines, ...prescriptionData } = data;
    const prescriptionNo = await generatePrescriptionNo();
    const prescription = await prisma_1.prisma.prescription.create({
        data: {
            ...prescriptionData,
            prescriptionNo,
            prescriptionDate: prescriptionData.prescriptionDate
                ? new Date(prescriptionData.prescriptionDate)
                : undefined,
            medicines: {
                create: medicines,
            },
        },
        include: {
            medicines: true,
            admission: {
                include: {
                    patient: {
                        select: {
                            id: true,
                            fullName: true,
                            hospitalPatientId: true,
                        },
                    },
                },
            },
        },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("prescription");
    return prescription;
};
exports.createPrescription = createPrescription;
const getPrescriptionByNo = async (prescriptionNo) => {
    return prisma_1.prisma.prescription.findUnique({
        where: { prescriptionNo },
        include: {
            medicines: true,
            admission: {
                include: {
                    patient: {
                        select: {
                            id: true,
                            fullName: true,
                            hospitalPatientId: true,
                        },
                    },
                },
            },
        },
    });
};
exports.getPrescriptionByNo = getPrescriptionByNo;
const getAllPrescriptions = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "prescription",
        include: {
            medicines: true,
            admission: {
                include: {
                    patient: {
                        select: {
                            id: true,
                            fullName: true,
                            hospitalPatientId: true,
                        },
                    },
                },
            },
        },
    }, cursor);
};
exports.getAllPrescriptions = getAllPrescriptions;
const getPrescriptionById = async (id) => {
    return prisma_1.prisma.prescription.findUnique({
        where: { id },
        include: {
            medicines: true,
            admission: {
                include: {
                    patient: {
                        select: {
                            id: true,
                            fullName: true,
                            hospitalPatientId: true,
                            mobileNumber: true,
                        },
                    },
                    doctor: {
                        select: {
                            id: true,
                            fullName: true,
                        },
                    },
                },
            },
        },
    });
};
exports.getPrescriptionById = getPrescriptionById;
const updatePrescription = async (id, data) => {
    const { medicines, ...prescriptionData } = data;
    // Get existing prescription to check for old file
    const existingPrescription = await prisma_1.prisma.prescription.findUnique({
        where: { id },
        select: { prescriptionDoc: true },
    });
    // If updating prescriptionDoc and old one exists, delete old file from S3
    if (prescriptionData.prescriptionDoc &&
        existingPrescription?.prescriptionDoc) {
        // Only delete if the URL is different
        if (prescriptionData.prescriptionDoc !== existingPrescription.prescriptionDoc) {
            await deleteFileFromS3(existingPrescription.prescriptionDoc);
        }
    }
    const updateData = {
        ...prescriptionData,
        prescriptionDate: prescriptionData.prescriptionDate
            ? new Date(prescriptionData.prescriptionDate)
            : undefined,
    };
    // If medicines are provided, handle them separately
    if (medicines) {
        await prisma_1.prisma.medicine.deleteMany({
            where: { prescriptionId: id },
        });
        updateData.medicines = {
            create: medicines,
        };
    }
    const prescription = await prisma_1.prisma.prescription.update({
        where: { id },
        data: updateData,
        include: {
            medicines: true,
            admission: {
                include: {
                    patient: {
                        select: {
                            id: true,
                            fullName: true,
                            hospitalPatientId: true,
                        },
                    },
                },
            },
        },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("prescription");
    return prescription;
};
exports.updatePrescription = updatePrescription;
const deletePrescription = async (id) => {
    // Get prescription to find associated file
    const prescription = await prisma_1.prisma.prescription.findUnique({
        where: { id },
        select: { prescriptionDoc: true },
    });
    // Delete file from S3 if exists
    if (prescription?.prescriptionDoc) {
        await deleteFileFromS3(prescription.prescriptionDoc);
    }
    // Delete prescription from database (cascades to medicines)
    const deletedPrescription = await prisma_1.prisma.prescription.delete({
        where: { id },
        include: {
            medicines: true,
        },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("prescription");
    return deletedPrescription;
};
exports.deletePrescription = deletePrescription;
exports.searchPrescription = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Prescription",
    exactFields: ["prescriptionNo"],
    prefixFields: ["prescriptionNo"],
    similarFields: [],
    selectFields: [
        "id",
        "prescriptionNo",
        "admissionId",
        "prescriptionDate",
        "prescriptionDoc",
        "notes",
        "status",
        "createdAt",
        "updatedAt",
    ],
});
const filterPrescriptionsService = async (params) => {
    const { fromDate, toDate, status, admissionId, cursor, limit } = params;
    const where = {};
    if (status) {
        where.status = {
            equals: status,
        };
    }
    if (admissionId) {
        where.admissionId = admissionId;
    }
    if (fromDate || toDate) {
        where.prescriptionDate = {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "prescription",
        limit,
        include: {
            medicines: true,
            admission: {
                include: {
                    patient: {
                        select: {
                            id: true,
                            fullName: true,
                            hospitalPatientId: true,
                        },
                    },
                },
            },
        },
    }, cursor, where);
};
exports.filterPrescriptionsService = filterPrescriptionsService;
const getPrescriptionsByAdmission = async (admissionId) => {
    return prisma_1.prisma.prescription.findMany({
        where: { admissionId },
        include: {
            medicines: true,
        },
        orderBy: {
            prescriptionDate: "desc",
        },
    });
};
exports.getPrescriptionsByAdmission = getPrescriptionsByAdmission;
