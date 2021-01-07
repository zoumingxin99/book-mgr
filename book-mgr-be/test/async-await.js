const request = (arg, isReject) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(isReject){
                reject('出错了');
                return;
            }
            console.log(arg);
            resolve(arg + 1);
        }, 300);
    });
};

//async 函数 返回一个promise
const fn = async () => {
    const res1 = await request(1);
    const res2 = await request(res1);
    const res3 = await request(res2);
    const res4 = await request(res3);
    const res5 = await request(res4);

    console.log(res5);
}

fn();

//回调
// const request = (arg, isReject) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             if(isReject){
//                 reject('出错了');
//                 return;
//             }
//             console.log(arg);
//             resolve(arg + 1);
//         }, 300);
//     });
// };

// request(1)
//     .then((res1) => {
//         return request(res1, true);
//     })

//     .then((res2) =>{
//         console.log('666');
//         return request(res2);
//     }, (e) => {
//         console.log(e);
//     });