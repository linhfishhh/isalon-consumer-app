import {
  Alert,
} from 'react-native';
import _ from 'lodash';

export function confirm(message, onConfirm) {
  Alert.alert(
    'iSalon',
    message,
    [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đồng ý',
        onPress: () => {
          if (onConfirm) {
            onConfirm();
          }
        }
      },
    ],
    { cancelable: false },
  );
}

export function error(message) {
  Alert.alert(
    'iSalon',
    message,
    [
      {
        text: 'Đóng',
        style: 'cancel',
      }
    ],
    { cancelable: false },
  );
}

export function info(message) {
  Alert.alert(
    'iSalon',
    message,
    [
      {
        text: 'Đóng',
        style: 'cancel',
      }
    ],
    { cancelable: false },
  );
}

export function handleServerError(e) {
  const statusCode = _.get(e, 'response.status');
  let msg = _.get(e, 'response.data.message');
  if (statusCode === 502) {
    msg = 'Đã có lỗi xảy ra khi kết nối với máy chủ. Vui lòng thử lại sau.';
  }
  if (!_.isEmpty(msg)) {
    error(msg);
  }
}

export function getServerErrorMessage(e) {
  const statusCode = _.get(e, 'response.status');
  const msg = _.get(e, 'response.data.message');
  if (statusCode === 502 || _.isEmpty(msg)) {
    return 'Đã có lỗi xảy ra khi kết nối với máy chủ. Vui lòng thử lại sau.';
  }
  return msg;
}
