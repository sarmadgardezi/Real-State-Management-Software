import { Box, InputAdornment, TextField, withStyles } from '@material-ui/core';
import { useCallback, useMemo, useState } from 'react';

import FilterListIcon from '@material-ui/icons/FilterList';
import Hidden from './HiddenSSRCompatible';
import SearchIcon from '@material-ui/icons/Search';
import ToggleMenu from './ToggleMenu';
import useTimeout from '../hooks/useTimeout';
import useTranslation from 'next-translate/useTranslation';

const StyledTextField = withStyles({
  root: {
    width: '100%',
    '& .MuiInput-root': {
      color: 'inherit',
      '& .MuiInputAdornment-root': {
        color: 'inherit',
      },
    },
  },
})(TextField);

const SearchFilterBar = ({
  filters,
  onSearch,
  defaultValue = { status: '', searchText: '' },
}) => {
  const { t } = useTranslation('common');
  const [filter, setFilter] = useState(defaultValue.status);
  const [searchText, setSearchText] = useState(defaultValue.searchText);
  const triggerSearch = useTimeout(() => {
    onSearch(filter, searchText);
  }, 250);

  // TODO: use useEffect to trigger the search
  // commented as now this cause infinite rendering loop
  // useEffect(() => {
  //   triggerSearch.start();
  // }, [filter, searchText, triggerSearch]);

  const onTextChange = useCallback(
    (event) => {
      setSearchText(event.target.value || '');
      // this hack works without useEffect because the action
      // is triggered 250ms later after the state update
      triggerSearch.start();
    },
    [setSearchText, triggerSearch]
  );

  const onToggleChange = useCallback(
    (option) => {
      setFilter(option.id);
      // this hack works without useEffect because the action
      // is triggered 250ms later after the state update
      triggerSearch.start();
    },
    [setFilter, triggerSearch]
  );

  const selectedItem = useMemo(
    () => filters.find((f) => f.id === defaultValue.status) || filters[0],
    [defaultValue, filters]
  );

  return (
    <Box display="flex" flexWrap="nowrap" alignItems="center">
      <Box flexGrow={1}>
        <StyledTextField
          placeholder={t('Search')}
          defaultValue={defaultValue.searchText}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={onTextChange}
        />
      </Box>
      <Box>
        <Hidden smDown>
          <ToggleMenu
            startIcon={<FilterListIcon />}
            options={filters}
            value={selectedItem}
            noLabel={false}
            onChange={onToggleChange}
          />
        </Hidden>
        <Hidden mdUp>
          <ToggleMenu
            startIcon={<FilterListIcon />}
            options={filters}
            value={selectedItem}
            noLabel={true}
            onChange={onToggleChange}
          />
        </Hidden>
      </Box>
    </Box>
  );
};

export default SearchFilterBar;
