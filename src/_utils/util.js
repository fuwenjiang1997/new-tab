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

function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer))
}

function resolveUrl(href, baseUrl) {
  try {
    return new URL(href, baseUrl).href
  } catch {
    return null
  }
}

function parseIconSize(sizesAttr) {
  if (!sizesAttr) return 0
  if (sizesAttr === 'any') return 999
  const sizes = sizesAttr.split(/\s+/)
  let maxSize = 0
  for (const size of sizes) {
    const w = parseInt(size.split('x')[0])
    if (w > maxSize) maxSize = w
  }
  return maxSize
}

function getDefaultSize(rel) {
  if (/apple-touch-icon/i.test(rel)) return 180
  return 0
}

export async function getFavicon(url) {
  const { origin } = new URL(url)
  const candidates = []

  try {
    const response = await fetchWithTimeout(url)
    const text = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')

    const iconLinks = doc.querySelectorAll(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"], link[rel="mask-icon"]'
    )

    for (const link of iconLinks) {
      const href = resolveUrl(link.getAttribute('href'), url)
      if (!href) continue
      const rel = link.getAttribute('rel') || ''
      const size = parseIconSize(link.getAttribute('sizes')) || getDefaultSize(rel)
      candidates.push({ url: href, size })
    }

    const manifestLink = doc.querySelector('link[rel="manifest"]')
    if (manifestLink?.getAttribute('href')) {
      const manifestUrl = resolveUrl(manifestLink.getAttribute('href'), url)
      if (manifestUrl) {
        try {
          const manifestRes = await fetchWithTimeout(manifestUrl)
          if (manifestRes.ok) {
            const manifest = await manifestRes.json()
            if (manifest.icons?.length) {
              for (const icon of manifest.icons) {
                if (!icon.src) continue
                const iconUrl = resolveUrl(icon.src, manifestUrl)
                if (!iconUrl) continue
                const size = parseIconSize(icon.sizes)
                candidates.push({ url: iconUrl, size })
              }
            }
          }
        } catch {}
      }
    }
  } catch {}

  candidates.sort((a, b) => b.size - a.size)

  candidates.push({ url: `https://www.google.com/s2/favicons?domain=${origin}&sz=128`, size: -1 })
  candidates.push({ url: `${origin}/favicon.ico`, size: -2 })

  for (const candidate of candidates) {
    const base64 = await fetchImgToBase64(candidate.url)
    if (base64) return base64
  }

  return null
}

export async function fetchImgToBase64(link) {
  try {
    const res = await fetchWithTimeout(link)
    if (!res.ok) return null
    const blob = await res.blob()
    const base64data = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    return base64data
  } catch {
    return null
  }
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
