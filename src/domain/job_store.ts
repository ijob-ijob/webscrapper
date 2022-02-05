import Platform from './platform';

export interface JobStore {
    jobStoreId: number;
    link: string;
    data: any;
    platform: Platform;
    updatedAt: string;
}

export interface JobStoreEntity {
    jobStoreId: number;
    link: string;
    data: any;
    platformId: number;
    updatedAt: string;
}
