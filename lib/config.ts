// utility for environment variable access and validation

export function getEnv(name: string): string {
  const val = process.env[name];
  if (val === undefined || val === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

export function getEnvOptional(name: string): string | undefined {
  return process.env[name];
}

export function getEnvNumber(name: string, defaultValue?: number): number {
  const val = process.env[name];
  if (val === undefined || val === "") {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing required environment variable: ${name}`);
  }
  const num = Number(val);
  if (Number.isNaN(num)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }
  return num;
}
