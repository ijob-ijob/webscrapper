import { SchedulerConfCronJob } from '../../domain/model/scheduler_conf_cron_job'
import { SchedulerConfRepo } from '../../database/scheduler_conf_repo'
import { SchedulerConfPlatform } from '../../domain/entities/scheduler_conf'
import logging from '../../config/logging'
import { schedule, ScheduledTask } from 'node-cron'
import { JobDetailsSaver } from '../job_details_saver'
import { SchedulerConfType } from '../../domain/constant/scheduler_conf_types'
import { Careers24JobStore } from '../careers24_job_stores'
import { Scheduler } from './scheduler'
import { Careers24JobStoreImporterScheduler } from './careers-24-job-store-importer-scheduler'

const NAMESPACE = 'SchedulerBuilder'

export class SchedulerBuilder {

    private careers24JobStoreImporterScheduler: Scheduler

    constructor(private careers24JobStore: Careers24JobStore) {
    }

    public async startAndReturnScheduler(): Promise<void> {
        const schedulerConfRepo: SchedulerConfRepo = new SchedulerConfRepo()

        let that = this
        return await new Promise<void>(function (resolve, reject) {
            schedulerConfRepo.getActiveSchedularConf()
                .then((schedulerConfPlaformList: SchedulerConfPlatform[]) => {
                    let schedulerConfCronJobList: SchedulerConfCronJob[] = that.startAndReturnScheduledTasks(schedulerConfPlaformList)
                    logging.info(NAMESPACE, 'Finished starting and getting scheduler conf', schedulerConfCronJobList)
                    return resolve()
                }).catch((error) => {
                logging.error(NAMESPACE, 'An error occured while getting and starting scheduler conf', error)
                return reject(`An error occured whole getting and starting scheduler conf, ${error}`)
            })
        })
    }

    private startAndReturnScheduledTasks(schdulerConfPlatformList: SchedulerConfPlatform[]): SchedulerConfCronJob[] {
        let schedulerConfCronJobList: SchedulerConfCronJob[] = []

        for (let i = 0; i < schdulerConfPlatformList.length; i++) {
            let schedulerConfPlaform: SchedulerConfPlatform = schdulerConfPlatformList[i]

            switch (schedulerConfPlaform.identifier) {
                case SchedulerConfType.CAREERS24JOBSTOREIMPORTER:
                    this.careers24JobStoreImporterScheduler = new Careers24JobStoreImporterScheduler(schedulerConfPlaform, this.careers24JobStore)
                    this.careers24JobStoreImporterScheduler.start()
                    break
                // case SchedulerConfType.CAREERS24JONDETAILSRESOLVER:
                //    schedulerConfCronJobList.push(this.buildAndReturnProcessJobStoreToJobDetailsCronJob(schedulerConfPlaform))
                //     break
                default:
                    logging.warn(NAMESPACE, 'Could not find configured scheduler conf', schedulerConfPlaform)
                    break
            }
        }
        logging.info(NAMESPACE, 'Finished starting and returning scheduled tasks', schdulerConfPlatformList)
        return schedulerConfCronJobList
    }

    private buildAndReturnProcessJobStoreToJobDetailsCronJob(schedulerConfPlatform: SchedulerConfPlatform): SchedulerConfCronJob {
        const jobDetailsSaver: JobDetailsSaver = new JobDetailsSaver()

        let scheduledTask: ScheduledTask = schedule('* * * * *',
            () => jobDetailsSaver.processJobStoreToJobDetails()
                .then(() => {
                    logging.info(NAMESPACE, 'Finished processing store to details job')
                }).catch((error) => {
                    logging.error(NAMESPACE, 'An occur ouccred while processing store to details job', error)
                }))

        let schedulerConfCronJob: SchedulerConfCronJob = {
            cronJob: scheduledTask,
            schedulerConfPlatform: schedulerConfPlatform
        }

        logging.info(NAMESPACE, 'Finished building and returning process store to job details cron job', schedulerConfCronJob)
        return schedulerConfCronJob
    }
}