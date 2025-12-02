/**
 * State for snackbar message
 */
export const useSnackBarMessage = () => useState<ISnackMessage>("snackBarMessage");

/**
 * State for Time Tracks of a week
 */
export const useStateTracksOfTheWeek = () => useState<ITimeTrack[]>("timeTracksWeek");

/**
 * State for Time Track
 */
export const useStateTrack = () => useState<ITimeTrack|undefined>("timeTrack");

/**
 * State for Pause Track
 */
export const useStatePause = () => useState<IPauseTrack|undefined>("pauseTrack");
