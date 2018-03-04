var states = {
    "off" : "garbage text",
    "pomodoro" : "grabage text"
}

var currentState = "off";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === "startTimer" && currentState === "off") {
        startTimer();
        sendResponse({message: "Timer Started"});
    }
});

function startTimer() {
    var start = moment();
    var timer = setInterval(function() {
        var diff = moment().diff(start, 'seconds');
        updateTime(diff);
        var length = localStorage["pomodoro-selection"] || 10;
        if (diff > length) {
            clearInterval(timer);
            notifyUser();
        }
    }, 1000);
    currentState = "pomodoro";
}

function updateTime(diff) {
    chrome.runtime.sendMessage({"command": "updateTime", "time": diff}, function(response) {
        console.log(response.message);
    });
}

function notifyUser() {
    var opts = {
        "type" : "basic",
        "title" : "Break Time!",
        "message": "Time for a break!", 
        "iconUrl": "icon.png"
    };
    var idBase = "pomodoro"; 
    id = idBase + (new Date()).getTime();
    chrome.notifications.create(id, opts, function() {
        console.log("notification created");
    })

}

