export function calculateRentStatus(
  startingDate,
  dailyRent,
  startingAmount,
  currentAmount
) {
  if (!startingDate || !dailyRent || !startingAmount || !currentAmount)
    return null;
  // Step 1: Convert Firebase Timestamp to JavaScript Date
  const startDate = startingDate.toDate();
  const currentDate = new Date();

  // Step 2: Calculate the total number of months since the starting date
  const totalMonthsElapsed =
    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
    (currentDate.getMonth() - startDate.getMonth());

  // Step 3: Calculate the monthly rent
  const monthlyRent = dailyRent * 30;

  // Step 4: Calculate the total rent due for the months that have passed
  const totalRentDue = totalMonthsElapsed * monthlyRent;

  // Step 5: Calculate the total payments made
  const totalPaid = currentAmount;

  // Step 6: Determine rent status based on monthly dues
  const rentStatus = {
    isFullyPaid: totalPaid >= totalRentDue,
    monthsDue: 0
  };

  if (!rentStatus.isFullyPaid) {
    // Calculate the remaining balance
    const remainingBalance = totalRentDue - totalPaid;

    // Calculate months due based on remaining balance
    rentStatus.monthsDue = Math.floor(remainingBalance / monthlyRent);
  }
  console.log(rentStatus);
  return rentStatus;
}

export function getRentStatusColorAndText(rentStatus) {
  if (!rentStatus) return { label: "N/A" };
  if (rentStatus.isFullyPaid) {
    return { color: "success", label: "Fully Paid" };
  } else if (rentStatus.monthsDue > 0) {
    return { color: "error", label: `${rentStatus.monthsDue} months due` };
  } else {
    return { color: "warning", label: "Overdue" };
  }
}
