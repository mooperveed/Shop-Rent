import { useQuery } from "react-query";
import { getRooms, getTenantById } from "../../service/firestoreService";

const QueryId = "roomList";
export const useRoomsQuery = () => {
  return useQuery([QueryId], {
    queryFn: async () => {
      const roomsSnapshot = await getRooms();

      const roomsWithTenant = await Promise.all(
        roomsSnapshot.map(async (roomDoc) => {
          const tenantSnapshot = await getTenantById(roomDoc.data().tenantId);

          return {
            id: roomDoc.id,
            ...roomDoc.data(),
            tenant: tenantSnapshot.data()
          };
        })
      );
      return roomsWithTenant;
    },
    onSuccess: (data) => {
      console.log(QueryId, data);
    },
    refetchOnWindowFocus: false
  });
};
