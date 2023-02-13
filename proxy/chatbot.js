let Client = require('node-rest-client').Client;

let client = new Client();

exports.getResponse = async (userId, msg) => {
  return new Promise((resolve, reject) => {
    let args = {
      requestConfig: {
		      timeout: 60000
      },
      headers:{"Content-Type":"application/json"},
      data: {userId: userId, content: msg},
      responseConfig: {
        timeout: 60000
      }
    }
    let req = client.post("https://12po0mz2pe.execute-api.us-west-2.amazonaws.com/default/OpenaiProxyTest", args, (data, response) => {
      console.log("thisisdata: ", data);
      resolve(data);
    });
    req.on('error', (err)=> {
      console.log("error");
      reject(err);
    });
  })
}
