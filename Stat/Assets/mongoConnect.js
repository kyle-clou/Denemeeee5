module.exports = (mongoose, cfg) => mongoose.connect(cfg.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false }).then(console.log("Mongoose bağlandı!\n"+ mongoose.connections[0]._connectionString)).catch(err => console.log(err.message));