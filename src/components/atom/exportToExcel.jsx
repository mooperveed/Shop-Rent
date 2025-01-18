import * as XLSX from "xlsx";
import { getShopById,getPayments } from "../../service/firestoreService";


// Helper function to get the full month name
const getMonthName = (monthIndex) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return monthNames[monthIndex];
  };



  const fetchAndPreparePayments = async () => {
    const snapshot = await getPayments();
    const data = [];
  
    const promises = snapshot.docs.map(async (paymentDoc) => {
      const payment = paymentDoc.data();
      const shopIdRef = payment.shopId;
  
      let shopName = "N/A";
      let shopOwner = "N/A";
  
      // Fetch shop details
      if (shopIdRef) {
        const shopDoc = await getShopById(shopIdRef.id);
        if (shopDoc.exists()) {
          shopName = shopDoc.data().shopName || "N/A";
          shopOwner = shopDoc.data().ownerName || "N/A";
        }
      }
  
      // Convert Firebase createdAt timestamp to JavaScript Date
      const paidDate = new Date(payment.createdAt.seconds * 1000);
      const formattedDate = `${paidDate.getDate().toString().padStart(2, '0')}-${(paidDate.getMonth() + 1).toString().padStart(2, '0')}-${paidDate.getFullYear()}`;
      const monthYear = `${getMonthName(paidDate.getMonth())} ${paidDate.getFullYear()}`;
  
      // Create a row with detailed fields
      const row = {
        PaymentID: paymentDoc.id,
        ShopName: shopName,
        ShopOwner: shopOwner,
        AmountPaid: payment.amount || 0,
        MonthsDue: payment.monthsDue || 0,
        PaidDate: formattedDate, // Detailed date
        MonthYear: monthYear, // Grouping month-year
      };
  
      data.push(row);
    });
  
    // Wait for all promises
    await Promise.all(promises);
  
    return data;
  };
  
  
  
  
  
  
  export const exportToExcel = async () => {
    const paymentsData = await fetchAndPreparePayments();
  
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(paymentsData);
  
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments Report");
  
    // Save the Excel file
    XLSX.writeFile(workbook, "Payments_Report.xlsx");
  };