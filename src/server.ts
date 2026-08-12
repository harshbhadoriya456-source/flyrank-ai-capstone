import Fastify from "fastify";
import {
  defaultSettings,
  normalizeSettingsInput,
  validateSettings,
  type SettingsFormValues,
} from "./settings";

const server = Fastify({ logger: true });

const settingsFormHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Settings</title>
    <style>
      :root {
        --bg: #f5f7fb;
        --panel: #ffffff;
        --border: #dfe5f1;
        --text: #101828;
        --muted: #667085;
        --primary: #1d4ed8;
        --error: #b42318;
        --success: #067647;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: var(--bg);
        color: var(--text);
      }

      .container {
        max-width: 640px;
        margin: 64px auto;
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(16, 24, 40, 0.06);
        padding: 32px;
      }

      h1 {
        margin: 0 0 24px;
        font-size: 2rem;
      }

      .field {
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 700;
      }

      input, select, button {
        font: inherit;
      }

      input, select {
        width: 100%;
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 12px 14px;
        background: #fff;
        color: var(--text);
      }

      input:focus, select:focus, button:focus {
        outline: 3px solid rgba(29, 78, 216, 0.18);
        outline-offset: 2px;
      }

      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 8px;
      }

      .checkbox-row input {
        width: auto;
        margin: 0;
      }

      .checkbox-row label {
        margin: 0;
        font-weight: 500;
      }

      .error {
        min-height: 1.25rem;
        margin-top: 6px;
        color: var(--error);
        font-size: 0.875rem;
      }

      button {
        border: none;
        border-radius: 10px;
        background: var(--primary);
        color: white;
        padding: 12px 20px;
        cursor: pointer;
        font-weight: 700;
      }

      .success {
        display: none;
        margin-top: 18px;
        border-radius: 10px;
        background: rgba(6, 118, 71, 0.1);
        color: var(--success);
        padding: 12px 14px;
      }

      @media (max-width: 640px) {
        .container {
          margin: 24px 16px;
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <main class="container">
      <h1>Settings</h1>
      <form id="settings-form" novalidate>
        <div class="field">
          <label for="displayName">Display name</label>
          <input id="displayName" name="displayName" type="text" maxlength="50" aria-describedby="displayName-error" />
          <div id="displayName-error" class="error" aria-live="polite"></div>
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" aria-describedby="email-error" />
          <div id="email-error" class="error" aria-live="polite"></div>
        </div>

        <div class="field">
          <label for="timezone">Timezone</label>
          <select id="timezone" name="timezone" aria-describedby="timezone-error">
            <option value="">Select a timezone</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
          </select>
          <div id="timezone-error" class="error" aria-live="polite"></div>
        </div>

        <div class="field">
          <label for="refreshRate">Refresh rate (minutes)</label>
          <input id="refreshRate" name="refreshRate" type="number" min="1" max="1440" step="1" value="15" aria-describedby="refreshRate-error" />
          <div id="refreshRate-error" class="error" aria-live="polite"></div>
        </div>

        <div class="field checkbox-row">
          <input id="notifications" name="notifications" type="checkbox" checked />
          <label for="notifications">Enable notifications</label>
        </div>

        <button type="submit">Save settings</button>
        <div id="success-message" class="success" role="status" aria-live="polite">Settings saved successfully.</div>
      </form>
    </main>

    <script>
      const form = document.getElementById('settings-form');
      const successMessage = document.getElementById('success-message');

      function setFieldError(fieldName, message) {
        const errorNode = document.getElementById(fieldName + '-error');
        if (errorNode) {
          errorNode.textContent = message || '';
        }

        const field = document.getElementById(fieldName);
        if (field) {
          if (message) {
            field.setAttribute('aria-invalid', 'true');
          } else {
            field.removeAttribute('aria-invalid');
          }
        }
      }

      function validateForm() {
        const values = {
          displayName: form.displayName.value,
          email: form.email.value,
          timezone: form.timezone.value,
          refreshRate: form.refreshRate.value,
        };

        const errors = {
          displayName: !values.displayName || values.displayName.trim().length < 2 || values.displayName.trim().length > 50
            ? 'Display name must be 2 to 50 characters.'
            : '',
          email: !values.email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.email.trim())
            ? 'Please enter a valid email address.'
            : '',
          timezone: !values.timezone ? 'Please select a timezone.' : '',
          refreshRate: !Number.isInteger(Number(values.refreshRate)) || Number(values.refreshRate) < 1 || Number(values.refreshRate) > 1440
            ? 'Refresh rate must be an integer between 1 and 1440 minutes.'
            : ''
        };

        Object.entries(errors).forEach(([fieldName, message]) => {
          setFieldError(fieldName, message);
        });

        return Object.values(errors).every((message) => !message);
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        successMessage.style.display = 'none';

        if (!validateForm()) {
          return;
        }

        const payload = {
          displayName: form.displayName.value.trim(),
          email: form.email.value.trim(),
          notifications: form.notifications.checked,
          timezone: form.timezone.value,
          refreshRate: Number(form.refreshRate.value)
        };

        const response = await fetch('/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.errors) {
            Object.entries(data.errors).forEach(([fieldName, message]) => {
              if (fieldName !== 'unknownFields') {
                setFieldError(fieldName, String(message));
              }
            });
          }
          return;
        }

        successMessage.style.display = 'block';
        form.reset();
        form.notifications.checked = true;
        form.refreshRate.value = '15';
      });
    </script>
  </body>
</html>
`;

server.get("/health", async () => {
  return { status: "ok" };
});

server.get("/settings", async () => {
  return {
    settings: defaultSettings,
    validation: validateSettings(defaultSettings),
  };
});

server.get("/settings-form", async () => {
  return settingsFormHtml;
});

server.post("/settings", async (request, reply) => {
  const payload = request.body as Record<string, unknown>;
  const normalized = normalizeSettingsInput(payload);
  const errors = validateSettings(payload);

  if (Object.keys(errors).length > 0) {
    reply.code(400);
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    settings: normalized,
  };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await server.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
