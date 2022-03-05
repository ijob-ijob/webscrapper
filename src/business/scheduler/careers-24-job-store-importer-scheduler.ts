import { SchedulerConfPlatform } from '../../domain/entities/scheduler-conf'
import { schedule, ScheduledTask } from 'node-cron'
import { Careers24JobDetailsScrapper } from '../scrapper/careers24-job-details-scrapper'
import { Scheduler } from './scheduler'
import { GlobalContainer } from '../../container/global-container'
import logging from '../../config/logging'

const NAMESPACE = 'Careers24ScrapperScheduler'
export class Careers24JobStoreImporterScheduler implements Scheduler {
    private isProcessing: boolean = false
    private cronJob: ScheduledTask

    constructor(private globalContainer: GlobalContainer) {}

    public start(cron: string): void {
        this.run(cron)
    }

    public stop(): void {
        this.cronJob.stop()
    }

    public run(cron: string): void {
        logging.info(NAMESPACE, 'STARTING::Careers24JobStoreImporterScheduler')
        let scheduledTask: ScheduledTask = schedule(cron,
            () => {
                if (!this.isProcessing) {
                    this.isProcessing = true
                    this.globalContainer.getImporterContainer().getCareer24JobStoreImporter().import()
                        .then(() => {
                            this.isProcessing = false
                            logging.info(NAMESPACE, 'Finsihed processing job store import')
                        }).catch((error) => {
                        this.isProcessing = false
                        logging.error(NAMESPACE, 'An error occured while processing job store import')
                    })
                } else {
                    logging.info(NAMESPACE, 'RUNNING::Processing job store imports')
                }
            })

        this.cronJob = scheduledTask

        logging.info(NAMESPACE, 'STARTED::Careers24JobStoreImporterScheduler')
    }
}