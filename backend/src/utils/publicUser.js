export function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    role: user.role,
    languagePreference: user.languagePreference,
    verifiedStatus: user.verifiedStatus,
    createdAt: user.createdAt
  };
}
