function UniqueID(n){
    const chars="QWS1A8ZX7CD4FV6RE3T2GB5NH4JK9LP2OI3UM0aeqd7ws5zcx9nvh1fg4br6yt9mjk2ul1iop"
    let len=chars.length-1
    let str=""
    for(let i=0;i<n;i++){
        str=str+chars[Math.floor(Math.random() * (len - 0 + 1)) + 0]
    }
   return str;
}

function formatDate() {
    let date = new Date()
    const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    
    return `${day} ${months[monthIndex]} ${year}`;
}


module.exports={UniqueID,formatDate}