import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Separator from '../../components/Separator';
import TextButton from '../../components/TextButton';
import FilterGroup from './FilterGroup';
import FilterRateGroup from './FilterRateGroup';
import PriceRangeGroup from './PriceRangeGroup';
import {
  fetchFilterOptions as fetchFilterOptionsAction,
} from '../../redux/search/actions';
import FilterTagGroup from './FilterTagGroup';
import FilterVariantGroup from './FilterVariantGroup';
import MainContainer from '../../components/MainContainer';

class FilterMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    const { initialOptions } = props;
    this.state = {
      isModalVisible: false,
      searchFilterOptions: initialOptions ? { ...initialOptions } : {},
    };
    this.cachedSearchFilterOptions = initialOptions ? { ...initialOptions } : {};
  }

  componentDidMount() {
    const { fetchFilterOptions, filterOptions } = this.props;
    if (_.isEmpty(filterOptions)) {
      fetchFilterOptions();
    }
  }

  show = () => {
    this.setState({
      isModalVisible: true,
      searchFilterOptions: { ...this.cachedSearchFilterOptions },
    });
  }

  handleBackPress = () => {
    const { isModalVisible } = this.state;
    if (isModalVisible) {
      this.onCloseModal();
      return true;
    }
    return false;
  }

  onCloseModal = () => {
    // reset filter
    this.setState({
      isModalVisible: false,
      searchFilterOptions: { ...this.cachedSearchFilterOptions }
    });
  }

  didSelectFilterOption = (key, value) => {
    const { searchFilterOptions } = this.state;
    const options = _.get(searchFilterOptions, key, []);
    const removed = _.remove(options, (v) => v === value);
    if (_.isEmpty(removed)) {
      options.push(value);
    }
    searchFilterOptions[key] = options;
    this.setState({ searchFilterOptions });
  }

  didChangePriceRange = (key, value) => {
    const { searchFilterOptions } = this.state;
    if (value <= 0) {
      _.unset(searchFilterOptions, key);
    } else {
      searchFilterOptions[key] = value;
    }
    this.setState({ searchFilterOptions });
  }

  didChangeRate = (key, value) => {
    const { searchFilterOptions } = this.state;
    if (value === 0) {
      _.unset(searchFilterOptions, key);
    } else {
      searchFilterOptions[key] = value;
    }
    this.setState({ searchFilterOptions });
  }

  onReset = () => {
    this.cachedSearchFilterOptions = {};
    this.setState({ searchFilterOptions: {} });
  }

  onConfirm = () => {
    // callback
    const { searchFilterOptions } = this.state;
    const { onSelectFilterOptions } = this.props;
    this.cachedSearchFilterOptions = { ...searchFilterOptions };
    if (onSelectFilterOptions) {
      onSelectFilterOptions({ ...searchFilterOptions });
    }
    this.onCloseModal();
  }

  render() {
    const { isModalVisible, searchFilterOptions } = this.state;
    const { filterOptions } = this.props;
    const categoryOption = filterOptions.find((opt) => opt.filterName === 'category');
    const brandOption = filterOptions.find((opt) => opt.filterName === 'brand');
    const usesOption = filterOptions.find((opt) => opt.filterName === 'uses');
    const originOption = filterOptions.find((opt) => opt.filterName === 'origin');
    const variantOptions = filterOptions.find((opt) => opt.filterName === 'variant');
    const variantObjectList = _.get(variantOptions, 'objectList', []);
    return (
      <Modal
        onBackButtonPress={this.handleBackPress}
        onBackdropPress={this.onCloseModal}
        style={styles.modal_style}
        isVisible={isModalVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
      >
        <MainContainer style={styles.container} hasNavigationBackground={false}>
          <ScrollView style={styles.list_view}>
            {
              categoryOption ? (
                <View style={styles.filter_group}>
                  <FilterGroup
                    option={categoryOption}
                    selectedOptions={searchFilterOptions}
                    onSelectFilterOption={this.didSelectFilterOption}
                    expandable
                    collapsed
                  />
                  <Separator height={1} marginLeft={25} />
                </View>
              ) : null
            }
            {
              brandOption ? (
                <View style={styles.filter_group}>
                  <FilterGroup
                    option={brandOption}
                    selectedOptions={searchFilterOptions}
                    onSelectFilterOption={this.didSelectFilterOption}
                    expandable
                    collapsed
                  />
                  <Separator height={1} marginLeft={25} />
                </View>
              ) : null
            }
            {
              usesOption ? (
                <View style={styles.filter_group}>
                  <FilterTagGroup
                    option={usesOption}
                    selectedOptions={searchFilterOptions}
                    onSelectFilterOption={this.didSelectFilterOption}
                    expandable
                    collapsed
                  />
                  <Separator height={1} marginLeft={25} />
                </View>
              ) : null
            }
            {
              originOption ? (
                <View style={styles.filter_group}>
                  <FilterTagGroup
                    option={originOption}
                    selectedOptions={searchFilterOptions}
                    onSelectFilterOption={this.didSelectFilterOption}
                    expandable
                    collapsed
                  />
                  <Separator height={1} marginLeft={25} />
                </View>
              ) : null
            }
            <PriceRangeGroup
              title="Giá"
              selectedOptions={searchFilterOptions}
              onSelectFilterOption={this.didChangePriceRange}
            />
            <Separator height={1} marginLeft={25} />
            <FilterRateGroup
              title="Xếp hạng"
              selectedOptions={searchFilterOptions}
              onSelectFilterOption={this.didChangeRate}
            />
            <Separator height={1} marginLeft={25} />
            {
              variantObjectList.map((item, index) => (
                <View style={styles.filter_group} key={item.id || index}>
                  <FilterVariantGroup
                    option={item}
                    selectedOptions={searchFilterOptions}
                    onSelectFilterOption={this.didSelectFilterOption}
                    expandable
                    collapsed
                  />
                  <Separator height={1} marginLeft={25} />
                </View>
              ))
            }
          </ScrollView>
          <Separator height={1} />
          <View style={styles.action_container}>
            <TextButton
              style={styles.reset_button}
              titleStyle={styles.action_title}
              title="Cài đặt lại"
              onPress={this.onReset}
            />
            <TextButton
              style={styles.done_button}
              titleStyle={styles.action_title}
              title="Hoàn thành"
              onPress={this.onConfirm}
            />
          </View>
        </MainContainer>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal_style: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '80%',
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  list_view: {
    flex: 1,
  },
  action_container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  reset_button: {
    marginRight: 5,
    backgroundColor: '#00A69C',
    height: 30,
    width: 90,
  },
  done_button: {
    marginLeft: 5,
    backgroundColor: Colors.tintColor,
    height: 30,
    width: 90,
  },
  action_title: {
    ...Layout.font.normal,
    color: 'white',
  },
  filter_group: {
    flexDirection: 'column'
  }
});

export default connect(
  (state) => ({
    filterOptions: state.shopSearch.filterOptions,
  }),
  {
    fetchFilterOptions: fetchFilterOptionsAction
  },
  null,
  { withRef: true }
)(React.memo(FilterMenu));
