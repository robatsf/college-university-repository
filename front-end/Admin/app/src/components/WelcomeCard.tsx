import React from "react";
import { Box, Card, CardContent, Avatar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BookOpen, GraduationCap } from "lucide-react";

// Reusable styled card for the welcome message
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const WelcomeCard = ({ role, name }) => (
  <StyledCard sx={{ mb: 3, minHeight: 110, maxHeight: 110 }}>
    <CardContent sx={{ py: 2 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          {role === "librarian" ? <BookOpen size={24} /> : <GraduationCap size={24} />}
        </Avatar>
        <Box>
          <Typography variant="h5" component="div">
            Welcome, {name}!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {role === "librarian"
              ? "Manage and track library resources efficiently"
              : "Monitor your department's research activities"}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </StyledCard>
);

export default WelcomeCard;
