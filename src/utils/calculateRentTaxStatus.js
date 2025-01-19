export function calculateRentTaxStatus(
  startingDate,
  monthlyRent,
  currentBalance,
  taxRate,
  taxBalance
) {
  if (
    !startingDate || // Assuming startingDate should still be validated for falsy values
    isNaN(monthlyRent) ||
    isNaN(currentBalance) ||
    isNaN(taxRate) ||
    isNaN(taxBalance)
  ) {
    return null;
  }

  // Convert Firebase Timestamp to JavaScript Date
  const startDate = startingDate.toDate();
  const currentDate = new Date();

  // If taxRate is 0, skip tax calculations
  const taxAmount = taxRate > 0 ? monthlyRent * (taxRate / 100) : 0;

  // Calculate the total number of months since the starting date
  const totalMonthsElapsed =
    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
    (currentDate.getMonth() - startDate.getMonth());

  // Calculate the total rent due for the months that have passed
  const totalRentDue = Number(totalMonthsElapsed) * Number(monthlyRent);
  const totalTaxDue = taxRate > 0 ? Number(totalMonthsElapsed) * Number(taxAmount) : 0;


  // Calculate the total payments made
  const totalPaidRent = currentBalance;
  const totalPaidTax = taxBalance;

  // Determine rent status based on monthly dues
  const rentStatus = {
    isFullyPaidRent: totalPaidRent >= totalRentDue,
    isFullyPaidTax: taxRate === 0 || totalPaidTax >= totalTaxDue,
    monthsDue: 0,
    taxDue: 0,
  };

  if (!rentStatus.isFullyPaidRent) {
    // Calculate the remaining balance
    const pendingRentAmount = totalRentDue - totalPaidRent;
    // Calculate months due based on remaining balance
    rentStatus.monthsDue = Number(Math.floor(pendingRentAmount / monthlyRent));
  }

  if (taxRate > 0 && !rentStatus.isFullyPaidTax) {
    const pendingTaxAmount = totalTaxDue - totalPaidTax;
    rentStatus.taxDue = Number(Math.floor(pendingTaxAmount / taxAmount));
  }
  return rentStatus;
}

export function getRentStatusColorAndText(rentStatus) {
  if (!rentStatus) return { label: "N/A" };
  if (rentStatus.isFullyPaidRent) {
    return { color: "success", label: "Fully Paid" };
  } else if (rentStatus.monthsDue > 0) {
    return { color: "error", label: `${rentStatus.monthsDue} months due` };
  } else {
    return { color: "warning", label: `${rentStatus.monthsDue}` };
  }
}

export function getTaxStatusColorAndText(rentStatus) {
  if (!rentStatus) return { label: "N/A" };
  if (rentStatus.isFullyPaidTax) {
    return { color: "success", label: "Tax Fully Paid" };
  } else if (rentStatus.taxDue > 0) {
    return { color: "error", label: `${rentStatus.taxDue} tax due` };
  } else {
    return { color: "warning", label: "Error" };
  }
}
