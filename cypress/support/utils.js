export function uniqueEmail(prefix = "qa") {
  const ts = Date.now();
  return `${prefix}.${ts}@example.com`;
}
