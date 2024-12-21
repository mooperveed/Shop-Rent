import React from "react";
import { Button, Grid2, Modal, TextField } from "@mui/material";
import { useCreatePaymentMutation } from "../../hooks/mutation/useCreatePayment";
import { useParams } from "react-router-dom";
import { ModalLayout } from "./ModalLayout";

export const NewPaymentModal = (props) => {
  const { shopId } = useParams();
  // console.log(shopId);
  const [amount, setAmount] = React.useState(0);
  const [noteAtPayment, setNoteAtPayment] = React.useState('');
  const createPaymentMutation = useCreatePaymentMutation(props.onSuccess);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
  const setNoteAtPaymentChange = (event) => {
    setNoteAtPayment(event.target.value);
   
  };
  console.log("noteAtPayment is ",noteAtPayment);
  const handleSubmitAmount = () => {
    createPaymentMutation.mutate({
      shopId,
      amount,
      noteAtPayment
    });
  };

  return (
    <ModalLayout
      isOpen={props.open}
      onClose={props.onClose}
      onSubmit={handleSubmitAmount}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Amount"
            variant="outlined"
            placeholder="0000"
            fullWidth
            type="number"
            min={0}
            value={amount}
            onChange={handleAmountChange}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Note"
            variant="outlined"
            placeholder="Add a note"
            fullWidth
            type="string"
            value={noteAtPayment}
            onChange={setNoteAtPaymentChange}
          />
        </Grid2>
      </Grid2>
    </ModalLayout>
  );
};
