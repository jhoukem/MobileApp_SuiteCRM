var api_url = "<SUGAR_URL>/service/v2/rest.php";
var user_name = '<USERNAME>';    //SugarCRM username
var password = '<PASSWORD>';    //SugarCRM password

var params = {
    user_auth:{
        user_name:user_name,
        password:password,
        encryption:'PLAIN'
    },
    application: 'SugarCRM RestAPI Example'
};
var json = JSON.stringify(params);
$.ajax({
        url: api_url,
        type: "POST",
        data: { method: "login", input_type: "JSON", response_type: "JSON", rest_data: json },
        dataType: "json",
        success: function(result) {
             if(result.id) {
                    //HERE: you will have out put from rest
                alert("sucessfully LOGIN Your session ID is : " + result.id);
             }
             else
                 alert("Error");
              
        },
        error: function(result) {
           alert("Error");
        }
});
