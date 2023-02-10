import AsyncStorage from '@react-native-community/async-storage';

export async function getToken() {
  return AsyncStorage.getItem('@iSalon:shop:token');
}

export async function saveToken(token) {
  await AsyncStorage.setItem('@iSalon:shop:token', token);
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem('@iSalon:shop:token', () => {});
    return true;
  } catch (exception) {
    return false;
  }
}

export async function isAuthenticated() {
  const token = await getToken();
  return token !== undefined && token != null;
}
