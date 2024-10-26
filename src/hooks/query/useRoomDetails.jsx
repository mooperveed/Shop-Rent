import { useQuery } from "react-query";
import { getRoomById, getTenantById } from "../../service/firestoreService";

const QueryId = "roomDetail";
export const useRoomDetailsQuery = (id) => {
  return useQuery([QueryId, id], {
    queryFn: async () => {
      const roomSnapshot = await getRoomById(id);
      const roomData = roomSnapshot.data();
      const tenant = await getTenantById(roomData.tenantId.id);
      return {
        id: roomSnapshot.id,
        ...roomData,
        tenantId: tenant.id,
        tenant: tenant.data()
      };
    },
    onSuccess: (data) => {
      console.log(QueryId, data);
    },
    refetchOnWindowFocus: false
  });
};
