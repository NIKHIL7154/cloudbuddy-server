const {spawn}=require('child_process');
const path=require('path');

async function buildProject(taskId){
    return new Promise((res,rej)=>{
        
        const command = `cd builder/projects/${taskId} && npm run build`;
        
        const execution = spawn(command,{shell:true});
        execution.on('error',(err)=>{
            console.error(`Error in Building: ${err}`);
            rej(`Error in Building: ${err}`);
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
                res("Project Built successfully");
            }
            else{
                rej(`Failed while building project \n reason: ${output}`);
            }
        });
        
    });
}

module.exports=buildProject;