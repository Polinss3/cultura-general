import type { ConfigContext, ExpoConfig } from 'expo/config';
import appJson from './app.json';
import {
  APPODEAL_AD_ATTRIBUTION_KIT_IDS,
  APPODEAL_SKADNETWORK_IDS,
} from './config/appodealAttributionIds';

const APPSFLYER_TRACKING_DOMAINS = [
  'att-attr.appsflyersdk.com',
  'att-launches.appsflyersdk.com',
  'att-conversions.appsflyersdk.com',
  'att-dlsdk.appsflyersdk.com',
  'att-attr.whappsflyer.com',
  'att-launches.whappsflyer.com',
  'att-conversions.whappsflyer.com',
  'att-dlsdk.whappsflyer.com',
  'att-attr.appsflyer-cn.com',
  'att-launches.appsflyer-cn.com',
  'att-conversions.appsflyer-cn.com',
  'att-dlsdk.appsflyer-cn.com',
  'att-attr.hevents.appsflyer-cn.com',
  'att-launches.hevents.appsflyer-cn.com',
  'att-conversions.hevents.appsflyer-cn.com',
  'att-dlsdk.hevents.appsflyer-cn.com',
];

export default ({ config }: ConfigContext): ExpoConfig => {
  const base = appJson.expo as ExpoConfig;
  return {
    ...config,
    ...base,
    ios: {
      ...base.ios,
      infoPlist: {
        ...base.ios?.infoPlist,
        NSAppTransportSecurity: { NSAllowsArbitraryLoads: true },
        SKAdNetworkItems: APPODEAL_SKADNETWORK_IDS.map(SKAdNetworkIdentifier => ({
          SKAdNetworkIdentifier,
        })),
        AdAttributionKitItems: APPODEAL_AD_ATTRIBUTION_KIT_IDS.map(AdNetworkIdentifier => ({
          AdNetworkIdentifier,
        })),
      },
      privacyManifests: {
        NSPrivacyTracking: true,
        NSPrivacyTrackingDomains: APPSFLYER_TRACKING_DOMAINS,
        NSPrivacyCollectedDataTypes: [
          {
            NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeDeviceID',
            NSPrivacyCollectedDataTypeLinked: true,
            NSPrivacyCollectedDataTypeTracking: true,
            NSPrivacyCollectedDataTypePurposes: [
              'NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising',
              'NSPrivacyCollectedDataTypePurposeDeveloperAdvertising',
              'NSPrivacyCollectedDataTypePurposeAnalytics',
            ],
          },
          {
            NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeAdvertisingData',
            NSPrivacyCollectedDataTypeLinked: true,
            NSPrivacyCollectedDataTypeTracking: true,
            NSPrivacyCollectedDataTypePurposes: [
              'NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising',
              'NSPrivacyCollectedDataTypePurposeDeveloperAdvertising',
              'NSPrivacyCollectedDataTypePurposeAnalytics',
            ],
          },
          {
            NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeProductInteraction',
            NSPrivacyCollectedDataTypeLinked: true,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: [
              'NSPrivacyCollectedDataTypePurposeAppFunctionality',
              'NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising',
              'NSPrivacyCollectedDataTypePurposeDeveloperAdvertising',
              'NSPrivacyCollectedDataTypePurposeAnalytics',
            ],
          },
          {
            NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeCoarseLocation',
            NSPrivacyCollectedDataTypeLinked: true,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: [
              'NSPrivacyCollectedDataTypePurposeAppFunctionality',
              'NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising',
              'NSPrivacyCollectedDataTypePurposeDeveloperAdvertising',
              'NSPrivacyCollectedDataTypePurposeAnalytics',
            ],
          },
          {
            NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeCrashData',
            NSPrivacyCollectedDataTypeLinked: true,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeAnalytics'],
          },
          {
            NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePerformanceData',
            NSPrivacyCollectedDataTypeLinked: true,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: [
              'NSPrivacyCollectedDataTypePurposeAppFunctionality',
              'NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising',
              'NSPrivacyCollectedDataTypePurposeDeveloperAdvertising',
              'NSPrivacyCollectedDataTypePurposeAnalytics',
            ],
          },
          {
            NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeOtherDiagnosticData',
            NSPrivacyCollectedDataTypeLinked: true,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: [
              'NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising',
              'NSPrivacyCollectedDataTypePurposeDeveloperAdvertising',
              'NSPrivacyCollectedDataTypePurposeAnalytics',
            ],
          },
        ],
      },
    },
    plugins: [
      ...(base.plugins ?? []),
      [
        'expo-build-properties',
        {
          ios: {
            deploymentTarget: '15.1',
            useFrameworks: 'static',
          },
          android: { minSdkVersion: 24 },
        },
      ],
    ],
  };
};
