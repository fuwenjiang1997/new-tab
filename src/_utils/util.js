import dayjs from 'dayjs'

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
    iconUrl: '/logo.png',
    title: 'Notification title',
    message: 'Notification message',
    eventTime: Date.now(),
    ...options,
  }
  chrome.notifications.create(notificationId, options, (id) => {
    if (chrome.runtime.lastError) {
      console.error(
        'Notification creation failed:',
        chrome.runtime.lastError.message
      )
    } else {
      console.log('Notification created with ID:', id)
    }
    callback?.(id)
  })
}

export async function getFavicon(url) {
  try {
    const response = await fetch(url)
    const text = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')

    const faviconLinkEl =
      doc.querySelector('link[rel="icon"]') ||
      doc.querySelector('link[rel="shortcut icon"]')

    let faviconLink
    if (faviconLinkEl) {
      faviconLink = faviconLinkEl.href
    } else {
      const { origin } = new URL(url)
      faviconLink = `${origin}/favicon.ico`
    }

    return fetchImgToBase64(faviconLink)
  } catch (error) {
    console.error('Error fetching the favicon:', error)
    return null
  }
}

export async function fetchImgToBase64(link) {
  const res = await fetch(link)
  if (res.ok) {
    return new Promise(async (resolve) => {
      const blob = await res.blob()
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result
        resolve(base64data)
      }
      reader.readAsDataURL(blob)
    })
  }
  return null
}

export function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export function getTodayDayjs(hms) {
  const _nowDay = dayjs().format('YYYY-MM-DD')
  return dayjs(`${_nowDay} ${hms}`)
}