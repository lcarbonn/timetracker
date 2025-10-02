const config = useRuntimeConfig()

const BASEROW_URL = config.baserowApiUrl

let accessToken: string | null = null;

// for test purposes
export const setAccessToken = (newAccessToken:string) => {
  accessToken = newAccessToken
}

/**
 * Call refresh token and update user session in case
 * @param event 
 * @returns 
 */
async function refreshAccessToken(event:any): Promise<boolean> {

  // console.log("➡️ Refresh start");

  const session = await getUserSession(event)
  if (!session.secure?.refresh_token) return false;

  // console.log("➡️ Refresh refresh token is set");

  const response = await fetch(`${BASEROW_URL}/api/user/token-refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.secure.refresh_token }),
  });

  if (!response.ok) {
    // console.log("➡️ Refresh error:", response.status, ", ",response.statusText);
    await clearUserSession(event)
    return false;
  }

  const data = await response.json();
  // console.log("➡️ Refresh data:", data);
  accessToken = data.access_token
  await setUserSession(event, {
    secure:{
      access_token:data.access_token
    }
  })

  // console.log("➡️ Refresh end");
  return true;
}
/**
 * execute basserow method with token refresh management
 * @param event 
 * @param method 
 * @param args 
 * @returns 
 */
export async function baserowExecute<E, T extends any[], R>(
  event: E,
  method: (...args: T) => Promise<R>,
  ...args: T
): Promise<R> {
  try {
    // console.log("➡️ Fetch start:", method.name);

    // get the accessToken
    const session = await getUserSession(event as any)
    // console.log("✅ Fetch access_token:", session.secure?.access_token?true:false);
    if(session.secure?.access_token)
      accessToken = session.secure?.access_token

    // first call of the method
    const result = await method(...args);

    // console.log("✅ Fetch success:", method.name);
    
    return result;
  } catch (err: any) {
    // try to refresh in case of 401 and recall method
    // console.log("🔄 Fetch error before refresh:", err.statusCode);
    if (err.statusCode === 401 && (await refreshAccessToken(event))) {
      // console.log("🔄 Fetch retry after refresh:", method.name);
      return await method(...args);
    }
    // console.error("❌ Fetch failed:", method.name, err.statusMessage);
    throw err;
  }
}

export async function rawFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  query?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  options.headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

if (query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) endpoint += `?${qs}`;
  }
  if (accessToken) {
    (options.headers as Record<string, string>)["Authorization"] =
      `JWT ${accessToken}`;
  }

  const response = await fetch(`${BASEROW_URL}${endpoint}`, options);

  if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText,
      })
  }

  return response.json() as Promise<T>;
}