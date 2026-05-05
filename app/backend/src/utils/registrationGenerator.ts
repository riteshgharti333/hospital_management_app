export const generateRegistrationNumber = async (
  model: any,
  prefix: string,
  field: string = "registrationNo"
) => {
  const currentYear = new Date().getFullYear();

  const lastRecord = await model.findFirst({
    where: {
      [field]: {
        startsWith: `${prefix}-${currentYear}`,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  let nextCounter = 1;

  if (lastRecord) {
    const parts = lastRecord[field].split("-");
    const lastCounter = Number(parts[2]);
    nextCounter = lastCounter + 1;
  }

  return `${prefix}-${currentYear}-${nextCounter}`;
};