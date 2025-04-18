import { useIndexedDB } from '@/_hooks/useIndexDb'
import { DBNAME_SCRIPTS } from '@/_utils/const'

let _scripts = []
const [ _, _2, getScripts ] = useIndexedDB(DBNAME_SCRIPTS, [])
async function _getScripts() {
  _scripts = await getScripts()
}

chrome.runtime.onMessage.addListener(async(request, sender, sendResponse) => {
  const { action, location } = request
  if (action === 'executeScript') {
    if (Array.isArray(_scripts)) {
      sendResponse(JSON.stringify(_scripts))
    } 
  }
})

_getScripts()
setInterval(async () => {
  _getScripts()
}, 5000)