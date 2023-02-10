import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { DotIndicator } from 'react-native-indicators';
import styles from './styles';
import MainContainer from '../../components/MainContainer';
import NavigationBar from '../../components/NavigationBar';
import {
  getProvinceList as getProvinceListAction,
  getDistrictList as getDistrictListAction,
  getCommuneList as getCommuneListAction,
} from '../../redux/address/actions';
import { Colors, CommonStyles } from '../../constants';

type Props = {};

const PICK_STEPS = [
  'Tỉnh/Thành phố',
  'Quận/Huyện',
  'Phường/Xã',
];

function Item({ item, onPress }) {
  const onSelect = () => {
    onPress(item);
  };

  return (
    <TouchableOpacity style={styles.item} onPress={onSelect}>
      <Text style={styles.item_text}>{item.name}</Text>
    </TouchableOpacity>
  );
}

function PickAddressScreen({
  navigation,
  getProvinceList,
  getDistrictList,
  getCommuneList,
  preloadLocations,
  fetching,
}: Props) {
  const initialAddress = navigation.getParam('initialAddress'); // array with length = 3
  let step = navigation.getParam('step') || 1;
  const callback = navigation.getParam('callback');

  // check provinceId
  const provinceId = _.get(initialAddress[0], 'value.provinceId');
  const districtId = _.get(initialAddress[1], 'value.districtId');
  if (provinceId === undefined || provinceId == null || provinceId === -1) {
    step = 1;
  } else if (step === 3) {
    // check both provinceId and districtId
    if (districtId === undefined || districtId == null || districtId === -1) {
      step = 2;
    }
  }

  const [currentStep, setCurrentStep] = React.useState(step - 1);
  const [locations, setLocations] = React.useState(initialAddress);

  React.useEffect(() => {
    if (step === 1) {
      getProvinceList();
    } else if (step === 2) {
      getDistrictList(provinceId);
    } else {
      getCommuneList(districtId);
    }
  }, []);

  const onBack = React.useCallback(() => {
    navigation.goBack();
  }, []);

  const onDone = () => {
    if (callback) {
      callback(locations);
    }
    onBack();
  };

  const onSelectItem = (item) => {
    const selectedLocations = [...locations];
    selectedLocations[currentStep].value = item;
    setLocations(selectedLocations);
    if (currentStep === PICK_STEPS.length - 1) {
      // done
      onDone();
    } else {
      if (currentStep === 0) {
        getDistrictList(item.provinceId);
      } else if (currentStep === 1) {
        getCommuneList(item.districtId);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const keyExtractor = (item, index) => item + index;

  const renderItem = ({ item }) => (
    <Item item={item} onPress={onSelectItem} />
  );

  const separator = () => (
    <View style={styles.separator} />
  );

  return (
    <MainContainer hasNavigationBackground={false} style={CommonStyles.main_container_white}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <NavigationBar
        title={PICK_STEPS[currentStep]}
        onClose={onBack}
      />
      {
        fetching
          ? <DotIndicator color={Colors.tintColor} size={10} count={3} />
          : (
            <FlatList
              style={styles.list}
              data={preloadLocations}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ItemSeparatorComponent={separator}
            />
          )
      }
    </MainContainer>
  );
}

export default connect(
  (state) => ({
    preloadLocations: state.shopAddress.locations,
    fetching: state.shopAddress.fetching,
  }),
  {
    getProvinceList: getProvinceListAction,
    getDistrictList: getDistrictListAction,
    getCommuneList: getCommuneListAction,
  }
)(PickAddressScreen);
