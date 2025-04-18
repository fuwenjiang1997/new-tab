export default {
  manifest_version: 3,
  version: '1.0.0',
  'name': 'New Tab',
  'description': 'Chrome New Tab',
  'action': {
    'default_popup': 'src/popup/index.html'
  },
  'background': {
    'service_worker': 'src/background/index.js'
  },
  'chrome_url_overrides': {
    'newtab': 'src/overrides/index.html'
  },
  'icons': {
    16: 'src/assets/logo.png',
    24: 'src/assets/logo.png',
    32: 'src/assets/logo.png',
    128: 'src/assets/logo.png',
  },
  'permissions': [
    'activeTab', 
    'scripting', 
    'storage',   
    'tabs',      
    'webRequest', 
    'notifications',
    'alarms'
  ],
  web_accessible_resources: [
    {
      resources: ['src/contentScript/index.js'],
      matches: ['<all_urls>']
    }
  ],
  // content_security_policy: {
  //   "extension_pages": "script-src 'self'; object-src 'self'"
  // },  
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/contentScript/index.js'],
      run_at: 'document_end',
      all_frames: true
    }
  ],
  offline_enabled: true,
  host_permissions: ['<all_urls>'],
}