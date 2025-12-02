/**
 * Interface ISnackMessage
 * @public
 */
export type ISnackMessage = {
    message:string
    isError:boolean
}

/**
 * SnackMessage class
 * @public
 */
export class SnackMessage implements ISnackMessage {
    message:string=""
    isError:boolean=false
}
