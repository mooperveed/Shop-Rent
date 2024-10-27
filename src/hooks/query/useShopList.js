import { useQuery } from "react-query";
import { getShops } from "../../service/firestoreService";

const QueryId = "shopList";
export const useShopListQuery = () => {
  return useQuery([QueryId], {
    queryFn: async () => {
      const shopsListSnapshot = await getShops();

      const shopsList = await Promise.all(
        shopsListSnapshot.docs.map(async (shopDoc) => {
          return {
            id: shopDoc.id,
            ...shopDoc.data()
          };
        })
      );
      console.log(shopsList);
      return shopsList;
    },
    onSuccess: (data) => {
      console.log(QueryId, data);
    },
    refetchOnWindowFocus: false
  });
};
