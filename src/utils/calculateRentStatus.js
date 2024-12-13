export function calculateRentStatus(
  startingDate,
  monthlyRent,
  currentBalance,
  taxRate,
  taxBalance
) {
  console.log(currentBalance,monthlyRent,startingDate,taxRate,taxBalance);
  if (
    !startingDate || // Assuming startingDate should still be validated for falsy values
    isNaN(monthlyRent) ||
    isNaN(currentBalance)||
    isNaN(taxRate)||
    isNaN(taxBalance)
  ) {
    return null;
  }
  
  // Step 1: Convert Firebase Timestamp to JavaScript Date
  const startDate = startingDate.toDate();
  const currentDate = new Date();

  const taxAmount=monthlyRent*(taxRate/100);

  // Step 2: Calculate the total number of months since the starting date
  const totalMonthsElapsed =
    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
    (currentDate.getMonth() - startDate.getMonth());

  // Step 3: Calculate the monthly rent
  // const monthlyRent = dailyRent * 30;

  // Step 4: Calculate the total rent due for the months that have passed
  // const totalRentDue = Number(totalMonthsElapsed) * (Number(monthlyRent)+Number(taxAmount));
  const totalRentDue = Number(totalMonthsElapsed) * Number(monthlyRent);
  const totalTaxDue=  Number(totalMonthsElapsed) *Number(taxAmount);
  console.log("tax amount "+taxAmount);

  console.log("total months  elapsed "+totalMonthsElapsed );
  
  console.log("total tax due "+totalTaxDue );


  // Step 5: Calculate the total payments made
  const totalPaidRent = currentBalance;
  const totalPaidTax=taxBalance;
  console.log("total paid tax "+totalPaidTax);
  console.log("totalRentDue"+totalRentDue);
  console.log("totalPaidRent"+totalPaidRent);

  // Step 6: Determine rent status based on monthly dues
  const rentStatus = {
    isFullyPaidRent: totalPaidRent >= totalRentDue,
    isFullyPaidTax:totalPaidTax>=totalTaxDue,
    monthsDue: 0,
   taxDue:0,
  };

  if (!rentStatus.isFullyPaidRent) {
    // Calculate the remaining balance
    const remainingBalance = totalRentDue - totalPaidRent;
    // Calculate months due based on remaining balance
    rentStatus.monthsDue = Number(Math.floor(remainingBalance / monthlyRent));
  }
  if (!rentStatus.isFullyPaidTax) {
    const remainingTaxBalance = totalTaxDue - totalPaidTax;
    rentStatus.taxDue = Number(Math.floor(remainingTaxBalance / taxAmount));
  }
  console.log(" taxDue is  "+rentStatus.taxDue);
  // if(rentStatus.monthsDue===0)rentStatus.isFullyPaidRent=true;
  return rentStatus;
}

export function getRentStatusColorAndText(rentStatus) {
  console.log("rent status is "+rentStatus);
  // console.log(rentStatus.taxDue);
  if (!rentStatus) return { label: "N/A" };
  if (rentStatus.isFullyPaidRent) {
    return { color: "success", label: "Fully Paid" };
  } else if (rentStatus.monthsDue > 0) {
    return { color: "error", label: `${rentStatus.monthsDue} months due` };
  } else {
    console.log("months due"+rentStatus.monthsDue);
    console.log("rent fullypaid"+rentStatus.isFullyPaidRent);
    return { color: "warning", label: "Overdue" };
  }
}
