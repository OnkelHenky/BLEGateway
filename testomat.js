(function loop(i) {
    const promise = new Promise((resolve, reject) => {
        const timeout = Math.random() * 600;
        setTimeout( () => {
            console.log(i);
            resolve(); // resolve it!
        }, timeout);
    }).then( () => i >= 10 || loop(i+1) );
})(0);

