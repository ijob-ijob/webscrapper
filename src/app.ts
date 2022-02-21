import * as express from 'express'
import { Careers24JobStore } from './business/careers24_job_stores'
import { JobDetailsSaver } from './business/job_details_saver'
import { SchedulerBuilder } from './business/scheduler/scheduler-builder'
import { Careers24Scrapper } from './business/careers24_scrapper'
import {schedule, ScheduledTask} from 'node-cron'
const app = express();
const port = 3000;

let schedulerBuilder: SchedulerBuilder = new SchedulerBuilder()
const jobDetailsSaver: JobDetailsSaver = new JobDetailsSaver()
const careers24JobStore: Careers24JobStore = new Careers24JobStore()

schedulerBuilder.startAndReturnScheduler()
    .then((schedulerConfCronJobList) => {
        console.log('Scheduler builder started successfully')
        console.log(console.log('finished processing'))
    }).catch((error) => console.log(`Failed to process. ${error}`))

// const jobDetailsSaver: JobDetailsSaver = new JobDetailsSaver()
// schedule('*/59 */9 * * * *',() => jobDetailsSaver.processJobStoreToJobDetails())
//
// const careers24Scrapper: Careers24Scrapper = new Careers24Scrapper()
// schedule('* * */3 * * *',() => careers24Scrapper.getLinks())

//schedule('* * */3 * * *',() => careers24JobStore.importJobStores())
// schedule('* * */3 * * *',() => jobDetailsSaver.processJobStoreToJobDetails())

app.get('/', (req, res) => {
    //console.log('passing here');
    // let careers24Store : Careers24JobStore = new Careers24JobStore();
    // careers24Store.importJobStores().then(r => console.log('Finished importing jobs'))

   // let jobDetailsSaver: JobDetailsSaver = new JobDetailsSaver();
    //jobDetailsSaver.processJobStoreToJobDetails()


   // console.log('done')
    res.send('Hello World webscrapper!');
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`)
});
