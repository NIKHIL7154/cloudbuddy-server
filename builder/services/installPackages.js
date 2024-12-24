const {spawn}=require('child_process');
const path=require('path');

async function installPackages(taskId){
    return new Promise((res,rej)=>{
        
        const command = `cd builder/projects/${taskId} && npm install`;
        
        const execution = spawn(command,{shell:true});
        execution.on('error',(err)=>{
            console.error(`Error in installing packages: ${err}`);
            rej(`Error in installing packages: ${err}`);
        });
        let output = '';
        execution.stdout.on('data',(data)=>{
            const dataStr=data.toString();
            output+=`[Warn] ${dataStr}\n`;
            console.log(`[stdout]: ${dataStr}`);
        });
        execution.stderr.on('data',(data)=>{
            const dataStr=data.toString();
            output+=`[Error] ${dataStr}\n`;
            console.error(`[stderr]: ${dataStr}`);
        });
        execution.on('close',(code)=>{
            if(code===0){
                res("Packages installed successfully");
            }
            else{
                rej(`Failed to install packages \n reason: ${output}`);
            }
        });
        
    });
}

module.exports=installPackages;