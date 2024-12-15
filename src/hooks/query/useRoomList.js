import { useQuery } from "react-query";
import { getRoomByShopId } from "../../service/firestoreService";

const QueryId = "roomList";

export const useRoomListQuery = (id) => {
  return useQuery([QueryId,id], {
    queryFn: async () => {
      const roomsSnapshot = await getRoomByShopId(id);

      const rooms = roomsSnapshot.docs.map((roomDoc) => ({
        id: roomDoc.id, // Document ID
        ...roomDoc.data(), // roomNumber and consumerNumber
      }));
   console.log("rooms"+roomsSnapshot);
      return rooms;
    },
    onSuccess: (data) => {
      console.log(QueryId, data);
    },
    refetchOnWindowFocus: false,
  });
};
