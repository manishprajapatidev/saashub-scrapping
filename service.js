const puppeteer = require('puppeteer')
const fs = require('fs')
;(async () => {
	const files = fs.readdirSync('.')

	const jsonFiles = files.filter((file) => file.startsWith('best-') && file.endsWith('.json'))

	for (const file of jsonFiles) {
		const data = await fs.readFileSync(file, 'utf8')

		try {
			const jsonFiles = JSON.parse(data)
			for (const service of jsonFiles.services) {
				const browser = await puppeteer.launch({ headless: false })
				const page = await browser.newPage()
				console.log('service.link :>> ', service.link)
				await page.goto(service.link)

				const data = await page.evaluate(() => {
					const titleElements = document.querySelector('h2.title')
					const subtitleElements = document.querySelector('h3.subtitle')
					const textLinkElement = document.querySelector('.text-links')
					const ulList = document.querySelector('ul.separated-list-x')
					const text = textLinkElement.innerHTML
						.replace(/<[^>]*>/g, '') // Remove HTML tags
						.replace(/\n|\r/g, '') // Remove newlines and carriage returns
						.trim()
					const ulListUl = ulList.innerHTML
						.replace(/<[^>]*>/g, '') // Remove HTML tags
						.replace(/\n|\r/g, '') // Remove newlines and carriage returns
						.trim()
					// const text = textLinkElement.textContent.trim()

					const title = titleElements.textContent.trim()
					const subtitle = subtitleElements.textContent.trim()
					return { title, subtitle, text, ulListUl }
				})

				console.log('data :>> ', data)
				// const jsonData = JSON.stringify(data, null, 2)
				// fs.writeFileSync('shopify-alternatives.json', jsonData, 'utf8')
				// console.log('Data saved to shopify-alternatives.json')

				await browser.close()
			}
		} catch (err) {
			console.error(`Error parsing JSON in file ${file}:`, err)
		}
	}
})()
// ;(async () => {
// 	const browser = await puppeteer.launch({ headless: false })
// 	const page = await browser.newPage()
// 	await page.goto('https://www.saashub.com/shopify-alternatives')

// 	const data = await page.evaluate(() => {
// 		const titleElements = document.querySelector('h2.title')
// 		const subtitleElements = document.querySelector('h3.subtitle')
// 		const textLinkElement = document.querySelector('.text-links')
// 		const text = textLinkElement.innerHTML
// 			.replace(/<[^>]*>/g, '') // Remove HTML tags
// 			.replace(/\n|\r/g, '') // Remove newlines and carriage returns
// 			.trim()
// 		// const text = textLinkElement.textContent.trim()

// 		const title = titleElements.textContent.trim()
// 		const subtitle = subtitleElements.textContent.trim()
// 		return { title, subtitle, text }
// 	})

// 	const jsonData = JSON.stringify(data, null, 2)
// 	fs.writeFileSync('shopify-alternatives.json', jsonData, 'utf8')
// 	console.log('Data saved to shopify-alternatives.json')

// 	await browser.close()
// })()
