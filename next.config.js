/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

module.exports = {  
  api: {
    externalResolver: true,
  },
};

module.exports={
  env:{
    // "BASE_URL": "http://chakri.deltin.club",
    "BASE_URL": "http://localhost:9223",
    "MONGODB_URL":"mongodb+srv://aditya4sure:NewPassword@casino.0r9lzep.mongodb.net/?retryWrites=true&w=majority",
    "ACCESS_TOKEN_SECRET":"erufgyuvbsyudfybvisukfbvu6e6j5rte7ghi4eih76wiyrw7y7ihye7hg4yieyni7ynegynrie47g",
    "REFRESH_TOKEN_SECRET":"fby54uh54uhto4euiot5hh7th47t5h54yt74ith54th74fjkbhjdfkhkjdbvgdhdbdfhkbj"
  }
}