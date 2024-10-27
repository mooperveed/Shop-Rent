import React from "react";
import { Button, Modal, TextField } from "@mui/material";
import { useUpdateTenantMutation } from "../../hooks/mutation/useUpdateShop";
import { useParams } from "react-router-dom";

export const UpdateTenantModal = (props) => {
  const { roomId } = useParams();
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const updateTenant = useUpdateTenantMutation(
    props.onSuccess
  );

  const handleSubmitAmount = () => {
    updateTenant.mutate({
      roomId,
      name,
      address
    });
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          label="Address"
          variant="outlined"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <Button
          onClick={handleSubmitAmount}
          disabled={updateTenant.isLoading}
          variant="contained"
        >
          {updateTenant.isLoading ? "Creating.." : "Submit"}
        </Button>
      </>
    </Modal>
  );
};
