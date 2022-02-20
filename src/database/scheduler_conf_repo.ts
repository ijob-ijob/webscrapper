import { SchedulerConfPlatform, SchedulerConfPlatformDb } from '../domain/entities/scheduler_conf'
import logging from '../config/logging'
import mysqlPool from './mysql'

const NAMESPACE = 'SchedulerConfRepo'
export class SchedulerConfRepo {

    public async getActiveSchedularConf(): Promise<SchedulerConfPlatform[]> {
        const statement = `select
                                SCHEDULER_CONF_ID, 
                                CRON, 
                                SCHEDULER_CONF.PLATFORM_ID, 
                                SCHEDULER_CONF.SUPPORTED_FROM, 
                                SCHEDULER_CONF.SUPPORTED_TO, 
                                DESCRIPTION, 
                                TYPE, 
                                NAME,
                                IDENTIFIER
                          from SCHEDULER_CONF inner join PLATFORM 
                          on SCHEDULER_CONF.PLATFORM_ID = PLATFORM.PLATFORM_ID
                          where SCHEDULER_CONF.SUPPORTED_TO is null 
                          and PLATFORM.SUPPORTED_TO is null`

        try {
            const rows = await mysqlPool.query(statement)
            const schedularConfPlatformDbList: SchedulerConfPlatformDb[] = <SchedulerConfPlatformDb[]>rows[0]
            const schedulerConfList: SchedulerConfPlatform[] = schedularConfPlatformDbList.map((schedularConfPlatfromDb) => {
                return {
                    schedulerConfId: schedularConfPlatfromDb.SCHEDULER_CONF_ID,
                    cron: schedularConfPlatfromDb.CRON,
                    platformId: schedularConfPlatfromDb.PLATFORM_ID,
                    supportedFrom: schedularConfPlatfromDb.SUPPORTED_FROM,
                    supportedTo: schedularConfPlatfromDb.SUPPORTED_TO,
                    description: schedularConfPlatfromDb.DESCRIPTION,
                    type: schedularConfPlatfromDb.TYPE,
                    name: schedularConfPlatfromDb.NAME,
                    identifier: schedularConfPlatfromDb.IDENTIFIER
                }
            })

            logging.info(NAMESPACE, 'Finished getting all active scheduler config')
            return schedulerConfList
        } catch (error) {
            logging.error(NAMESPACE, 'An error occured while getting all scheduler conf', error)
            throw error
        }
    }
}