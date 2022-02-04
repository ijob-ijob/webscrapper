import JobStore from "../domain/job_store";
import logging from "../../config/logging";
import mysqlPool from "./mysql";

const NAMESPACE = 'JobStoreRepo';
export class JobStoreRepo {

    async getJobStoreByJobLinksAndPlatform(jobLinks: string[], platform: string) : Promise<JobStore[]> {
        let statement = 'select * from `JOB_STORE` inner join `PLATFORM` on `platform_id` = `platform_id` where `link` in ? and `name` = ?';

        try {
            const results = await mysqlPool.query(statement, [jobLinks, platform]);
            let jobStores: JobStore[] = [];
            Object.keys(results).forEach(function(key) {
                let row = results[key];
                jobStores.push(row);
            });
            return jobStores;
        } catch (error) {
            logging.error(NAMESPACE, 'An error occurred', error);
            throw new Error(`Error occurred ${error}`);
        }
    }

    async saveJobStore(jobStoreList: JobStore[]) {

    }
}
