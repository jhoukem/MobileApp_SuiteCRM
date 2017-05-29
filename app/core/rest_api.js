const DEBUG = false;

export var restCall = function(method, parameters, url, functionOnSuccess, functionOnFailure){

   var arg = 'method='+ method +'&input_type=JSON&response_type=JSON&rest_data=';

   var dataToSend = {  
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: arg.concat(JSON.stringify(parameters)),
    }

    if(DEBUG){
        console.log("URL="+ url);
        console.log("Data to send: ");
        console.log(dataToSend);
    }

    // For production you may want to remove 'SuiteCRM' from the path.
    // Here it is set because I use a Wampserver and you can have multiple website with wamp
    // so you have to specify the folder.
    fetch('http://'+ url +'/SuiteCRM/service/v3_1/rest.php', dataToSend)  
    .then((response) => response.json())
    .then((responseData) => {
        if(functionOnSuccess){
            functionOnSuccess(responseData);
        }
        if(DEBUG){
            console.log(responseData);
        }
    })
    .catch((error) => {
        if(functionOnFailure){
            functionOnFailure(error);
        }
        console.log("Fetch error: " + error);
    });
} 