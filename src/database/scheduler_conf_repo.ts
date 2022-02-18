import { SchedulerConf, SchedulerConfDb } from '../domain/entities/scheduler_conf'
import logging from '../config/logging'
import mysqlPool from './mysql'

const NAMESPACE = 'SchedulerConfRepo'
export class SchedulerConfRepo {

    public async getActiveSchedularConf(): Promise<SchedulerConf[]> {
        const statement = 'select * from SCHEDULER_CONF where SUPPORTED_TO is null'

        try {
            const rows = await mysqlPool.query(statement)
            const schedularConfDbList: SchedulerConfDb[] = <SchedulerConfDb[]>rows[0]
            const schedulerConfList: SchedulerConf[] = schedularConfDbList.map((schedularConfDb) => {
                return {
                    schedulerConfId: schedularConfDb.SCHEDULER_CONFIG_ID,
                    cron: schedularConfDb.CRON,
                    platformId: schedularConfDb.PLATFORM_ID,
                    supportedFrom: schedularConfDb.SUPPORTED_FROM,
                    supportedTo: schedularConfDb.SUPPORTED_TO
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