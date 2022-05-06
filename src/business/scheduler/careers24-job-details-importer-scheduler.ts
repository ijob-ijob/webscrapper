import { Scheduler } from './scheduler'
import { schedule, ScheduledTask } from 'node-cron'
import { GlobalContainer } from '../../container/global-container'
import logging from '../../config/logging'

const NAMESPACE = 'Careers24JobDetailsImporterScheduler'
export class Careers24JobDetailsImporterScheduler implements Scheduler {
    private isProcessingInternal: boolean = false
    private cronJob: ScheduledTask
    private identifier: string
    private lastProcessedAt: Date
    private cron: string

    constructor (private globalContainer: GlobalContainer) {}

    public setIsProcessing (isProcessing: boolean): void {
      this.isProcessingInternal = isProcessing
    }

    public getCron (): string {
      return this.cron
    }

    public getLastProcessedAt (): Date {
      return this.lastProcessedAt
    }

    public start (identifier: string, cron: string): void {
      this.run(identifier, cron)
    }

    public stop (): void {
      this.cronJob.stop()
    }

    public getIdentifier (): string {
      return this.identifier
    }

    public isProcessing (): boolean {
      return this.isProcessingInternal
    }

    private setIdentifier (identifier: string): void {
      this.identifier = identifier
    }

    public run (identifier: string, cron: string): void {
      if (!this.identifier || identifier) {
        this.setIdentifier(identifier)
      }

      if (!this.cron || cron) {
        this.cron = cron
      }

      logging.info(NAMESPACE, 'STARTING::Careers24JobDetailsImporterScheduler')
      this.cronJob = schedule(this.cron,
        () => {
          if (!this.isProcessingInternal) {
            this.lastProcessedAt = new Date()
            this.isProcessingInternal = true
            this.globalContainer.getImporterContainer().getCareers24JobDetailsImporter().import()
              .then(() => {
                this.isProcessingInternal = false
                logging.info(NAMESPACE, 'Finished processing job details import')
              }).catch((error) => {
                this.isProcessingInternal = false
                logging.error(NAMESPACE, `An error occurred while processing job details import::${error}`)
              })
          } else {
            logging.info(NAMESPACE, 'RUNNING::Processing job details imports')
          }
        })
      logging.info(NAMESPACE, 'STARTED::Careers24JobDetailsImporterScheduler')
    }
}
