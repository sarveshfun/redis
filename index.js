const http = require("http");
const client = require("./caching/caching.js");
const mysql = require("mysql2");
const select = require("./database/dbutil.js");
//const {client_2} = require("./database/mongo.js")
//console.log(select)
const fs = require("fs")
const url = require('url');
const { get } = require("https");
async function cache(key, data) {
  await client.set(key, data);
}

let date = new Date().toUTCString().slice(5, 16);


const apicall = (options, response) => {
  return new Promise((resolve, reject) => {
    let responseData = "";
    const serverRequest = http.request(options, (serverResponse) => {
      serverResponse.on("data", (chunk) => {
        responseData += chunk;
      });

      serverResponse.on("end", () => {
        console.log(responseData)
        resolve(responseData);
      });


      serverResponse.pipe(response);
    });

    serverRequest.on("error", (err) => {
      console.log(err.message);
    });

    serverRequest.end();
  });
};

const requestListener = async (request, response) => {

  let date = new Date().toUTCString().slice(5, 16);

    console.log(request.url)
    try{
   if(request.url=="/weather"){
  const key = "0f42cebbff18ee23ec06ce0624a0bff9";
  const city = "mumbai";
  const options = {
    host: "api.openweathermap.org",
    path: `/data/2.5/weather?units=metric&q=${encodeURIComponent(
      city
    )}&APPID=${encodeURIComponent(key)}`,
    port: 80,
    method: "get",
  };

  response.writeHead(200);
  const get_data = await client.get(`${10}`);
  console.log(get_data)
  const  app =   JSON.parse(get_data);

  if(get_data){
   fs.writeFile("./note.txt",get_data,(err)=>{
         if(err){
          console.log(err)
         }else{
          response.write(get_data)
          response.end()
              console.log("succesfuly")
         }

   })
  }
  if (!get_data) {
     console.log("call from api")
    let data = await apicall(options, response);
    data = await client.set(`${10}`, JSON.stringify(data));
    response.end();

}else if (request.url.startsWith('/student/')) {
  const parsedUrl = new url.URL(`http://localhost${request.url}`);
  const dynamicPath = parsedUrl.pathname.slice('/student/'.length);
  data = await client.get(dynamicPath);
   console.log("call from student")
  if(!data){
   select(dynamicPath,response);
  }else{
    response.write(data)
    response.end()
  }
}
}}catch(e){
   console.log(e.message)
}      
}




const server = http.createServer(requestListener);
server.listen(3000, "localhost", () => {
  console.log(`Server is running `);
})
