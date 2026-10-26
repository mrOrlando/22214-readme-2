// Limits of the user service. The service checks them itself; the gateway
// only shows them in the documentation
export const UserNameLength = { Min: 3, Max: 50 } as const;
export const UserPasswordLength = { Min: 6, Max: 12 } as const;
