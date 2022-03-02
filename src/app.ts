import * as express from 'express'
import { SchedulerBuilder } from './business/scheduler/scheduler-builder'
import { schedule, ScheduledTask } from 'node-cron'
import { GlobalContainer } from './container/global-container'

const app = express();
const port = 3000;

const gloabContainer: GlobalContainer = new GlobalContainer()
const schedulerBuilder: SchedulerBuilder = new SchedulerBuilder(gloabContainer)

schedulerBuilder.startSchedulers()

app.get('/', (req, res) => {
    res.send('Hello World webscrapper!');
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`)
});
