const redis = require('redis');
const path = require('path');
const installPackages = require('./services/installPackages');
const buildProject = require('./services/build');
const uploadProject = require('./services/uploadProject');
const cloneProject = require('./services/clone');
const consumer = redis.createClient();
const publisher = redis.createClient();

const fs=require('fs');

const { default: axios } = require('axios');

(async () => {

    await consumer.connect();
    await publisher.connect();
    console.log('Subscriber connected to Redis');


    while (true) {
        const task = await consumer.brPop('taskQueue', 0);
        // Block until a task is available
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const project = JSON.parse(task.element);
        const taskId = project.id;
        
        
        try {
            //cloning the project into a new directory
            await sendUpdate("Cloning project",taskId,false);
            const cloneResult = await cloneProject(project.url,taskId);
            console.log('Clone result:', cloneResult);
            await sendUpdate("Project cloned successfully",taskId,false);

            //installing the required packages
            await sendUpdate("Installing packages",taskId,false);
            const installResult = await installPackages(taskId);
            console.log('Install result:', installResult);
            await sendUpdate("Packages installed successfully",taskId,false);

            //building the project
            await sendUpdate("Building project",taskId,false);
            const buildResult = await buildProject(taskId);
            console.log('Build result:', buildResult);
            await sendUpdate("Project Build successfully",taskId,false);
            
            //deploying the project to the aws s3 bucket
            await sendUpdate("Deploying Your project",taskId,false);
            const uploadResult = await uploadProject(taskId);
            console.log('Upload result:', uploadResult);

            //updating the user database with the project details
            const addtodbresult = await axios.post('http://localhost:4000/addgitwebsite', { id: project.authdata.id, webname: project.webname, endpoint: `https://nikhilcloud.top/${project.id.substring(0,5)}`, webid: taskId.substring(0,5),gitUrl:project.url });

            if (addtodbresult.data.status !="success") {
                throw new Error('Failed to add to database status is not success');}
            
            await sendUpdate("Your project Deployed Successfully",taskId,true,true);



            console.log('Task processed:', project);
            removedir(taskId);
        }
        catch (err) {
            removedir(taskId);
            console.error('Error:', err);
            sendUpdate(`Error while performing the task : ${err}`,taskId,true);
        }
    }


})();

async function sendUpdate(status,taskId,abort,success=false){
    await publisher.publish('taskUpdates', JSON.stringify({ id: taskId, status, abort, success }));
}

async function removedir(taskId){
    const PATH=path.join(process.cwd(),"builder","projects",taskId);
    if(fs.existsSync(PATH)){
        fs.rmSync(PATH,{recursive:true});
        console.log('Directory removed:', taskId);
    }else{
        console.log('Directory not found:', taskId);
    }
}

