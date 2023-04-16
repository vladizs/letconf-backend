export function parseCookie(cookie: string) {
  const cookiesList = cookie.split('; ');
  const cookieMap = cookiesList.map((c) => c.split('='));
  return Object.fromEntries(cookieMap);
}
