import { useMutation } from "react-query";
import {
  addNewPayment,
  getRoomById,
  getShopById,
  updateShop
} from "../../service/firestoreService";
import { Timestamp } from "@firebase/firestore";

const MutationId = "createPayment";
export const useCreatePaymentMutation = (onSuccess) => {
  return useMutation({
    mutationKey: [MutationId],
    mutationFn: async (data) => {
      const shopSnapshot = await getShopById(data.roomId);
      const currentBalance = shopSnapshot.data().currentBalance;
      const updatedBalance = currentBalance + data.amount;
      await updateShop(shopSnapshot.id, { currentBalance: updatedBalance });
      const paymentData = {
        amount: data.amount,
        shopId: data.roomId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        updatedFromAmount: currentBalance,
        updatedToAmount: updatedBalance,
        deletedAt: null
      };
      return addNewPayment(paymentData);
    },
    onSuccess: (data) => {
      onSuccess();
      console.log(MutationId, data);
    }
  });
};
