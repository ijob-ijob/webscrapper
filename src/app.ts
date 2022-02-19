import * as express from 'express'
import { Careers24JobStore } from './business/careers24_job_stores'
import { JobDetailsSaver } from './business/job_details_saver'
import { SchedulerBuilder } from './business/scheduler/scheduler-builder'
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    //console.log('passing here');
    // let careers24Store : Careers24JobStore = new Careers24JobStore();
    // careers24Store.importJobStores().then(r => console.log('Finished importing jobs'))

   // let jobDetailsSaver: JobDetailsSaver = new JobDetailsSaver();
    //jobDetailsSaver.processJobStoreToJobDetails()
    let schedulerBuilder: SchedulerBuilder = new SchedulerBuilder()
        schedulerBuilder.startAndReturnScheduler()
        .then((schedulerConfCronJobList) => {
            console.log('finished processing')
            console.log(console.log('finished processing'))
        }).catch((error) => console.log(`Failed to process. ${error}`))

   // console.log('done')
    res.send('Hello World webscrapper!');
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`)
});
