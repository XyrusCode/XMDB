import React from 'react';
import PropTypes from 'prop-types';
// Image
import searchIcon from '../../images/search-icon.svg';
// Styles
import { Wrapper, Content } from './SearchBar.styles';

// Debouncing moved to useDebounce in Home, so this reports every keystroke and
// keeps no state of its own.
const SearchBar = ({ value, onChange }) => (
  <Wrapper>
    <Content>
      <img src={searchIcon} alt='search-icon' />
      <input
        type='text'
        placeholder='Search Movie'
        onChange={event => onChange(event.currentTarget.value)}
        value={value}
      />
    </Content>
  </Wrapper>
);

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default SearchBar;
