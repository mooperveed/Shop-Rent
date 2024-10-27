import styled from "@emotion/styled";

const LabeledFieldWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "4px"
}));
const FieldLabel = styled("div")(({ theme }) => ({
  fontSize: "12px"
}));
export const LabelField = (props) => {
  return (
    <LabeledFieldWrapper>
      <FieldLabel>{props.label}</FieldLabel>
      {props.children}
    </LabeledFieldWrapper>
  );
};
