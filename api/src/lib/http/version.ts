
import { Request, Response, NextFunction } from 'express'
import APIConstants from '../constants/api'

export default function handleVersion(req: Request, res: Response, next: NextFunction): any {
    const { current } = APIConstants.version
    const { context } = req
    const origVersion: any = req.get('Accept-version')

    let version = origVersion

    // Strip the leading v and convert it into a float
    if (version) {
        if (!(version = parseFloat(version.replace(/^v/, '')))) {
            context.warn(
                `Version '${origVersion}' could not be parsed - defaulting to version ${current}`
            )
        }
        else if (version <= APIConstants.deprecated) {
            context.warn(`Version ${version} is deprecated. Consider switching to version ${
                Math.min.apply(null, APIConstants.version.all.filter((x: number) => x > version))
            } or higher.`)
        }
        else if (version < current) {
            context.warn(
                `New version (${current}) available (current: ${version})`
            )
        }
    }

    req.apiVersion = version || current

    next()
}