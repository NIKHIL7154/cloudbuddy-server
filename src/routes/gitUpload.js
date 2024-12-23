const express = require("express");
const route = express.Router();
const redis = require("redis");
const path = require('path');
const { exec } = require('child_process');

const { v4: uuidv4 } = require('uuid');
const { verifytoken } = require("../middle/authverify");

const clients = new Map();
const queueClient = redis.createClient();
const subscriber = redis.createClient();
(async () => {
    try {
        await queueClient.connect();
        await subscriber.connect();
        console.log('Producer connected to Redis');

        // Subscribe to the "taskUpdates" channel
        await subscriber.subscribe('taskUpdates', (message) => {
            const update = JSON.parse(message);
            console.log('Received task update:', update.status);
            // Stream updates to the relevant client
            const client = clients.get(update.id);
            if (client && client.res) {
                client.res.write(`data: ${JSON.stringify(update.status)}\n\n`);
                
                if (update.abort) {
                    //close connection if process is aborted
                    if (update.success) {
                        const url=`https://nikhilcloud.top/${update.id.substring(0,5)}`
                        client.res.write(`data: ${JSON.stringify(`Project Deployment successful. You can view your Project at ${url}`)}\n\n`);
                    }
                    client.res.write(`data: babu\n\n`);
                    client.res.end();
                    clients.delete(update.id);
                }
            }else{
                if(update.abort){
                    clients.delete(update.id);
                }
            }
            
        });
    }
    catch (err) {
        console.error('Error in caching:', err);
    }
})();
route.post("/task",verifytoken, (req, res) => {
    const taskId = uuidv4();
    const { gitUrl ,name} = req.body;
    queueClient.lPush("taskQueue", JSON.stringify({authdata:req.authdata,webname:name, id: taskId,url:gitUrl, status: "Project initiated" }));
    clients.set(taskId, { status:"Active" });
    res.status(200).json({ message: "Progress started", id: taskId });

});
    



route.get("/task/:id", (req, res) => {
    console.log("Request received for task: ", req.params.id);
    const taskId = req.params.id;
    if(!clients.has(taskId)){
        console.log(`Task not found: ${taskId}`);
        res.status(404).json({message: "Task not found"});
        return;
    }
    
    // Set necessary headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.set(taskId, {status:"polling", res });
    // Send an initial message to establish the connection
    res.write(`data: ${JSON.stringify(`You are in Queue....`)}\n\n`);

    // Store the client in the map with taskId as the key
    //clients.set(taskId, { res });

    console.log(`Client connected for task: ${taskId}`);

    // Handle client disconnects
    req.on('close', () => {
        console.log(`Client disconnected for task: ${taskId}`);
        //clients.delete(taskId); // Clean up the client map
    });

})







module.exports = route;