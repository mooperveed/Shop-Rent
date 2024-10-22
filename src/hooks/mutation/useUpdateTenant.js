import { useMutation } from "react-query";
import { createTenant, updateTenant } from "../../service/firestoreService";

const MutationId = "updateTenant";

export const useUpdateTenantMutation = () => {
  return useMutation({
    mutationKey: [MutationId],
    mutationFn: async (roomId, data) => {
      const tenantSnapshot = await createTenant(data);

      return updateTenant(roomId, tenantSnapshot.id);
    },
    onSuccess: (data) => {
      console.log(MutationId, data);
    }
  });
};
