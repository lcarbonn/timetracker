import type { ISnackMessage } from "~/types/snackMessage";
import type { ITimeTrack } from "~/types/tableTimeTrack";
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
 * State for week
 */
export const useWeek = () => useState<number>("week");
