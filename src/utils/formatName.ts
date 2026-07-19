export function displayNameFor(email: string, name?: string): string {
  if (name) {
    return name.split(' ')[0];
  }
  const localPart = email.split('@')[0];
  const firstSegment = localPart.split(/[.\-_0-9]/)[0] || localPart;
  return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
}
