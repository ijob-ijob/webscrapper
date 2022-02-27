import * as express from 'express'
import { Careers24JobStore } from './business/careers24_job_stores'
import { JobDetailsSaver } from './business/job_details_saver'
import { SchedulerBuilder } from './business/scheduler/scheduler-builder'
import { Careers24Scrapper } from './business/careers24_scrapper'
import {schedule, ScheduledTask} from 'node-cron'
const app = express();
const port = 3000;

const jobDetailsSaver: JobDetailsSaver = new JobDetailsSaver()
const careers24JobStore: Careers24JobStore = new Careers24JobStore()
let schedulerBuilder: SchedulerBuilder = new SchedulerBuilder(careers24JobStore)

schedulerBuilder.startAndReturnScheduler()

// schedulerBuilder.startAndReturnScheduler()
//     .then((schedulerConfCronJobList) => {
//         console.log('Scheduler builder started successfully')
//         console.log(console.log('finished processing'))
//     }).catch((error) => console.log(`Failed to process. ${error}`))

// const jobDetailsSaver: JobDetailsSaver = new JobDetailsSaver()
// schedule('*/59 */9 * * * *',() => jobDetailsSaver.processJobStoreToJobDetails())
//
// const careers24Scrapper: Careers24Scrapper = new Careers24Scrapper()
// let links: string[] = []
// let hasProcessed = false
// schedule('* * * * *',() => {
//     //console.log('It\' been 1 minute and I am running again and links size is ' + links.length)
//     if (!hasProcessed) {
//         console.log('going into processing')
//         careers24Scrapper.getLinks().then((linksResponse)=> {
//             links.push(...linksResponse)
//             console.log(links)
//         })
//         hasProcessed = true
//     } else if (hasProcessed && links.length != 0) {
//         console.log('****************** finished processing *******************')
//     } else {
//         console.log('still busy processing')
//     }
// })

// schedule('* */15 * * * *', function (){
//     console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%^^^^^^^^^^^^^^^^^^^^^^^&&&&&&&&&&&&&&&&&')
// })


// careers24Scrapper.getLinks().then((res) => {
//     console.log(res)
// })

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
