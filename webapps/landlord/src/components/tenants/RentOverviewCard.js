import { Box, Divider, Typography } from '@material-ui/core';
import { CardRow, PageInfoCard } from '../Cards';

import NumberFormat from '../NumberFormat';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { StoreContext } from '../../store';
import { useContext } from 'react';
import useTranslation from 'next-translate/useTranslation';

export default function RentOverview() {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);

  return (
    <PageInfoCard Icon={ReceiptIcon} title={t('Rental')}>
      <CardRow>
        <Typography color="textSecondary" noWrap>
          {t('Rent')}
        </Typography>
        <NumberFormat
          color="text.secondary"
          value={store.tenant.selected.rental}
        />
      </CardRow>
      <CardRow>
        <Typography color="textSecondary" noWrap>
          {t('Expenses')}
        </Typography>
        <NumberFormat
          color="text.secondary"
          value={store.tenant.selected.expenses}
        />
      </CardRow>
      {store.tenant.selected.discount > 0 ? (
        <CardRow>
          <Typography color="textSecondary" noWrap>
            {t('Discount')}
          </Typography>
          <NumberFormat
            color="text.secondary"
            value={store.tenant.selected.discount * -1}
          />
        </CardRow>
      ) : null}
      {store.tenant.selected.isVat && (
        <>
          <Box pb={1}>
            <Divider />
          </Box>
          <CardRow>
            <Typography color="textSecondary" noWrap>
              {t('Pre-tax total')}
            </Typography>
            <NumberFormat
              color="text.secondary"
              value={store.tenant.selected.preTaxTotal}
            />
          </CardRow>
          <CardRow>
            <Typography color="textSecondary" noWrap>
              {t('VAT')}
            </Typography>
            <NumberFormat
              color="text.secondary"
              value={store.tenant.selected.vat}
            />
          </CardRow>
        </>
      )}
      <Box pb={1}>
        <Divider />
      </Box>
      <CardRow>
        <Typography color="textSecondary" variant="h5" noWrap>
          {t('Total')}
        </Typography>
        <NumberFormat
          color="text.secondary"
          fontSize="h5.fontSize"
          value={store.tenant.selected.total}
        />
      </CardRow>
    </PageInfoCard>
  );
}
