import { useMutation } from "react-query";
import {
  createTenant,
  updateRoom,
  updateShop,
  updateTenant
} from "../../service/firestoreService";

const MutationId = "updateShop";

export const useUpdateShopMutation = (onSuccess) => {
  return useMutation({
    mutationKey: [MutationId],
    mutationFn: async (data) => {
      return updateShop(data.id, data);
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess();
      console.log(MutationId, data);
    }
  });
};
