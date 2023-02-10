import React from 'react';
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import _ from 'lodash';
import styles from './styles';
import Img from '../Img';
import ImageButton from '../ImageButton';
import SortDropDownMenu from '../SortDropDownMenu';

import listIcon from '../../../assets/images/shop/ic_view_type_list.png';
import gridIcon from '../../../assets/images/shop/ic_view_type_grid.png';
import sortDownArrow from '../../../assets/images/shop/ic_sort_down_arrow.png';
import filterIcon from '../../../assets/images/shop/ic_filter.png';

type Props = {
  onChangedViewType: Function,
  onPressFilter: Function,
};

export default function SortFilterView({
  onChangedViewType,
  onPressFilter,
  onSelectSortOption,
  initialValue,
  disabledSort
}: Props) {
  const [viewType, setViewType] = React.useState(VIEW_TYPE_LIST);
  // const [sortMenuVisible, setSortMenuVisible] = React.useState(false);
  const dropMenuRef = React.useRef(null);

  const onViewTypePress = () => {
    const newViewType = 1 - viewType;
    setViewType(newViewType);
    if (onChangedViewType) {
      onChangedViewType(newViewType);
    }
  };

  const onSortButtonPress = () => {
    // setSortMenuVisible(true);
    dropMenuRef.current.show();
  };

  return (
    <View style={styles.container}>
      <SortDropDownMenu
        ref={dropMenuRef}
        didSelectSortOption={onSelectSortOption}
        initialValue={_.get(initialValue, 'sortType')}
      />
      {!disabledSort && (
        <TouchableOpacity style={styles.btn} onPress={onSortButtonPress}>
          <Text style={styles.text}>{_.get(initialValue, 'value') || 'Sắp xếp'}</Text>
          <Img style={styles.sort_down_arrow} source={sortDownArrow} />
        </TouchableOpacity>
      )}
      <View style={styles.space} />
      <TouchableOpacity style={styles.btn} onPress={onPressFilter}>
        <Img style={styles.filter_icon} source={filterIcon} />
        <Text style={styles.text}>Bộ lọc</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <ImageButton
        style={styles.view_type}
        source={viewType === VIEW_TYPE_LIST ? gridIcon : listIcon}
        onPress={onViewTypePress}
      />
    </View>
  );
}

const VIEW_TYPE_LIST = 0;
const VIEW_TYPE_GRID = 1;
export {
  VIEW_TYPE_LIST,
  VIEW_TYPE_GRID
};
