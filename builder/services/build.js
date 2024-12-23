const {spawn}=require('child_process');
const path=require('path');

async function buildProject(taskId){
    return new Promise((res,rej)=>{
        
        const command = `npm run build`;
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
                res("Project Built successfully");
            }
            else{
                rej(`Failed while building project \n reason: ${output}`);
            }
        });
        
    });
}

module.exports=buildProject;