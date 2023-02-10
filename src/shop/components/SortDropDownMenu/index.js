import React from 'react';
import {
  StyleSheet,
  FlatList,
} from 'react-native';
import DropDownMenu from '../DropDownMenu';
import Layout from '../../constants/Layout';
import OptionRow from './OptionRow';
import { SortType } from '../../constants';

export default class SortDropDownMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    const { initialValue } = props;
    this.filters = [
      {
        value: 'Mặc định',
      },
      {
        sortType: SortType.NEW_PRODUCT,
        value: 'Hàng mới',
      },
      {
        sortType: SortType.HOT_ORDER,
        value: 'Bán chạy',
      },
      {
        sortType: SortType.HOT_SALE,
        value: 'Giảm giá nhiều',
      },
      {
        sortType: SortType.PRICE,
        sortDirection: 'ASC',
        value: 'Giá thấp',
      },
      {
        sortType: SortType.PRICE,
        sortDirection: 'DESC',
        value: 'Giá cao',
      },
      {
        sortType: SortType.HOT_REVIEW,
        value: 'Sự nổi tiếng'
      }
    ];
    this.state = {
      selectedIndex: this.filters.findIndex((o) => o.sortType === initialValue)
    };
  }

  setMenuRef = (ref) => {
    this.menuRef = ref;
  }

  show = () => {
    this.menuRef.show();
  }

  keyExtractor = (item, index) => item + index

  selectOption = (index) => {
    this.setState({
      selectedIndex: index
    });
    const { didSelectSortOption } = this.props;
    didSelectSortOption(this.filters[index]);
    this.menuRef.hide();
  }

  renderItem = ({ item, index }) => {
    const { selectedIndex } = this.state;
    return (
      <OptionRow
        index={index}
        selected={selectedIndex === index}
        option={item.value}
        selectOption={this.selectOption}
      />
    );
  }

  render() {
    const { selectedIndex } = this.state;
    return (
      <DropDownMenu ref={this.setMenuRef}>
        <FlatList
          style={styles.content}
          extraData={selectedIndex}
          data={this.filters}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
        />
      </DropDownMenu>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    width: Layout.window.width,
    height: 300,
    backgroundColor: 'white'
  },
});
