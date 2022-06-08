import * as express from 'express'
import { SchedulerBuilder } from './business/scheduler/scheduler-builder'
import { GlobalContainer } from './container/global-container'
import config from './config/config'

const app = express()
const port = config.server.port

const globalContainer: GlobalContainer = new GlobalContainer()
const schedulerBuilder: SchedulerBuilder = new SchedulerBuilder(globalContainer)

schedulerBuilder.startSchedulers()

app.get('/', (req, res) => {
  res.send('Hello World webscrapper!')
})

app.get('/job-details', (req, res) => {
  res.send(schedulerBuilder.getJobDetails())
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`)
})
