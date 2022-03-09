import { Platform, PlatformDb } from './platform';

export interface JobStoreBase {
    jobStoreId: number
    link: string
    updatedAt: string
    data: any
    status: string
    createdAt: string
}

export interface JobStore extends JobStoreBase {
    platform: Platform
}

export interface JobStoreEntity extends JobStoreBase {
    platformId: number
}

export class JobStoreBaseDb {
    JOB_STORE_ID: number
    LINK: string
    DATA: any
    UPDATED_AT: string
    STATUS: string
    CREATED_AT: string
}

export class JobStoreEntityDb extends JobStoreBaseDb{
    PLATFORM_ID: number
}

export class JobStoreDb extends JobStoreBaseDb {
    PLATFORM: PlatformDb
}