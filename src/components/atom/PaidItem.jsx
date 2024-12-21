import styled from "@emotion/styled";
import { formatTimestampToDate } from "../../utils/formatTimestampToDate";
import { Grid2, IconButton } from "@mui/material";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { getDoc, doc } from "@firebase/firestore";
import { db } from "../../libs/db";
import { COLLECTION } from "../../constants/db";
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faStore, faMoneyBillWave, faReceipt, faCalendarAlt,faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { deletePayment } from "../../service/firestoreService";



// Add FontAwesome icons to the library
library.add(faStore, faMoneyBillWave, faReceipt, faCalendarAlt);

const PaidItemWrapper = styled(Grid2)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "12px",
  border: "1px solid #EAEAEA",
  borderRadius: "8px",
  cursor: "pointer",
  [theme.breakpoints.up("md")]: {
    padding: "16px"
  }
}));
const PaidItemLeftCol = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column"
}));
const PaidAmount = styled("div")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 500,
  color: "#000000"
}));
const PaidDate = styled("div")(({ theme }) => ({
  fontSize: "12px",
  fontWeight: 500,
  color: "#000000"
}));
const PaidItemRightCol = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px"
}));
const PaidCurrentBalance = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));
const PaidPreviousBalance = styled("div")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#000000"
}));

