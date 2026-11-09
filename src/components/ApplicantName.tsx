import { Box, Typography } from "@mui/material";

const signatureStyles = {
  width: "100%",
  position: "absolute",
  textAlign: { xs: "center", md: "inherit" },
  bottom: "20px",
};

export default function ApplicantName() {
  return (
    <Box sx={signatureStyles}>
      <Typography variant="caption" component="h2">
        Aux Ciprián
      </Typography>
    </Box>
  );
}
