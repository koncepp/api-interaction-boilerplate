import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL is required'
    })
  }

  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    // Get basic information
    const title = $('title').text()
    const description = $('meta[name="description"]').attr('content') || 'No description found'

    // Count links
    const links = $('a')
    const totalLinks = links.length
    const internalLinks = links.filter((_, el) => {
      const href = $(el).attr('href')
      return href ? (href.startsWith('/') || href.startsWith(url)) : false
    }).length
    const externalLinks = totalLinks - internalLinks

    // Count meta tags
    const metaTags = $('meta').length

    // Extract email addresses from both text and mailto links
    // Improved regex to handle more email formats and common separators
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?/g

    // Get emails from text content
    const textContent = $('body').text()
    const textEmails = textContent.match(emailRegex) || []

    // Get emails from mailto links
    const mailtoEmails = $('a[href^="mailto:"]')
      .map((_, el) => {
        const href = $(el).attr('href')
        return href ? href.replace('mailto:', '') : null
      })
      .get()
      .filter(email => email && email.match(emailRegex))

    // Get emails from href attributes that might contain email addresses
    const hrefEmails = $('a[href*="@"]')
      .map((_, el) => {
        const href = $(el).attr('href')
        const matches = href?.match(emailRegex)
        return matches ? matches[0] : null
      })
      .get()
      .filter(email => email)

    // Combine and deduplicate emails
    const allEmails = [...new Set([...textEmails, ...mailtoEmails, ...hrefEmails])]

    return {
      title,
      description,
      totalLinks,
      internalLinks,
      externalLinks,
      metaTags,
      emails: allEmails
    }
  } catch (error) {
    console.error('Error analyzing URL:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to analyze URL'
    })
  }
})
