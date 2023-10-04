const puppeteer = require('puppeteer')
const fs = require('fs')

;(async () => {
	const browser = await puppeteer.launch({ headless: 'new' })

	try {
		const rawData = fs.readFileSync('data.json')
		const data = JSON.parse(rawData)

		for (const item of data) {
			const page = await browser.newPage()
			const pathName = item.link.split('/').pop()

			await page.goto(item.link)

			const textUrls = await page.evaluate(async () => {
				const UrlArray = []

				while (true) {
					const currentScrollHeight = document.documentElement.scrollTop
					window.scrollBy(0, window.innerHeight)

					await new Promise((resolve) => setTimeout(resolve, 1000))

					const newScrollHeight = document.documentElement.scrollTop
					if (newScrollHeight === currentScrollHeight) {
						const loadMoreButton = document.getElementById('load_more_services_btn')
						if (loadMoreButton) {
							loadMoreButton.click()
							await new Promise((resolve) => setTimeout(resolve, 1000))
						} else {
							break
						}
					}
				}

				const categoryName = document.querySelector('h1.level-y').textContent.trim() ?? ''
				const anchorlements = document.querySelectorAll('ol.services-list li h3.title a')

				for (let i = 0; i < anchorlements.length; i++) {
					const text = anchorlements[i].textContent.trim().replace(/✓\n/g, '')
					const link = anchorlements[i].href.trim()
					UrlArray.push({ text, link })
				}

				return { categoryName, services: UrlArray }
			})

			const jsonData = JSON.stringify(textUrls, null, 2)
			fs.writeFileSync(`${pathName}.json`, jsonData, 'utf8')
			console.log(`Data saved to ${pathName}.json`)

			await page.close()
			console.log('item closed :>> ', item.name)
		}
	} catch (error) {
		console.error('Error reading or parsing the JSON file:', error)
	}

	await browser.close()
})()