export const PaidItem = (props) => {


  const generateReceipt = async (receiptDetails) => {
    const {
      id: paymentId,
      amount: amountPaid,
      createdAt,
      shopId,
      isFullyPaidRent,
      isFullyPaidTax,
      monthsDue,
      taxDue,
    } = receiptDetails;
    console.log("tax due at receiptDetails "+ receiptDetails.taxDue);

    const pdfDoc = new jsPDF();
  
    // Fetch shop details to get shopName
    const shopDoc = await getDoc(doc(db, COLLECTION.SHOPS, shopId));
    const shopName = shopDoc.exists() ? shopDoc.data().shopName : "Unknown Shop";
  
    // Convert Firebase timestamp to readable date
    const paidDate = new Date(createdAt.seconds * 1000).toLocaleDateString();
  
    // // Add background image with low opacity
    // const backgroundImageUrl = 'https://example.com/path/to/your/background-image.jpg'; // Replace with your image URL
    // pdfDoc.addImage(backgroundImageUrl, 'JPEG', 0, 0, 210, 297, '', 'FAST', 0.1);
  
    // Styles
    const lineSpacing = 15;
    const primaryColor = [40, 116, 166]; // Blue
    const secondaryColor = [46, 134, 193]; // Lighter blue
  
    // Header
    pdfDoc.setFillColor(...primaryColor);
    pdfDoc.rect(0, 0, 210, 40, 'F');
    pdfDoc.setTextColor(255, 255, 255);
    pdfDoc.setFontSize(28);
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text("Payment Receipt", 105, 25, { align: "center" });
  
    // Content
    pdfDoc.setFontSize(12);
    pdfDoc.setTextColor(0, 0, 0);
    pdfDoc.setFont(undefined, 'normal');
  
    const startY = 60;
    const iconSize = 5;
    const textX = 40;
  
    // Shop Name
    const storeIcon = icon(faStore).html[0];
    pdfDoc.addSvgAsImage(storeIcon, 20, startY - 5, iconSize, iconSize, { color: secondaryColor });
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text(`Shop Name:`, textX, startY);
    pdfDoc.setFont(undefined, 'normal');
    pdfDoc.text(shopName, textX + 30, startY);
  
    // Amount Paid
    const moneyIcon = icon(faMoneyBillWave).html[0];
    pdfDoc.addSvgAsImage(moneyIcon, 20, startY + lineSpacing - 5, iconSize, iconSize, { color: secondaryColor });
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text(`Amount Paid:`, textX, startY + lineSpacing);
    pdfDoc.setFont(undefined, 'normal');
    pdfDoc.text(`₹${amountPaid}`, textX + 30, startY + lineSpacing);
  
    // Payment ID
    const receiptIcon = icon(faReceipt).html[0];
    pdfDoc.addSvgAsImage(receiptIcon, 20, startY + 2 * lineSpacing - 5, iconSize, iconSize, { color: secondaryColor });
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text(`Payment ID:`, textX, startY + 2 * lineSpacing);
    pdfDoc.setFont(undefined, 'normal');
    pdfDoc.text(paymentId, textX + 30, startY + 2 * lineSpacing);
  
    // Paid Date
    const calendarIcon = icon(faCalendarAlt).html[0];
    pdfDoc.addSvgAsImage(calendarIcon, 20, startY + 3 * lineSpacing - 5, iconSize, iconSize, { color: secondaryColor });
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text(`Paid Date:`, textX, startY + 3 * lineSpacing);
    pdfDoc.setFont(undefined, 'normal');
    pdfDoc.text(paidDate, textX + 30, startY + 3 * lineSpacing);
  
    // Months Due (only if isFullyPaidRent is false)
    if (!isFullyPaidRent && monthsDue) {
      const exclamationIcon = icon(faExclamationCircle).html[0];
      pdfDoc.addSvgAsImage(exclamationIcon, 20, startY + 4 * lineSpacing - 5, iconSize, iconSize, { color: [231, 76, 60] }); // Red color for attention
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.setTextColor(231, 76, 60); // Red color for emphasis
      pdfDoc.text(`Months Due:`, textX, startY + 4 * lineSpacing);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.setTextColor(0, 0, 0); // Reset to black
      pdfDoc.text(`${monthsDue} month${monthsDue > 1 ? "s" : ""} due`, textX + 30, startY + 4 * lineSpacing);

    }
    console.log("fullyPaidRent "+isFullyPaidRent,monthsDue);

    // Months Due (only if isFullyPaidRent is false)
    if (!isFullyPaidTax && taxDue) {
      const exclamationIcon = icon(faExclamationCircle).html[0];
      pdfDoc.addSvgAsImage(exclamationIcon, 20, startY + 5 * lineSpacing - 5, iconSize, iconSize, { color: [231, 76, 60] }); // Red color for attention
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.setTextColor(231, 76, 60); // Red color for emphasis
      pdfDoc.text(`Tax Due:`, textX, startY + 5 * lineSpacing);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.setTextColor(0, 0, 0); // Reset to black
      pdfDoc.text(`${taxDue} month${taxDue > 1 ? "s" : ""} due`, textX + 30, startY + 5 * lineSpacing);

    }
    console.log("fullyPaidTax "+isFullyPaidTax,taxDue);
  
    // Adjust the position of the decorative line
    const decorativeLineY = !isFullyPaidRent && monthsDue ? startY + 6 * lineSpacing : startY + 4 * lineSpacing;
    pdfDoc.setDrawColor(...secondaryColor);
    pdfDoc.setLineWidth(0.5);
    pdfDoc.line(20, decorativeLineY, 190, decorativeLineY);
  
    // Footer
    pdfDoc.setFillColor(...primaryColor);
    pdfDoc.rect(0, 277, 210, 20, 'F');
    pdfDoc.setFontSize(12);
    pdfDoc.setTextColor(255, 255, 255);
    pdfDoc.text("Thank you for your payment!", 105, 288, { align: "center" });
  
    // Save the PDF
    pdfDoc.save(`Receipt_${paymentId}.pdf`);
  };

  return (
    <PaidItemWrapper
      size={{ xs: 12 }}
      container
      justifyContent={"space-between"}
    >
      <Grid2>
        <PaidAmount>{props.amount}</PaidAmount>
        <PaidDate>Paid on {formatTimestampToDate(props.createdAt)}</PaidDate>
      </Grid2>
      {/* <Grid2>

     </Grid2> */}
      <Grid2 container spacing={1} alignItems={"center"}>
        <Grid2>
  <IconButton 
    size="small" 
    variant="contained" 
    onClick={async () => {
      try {
        const receiptDetails = await props; // Fetch from Firebase
        console.log("props value:", props.monthsDue);
        generateReceipt(receiptDetails); // Generate and download the receipt
        // console.log("props  "+props.createdAt);
      } catch (error) {
        console.error("Failed to generate receipt:", error.message);
      }
    }}
  >
    <SystemUpdateAltOutlinedIcon />
  </IconButton>
</Grid2>

<Grid2>
<IconButton 
  size="small" 
  variant="contained" 
  color="error"
  onClick={async () => {
    try {
      
      await deletePayment(props.paymentId); // Call delete function with the payment ID
      props.paymentsListQuery.refetch();
      console.log("props.paymentsListQuery ",props.paymentsListQuery);
     
      console.log(`Payment with ID ${props.paymentId} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete payment:", error.message);
    }
  }}
>
  <DeleteIcon />
</IconButton>

    </Grid2>
      </Grid2>
    </PaidItemWrapper>
  );
};