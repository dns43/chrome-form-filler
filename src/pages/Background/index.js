
function bglog(s) {
    console.log('[backgound]: ' + s)
}

bglog('This is the background page.');

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case 'placeholder1':
            bglog('placeholder1');
            break;
        case 'placeholder2':
            bglog('placeholder2');
            break;
        default:
            console.error('unknown API')
    }
});
