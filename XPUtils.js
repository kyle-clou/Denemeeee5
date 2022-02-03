const mongoose = require('mongoose')

class Utils {
constructor(client,url) {
    this.client = client
    this.url = url
}
async login() {
    if (!this.url) throw new TypeError("A database url was not provided.");
    mongoose.connect(this.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });    
}




}