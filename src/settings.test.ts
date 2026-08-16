import { describe, expect, it } from "vitest";
import { validateSettings } from "./settings";

describe("validateSettings", () => {
  it("accepts valid settings values", () => {
    const result = validateSettings({
      displayName: "Jane Doe",
      email: "jane@example.com",
      notifications: true,
      theme: "dark",
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
      theme: "invalid-theme",
      timezone: "",
      refreshRate: -1,
    });

    expect(result).toMatchObject({
      displayName: "Display name must be 2 to 50 characters.",
      email: "Please enter a valid email address.",
      theme: "Please select a valid theme preference (light, dark, or system).",
      timezone: "Please select a timezone.",
      refreshRate: "Refresh rate must be an integer between 1 and 1440 minutes.",
    });
  });

  it("rejects excessive display names and unknown fields", () => {
    const result = validateSettings({
      displayName: "A".repeat(51),
      email: "user@example.com",
      notifications: true,
      theme: "light",
      timezone: "UTC",
      refreshRate: 15,
      extraField: "not allowed",
    });

    expect(result.displayName).toBe("Display name must be 2 to 50 characters.");
    expect(result.unknownFields).toEqual(["extraField"]);
  });
});
