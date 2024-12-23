const {spawn}=require('child_process');
const path=require('path');

async function installPackages(taskId){
    return new Promise((res,rej)=>{
        
        const command = `npm install`;
        const curpath=process.cwd();
        const clonepath=path.join(curpath,"builder","projects",taskId);
        const execution = spawn(command,{cwd:clonepath,shell:true});
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