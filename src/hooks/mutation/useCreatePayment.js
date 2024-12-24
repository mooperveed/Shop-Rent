import { useMutation } from "react-query";
import {
  addNewPayment,
  getShopById,
  updateShop
} from "../../service/firestoreService";
import { Timestamp } from "@firebase/firestore";
import {calculateRentTaxStatus} from "../../utils/calculateRentTaxStatus";

const MutationId = "createPayment";


export const useCreatePaymentMutation = (onSuccess) => {
  return useMutation({
    mutationKey: [MutationId],
    mutationFn: async (data) => {
      // Fetch shop details
      const shopSnapshot = await getShopById(data.shopId);
      const shopData = shopSnapshot.data();
      const monthlyRent = shopData.roomRent;

      // Calculate initial values
      const currentBalance = Number(shopData.currentBalance);
      const taxBalance = Number(shopData.taxBalance);
      const creditedBalance = Number(shopData.credit);
      const paymentAmount = creditedBalance + Number(data.amount);
      let lastPaymentCount = shopData.lastPaymentCount;
      let taxAmount = 0, rentAmount = 0, tempAmount = 0, credit = 0;

      // Initial calculations
      const taxAmountMonth = Number(monthlyRent) * (Number(shopData.taxRate) / 100);
      const rentStatus = calculateRentTaxStatus(
        shopData.startDate,
        monthlyRent,
        currentBalance,
        shopData.taxRate,
        shopData.taxBalance
      );
      const maxTaxAmount = Number(rentStatus.taxDue) * taxAmountMonth;
      const maxAmount = Number(monthlyRent) * rentStatus.monthsDue;

      // Calculate rent and tax payments
      if ((maxAmount - paymentAmount) < 0) {
        rentAmount = maxAmount;
        tempAmount = paymentAmount - maxAmount;
      } else {
        tempAmount = paymentAmount % monthlyRent;
        rentAmount = paymentAmount - tempAmount;
      }
      if ((maxTaxAmount - tempAmount) < 0) {
        taxAmount = maxTaxAmount;
        credit = tempAmount - taxAmount;
      } else {
        credit = tempAmount % taxAmountMonth;
        taxAmount = tempAmount - credit;
      }

      // Update shop balances
      const updatedBalanceRent = currentBalance + rentAmount;
      const updatedBalanceTax = taxBalance + taxAmount;
      const updatedLastPaymentCount = lastPaymentCount + 1;
      const updatedCredited = credit;

      // Update shop in database
      await updateShop(shopSnapshot.id, {
        currentBalance: updatedBalanceRent,
        credit: updatedCredited,
        taxBalance: updatedBalanceTax,
        lastPaymentCount: updatedLastPaymentCount
      });

      // Re-fetch updated shop data to recalculate rent status
      const updatedShopSnapshot = await getShopById(data.shopId);
      const updatedShopData = updatedShopSnapshot.data();
      const updatedRentStatus = calculateRentTaxStatus(
        updatedShopData.startDate,
        updatedShopData.roomRent,
        updatedShopData.currentBalance,
        updatedShopData.taxRate,
        updatedShopData.taxBalance
      );

      // Create payment data using recalculated rent status
      const paymentData = {
        amount: data.amount,
        shopId: data.shopId,
        noteAtPayment: data.noteAtPayment,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        updatedFromAmount: currentBalance,
        updatedToAmount: updatedBalanceRent,
        deletedAt: null,
        monthsDue: updatedRentStatus.monthsDue,
        taxDue: updatedRentStatus.taxDue,
        isFullyPaidRent: updatedRentStatus.isFullyPaidRent,
        isFullyPaidTax: updatedRentStatus.isFullyPaidTax,
        lastPaymentCount: updatedLastPaymentCount,
      };

      // Add new payment
      return addNewPayment(paymentData);
    },
    onSuccess: (data) => {
      onSuccess();
      console.log(MutationId, data);
    }
  });
};

