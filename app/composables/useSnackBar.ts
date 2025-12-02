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
 * @param error - the error
 * @param message - the message
 */
export const errorToSnack = (message:string, error:any) => {
    const snackBarMessage = new SnackMessage()
    snackBarMessage.message = new String(message + " : " + error?.message).toString()
    snackBarMessage.isError = true
    useSnackBarMessage().value = snackBarMessage
}