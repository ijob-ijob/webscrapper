import { Scheduler } from './scheduler'
import { schedule, ScheduledTask } from 'node-cron'
import { GlobalContainer } from '../../container/global-container'
import logging from '../../config/logging'

const NAMESPACE = 'Careers24JobDetailsImporterScheduler'
export class Careers24JobDetailsImporterScheduler implements Scheduler {

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
        logging.info(NAMESPACE, 'STARTING::Careers24JobDetailsImporterScheduler')
        let scheduledTask: ScheduledTask = schedule(cron,
            () => {
                if (!this.isProcessing) {
                    this.isProcessing = true
                    this.globalContainer.getImporterContainer().getCareers24JobDetailsImporter().import()
                        .then(() => {
                            this.isProcessing = false
                            logging.info(NAMESPACE, 'Finsihed processing job details import')
                        }).catch((error) => {
                        this.isProcessing = false
                        logging.error(NAMESPACE, 'An error occured while processing job details import')
                    })
                } else {
                    logging.info(NAMESPACE, 'RUNNING::Processing job details imports')
                }
            })

        this.cronJob = scheduledTask

        logging.info(NAMESPACE, 'STARTED::Careers24JobDetailsImporterScheduler')
    }

}