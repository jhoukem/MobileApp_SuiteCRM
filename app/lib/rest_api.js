const DEBUG = false;

export var restCall = function(method, parameters, url, functionOnSuccess, functionOnFailure){

   var arg = 'method='+ method +'&input_type=JSON&response_type=JSON&rest_data=';

   var dataToSend = {  
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: arg.concat(parameters),
    }

    if(DEBUG){
        console.log("URL="+ url);
        console.log("Data to send: ");
        console.log(dataToSend);
    }

    fetch('http://'+ url +'/SuiteCRM/service/v3_1/rest.php', dataToSend)  
    .then((response) => response.json())
    .then((responseData) => {
        functionOnSuccess(responseData);
        if(DEBUG){
            console.log(responseData);
        }
    })
    .catch((error) => {
        functionOnFailure(error);
        if(DEBUG){
            console.log(error);
        }
    });
} 