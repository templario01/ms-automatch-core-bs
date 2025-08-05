export function obfuscateEmail(email: string): string {
  const [username, domain] = email.split('@');
  let obfuscateEmail: string;
  if (username.length <= 3) {
    obfuscateEmail = '***';
  } else {
    obfuscateEmail = username.substring(0, 3) + '***';
  }
  return obfuscateEmail + '@' + domain;
}
