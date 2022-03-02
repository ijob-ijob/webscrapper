import mysqlPool from './mysql'
import { Platform, PlatformDb } from '../domain/entities/platform'
import { PlatSchedConfDb, PlatSchedConf } from '../domain/entities/plat-sched-conf'
import logging from '../config/logging'

const NAMESPACE = 'PlatformRepo'
export class PlatformRepo {

    public async getPlatformInfo (platformName: string) : Promise<Platform> {
        const selectPlatformId = 'select * from  `PLATFORM` where `name` = ?'

        let results : PlatformDb[]

        try {
            const rows = await mysqlPool.query(selectPlatformId, [platformName])
            results = <PlatformDb[]>rows[0]
        } catch (error) {
            logging.error(NAMESPACE, 'Failed to get platform id', error)
            throw error
        }

        const platform: PlatformDb = results[0]
        if (results.length > 1) {
            throw new Error('Found many platform Ids, while expecting only one')
        } else if (results.length < 1) {
            throw new Error('Could not find platform Id, results empty')
        }

        if (!platform) {
            throw new Error('Failed to get platform id')
        }

        return {
            platformId: platform.PLATFORM_ID,
            name: platform.NAME,
            type: platform.TYPE,
            supportedFrom: platform.SUPPORTED_FROM,
            supportedTo: platform.SUPPORTED_TO
        }
    }

    public async  getAllActivePlatformsWithIdentifer(): Promise<PlatSchedConf[]> {
        const statement = ` SELECT DISTINCT PLATFORM.PLATFORM_ID, 
                                            PLATFORM.NAME, 
                                            PLATFORM.TYPE, 
                                            SCHEDULER_CONF.IDENTIFIER
                            FROM PLATFORM INNER JOIN SCHEDULER_CONF
                            ON PLATFORM.PLATFORM_ID = SCHEDULER_CONF.PLATFORM_ID
                            WHERE PLATFORM.SUPPORTED_TO IS NULL
                            AND SCHEDULER_CONF.SUPPORTED_TO IS NULL;`

        try {
            const rows = await mysqlPool.query(statement)
            const platSchedConfDbList: PlatSchedConfDb[] = <PlatSchedConfDb[]>rows[0]
            console.log(rows[0])
            const platSchedConfList: PlatSchedConf[] = platSchedConfDbList.map((platformDb) => {
                return {
                    platformId: platformDb.PLATFORM_ID,
                    name: platformDb.NAME,
                    type: platformDb.TYPE,
                    identifier: platformDb.IDENTIFIER
                }
            })

            logging.info(NAMESPACE, 'Finished getting all active platforms with identifiers', platSchedConfList)
            return platSchedConfList
        } catch (error) {
            logging.error(NAMESPACE, 'An error occured while fetching all active platforms with idenfifiers')
            throw new Error(`An error occured while fetching all active platforms with identifiers ${error}`)
        }
    }

    public async getAllActivePlatforms(): Promise<Platform[]> {
        const statement = 'select * from  PLATFORM where supported_to is null'

        try {
            const rows = await mysqlPool.query(statement)
            const platformDbList: PlatformDb[] = <PlatformDb[]>rows[0]
            console.log(rows[0])
            const platformList: Platform[] = platformDbList.map((platformDb) => {
                return {
                    platformId: platformDb.PLATFORM_ID,
                    name: platformDb.NAME,
                    type: platformDb.TYPE,
                    supportedFrom: platformDb.SUPPORTED_FROM,
                    supportedTo: platformDb.SUPPORTED_TO,
                }
            })

            logging.info(NAMESPACE, 'Finished getting all active platforms', platformList)
            return platformList
        } catch (error) {
            logging.error(NAMESPACE, 'An error occured while fetching all active platforms')
            throw new Error(`An error occured while fetching all active platforms ${error}`)
        }
    }
}