import Fastify from "fastify";
import { defaultSettings, validateSettings } from "./settings";

const server = Fastify({ logger: true });

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
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Settings</title>
        <style>
          :root {
            color-scheme: light;
            --bg: #f5f7fb;
            --panel: #ffffff;
            --border: #dfe5f1;
            --text: #101828;
            --muted: #667085;
            --primary: #1d4ed8;
            --error: #c62828;
            --success: #1b7f5a;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: var(--bg);
            color: var(--text);
          }
          .container {
            max-width: 620px;
            margin: 64px auto;
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 32px;
            box-shadow: 0 14px 30px rgba(16, 24, 40, 0.08);
          }
          h1 { margin-top: 0; font-size: 2rem; }
          .field { margin-bottom: 20px; }
          label {
            display: block;
            margin-bottom: 8px;
            font-weight: 700;
          }
          input, select {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid var(--border);
            border-radius: 10px;
            font-size: 1rem;
          }
          input:focus, select:focus {
            outline: 2px solid rgba(29, 78, 216, 0.2);
            border-color: var(--primary);
          }
          .checkbox-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 0;
          }
          .checkbox-row input {
            width: auto;
          }
          .error {
            color: var(--error);
            font-size: 0.85rem;
            margin-top: 6px;
            min-height: 1em;
          }
          .success {
            margin-top: 18px;
            padding: 12px 14px;
            border-radius: 10px;
            background: rgba(27, 127, 90, 0.08);
            color: var(--success);
            display: none;
          }
          button {
            background: var(--primary);
            color: white;
            border: none;
            padding: 12px 18px;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <main class="container">
          <h1>Account Settings</h1>
          <form id="settings-form" novalidate>
            <div class="field">
              <label for="displayName">Display name</label>
              <input id="displayName" name="displayName" type="text" placeholder="Jane Doe" />
              <div class="error" data-error-for="displayName"></div>
            </div>

            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" placeholder="jane@example.com" />
              <div class="error" data-error-for="email"></div>
            </div>

            <div class="field">
              <label for="timezone">Timezone</label>
              <select id="timezone" name="timezone">
                <option value="">Select a timezone</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
              </select>
              <div class="error" data-error-for="timezone"></div>
            </div>

            <div class="field">
              <label for="refreshRate">Refresh rate (minutes)</label>
              <input id="refreshRate" name="refreshRate" type="number" min="1" max="1440" value="15" />
              <div class="error" data-error-for="refreshRate"></div>
            </div>

            <div class="field checkbox-row">
              <input id="notifications" name="notifications" type="checkbox" checked />
              <label for="notifications">Enable email notifications</label>
            </div>

            <button type="submit">Save settings</button>
            <div id="success" class="success">Settings saved successfully.</div>
          </form>
        </main>

        <script>
          const form = document.getElementById('settings-form');
          const successBox = document.getElementById('success');

          const validators = {
            displayName(value) {
              if (!value || value.trim().length < 2) return 'Display name must be at least 2 characters.';
              return '';
            },
            email(value) {
              const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!value || !emailPattern.test(value.trim())) return 'Please enter a valid email address.';
              return '';
            },
            timezone(value) {
              if (!value) return 'Please select a timezone.';
              return '';
            },
            refreshRate(value) {
              const num = Number(value);
              if (!Number.isFinite(num) || num < 1 || num > 1440) return 'Refresh rate must be between 1 and 1440 minutes.';
              return '';
            }
          };

          function setError(fieldName, message) {
            const node = form.querySelector('[data-error-for="' + fieldName + '"]');
            if (node) node.textContent = message || '';
          }

          function validateForm() {
            const values = {
              displayName: form.displayName.value,
              email: form.email.value,
              timezone: form.timezone.value,
              refreshRate: form.refreshRate.value,
            };

            let isValid = true;
            Object.entries(validators).forEach(([field, validate]) => {
              const message = validate(values[field]);
              setError(field, message);
              if (message) isValid = false;
            });

            return isValid;
          }

          form.addEventListener('submit', (event) => {
            event.preventDefault();
            successBox.style.display = 'none';

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

            fetch('/settings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            })
              .then(async (response) => {
                const data = await response.json();
                if (!response.ok) {
                  Object.entries(data.errors || {}).forEach(([field, message]) => {
                    setError(field, message);
                  });
                  return;
                }

                successBox.style.display = 'block';
                form.reset();
                form.notifications.checked = true;
                form.refreshRate.value = '15';
              })
              .catch(() => {
                successBox.textContent = 'Unable to save settings right now.';
                successBox.style.display = 'block';
              });
          });
        </script>
      </body>
    </html>
  `;
});

server.post("/settings", async (request, reply) => {
  const payload = request.body as Record<string, unknown>;
  const settings = {
    displayName: typeof payload.displayName === "string" ? payload.displayName : "",
    email: typeof payload.email === "string" ? payload.email : "",
    notifications: Boolean(payload.notifications),
    timezone: typeof payload.timezone === "string" ? payload.timezone : "",
    refreshRate: Number(payload.refreshRate ?? defaultSettings.refreshRate),
  };

  const errors = validateSettings(settings);

  if (Object.keys(errors).length > 0) {
    reply.code(400);
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    settings,
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
