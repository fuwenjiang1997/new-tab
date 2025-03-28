export function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters[randomIndex]
  }

  return result
}


export function chromeNotification(notificationId, options = {}, callback) {
  if (typeof notificationId === 'object') {
    callback = options
    options = notificationId
    notificationId = generateRandomString(10)
  }
  options = {
    type: 'basic',
    iconUrl: "/logo.png",
    title: 'Notification title',
    message: 'Notification message',
    eventTime: Date.now(),
    ...options
  }
  chrome.notifications.create(
    notificationId,
    options,
    (id) => {
      if (chrome.runtime.lastError) {
        console.error('Notification creation failed:', chrome.runtime.lastError.message);
      } else {
        console.log('Notification created with ID:', id);
      }
      callback?.(id)
    }
  )
}