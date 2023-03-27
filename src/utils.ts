export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export const getPlatform = (): string => {
  if (navigator.userAgentData) {
    return navigator.userAgentData.platform
  } else {
    const ua = navigator.userAgent
    if (ua.includes('Macintosh')) {
      return 'macOS'
    } else {
      return 'theOtherOS'
    }
  }
}

type Brand = {
  'brand': string
  'versoin': string
}

export const getBrowser = (): string => {
  if (navigator.userAgentData) {
    const brands: Brand[] = navigator.userAgentData.brands
    if (brands.find((b: Brand) => b.brand.includes('Chrome'))) {
      return 'Chrome'
    } else {
      return 'theOtherBrowser'
    }
  } else {
    const ua = navigator.userAgent
    if (ua.includes('Chrome')) {
      return 'Chrome'
    } else if (ua.includes('Safari')) {
      return 'Safari'
    } else if (ua.includes('Firefox')) {
      return 'Firefox'
    } else {
      return 'theOtherBrowser'
    }
  }
}
