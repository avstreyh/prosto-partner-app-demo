export type AuthStackParamList = {
  Splash: undefined;
  Permissions: undefined;
  AuthPhone: undefined;
  AuthCode: { phone: string };
};

export type MainStackParamList = {
  Journal: undefined;
  AppointmentCard: { bookingId: string };
  Profile: undefined;
  Settlements: undefined;
  Scanner: undefined;
};
