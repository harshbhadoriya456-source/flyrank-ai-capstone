export const allowedSettingsKeys = [
  "displayName",
  "email",
  "notifications",
  "timezone",
  "refreshRate",
] as const;

export type AllowedSettingsKey = (typeof allowedSettingsKeys)[number];

export type SettingsFormValues = {
  displayName: string;
  email: string;
  notifications: boolean;
  timezone: string;
  refreshRate: number;
};

export type SettingsValidationErrors = Partial<
  Record<keyof SettingsFormValues, string>
> & {
  unknownFields?: string[];
};

export const defaultSettings: SettingsFormValues = {
  displayName: "",
  email: "",
  notifications: true,
  timezone: "",
  refreshRate: 15,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSettings(
  values: Record<string, unknown>,
): SettingsValidationErrors {
  const errors: SettingsValidationErrors = {};
  const unknownFields = Object.keys(values).filter(
    (key) => !allowedSettingsKeys.includes(key as AllowedSettingsKey),
  );

  if (unknownFields.length > 0) {
    errors.unknownFields = unknownFields;
  }

  const displayName = typeof values.displayName === "string"
    ? values.displayName.trim()
    : "";
  if (!displayName || displayName.length < 2 || displayName.length > 50) {
    errors.displayName = "Display name must be 2 to 50 characters.";
  }

  const email = typeof values.email === "string" ? values.email.trim() : "";
  if (!email || !emailPattern.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const timezone = typeof values.timezone === "string" ? values.timezone.trim() : "";
  if (!timezone) {
    errors.timezone = "Please select a timezone.";
  }

  const refreshRateValue = Number(values.refreshRate);
  const refreshRateIsInteger = Number.isInteger(refreshRateValue);
  if (
    !refreshRateIsInteger ||
    refreshRateValue < 1 ||
    refreshRateValue > 1440
  ) {
    errors.refreshRate =
      "Refresh rate must be an integer between 1 and 1440 minutes.";
  }

  return errors;
}

export function normalizeSettingsInput(
  values: Record<string, unknown>,
): SettingsFormValues {
  return {
    displayName:
      typeof values.displayName === "string" ? values.displayName.trim() : "",
    email: typeof values.email === "string" ? values.email.trim() : "",
    notifications: Boolean(values.notifications),
    timezone: typeof values.timezone === "string" ? values.timezone.trim() : "",
    refreshRate: Number(values.refreshRate ?? defaultSettings.refreshRate),
  };
}
