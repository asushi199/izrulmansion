const publicAppBaseUrl = "https://pkgpantairemis.vercel.app";
const legacyAppHosts = new Set(["izrulmansion.vercel.app"]);

function normalizePublicBaseUrl(baseUrl: string) {
  try {
    const url = new URL(baseUrl);
    if (legacyAppHosts.has(url.host.toLowerCase())) {
      return publicAppBaseUrl;
    }
  } catch {
    return baseUrl;
  }

  return baseUrl;
}

export function resolveAppBaseUrl(
  configuredBaseUrl: string | undefined,
  requestHeaders: Pick<Headers, "get">
) {
  const configured = configuredBaseUrl?.trim().replace(/\/+$/, "");
  if (configured) {
    const baseUrl = /^https?:\/\//i.test(configured) ? configured : `https://${configured}`;
    return normalizePublicBaseUrl(baseUrl);
  }

  const forwardedHost = requestHeaders.get("x-forwarded-host")?.trim();
  const host = forwardedHost || requestHeaders.get("host")?.trim();

  if (host) {
    const forwardedProto = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProto || (host.startsWith("localhost") ? "http" : "https");
    return normalizePublicBaseUrl(`${protocol}://${host}`);
  }

  return "http://localhost:3000";
}
