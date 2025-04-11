import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
  // Set CORS headers
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })

  // Handle OPTIONS request for CORS preflight
  if (event.method === 'OPTIONS') {
    return 'OK'
  }

  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL is required'
    })
  }

  try {
    // Fetch the URL content with a timeout
    const response = await $fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KonceppBot/1.0; +http://koncepp.com)'
      },
      timeout: 10000 // 10 second timeout
    })

    // Load the HTML into Cheerio
    const $ = cheerio.load(response as string)

    // Extract information
    const title = $('title').text() || 'No title found'
    const description = $('meta[name="description"]').attr('content') || 'No description found'
    const h1 = $('h1').first().text() || 'No H1 found'
    
    // Count words in the body
    const bodyText = $('body').text()
    const wordCount = bodyText.trim().split(/\s+/).length

    // Get all links
    const links = $('a')
      .map((_, element) => ({
        text: $(element).text().trim(),
        href: $(element).attr('href')
      }))
      .get()
      .filter(link => link.href && !link.href.startsWith('#'))

    // Get meta tags
    const metaTags = $('meta')
      .map((_, element) => ({
        name: $(element).attr('name') || $(element).attr('property'),
        content: $(element).attr('content')
      }))
      .get()
      .filter(tag => tag.name && tag.content)

    // Get images
    const images = $('img')
      .map((_, element) => ({
        src: $(element).attr('src'),
        alt: $(element).attr('alt')
      }))
      .get()
      .filter(img => img.src)

    return {
      success: true,
      data: {
        url,
        title,
        description,
        h1,
        wordCount,
        linkCount: links.length,
        links: links.slice(0, 10), // Return first 10 links
        metaTags: metaTags.slice(0, 10), // Return first 10 meta tags
        imageCount: images.length,
        images: images.slice(0, 5), // Return first 5 images
        analyzedAt: new Date().toISOString()
      }
    }
  } catch (error: any) {
    console.error('Error analyzing URL:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Error analyzing URL. Please make sure the URL is accessible and try again.'
    })
  }
}) 