const {spawn}=require('child_process');
const path=require('path');

async function cloneProject(url,taskId){
    return new Promise((res,rej)=>{
        
        
        
        
        
        console.log(`Cloning at path: ${process.cwd()}/projects/${taskId}`);
        
        const command = `cd builder/projects && git clone ${url} ${taskId}`;
        

        // Spawn process
        const execution = spawn(command,{shell: true });

        execution.on('error',(err)=>{
            console.error(`Error in cloning: ${err}`);
            rej(`Error in cloning: ${err}`);
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
                res("Cloning successful");
            }
            else{
                rej(`Cloning failed with code ${code} reason: ${output}`);
            }
        });
        
    });
}



module.exports=cloneProject;