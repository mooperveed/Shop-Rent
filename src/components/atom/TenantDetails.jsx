import React from "react";
import { useParams } from "react-router-dom";
import { useRoomDetailsQuery } from "../../hooks/query/useShopDetails";
import { Button, Chip, Grid2, IconButton, Typography } from "@mui/material";
import { LabelField } from "./LabelField";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

export const TenantDetails = () => {
  const { roomId } = useParams();

  return (
    <Grid2 container>
      <Grid2
        size={{ xs: 12 }}
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        spacing={1}
        marginBottom={2}
      >
        <Grid2 size="auto">
          <Typography variant="subtitle1" fontWeight={500}>
            Tenant Details
          </Typography>
        </Grid2>
        <Grid2 size="auto">
          <IconButton size={"small"} variant="contained">
            <ChangeCircleIcon />
          </IconButton>
        </Grid2>
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <LabelField label="Shop Name">
          <Typography variant="body2">{"ABC Shop" || "N/A"}</Typography>
        </LabelField>
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <LabelField label="Address">
          <Typography variant="body2">
            {"123/456, Shop No. 789, ABC Street, XYZ City, State, Pincode"}
          </Typography>
        </LabelField>
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <LabelField label="Contact No">
          <Typography variant="body2">{"995029488" || "N/A"}</Typography>
        </LabelField>
      </Grid2>
    </Grid2>
  );
};
