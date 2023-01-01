const Query = {
    hello: (parents, args, {req}) => {
        console.log("req = ", req);
        return 'Hello world!';
    },
}

module.exports = Query