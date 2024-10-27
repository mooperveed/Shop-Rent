import { useQuery } from "react-query";
import {
  getPaymentByShopId,
  getPaymentByTenantId,
  getRoomById
} from "../../service/firestoreService";

const QueryId = "paymentList";
export const useTenantPaymentsQuery = (roomId) => {
  return useQuery([QueryId, roomId], {
    queryFn: async () => {
      const paymentsSnapshot = await getPaymentByShopId(roomId);

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
