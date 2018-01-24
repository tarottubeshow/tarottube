import {
  Audio,
} from 'expo'

async function enable() {
  const result = await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    playsInSilentLockedModeIOS: true,
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    shouldDuckAndroid: false,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  })
  return Audio.setIsEnabledAsync(true)
}

export {
  enable,
}
