import { useMutation } from "react-query";
import { addNewPayment } from "../../service/firestoreService";

const MutationId = "createPayment";
export const useCreatePaymentMutation = () => {
  return useMutation({
    mutationKey: [MutationId],
    mutationFn: (data) => {
      return addNewPayment(data);
    },
    onSuccess: (data) => {
      console.log(MutationId, data);
    }
  });
};
