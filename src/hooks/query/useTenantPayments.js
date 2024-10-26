import { useQuery } from "react-query";
import {
  getPaymentByTenantId,
  getRoomById
} from "../../service/firestoreService";

const QueryId = "paymentList";
export const useTenantPaymentsQuery = (roomId) => {
  return useQuery([QueryId, roomId], {
    queryFn: async () => {
      const roomSnapshot = await getRoomById(roomId);
      const paymentsSnapshot = await getPaymentByTenantId(
        roomSnapshot.data().tenantId.id
      );
      console.log(paymentsSnapshot);

      const paymentList = paymentsSnapshot.docs.map((payment) => {
        return {
          id: payment.id,
          ...payment.data(),
          tenantId: roomSnapshot.data().tenantId.id,
          tenant: roomSnapshot.data().tenant
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
