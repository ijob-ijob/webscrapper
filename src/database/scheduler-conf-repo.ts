import { SchedulerConfPlatform, SchedulerConfPlatformDb } from '../domain/entities/scheduler-conf'
import logging from '../config/logging'
import mysqlPool from './mysql'

const NAMESPACE = 'SchedulerConfRepo'
export class SchedulerConfRepo {
  public async getActiveSchedularConf (): Promise<SchedulerConfPlatform[]> {
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

    const schedulerConfList: SchedulerConfPlatform[] = []

    await mysqlPool.query(statement).then((rows) => {
      const schedularConfPlatformDbList: SchedulerConfPlatformDb[] = <SchedulerConfPlatformDb[]>rows[0]
      const results = schedularConfPlatformDbList.map((schedularConfPlatformDb) => {
        return {
          schedulerConfId: schedularConfPlatformDb.SCHEDULER_CONF_ID,
          cron: schedularConfPlatformDb.CRON,
          platformId: schedularConfPlatformDb.PLATFORM_ID,
          supportedFrom: schedularConfPlatformDb.SUPPORTED_FROM,
          supportedTo: schedularConfPlatformDb.SUPPORTED_TO,
          description: schedularConfPlatformDb.DESCRIPTION,
          type: schedularConfPlatformDb.TYPE,
          name: schedularConfPlatformDb.NAME,
          identifier: schedularConfPlatformDb.IDENTIFIER
        }
      })
      schedulerConfList.push(...results)
    }).catch((error) => {
      logging.error(NAMESPACE, 'An error occurred while getting all scheduler conf', error)
      return new Promise((resolve, reject) => reject(new Error(`An error occurred while getting all scheduler conf::${error}`)))
    })

    logging.info(NAMESPACE, 'Finished getting all active scheduler config')
    return new Promise((resolve) => resolve(schedulerConfList))
  }
}
