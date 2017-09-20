onmessage = function (e) {
    console.log('Webworker - Message received');
    postMessage(e);
}