import type { ConfigContext, ExpoConfig } from 'expo/config';
import appJson from './app.json';
import { APPLOVIN_SKADNETWORK_IDS } from './config/applovinSkAdNetworkIds';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  ...(appJson.expo as ExpoConfig),
  ios: {
    ...(appJson.expo.ios as NonNullable<ExpoConfig['ios']>),
    infoPlist: {
      ...appJson.expo.ios.infoPlist,
      SKAdNetworkItems: APPLOVIN_SKADNETWORK_IDS.map(SKAdNetworkIdentifier => ({
        SKAdNetworkIdentifier,
      })),
    },
  },
});
