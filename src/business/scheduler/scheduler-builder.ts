import { SchedulerConfCronJob } from '../../domain/model/scheduler_conf_cron_job'
import { SchedulerConfRepo } from '../../database/scheduler_conf_repo'
import { SchedulerConf } from '../../domain/entities/scheduler_conf'
import logging from '../../config/logging'
import { schedule } from 'node-cron'

const NAMESPACE = 'SchedulerBuilder'
export class SchedulerBuilder {

    public async startAndReturnScheduler(): Promise<SchedulerConfCronJob[]> {
        const schedulerConfRepo: SchedulerConfRepo = new SchedulerConfRepo()

        return await new Promise<SchedulerConfCronJob[]>(function (resolve, reject) {
            let schedulerConfList: SchedulerConf[] = []

            schedulerConfRepo.getActiveSchedularConf()
                .then((schedulerConfList: SchedulerConf[]) => {
                    const schedulerConCronJob: SchedulerConfCronJob[] = []

                    for (let i = 0; i < schedulerConfList.length; i++) {
                        let scheduerConf: SchedulerConf = schedulerConfList[i]


                    }
                }).catch((error) => {
                    logging.error(NAMESPACE, 'An error occured while getting all active scheduler conf', error)
                    return reject(`An error occured whole getting all active scheduler conf, ${error}`)
                })
        })
    }
}