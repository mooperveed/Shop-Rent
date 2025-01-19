import { useQuery } from "react-query";
import {
  getShopById,
} from "../../service/firestoreService";

const QueryId = "shopDetails";
export const useShopDetailsQuery = (id) => {
  return useQuery([QueryId, id], {
    queryFn: async () => {
      const roomSnapshot = await getShopById(id);
      return {
        id: roomSnapshot.id,
        ...roomSnapshot.data()
      };
    },
    onSuccess: (data) => {
      console.log(QueryId, data);
    },
    refetchOnWindowFocus: false
  });
};
