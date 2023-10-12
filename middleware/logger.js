// Desc: Middleware to log request information
// Params: req, res, next
// Return: none
const logger = (req, res, next) => {
    console.log(`req.method: ${req.method} req.protocol: ${req.protocol} req.hostname: ${req.hostname} req.originalUrl: ${req.originalUrl} req.url: ${req.url} req.ip: ${req.ip} req.params: ${req.params} req.query: ${req.query} req.body: ${req.body} req.headers: ${req.headers} req.cookies: ${req.cookies} req.get('headerName'): ${req.get('headerName')}`);
    next();
}

module.exports = logger;