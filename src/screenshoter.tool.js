const inject = require('./middleware/injectionengine');
const p = 'bl';
const test = 'yes';
const m = '*';
const formFactor = '1366x768';
(async function main() {
	inject(p,m,test,formFactor);
})();