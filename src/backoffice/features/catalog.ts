export const FeatureFlags = [
  {
    name: 'dev_phone_registration',
    description: 'The feature flag that enables user signup with phone number',
    enabled: false,
  },
];

export type TypeFeatureFlag = {
  name: string;
  description: string;
  enabled: boolean;
};
