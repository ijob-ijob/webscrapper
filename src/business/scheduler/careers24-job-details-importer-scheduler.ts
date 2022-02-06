import { Scheduler } from './scheduler'
import { schedule, ScheduledTask } from 'node-cron'
import { GlobalContainer } from '../../container/global-container'
import logging from '../../config/logging'

const NAMESPACE = 'Careers24JobDetailsImporterScheduler'
export class Careers24JobDetailsImporterScheduler implements Scheduler {

    private isProcessingInternal: boolean = false
    private cronJob: ScheduledTask
    private identifier: string

    constructor(private globalContainer: GlobalContainer) {}

    public start(identifier: string, cron: string): void {
        this.identifier = identifier
        this.run(identifier, cron)
    }

    public stop(): void {
        this.cronJob.stop()
    }

    public getIdentifier(): string {
        return this.identifier
    }

    public isProcessing(): boolean {
        return this.isProcessingInternal
    }

    private setIdentifier(identifier: string): void {
        this.identifier = identifier
    }

    public run(identifier: string, cron: string): void {
        if (!this.identifier) {
            this.setIdentifier(identifier)
        }
       // logging.info(NAMESPACE, 'STARTING::Careers24JobDetailsImporterScheduler')
        let scheduledTask: ScheduledTask = schedule(cron,
            () => {
            console.log('*********************************************************************** ' + this.isProcessingInternal)
                if (!this.isProcessingInternal) {
                    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ' + this.isProcessingInternal)
                    this.isProcessingInternal = true
                    this.globalContainer.getImporterContainer().getCareers24JobDetailsImporter().import()
                        .then(() => {
                            this.isProcessingInternal = false
                            console.log('############################################################## ' + this.isProcessingInternal)
                            //logging.info(NAMESPACE, 'Finsihed processing job details import')
                        }).catch((error) => {
                        this.isProcessingInternal = false
                        console.log('------------------------------------------------------------------- ' + this.isProcessingInternal)
                       // logging.error(NAMESPACE, 'An error occured while processing job details import')
                    })
                } else {
                   // logging.info(NAMESPACE, 'RUNNING::Processing job details imports')
                }
            })

        this.cronJob = scheduledTask

       // logging.info(NAMESPACE, 'STARTED::Careers24JobDetailsImporterScheduler')
    }

}