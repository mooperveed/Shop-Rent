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
  
    // Create an array of promises to fetch the shopName for each payment
    const promises = snapshot.docs.map(async (paymentDoc) => {
      const payment = paymentDoc.data();
      const shopIdRef = payment.shopId; // shopId reference
  
      let shopName = "N/A";
  
      // Fetch the shop name using the getShopById function
      if (shopIdRef) {
        const shopDoc = await getShopById(shopIdRef.id); // getShopById expects the shop ID
        if (shopDoc.exists()) {
          shopName = shopDoc.data().shopName || "N/A"; // Assuming 'name' contains the shopName
        }
      }
  
      // Convert Firebase createdAt timestamp to JavaScript Date
      const paidDate = new Date(payment.createdAt.seconds * 1000);
      const month = paidDate.getMonth(); // 0 = January, 1 = February, ..., 11 = December
      const year = paidDate.getFullYear(); // Extract the year
  
      // Initialize a row with PaymentID, ShopName, AmountPaid
      const row = {
        PaymentID: paymentDoc.id,
        ShopName: shopName, // Use the fetched shopName
        AmountPaid: payment.amount || 0, // Use 'amount' instead of 'amountPaid'
      };
  
      // Generate Month Year as keys dynamically
      const monthYearKey = `${getMonthName(month)} ${year}`;
      row[monthYearKey] = "✔";
  
      // Push the row to the data array
      data.push(row);
    });
  
    // Wait for all the promises to resolve
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