import * as React from 'react';
import { Searchbar } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

const SearchBarComponent = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <Searchbar
      placeholder="Buscar un producto..."
      placeholderTextColor={"#374151"}
      onChangeText={setSearchQuery}
      value={searchQuery}
      style={{backgroundColor: "#F3F4F6", width: "100%", height: moderateScale(52) }}
    />
  );
};

export default SearchBarComponent;