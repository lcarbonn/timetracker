import type { ISnackMessage } from "~/types/snackMessage";
import type { IPauseTrack } from "~/types/tablePauseTrack";
import type { ITimeTrack } from "~/types/tableTimeTrack";
/**
 * State for snackbar message
 */
export const useSnackBarMessage = () => useState<ISnackMessage>("snackBarMessage");

/**
 * State for Time Tracks of a week
 */
export const useTimeTracksOfTheWeek = () => useState<ITimeTrack[]>("timeTracksWeek");

/**
 * State for Time Track
 */
export const useTimeTrack = () => useState<ITimeTrack|undefined>("timeTrack");

/**
 * State for Pause Track
 */
export const usePauseTrack = () => useState<IPauseTrack|undefined>("pauseTrack");

/**
 * State for week
 */
export const useWeek = () => useState<number>("week");
