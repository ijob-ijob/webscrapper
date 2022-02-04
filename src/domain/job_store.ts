import Platform from './platform';

export default interface JobStore {
    jobStoreId: number;
    link: string;
    data: any;
    platform: Platform;
    updatedAt: string;
}
