// In-memory store for reset tokens (in production, use a database)
const resetTokens = new Map<string, { email: string; expires: Date }>();

export { resetTokens };
