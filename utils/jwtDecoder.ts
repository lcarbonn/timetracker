import {jwtDecode} from "jwt-decode";

interface BaserowTokenPayload {
  user_id: number;
  exp: number;
  orig_iat: number;
  // d'autres champs peuvent exister selon la config
}

export function getUserIdFromToken(token: string): number {
  const decoded = jwtDecode<BaserowTokenPayload>(token);
  return decoded.user_id;
}
