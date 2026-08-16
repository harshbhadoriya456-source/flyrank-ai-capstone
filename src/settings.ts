export const allowedSettingsKeys = [
  "displayName",
  "email",
  "notifications",
  "theme",
  "timezone",
  "refreshRate",
] as const;

export type AllowedSettingsKey = (typeof allowedSettingsKeys)[number];

export type ThemeOption = "light" | "dark" | "system";

export type SettingsFormValues = {
  displayName: string;
  email: string;
  notifications: boolean;
  theme: ThemeOption;
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
  theme: "system",
  timezone: "",
  refreshRate: 15,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validThemes: ThemeOption[] = ["light", "dark", "system"];

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

  const theme = typeof values.theme === "string" ? values.theme.trim() : "";
  if (!theme || !validThemes.includes(theme as ThemeOption)) {
    errors.theme = "Please select a valid theme preference (light, dark, or system).";
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
  const themeInput = typeof values.theme === "string" ? values.theme.trim() : "";
  const validTheme = validThemes.includes(themeInput as ThemeOption)
    ? (themeInput as ThemeOption)
    : defaultSettings.theme;

  return {
    displayName:
      typeof values.displayName === "string" ? values.displayName.trim() : "",
    email: typeof values.email === "string" ? values.email.trim() : "",
    notifications: Boolean(values.notifications),
    theme: validTheme,
    timezone: typeof values.timezone === "string" ? values.timezone.trim() : "",
    refreshRate: Number(values.refreshRate ?? defaultSettings.refreshRate),
  };
}
