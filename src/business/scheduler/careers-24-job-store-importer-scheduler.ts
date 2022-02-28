import { SchedulerConfPlatform } from '../../domain/entities/scheduler_conf'
import { schedule, ScheduledTask } from 'node-cron'
import { Careers24JobDetailsScrapper } from '../scrapper/careers24_job_details_scrapper'
import { Scheduler } from './scheduler'
import { GlobalContainer } from '../../container/global_container'
import logging from '../../config/logging'

const NAMESPACE = 'Careers24ScrapperScheduler'

export class Careers24JobStoreImporterScheduler implements Scheduler {
    private isProcessing: boolean
    private cronJob: ScheduledTask

    constructor(private globalContainer: GlobalContainer) {}

    public start(): void {
        this.run()
    }

    public stop(): void {
        this.cronJob.stop()
    }

    public run(): void {
        logging.info(NAMESPACE, 'STARTING::Careers24JobStoreImporterScheduler')
        let scheduledTask: ScheduledTask = schedule('* * * * *',
            () => {
                if (!this.isProcessing) {
                    this.globalContainer.getJobSaverContainer().getJobStoreSaver().importJobStores()
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

        this.cronJob = scheduledTask

        logging.info(NAMESPACE, 'STARTED::Careers24JobStoreImporterScheduler')
    }
}