console.log('This is the background page.');
console.log('Put the background scripts here.');

var word = "asd";


function asd() {
    console.log('asd')
}

chrome.runtime.onMessage.addListener(data => {
    if (data.type === 'get_array') return Promise.resolve([1, 2, 3, 4]);
});


chrome.runtime.onMessage.addListener(receiver);

function receiver(request, sender, sendResponse) {
    console.log(request)
    window.word = request.text;

}