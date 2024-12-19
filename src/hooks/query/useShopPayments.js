import { useQuery } from "react-query";
import {
  getPaymentByShopId,
  getRoomById
} from "../../service/firestoreService";

const QueryId = "paymentList";
// console.log("ji");
// console.log( getPaymentByShopId(shopId));
export const useShopPaymentsQuery = (shopId) => {
  return useQuery([QueryId, shopId], {
    queryFn: async () => {
      const paymentsSnapshot = await getPaymentByShopId(shopId);
   
  
      const paymentList = paymentsSnapshot.docs.map((payment) => {
        return {
          id: payment.id,
          ...payment.data(),
          shopId: payment.data().shopId.id
        };
      });
      // console.log(paymentList);
      return paymentList;
    },
    onSuccess: (data) => {
      console.log(QueryId, data);
    },
    refetchOnWindowFocus: false
  });
};