
export class SchedulerConfDb {
    SCHEDULER_CONFIG_ID: number
    CRON: string
    PLATFORM_ID: number
    DESCRIPTION: string
    IDENTIFIER: string
    SUPPORTED_FROM: string
    SUPPORTED_TO: string
}

export interface SchedulerConf {
    schedulerConfId: number
    cron: string
    identifier: string
    description: string
    platformId: number
    supportedFrom: string
    supportedTo: string
}

export class SchedulerConfPlatformDb {
    SCHEDULER_CONFIG_ID: number
    CRON: string
    PLATFORM_ID: number
    DESCRIPTION: string
    SUPPORTED_FROM: string
    SUPPORTED_TO: string
    IDENTIFIER: string
    TYPE: string
    NAME: string
}

export interface SchedulerConfPlatform {
    schedulerConfId: number
    cron: string
    description: string
    platformId: number
    supportedFrom: string
    identifier: string
    supportedTo: string
    type: string,
    name: string,
}
