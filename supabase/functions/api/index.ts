import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

Deno.serve(async (req) => {
  try {
    // Visit browserless.io to get your free API token
    const browserlessApiKey = Deno.env.get('BROWSERLESS_API_KEY');
    
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessApiKey}`,
    })
    const page = await browser.newPage()

    const url = new URL(req.url).searchParams.get('url') || 'http://www.rokasdam.com'

    await page.goto(url)
    const screenshot = await page.screenshot()

    return new Response(screenshot, {
      headers: { 'Content-Type': 'image/png' },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})