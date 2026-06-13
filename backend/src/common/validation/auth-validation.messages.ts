export const AuthValidationMsg = {
  email: {
    invalid: 'Enter a valid email address.',
    required: 'Email is required.',
  },
  password: {
    required: 'Password is required.',
    string: 'Password must be a string.',
    min: 'Password must be at least 6 characters.',
    max: 'Password must be at most 72 characters.',
  },
  name: {
    required: 'Name is required.',
    string: 'Name must be a string.',
    min: 'Name must be at least 3 characters.',
    max: 'Name must be at most 18 characters.',
  },
  token: {
    required: 'Confirmation token is required.',
    string: 'Token must be a string.',
  },
  newPassword: {
    required: 'New password is required.',
    string: 'New password must be a string.',
    min: 'New password must be at least 6 characters.',
    max: 'New password must be at most 72 characters.',
  },
  currentPassword: {
    string: 'Current password must be a string.',
    min: 'Current password must be at least 6 characters.',
    max: 'Current password must be at most 72 characters.',
  },
} as const;
