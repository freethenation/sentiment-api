import { Request, Response } from 'express';
import { HttpError } from '../helpers/util'

const BASIC_AUTH_USERS: { [user: string]: string; } = {
    'admin': 'mz73YAyoUtNZqR',
}

/**
 * Secures the route with basic auth. Users are defined in `BASIC_AUTH_USERS`. The `admin` user is always allowed otherwise the list of allowed users must be supplied
 * @param allowedUsers
 */
export function basicAuth(...allowedUsers: string[]) {
    allowedUsers.push('admin')
    function _basicAuth(req: Request, res: Response, next: () => void) {
        if (process.env.NODE_ENV === 'testing') return next() //do not enforce auth in tests
        // check for basic auth header
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            return res.status(401).json({ message: 'Missing Authorization Header' });
        }
        // verify auth credentials
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        if (typeof (BASIC_AUTH_USERS[username]) == "undefined" ||
        BASIC_AUTH_USERS[username] !== password ||
            (allowedUsers && allowedUsers.indexOf(username) == -1)
        ) return res.status(401).json({ message: 'Invalid Credentials' });
        next();
    }
    return _basicAuth;
}
