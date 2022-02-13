import mysqlPool from './mysql'
import { Platform } from '../domain/platform'
import logging from '../config/logging'

const NAMESPACE = 'PlatformRepo'
export class PlatformRepo {

    public async getPlatformInfo (platformName: string) : Promise<Platform> {
        const selectPlatformId = 'select * from  `PLATFORM` where `name` = ?'

        let results : Platform[]

        try {
            const rows = await mysqlPool.query(selectPlatformId, [platformName])
            results = <Platform[]>rows[0]
        } catch (error) {
            logging.error(NAMESPACE, 'Failed to get platform id', error)
            throw error
        }

        const platform: Platform = results[0]
        if (results.length > 1) {
            throw new Error('Found many platform Ids, while expecting only one')
        } else if (results.length < 1) {
            throw new Error('Could not find platform Id, results empty')
        }

        if (!platform) {
            throw new Error('Failed to get platform id')
        }

        return platform
    }

    public async getAllActivePlatforms(): Promise<Platform[]> {
        const statement = 'select * from  PLATFORM where supported_to is null'

        try {
            const rows = await mysqlPool.query(statement)
            return <Platform[]>rows[0]
        } catch (error) {
            logging.error(NAMESPACE, 'An error occured while fetching all active platforms')
            throw new Error(`An error occured while fetching all active platforms ${error}`)
        }
    }
}