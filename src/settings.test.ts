import { describe, expect, it } from "vitest";
import { validateSettings } from "./settings";

describe("validateSettings", () => {
  it("accepts valid settings values", () => {
    const result = validateSettings({
      displayName: "Jane Doe",
      email: "jane@example.com",
      notifications: true,
      timezone: "UTC",
      refreshRate: 15,
    });

    expect(result).toEqual({});
  });

  it("returns validation errors for invalid values", () => {
    const result = validateSettings({
      displayName: "J",
      email: "not-an-email",
      notifications: false,
      timezone: "",
      refreshRate: -1,
    });

    expect(result).toMatchObject({
      displayName: "Display name must be at least 2 characters.",
      email: "Please enter a valid email address.",
      timezone: "Please select a timezone.",
      refreshRate: "Refresh rate must be between 1 and 1440 minutes.",
    });
  });
});
