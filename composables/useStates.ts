import type { ISnackMessage } from "~/types/snackMessage";
import type { ITimeTrack } from "~/types/tableTimeTrack";
import type { ITokenAuth } from "~/types/tokenAuth";

/**
 * State for AuthUser
 */
export const useAuthUser = () => useState<ITokenAuth|undefined>("authUser");
/**
 * State for snackbar message
 */
export const useSnackBarMessage = () => useState<ISnackMessage>("snackBarMessage");

/**
 * State for Time Tracks
 */
export const useTimeTracks = () => useState<ITimeTrack[]>("timeTracks");

/**
 * State for Time Track
 */
export const useTimeTrack = () => useState<ITimeTrack|undefined>("timeTrack");

/**
 * State for year
 */
export const useYear = () => useState<number>("year");
