console.log('[backgound]: This is the background page.');

function bglog(s) {
    console.log('[backgound]: ' + s)
}

var words = ["Saab", "Volvo", "BMW"];

const user = {
    username: 'demo-user'
};


chrome.storage.sync.set({ key: words }, function () {
    console.log('Value is set to ' + words);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case 'qew':
            bglog('get!');
            bglog('words array is: ' + words);
            bglog('stringigied words are: ' + JSON.stringify(words));

            chrome.storage.sync.set({ key: words }, function () {
                console.log('Value is set to ' + words);
            });

            chrome.storage.local.get(["name"], ({ name }) => { sendResponse({ name }) });

            return true;
            break;
        case 'qwe':
            chrome.storage.local.set({ words });
            bglog('set!');
            words = message.data
            sendResponse(words)
            break;
        default:
            console.error('unknown API')
    }
});
