const {mySqlQury} = require('../middleware/db');

let sendNotification = async (data) => {
  const general_settings_data = await mySqlQury(`SELECT * FROM tbl_general_settings`)
  
  let headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic " + general_settings_data[0].onesignal_api_key
  };
  
  let options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  let https = require('https');
  let req = https.request(options, function(res) {  
    res.on('data', function(data) {
      
    });
  });
  
  req.on('error', function(e) {
      
  });
  
  req.write(JSON.stringify(data));
  req.end();
};

module.exports = sendNotification 