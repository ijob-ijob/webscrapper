export interface Platform {
    platformId: number,
    name: string;
    type: string;
    supportedFrom: string;
    supportedTo: string;
}

export class PlatformDb {
    PLATFORM_ID: number
    NAME: string
    TYPE: string
    SUPPORTED_FROM: string
    SUPPORTED_TO: string
}
