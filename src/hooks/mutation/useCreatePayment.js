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
      const shopSnapshot = await getShopById(data.shopId);
      const monthlyRent=shopSnapshot.data().roomRent;
     const rentStatus=calculateRentTaxStatus(shopSnapshot.data().startDate,monthlyRent,shopSnapshot.data().currentBalance,shopSnapshot.data().taxRate,shopSnapshot.data().taxBalance);
      const taxAmountMonth=Number(monthlyRent)*(Number(shopSnapshot.data().taxRate)/100);
      const maxTaxAmount=  Number(rentStatus.taxDue) *Number(taxAmountMonth);
      const maxAmount=Number(monthlyRent)*rentStatus.monthsDue;
      const currentBalance = Number(shopSnapshot.data().currentBalance);
      const taxBalance = Number(shopSnapshot.data().taxBalance);
      const creditedBalance = Number(shopSnapshot.data().credit);
      const paymentAmount=creditedBalance +Number(data.amount);
      let lastPaymentCount=shopSnapshot.data().lastPaymentCount;
      let taxAmount=0,rentAmount=0,tempAmount=0,credit=0;
     
      if((maxAmount-paymentAmount)<0){
         rentAmount=maxAmount;
         tempAmount=paymentAmount-maxAmount;
      }else{
        tempAmount=paymentAmount%monthlyRent;
        rentAmount=paymentAmount-tempAmount;
      }
      if((maxTaxAmount-tempAmount)<0){
        taxAmount=maxTaxAmount;
        credit=tempAmount-taxAmount;
      }else{
        credit=tempAmount%taxAmountMonth;
        taxAmount=tempAmount-credit;
      }

    const updatedBalanceRent = Number(currentBalance)+Number(rentAmount);
    const updatedBalanceTax = Number(taxBalance)+Number(taxAmount);
    const updatedLastPaymentCount=lastPaymentCount+1;
    const updatedCredited = credit;
      await updateShop(shopSnapshot.id, { currentBalance: updatedBalanceRent,credit:updatedCredited,taxBalance:updatedBalanceTax,lastPaymentCount:updatedLastPaymentCount });
      const paymentData = {
        amount:data.amount,
        shopId: data.shopId,
        noteAtPayment:data.noteAtPayment,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        updatedFromAmount: currentBalance,
        updatedToAmount: updatedBalanceRent,
        deletedAt: null,
        monthsDue:rentStatus.monthsDue,
        taxDue:rentStatus.taxDue,
        isFullyPaidRent:rentStatus.isFullyPaidRent,
        isFullyPaidTax:rentStatus.isFullyPaidTax,
        lastPaymentCount:updatedLastPaymentCount,
      };
      return addNewPayment(paymentData);
    },
    onSuccess: (data) => {
      onSuccess();
      console.log(MutationId, data);
    }
  });
};
