/**
 * Send message to snackbar
 * @param message - the message
 */
export const messageToSnack = (message:string) => {
    const snackBarMessage = new SnackMessage()
    snackBarMessage.message = new String(message).toString()
    snackBarMessage.isError = false
    useSnackBarMessage().value = snackBarMessage
}

/**
 * Send error to snackbar
 * @param message - the message
 * @param error - the error message
 */
export const errorToSnack = (message:string, error:string) => {
    const snackBarMessage = new SnackMessage()
    snackBarMessage.message = new String(message + " : " + error).toString()
    snackBarMessage.isError = true
    useSnackBarMessage().value = snackBarMessage
}