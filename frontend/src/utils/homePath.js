// Where a user lands after logging in, if they weren't heading somewhere else
export function homePathFor(user) {
  return user.role === 'admin' ? '/customers' : '/profile'
}
