import { PrismaClient } from "@prisma/client";

const isRender = process.env.RENDER === "true"; 

export const prisma = new PrismaClient(
  isRender
    ? ({
        __internal: {
          engine: {
            enablePreparedStatements: false,
          },
        },
      } as any)
    : {}
);
