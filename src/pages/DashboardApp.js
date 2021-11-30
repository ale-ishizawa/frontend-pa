// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
// components
import { NotificationManager } from 'react-notifications';
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../components/_dashboard/app';
import { api } from '../services/api';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [discData, setDiscData] = useState([]);

  useEffect(() => {
    getDiscData();
  }, []);

  async function getDiscData() {
    try {
      const response = await api.get('api/employees/disc');
      setDiscData([
        parseInt(response.data[0].d, 10),
        parseInt(response.data[0].i, 10),
        parseInt(response.data[0].s, 10),
        parseInt(response.data[0].c, 10)
      ]);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }
  return (
    <Page title="Dashboard | DISCovery">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Olá, seja bem-vindo</Typography>
        </Box>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWeeklySales />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid> */}

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits chartData={discData} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid> */}
          {/* 
          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
