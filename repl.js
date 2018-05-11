var repl = require('repl'),
    local = repl.start("curanexus> "),
    curaNEXUSSDK = require('./');

local.context.curaNEXUS = new curaNEXUSSDK( JSON.parse(process.argv[2]) );
local.context.logger = function (e, r) {
    console.log('err: ', e);
    console.log('res: ', r);
};

local.context.curaNEXUS.on('error', function(e) {
	console.log('err: ', e);
});
