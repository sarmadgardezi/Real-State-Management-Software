import { Box, Grid, Typography } from '@material-ui/core';

import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { DashboardCard } from '../Cards';
import Hidden from '../HiddenSSRCompatible';
import NumberFormat from '../NumberFormat';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../store';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

function FigureCardContent({ nav, children }) {
  return (
    <Box position="relative">
      <Box
        height={150}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="success.dark"
      >
        {children}
      </Box>
      {nav && (
        <Box position="absolute" bottom={0} right={0} fontSize={30}>
          <ArrowRightAltIcon fontSize="inherit" color="action" />
        </Box>
      )}
    </Box>
  );
}

function GeneralFigures() {
  const store = useContext(StoreContext);
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <>
      <Hidden smDown>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4} lg={2}>
            <DashboardCard
              title={t('Tenant')}
              onClick={() => {
                router.push(`/${store.organization.selected.name}/tenants`);
              }}
            >
              <FigureCardContent nav>
                <Typography variant="h3">
                  {store.dashboard.data.overview?.tenantCount}
                </Typography>
              </FigureCardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={4} lg={2}>
            <DashboardCard
              title={t('Property')}
              onClick={() => {
                router.push(`/${store.organization.selected.name}/properties`);
              }}
            >
              <FigureCardContent nav>
                <Typography variant="h3">
                  {store.dashboard.data.overview?.propertyCount}
                </Typography>
              </FigureCardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={4} lg={2}>
            <DashboardCard title={t('Occupancy rate')}>
              <FigureCardContent>
                <NumberFormat
                  value={store.dashboard.data.overview?.occupancyRate}
                  showZero={true}
                  minimumFractionDigits={0}
                  style="percent"
                  fontSize="h3.fontSize"
                />
              </FigureCardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <DashboardCard title={t('Revenues')}>
              <FigureCardContent>
                <NumberFormat
                  value={store.dashboard.data.overview?.totalYearRevenues}
                  fontSize="h3.fontSize"
                />
              </FigureCardContent>
            </DashboardCard>
          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <Grid container spacing={5}>
          <Grid item xs={12} md={12} lg={6}>
            <DashboardCard title={t('Revenues')}>
              <FigureCardContent>
                <NumberFormat
                  value={store.dashboard.data.overview?.totalYearRevenues}
                  fontSize="h3.fontSize"
                />
              </FigureCardContent>
            </DashboardCard>
          </Grid>
        </Grid>
      </Hidden>
    </>
  );
}

export default observer(GeneralFigures);
