import { Box, Typography } from "@mui/material";

const style = {
  width: "100%",
  position: "absolute",
  textAlign: { xs: "center", md: "inherit" },
  bottom: "20px",
};

export default function ApplicantName() {
  return (
    <>
      <Box sx={style}>
        <Typography variant="caption" component="h2">
          Aux Ciprián
        </Typography>
      </Box>
    </>
  );
}
