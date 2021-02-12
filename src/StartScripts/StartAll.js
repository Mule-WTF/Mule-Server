try {
  require('../Services/Discord/index.js');
} catch(ex) {
  console.log('FAIL: Discord did not start')
  console.log(ex)
}
try {
 // require('../Services/Telegram/index.js')
} catch(ex) {
  console.log('FAIL: Telegram did not start');
  console.log(ex)
}
require('../Services/Api/index.js');
require('../Services/FactoryMonitor/index.js');
