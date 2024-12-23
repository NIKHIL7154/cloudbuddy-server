const { default: axios } = require("axios");

const buildProject = require("./services/build");
const cloneProject = require("./services/clone");
const installPackages = require("./services/installPackages");
const uploadProject = require("./services/uploadProject");

const redis = require('redis');
const publisher = redis.createClient();
const consumer = redis.createClient();
async function test() {
    console.log('Hello World');
    try {
        //const res= await installPackages("test");
        //const data=await buildProject("test");
        //const data = await uploadProject("test");

        //console.log("this is real data"+data);
    } catch (error) {
        console.error('Error:', error);

    }
}

//test();

function red() {

    (async () => {
        await publisher.connect();
        await consumer.connect();
        console.log('Publisher connected to Redis');
        consumer.subscribe('taskUpdates', (message) => {
            const update = JSON.parse(message);
            console.log('Received task update:', update.status);
            if (update.abort) {
                console.log('Stopped:');
                process.exit();
            }
        });

        await publisher.lPush('taskQueue', JSON.stringify({ id: 'lbbgjh', url: 'https://github.com/NIKHIL7154/todoRedux.git' }))


    })();

}

async function ssd() {
    try {
        const project = { authdata: { id: "675fc8206f36eca3e5c0b4d4" }, webname: "test" }
        const taskId = "lbbgjh";
        const addtodbresult = await axios.post('http://localhost:4000/addgitwebsite', { id: project.authdata.id, webname: project.webname, endpoint: `http://${taskId.substring(0, 6)}.localhost:3000`, webid: taskId.substring(0, 6) });

        if (addtodbresult.data.status != "success") {
            throw new Error('Failed to add to database status is not success');
        }
    } catch (error) {
        console.log(error);

    }

}

async function checkUpload(){
    try {
        const data=await uploadProject("balbaso");
        console.log(data);
    } catch (error) {
        console.log(error)
    }
}

checkUpload();