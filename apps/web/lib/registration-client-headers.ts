/** Forward client metadata to the Spring API for registration audit. */
export function registrationClientHeaders(request: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  const forwarded =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-vercel-forwarded-for') ??
    request.headers.get('x-real-ip');
  if (forwarded) headers['X-Forwarded-For'] = forwarded;
  const ua = request.headers.get('user-agent');
  if (ua) headers['User-Agent'] = ua;
  const referer = request.headers.get('referer');
  if (referer) headers['Referer'] = referer;
  const lang = request.headers.get('accept-language');
  if (lang) headers['Accept-Language'] = lang;
  const country = request.headers.get('x-vercel-ip-country');
  if (country) headers['X-Client-Country'] = country;
  const region = request.headers.get('x-vercel-ip-country-region');
  if (region) headers['X-Client-Region'] = region;
  const city = request.headers.get('x-vercel-ip-city');
  if (city) headers['X-Client-City'] = city;
  return headers;
}
