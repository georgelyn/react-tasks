// export const firebaseErrorMap: any = {
//   'auth/email-already-in-use': 'The email account is already in use.',
//   'auth/invalid-email': 'The email account is not valid.',
//   'auth/user-not-found': 'The email or password is not correct.',
//   'auth/weak-password': 'The password should be at least 6 characters long.',
//   'auth/wrong-password': 'The email or password is not correct.',
// };

export const firebaseErrorMap = new Map<any, any>([
  ['auth/email-already-in-use', 'The email account is already in use.'],
  ['auth/invalid-email', 'The email account is not valid.'],
  [
    'auth/too-many-requests',
    'Access to this account has been temporarily disabled. Contact the administrator.',
  ],
  ['auth/user-not-found', 'The email or password is not correct.'],
  ['auth/weak-password', 'The password should be at least 6 characters long.'],
  ['auth/wrong-password', 'The email or password is not correct.'],
]);

export const firebaseError = (error: string) => {
  const startIndex = error.indexOf('(');
  const endIndex = error.indexOf(')');
  return error.substring(startIndex + 1, endIndex);
};
