const http = require("http");
const client = require("./caching/caching.js");
const mysql = require("mysql2");
const select = require("./database/dbutil.js");
console.log(select)
const url = require('url');
async function cache(key, data) {
  await client.set(key, data);
}

const apicall = (options, response) => {
  return new Promise((resolve, reject) => {
    let responseData = "";
    console.log("api");
    const serverRequest = http.request(options, (serverResponse) => {
      serverResponse.on("data", (chunk) => {
        responseData += chunk;
      });

      serverResponse.on("end", () => {
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
    console.log(request.url)
   if(request.url=="/weather"){
  const key = "0f42cebbff18ee23ec06ce0624a0bff9";
  const city = "mumbai";
  const options = {
    host: "api.openweathermap.org",
    path: `/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&APPID=${encodeURIComponent(key)}`,
    port: 80,
    method: "get",
  };
  response.writeHead(200);
  const get_data = await client.get("new");

  if (!get_data) {
    let data = await apicall(options, response);
    console.log(data);
    data = await client.set("new", data);
  } else {
   
    response.write(get_data)
    response.end();
  }
}else if (request.url.startsWith('/student/')) {
  const parsedUrl = new url.URL(`http://localhost${request.url}`);
  const dynamicPath = parsedUrl.pathname.slice('/student/'.length);
  console.log('Dynamic path:', dynamicPath);
  data = await client.get(dynamicPath);

  if(!data){
   select(dynamicPath,response);

  }else{
     console.log("no query")
    response.write(data)
    response.end()


  }

  
   
}
}
const server = http.createServer(requestListener);
server.listen(3000, "localhost", () => {
  console.log(`Server is running `);
})
