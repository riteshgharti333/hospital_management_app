export const calculateTotals = (data) => {
  return data.reduce(
    (totals, row) => {
      totals.quantity += row.quantity || 0;
      totals.mrp += row.mrp || 0;
      totals.rate += row.rate || 0;
      totals.taxableAmount += row.taxableAmount || 0;
      totals.totalGstAmount += row.totalGstAmount || 0;
      totals.cgstAmount += row.cgstAmount || 0;
      totals.totalAmount += row.totalAmount || 0;
      return totals;
    },
    {
      quantity: 0,
      mrp: 0,
      rate: 0,
      taxableAmount: 0,
      totalGstAmount: 0,
      cgstAmount: 0,
      totalAmount: 0,
    }
  );
};


///////////////////////

export const calculateDueTotals = (data = []) => {
  return data.reduce(
    (acc, item) => {
      acc.totalBill += item.totalBill || 0;
      acc.totalPaid += item.totalPaid || 0;
      acc.totalDue += item.totalDue || 0;
      return acc;
    },
    { totalBill: 0, totalPaid: 0, totalDue: 0 }
  );
};
