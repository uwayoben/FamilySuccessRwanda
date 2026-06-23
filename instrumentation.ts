export async function register() {
  // Only run in Node.js runtime, not Edge
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runMigrations } = await import("./lib/migrate");
    await runMigrations().catch((err) => {
      console.error("[migrate] Failed to run migrations:", err.message);
    });
  }
}
