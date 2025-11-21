const config = useRuntimeConfig()

const BASEROW_URL = config.public.baseApiUrl

let accessToken: string | null = null;

const isLog = false

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

  if(isLog) console.log("➡️ Refresh start");

  const session = await getUserSession(event)
  if (!session.secure?.refresh_token) return false;

  if(isLog) console.log("➡️ Refresh refresh token is set");

  const response = await fetch(`${BASEROW_URL}/api/user/token-refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.secure.refresh_token }),
  });

  if (!response.ok) {
    if(isLog) console.log("➡️ Refresh error:", response.status, ", ",response.statusText);
    await clearUserSession(event)
    return false;
  }

  const data = await response.json();
  if(isLog) console.log("➡️ Refresh data:", data);
  accessToken = data.access_token
  await setUserSession(event, {
    access_token:data.access_token,
    secure:{
      access_token:data.access_token
    }
  })

  if(isLog) console.log("➡️ Refresh end");
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
    if(isLog) console.log("➡️ Fetch start:", method.name);

    // get the accessToken
    const session = await getUserSession(event as any)
    if(isLog) console.log("✅ Fetch access_token:", session.secure?.access_token?true:false);
    if(session.secure?.access_token)
      accessToken = session.secure?.access_token

    // first call of the method
    const result = await method(...args);

    if(isLog) console.log("✅ Fetch success:", method.name, result);
    
    return result;
  } catch (err: any) {
    // try to refresh in case of 401 and recall method
    if(isLog) console.log("🔄 Fetch error before refresh:", err.statusCode);
    if (err.statusCode === 401 && (await refreshAccessToken(event))) {
      if(isLog) console.log("🔄 Fetch retry after refresh:", method.name);
      const res = await method(...args);
      if(isLog) console.log("🔄 Fetch result after refresh:", res);
      return res

    }
    if(isLog) console.error("❌ Fetch failed:", method.name, err.statusMessage);
    throw err;
  }
}

export async function rawFetch<T>(
  endpoint: string,
  options: any = {},
  // query?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  options.headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (accessToken) {
    (options.headers as Record<string, string>)["Authorization"] =
      `JWT ${accessToken}`;
  }

  if(isLog) console.log("🔄 rawFetch :", endpoint, " options:", options);

    const result = await $fetch<T>(`${BASEROW_URL}${endpoint}`, {
    onRequest ({request, options:reqOptions }) {
      if(isLog) console.log("🔄 rawFetch onRequest :", endpoint, " options:", reqOptions);
      reqOptions.method = options.method || "GET"
      reqOptions.headers = options.headers || {}
      reqOptions.body = options.body
      reqOptions.query = options.query
    },
    onResponseError ({ response }) {
      // Handle the response errors
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText,
      })
    },
  })
  if(isLog) console.log("rawFetch result:", result)
  return result as Promise<T>
}