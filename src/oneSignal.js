import OneSignal from "react-native-onesignal";
export const updateDeviceUserIDTag = async (tags) => {
    try {
        await OneSignal.sendTags(tags);
    }
    catch (e) {

    }
};