import { useMutation } from "react-query";
import { createShop } from "../../service/firestoreService";

const MutationId = "createShop";

export const useCreateShopMutation = (onSuccess) => {
  return useMutation({
    mutationKey: [MutationId],
    mutationFn: async (data) => {
      return createShop({ ...data, currentBalance: data.startingBalance });
    },
    onSuccess: (data) => {
      onSuccess();
      console.log(MutationId, data);
    }
  });
};
