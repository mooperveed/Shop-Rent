import React, { useState }  from "react";
import styled from "@emotion/styled";
import { formatTimestampToDate } from "../../utils/formatTimestampToDate";
import { Grid2, IconButton, CircularProgress } from "@mui/material";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { getDoc, doc, updateDoc, runTransaction } from "@firebase/firestore";
import { db } from "../../libs/db";
import { COLLECTION } from "../../constants/db";
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faStore, faMoneyBillWave, faReceipt, faCalendarAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { deletePayment } from "../../service/firestoreService";
import { useShopDetailsQuery } from "../../hooks/query/useShopDetails";
import {ConfirmationDialog} from './ConfirmationDialog';
import {ErrorDialog} from './ErrorDialog';

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

const NoteAtPayment = styled("div")(({ theme }) => ({
  fontSize: "14px",
  fontStyle: "italic",
  fontWeight: 400,
  color: "#555555",
  marginTop: "8px",
  marginBottom: "8px",
}));

export const PaidItem = (props) => {
  const shopDetailsQuery = useShopDetailsQuery(props.shopId);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  console.log("props ", props);

  const updateShopBalance = async (shopId, amount) => {
    try {
      await runTransaction(db, async (transaction) => {
        const shopRef = doc(db, COLLECTION.SHOPS, shopId);
        const shopSnap = await transaction.get(shopRef);

        if (!shopSnap.exists()) {
          throw new Error(`Shop with ID ${shopId} not found`);
        }

        const shopData = shopSnap.data();
        let { credit, taxBalance, currentBalance, shopRent, lastPaymentCount } = shopData;

        // Subtract from credit first
        if (credit >= amount) {
          credit -= amount;
          amount = 0;
        } else {
          amount -= credit;
          credit = 0;
        }

        // Then subtract from taxBalance
        if (amount > 0 && taxBalance >= amount) {
          taxBalance -= amount;
          amount = 0;
        } else if (amount > 0) {
          amount -= taxBalance;
          taxBalance = 0;
        }

        // Finally subtract from currentBalance
        if (amount > 0) {
          if (currentBalance >= amount) {
            currentBalance -= amount;
          } else {
            currentBalance = 0;
          }
        }

        // Recalculate credit based on remaining balance
        const newCredit = currentBalance % shopRent;
        currentBalance -= newCredit;
        credit += newCredit;
        lastPaymentCount--;

        transaction.update(shopRef, {
          credit,
          taxBalance,
          currentBalance,
          lastPaymentCount
        });
      });

      return { success: true, message: 'Shop balance updated successfully.' };
    } catch (error) {
      console.error('Error updating shop balance:', error);
      return { success: false, message: error.message || 'Failed to update shop balance' };
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const shopDoc = await getDoc(doc(db, COLLECTION.SHOPS, props.shopId));
      const shopData = shopDoc.data();

      if (shopData.lastPaymentCount === props.lastPaymentCount) {
        setShowConfirmDialog(true);
      } else {
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Failed to check payment status:", error.message);
      setShowErrorDialog(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = async () => {
    if (isConfirming) return;
    setIsConfirming(true);
    try {
      const result = await updateShopBalance(props.shopId, props.amount);
      if (result.success) {
        await deletePayment(props.paymentId);
        props.paymentsListQuery.refetch();
        shopDetailsQuery.refetch();
        console.log(`Payment with ID ${props.paymentId} deleted successfully.`);
      } else {
        console.error("Failed to update shop balance:", result.message);
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Failed to delete payment:", error.message);
      setShowErrorDialog(true);
    } finally {
      setIsConfirming(false);
      setShowConfirmDialog(false);
    }
  };

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
    const credit = shopDoc.exists() ? shopDoc.data().credit : "Unknown Shop";
  
    // Convert Firebase timestamp to readable date
    const paidDate = new Date(createdAt.seconds * 1000).toLocaleDateString();
  
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
    pdfDoc.text(`Rs.${amountPaid}`, textX + 30, startY + lineSpacing);
  
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

    // Tax Due (only if isFullyPaidTax is false)
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

    if (!isFullyPaidTax || !isFullyPaidRent) {
      const exclamationIcon = icon(faExclamationCircle).html[0];
      pdfDoc.addSvgAsImage(exclamationIcon, 20, startY + 6 * lineSpacing - 5, iconSize, iconSize, { color: [46, 204, 113] }); // Green color for attention
      pdfDoc.setFont(undefined, 'bold');
      pdfDoc.setTextColor(46, 204, 113); // Green color for emphasis
      pdfDoc.text("Credit:", textX, startY + 6 * lineSpacing);
      pdfDoc.setFont(undefined, 'normal');
      pdfDoc.setTextColor(0, 0, 0); // Reset to black
      pdfDoc.text(String(credit), textX + 30, startY + 6 * lineSpacing);
    }
    // Adjust the position of the decorative line
    const decorativeLineY = !isFullyPaidRent && monthsDue ? startY + 7 * lineSpacing : startY + 5 * lineSpacing;
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
    <>
      <PaidItemWrapper
        size={{ xs: 12 }}
        container
        justifyContent={"space-between"}
      >
        <Grid2>
          <PaidAmount>{props.amount}</PaidAmount>
          <PaidDate>Paid on {formatTimestampToDate(props.createdAt)}</PaidDate>
        </Grid2>
        <Grid2>
          {props.noteAtPayment && (
            <NoteAtPayment>Note: {props.noteAtPayment}</NoteAtPayment>
          )}
        </Grid2>
        <Grid2 container spacing={1} alignItems={"center"}>
          <Grid2>
            <IconButton 
              size="small" 
              variant="contained" 
              onClick={async () => {
                try {
                  const receiptDetails = await props;
                  console.log("props value:", props.monthsDue);
                  generateReceipt(receiptDetails);
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
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <CircularProgress size={24} /> : <DeleteIcon />}
            </IconButton>
          </Grid2>
        </Grid2>
      </PaidItemWrapper>

      <ConfirmationDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        content="Are you sure you want to delete this payment?"
        isConfirming={isConfirming}
      />

      <ErrorDialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title="Cannot Delete Payment"
        content="This payment cannot be deleted as it is not the most recent payment for this shop."
      />
    </>
  );
};

export default PaidItem;

