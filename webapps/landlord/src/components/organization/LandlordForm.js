import * as Yup from 'yup';

import { Form, Formik } from 'formik';
import {
  NumberField,
  RadioField,
  RadioFieldGroup,
  Section,
  SelectField,
  SubmitButton,
  TextField,
} from '@microrealestate/commonui/components';
import { useCallback, useContext, useMemo } from 'react';

import cc from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../store';
import useTranslation from 'next-translate/useTranslation';

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  locale: Yup.string().required(),
  currency: Yup.string().required(),
  isCompany: Yup.string().required(),
  legalStructure: Yup.mixed().when('isCompany', {
    is: 'true',
    then: Yup.string().required(),
  }),
  company: Yup.mixed().when('isCompany', {
    is: 'true',
    then: Yup.string().required(),
  }),
  ein: Yup.mixed().when('isCompany', {
    is: 'true',
    then: Yup.string().required(),
  }),
  dos: Yup.mixed().when('isCompany', {
    is: 'true',
    then: Yup.string(),
  }),
  capital: Yup.mixed().when('isCompany', {
    is: 'true',
    then: Yup.number().moreThan(0).required(),
  }),
});

const currencies = [
  { id: 'none', label: '', value: '' },
  ...cc.data
    .reduce((acc, { code, currency }) => {
      const symbol = getSymbolFromCurrency(code);
      if (symbol) {
        acc.push({
          code,
          currency,
          symbol,
        });
      }
      return acc;
    }, [])
    .sort((c1, c2) => c1.currency.localeCompare(c2.currency))
    .map(({ code, currency, symbol }) => ({
      id: code,
      label: `${currency} (${symbol})`,
      value: code,
    })),
];

const languages = [
  { id: 'none', label: '', value: '' },
  { id: 'pt-BR', label: 'Brasileiro', value: 'pt-BR' },
  { id: 'en', label: 'English', value: 'en' },
  { id: 'fr-FR', label: 'Français (France)', value: 'fr-FR' },
  { id: 'de-DE', label: 'Deutsch (Deutschland)', value: 'de-DE' },
];

const LandlordForm = observer(({ onSubmit, onSubmitted }) => {
  const store = useContext(StoreContext);
  const { t } = useTranslation('common');

  const initialValues = useMemo(
    () => ({
      name: store.organization.selected?.name || '',
      locale: store.organization.selected?.locale || '',
      currency: store.organization.selected?.currency || '',
      isCompany: store.organization.selected?.isCompany ? 'true' : 'false',
      legalRepresentative:
        store.organization.selected?.companyInfo?.legalRepresentative || '',
      legalStructure:
        store.organization.selected?.companyInfo?.legalStructure || '',
      company: store.organization.selected?.companyInfo?.name || '',
      ein: store.organization.selected?.companyInfo?.ein || '',
      dos: store.organization.selected?.companyInfo?.dos || '',
      capital: store.organization.selected?.companyInfo?.capital || '',
    }),
    [store.organization.selected]
  );

  const _onSubmit = useCallback(
    async (settings) => {
      const updatedSettings = {
        name: settings.name,
        isCompany: settings.isCompany === 'true',
        currency: settings.currency,
        locale: settings.locale,
      };

      if (updatedSettings.isCompany) {
        updatedSettings.companyInfo = {
          ...(store.organization.selected?.companyInfo || {}),
          name: settings.company,
          ein: settings.ein,
          dos: settings.dos,
          legalRepresentative: settings.legalRepresentative,
          legalStructure: settings.legalStructure,
          capital: settings.capital,
        };
      }

      await onSubmit(updatedSettings);

      onSubmitted?.({
        isOrgNameChanged: updatedSettings.name !== initialValues.name,
        isLocaleChanged: updatedSettings.locale !== initialValues.locale,
      });
    },
    [
      onSubmit,
      onSubmitted,
      initialValues.locale,
      initialValues.name,
      store.organization.selected?.companyInfo,
    ]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={_onSubmit}
    >
      {({ values, isSubmitting }) => {
        return (
          <Form autoComplete="off">
            <Section label={t('Landlord information')}>
              <TextField label={t('Name')} name="name" />
              <SelectField
                label={t('Language')}
                name="locale"
                values={languages}
              />
              <SelectField
                label={t('Currency')}
                name="currency"
                values={currencies}
              />
              <RadioFieldGroup
                aria-label="organization type"
                label={t('The organization/landlord belongs to')}
                name="isCompany"
              >
                <RadioField
                  value="false"
                  label={t('A personal account')}
                  data-cy="companyFalse"
                />
                <RadioField
                  value="true"
                  label={t('A business or an institution')}
                  data-cy="companyTrue"
                />
              </RadioFieldGroup>
              {values.isCompany === 'true' && (
                <>
                  <TextField
                    label={t('Legal representative')}
                    name="legalRepresentative"
                  />
                  <TextField
                    label={t('Legal structure')}
                    name="legalStructure"
                  />
                  <TextField
                    label={t('Name of business or institution')}
                    name="company"
                  />
                  <TextField
                    label={t('Employer Identification Number')}
                    name="ein"
                  />
                  <TextField
                    label={t('Administrative jurisdiction')}
                    name="dos"
                  />
                  <NumberField label={t('Capital')} name="capital" />
                </>
              )}
            </Section>
            <SubmitButton
              size="large"
              label={!isSubmitting ? t('Save') : t('Saving')}
            />
          </Form>
        );
      }}
    </Formik>
  );
});

export default LandlordForm;
