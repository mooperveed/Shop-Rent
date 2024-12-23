export function calculateRentTaxStatus(
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
  
  //  Convert Firebase Timestamp to JavaScript Date
  const startDate = startingDate.toDate();
  const currentDate = new Date();

  const taxAmount=monthlyRent*(taxRate/100);

  //  Calculate the total number of months since the starting date
  const totalMonthsElapsed =
    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
    (currentDate.getMonth() - startDate.getMonth());



  //  Calculate the total rent due for the months that have passed
  const totalRentDue = Number(totalMonthsElapsed) * Number(monthlyRent);
  const totalTaxDue=  Number(totalMonthsElapsed) *Number(taxAmount);

  console.log("tax amount "+taxAmount);
  console.log("total months  elapsed "+totalMonthsElapsed );
  console.log("total tax due "+totalTaxDue );


  //  Calculate the total payments made
  const totalPaidRent = currentBalance;
  const totalPaidTax=taxBalance;
  console.log("total paid tax "+totalPaidTax);
  console.log("totalRentDue"+totalRentDue);
  console.log("totalPaidRent"+totalPaidRent);

  // Determine rent status based on monthly dues
  const rentStatus = {
    isFullyPaidRent: totalPaidRent >= totalRentDue,
    isFullyPaidTax:totalPaidTax>=totalTaxDue,
    monthsDue: 0,
   taxDue:0,
  };

  if (!rentStatus.isFullyPaidRent) {
    // Calculate the remaining balance
    const pendingRentAmount = totalRentDue - totalPaidRent;
    // Calculate months due based on remaining balance
    rentStatus.monthsDue = Number(Math.floor(pendingRentAmount / monthlyRent));
  }
  if (!rentStatus.isFullyPaidTax) {
    const pendingTaxAmount = totalTaxDue - totalPaidTax;
    rentStatus.taxDue = Number(Math.floor(pendingTaxAmount / taxAmount));
  }
  console.log(" taxDue is  "+rentStatus.taxDue);
  // if(rentStatus.monthsDue===0)rentStatus.isFullyPaidRent=true;
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
