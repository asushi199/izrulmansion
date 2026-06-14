export function verifyAdminApprovalPassword(submittedPassword: string, configuredPassword: string | undefined) {
  const expected = configuredPassword?.trim();
  return Boolean(expected && submittedPassword === expected);
}
