import { useQuery } from "react-query";
import {
  getPaymentByShopId,
} from "../../service/firestoreService";

const QueryId = "paymentList";
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
      return paymentList;
    },
    onSuccess: (data) => {
      console.log(QueryId, data);
    },
    refetchOnWindowFocus: false
  });
};