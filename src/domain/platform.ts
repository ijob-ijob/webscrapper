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

    getPlatform(): Platform {
        return {
            platformId: this.PLATFORM_ID,
            name: this.NAME,
            type: this.TYPE,
            supportedFrom: this.SUPPORTED_FROM,
            supportedTo: this.SUPPORTED_TO
        }
    }
}
