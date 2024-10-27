import { CircularProgress } from "@mui/material";
import styled from "@emotion/styled";

const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  flex: 1
}));

const CircularLoader = () => {
  return (
    <Wrapper>
      <CircularProgress size={30} color={"rgba(30, 30, 30, 0.87)"}/>
    </Wrapper>
  );
};

export default CircularLoader;
