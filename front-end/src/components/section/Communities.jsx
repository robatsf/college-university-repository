import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronRight, Users, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { useDepartments } from '../../hooks/useDepartments';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Skeleton
} from '@mui/material';

export default function Departments() {
  const { departments, isLoading, error, stats, colorVariants } = useDepartments();

  // Loading state with Material UI Skeletons
  if (isLoading) {
    return (
      <Card sx={{ p: 2, borderRadius: 2, boxShadow: 1, backgroundColor: 'white' }}>
        <Skeleton variant="text" width="33%" height={32} />
        <Skeleton variant="text" width="50%" height={24} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} md={6} key={i}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Skeleton variant="rectangular" width={48} height={48} />
                  </Grid>
                  <Grid item xs>
                    <Skeleton variant="text" width="75%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="50%" height={16} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          p: 2,
          borderRadius: 2,
          boxShadow: 1,
          textAlign: 'center',
          color: 'red'
        }}
      >
        Error loading departments
      </Box>
    );
  }

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: 'white',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: 2 }
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Academic Departments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Browse research works by department
            </Typography>
          </Box>
          {/* 
          Uncomment and adjust the button if you need the "View All" functionality
          <Link to="/departments" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              sx={{
                color: '#0066CC',
                borderColor: '#0066CC',
                '&:hover': { backgroundColor: '#E0F2FF' }
              }}
            >
              View All
              <ChevronRight style={{ marginLeft: 4 }} />
            </Button>
          </Link>
          */}
        </Box>

        {/* Departments Grid */}
        <Grid container spacing={2}>
          {departments.map((dept, index) => (
            <Grid item xs={12} md={6} key={dept.name}>
              <Link
                to={`browsedetail/?departemnt=${dept.name}`}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: '#0066CC', boxShadow: 3 }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Icon */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: colorVariants[index % 4],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Building2 size={24} />
                    </Box>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            transition: 'color 0.3s',
                            '&:hover': { color: '#0066CC' }
                          }}
                        >
                          {dept.name}
                        </Typography>
                        <ChevronRight style={{ marginLeft: 8, color: '#ccc', transition: 'all 0.3s' }} />
                      </Box>

                      {/* Stats */}
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BookOpen size={16} />
                          <Typography variant="caption" color="text.secondary">
                            {dept.count.toLocaleString()} items
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Users size={16} />
                          <Typography variant="caption" color="text.secondary">
                            Last updated: {new Date(dept.latest_file).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* Summary Stats */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'grey.300' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0066CC' }}>
                  {stats.totalItems.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Items
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0066CC' }}>
                  {stats.totalDepartments}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Departments
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0066CC' }}>
                  {stats.latestUpdate ? stats.latestUpdate.toLocaleDateString() : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Latest Update
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
