
/**
 * Extend the Express::Request object with our application-level properties
 */
declare namespace Express {
    export interface Request {
        apiVersion: number
        token: import('./lib/http/auth').Token | import('./lib/http/auth').InvalidToken
        context: import('./lib/http/context').default
    }
}