
export class SchedulerConfDb {
    SCHEDULER_CONFIG_ID: number
    CRON: string
    PLATFORM_ID: number
    SUPPORTED_FROM: string
    SUPPORTED_TO: string
}

export interface SchedulerConf {
    schedulerConfId: number
    cron: string
    platformId: number
    supportedFrom: string
    supportedTo: string
}