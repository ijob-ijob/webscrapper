import express from 'express';
import {Careers24JobStore} from "./business/careers24_job_stores";
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    console.log('passing here');
    let careers24Store : Careers24JobStore = new Careers24JobStore();
    //careers24Store.importJobStores().then(r => console.log('Finished importing jobs'))

    console.log('done')
    res.send('Hello World webscrapper!');
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
