import {SchedulerConfCronJob} from '../../domain/model/scheduler_conf_cron_job'
import {SchedulerConfPlatform} from '../../domain/entities/scheduler_conf'
import {schedule, ScheduledTask} from 'node-cron'
import {Careers24JobStore} from '../careers24_job_stores'
import logging from '../../config/logging'
import { Scheduler } from './scheduler'
import { GlobalContainer } from '../../container/global_container'

const NAMESPACE = 'Careers24ScrapperScheduler'

export class Careers24JobStoreImporterScheduler implements Scheduler {
    private isProcessing: boolean
    private schedulerConfCronJob: SchedulerConfCronJob
    private careers24JobStore: Careers24JobStore


    constructor(private globalContainer: GlobalContainer) {
        this.careers24JobStore = globalContainer.getScrapperContainer()
    }

    public start(): void {
        this.run()
    }

    public stop(): void {
        this.schedulerConfCronJob.cronJob.stop()
    }

    public run(): void {
        logging.info(NAMESPACE, 'STARTING::Careers24JobStoreImporterScheduler')
        let scheduledTask: ScheduledTask = schedule('* * * * *',
            () => {
                if (!this.isProcessing) {
                    this.careers24JobStore.importJobStores()
                        .then(() => {
                            this.isProcessing = false
                            logging.info(NAMESPACE, 'Finsihed processing job store import')
                        }).catch((error) => {
                        logging.error(NAMESPACE, 'An error occured while processing job store import')
                    })
                } else {
                    logging.info(NAMESPACE, 'Still busy processing')
                }
            })

        let schedulerConfCronJob: SchedulerConfCronJob = {
            cronJob: scheduledTask,
            schedulerConfPlatform: this.schedulerConfPlatform
        }

        logging.info(NAMESPACE, 'STARTED::Careers24JobStoreImporterScheduler')
    }
}