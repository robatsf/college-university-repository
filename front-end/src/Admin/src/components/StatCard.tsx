// src/components/StatCard.js
import React from "react";
import { Card, CardContent, CardHeader, Typography, Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  background: theme.palette.grey[50],
}));

const StatCard = ({ title, value, icon: Icon, trend }) => {
  const muiTheme = useTheme();
  const trendColor = trend > 0 ? muiTheme.palette.success.main : muiTheme.palette.error.main;

  return (
    <StyledCard>
      <StyledCardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{title}</Typography>
            {Icon && <Icon size={24} />}
          </Box>
        }
      />
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {value}
        </Typography>
        {trend !== undefined && (
          <Typography style={{ color: trendColor }}>
            {trend > 0 ? "+" : ""}
            {trend}% from last month
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default StatCard;
