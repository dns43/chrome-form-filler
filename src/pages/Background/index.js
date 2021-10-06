console.log('This is the background page.');
console.log('Put the background scripts here.');

var words = ["Saab", "Volvo", "BMW"];

chrome.runtime.onMessage.addListener(data => {
    if (data.type === 'get_array') return Promise.resolve([1, 2, 3, 4]);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case 'get':
            console.log('get!');
            sendResponse(words)
            break;
        case 'set':
            console.log('set!');
            words = message.data
            break;
        default:
            alert('unknown api')
    }
});
