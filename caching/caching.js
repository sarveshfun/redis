const redis = require("redis");
let redisPort = 6379;  
let redisHost = "127.0.0.1";  
const client = redis.createClient({
    socket: {
      port: redisPort,
      host: redisHost,
    }
  });

(async () => {
    // Connect to redis server
    await client.connect();
})();


console.log("Attempting to connect to redis");
client.on('connect', () => {
    console.log('Connected!');
});

// Log any error that may occur to the console
client.on("error", (err) => {
    console.log(`Error:${err}`);
});




// Close the connection when there is an interrupt sent from keyboard
process.on('SIGINT', () => {
    client.quit();
    console.log('redis client quit');
});

process.on("error",()=>{
console.log("errro")})

module.exports=client