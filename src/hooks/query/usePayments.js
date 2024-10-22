import { useQuery } from "react-query";
import {
  getPaymentByTenantId,
  getRoomById
} from "../../service/firestoreService";

const QueryId = "paymentList";
export const usePaymentsQuery = (roomId) => {
  return useQuery([QueryId, roomId], {
    queryFn: async () => {
      const roomSnapshot = await getRoomById(roomId);
      const paymentsSnapshot = await getPaymentByTenantId(
        roomSnapshot.data().tenantId
      );

      const paymentList = paymentsSnapshot.map((payment) => {
        return {
          id: payment.id,
          ...payment.data()
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
