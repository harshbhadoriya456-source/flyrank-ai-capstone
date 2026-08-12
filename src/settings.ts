export type SettingsFormValues = {
  displayName: string;
  email: string;
  notifications: boolean;
  timezone: string;
  refreshRate: number;
};

export type SettingsValidationErrors = Partial<
  Record<keyof SettingsFormValues, string>
>;

export const defaultSettings: SettingsFormValues = {
  displayName: "",
  email: "",
  notifications: true,
  timezone: "",
  refreshRate: 15,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSettings(
  values: Partial<SettingsFormValues>,
): SettingsValidationErrors {
  const errors: SettingsValidationErrors = {};

  const displayName = values.displayName?.trim() ?? "";
  if (!displayName || displayName.length < 2) {
    errors.displayName = "Display name must be at least 2 characters.";
  }

  const email = values.email?.trim() ?? "";
  if (!email || !emailPattern.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const timezone = values.timezone?.trim() ?? "";
  if (!timezone) {
    errors.timezone = "Please select a timezone.";
  }

  const refreshRate = Number(values.refreshRate);
  if (
    !Number.isFinite(refreshRate) ||
    refreshRate < 1 ||
    refreshRate > 1440
  ) {
    errors.refreshRate = "Refresh rate must be between 1 and 1440 minutes.";
  }

  return errors;
}
