const puppeteer = require('puppeteer')
const fs = require('fs')
;(async () => {
	const files = fs.readdirSync('.')

	const jsonFiles = files.filter((file) => file.startsWith('best-') && file.endsWith('.json'))
	const finalRecord = []
	for (const file of jsonFiles) {
		 
		const data = await fs.readFileSync(file, 'utf8')
		const categoryName = file.replace(/^best-|\.json$/g, '')
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (match) => match.toUpperCase())
		try {
			const jsonFile = JSON.parse(data)
			
			for (const service of jsonFile.services) {
				const browser = await puppeteer.launch({ headless: 'new' })
				const page = await browser.newPage()
				// console.log('service.link :>> ', service.link)
				await page.goto(service.link)

				let data = await page.evaluate(() => {
					const titleElements = document.querySelector('h2.title')
					const subtitleElements = document.querySelector('h3.subtitle')
					const textLinkElement = document.querySelector('.text-links') ?? document.querySelector('.markdown-content')
					const ulList = document.querySelector('a.btn.btn--hero.btn--success.track-event.is-success')
					let text = ''
					if (textLinkElement) {
						text = textLinkElement.innerHTML
							.replace(/<[^>]*>/g, '') // Remove HTML tags
							.replace(/\n|\r/g, '') // Remove newlines and carriage returns
							.trim()
					}

					const title = titleElements.textContent.trim().replace(/✓\n/g, '')
					const subtitle = subtitleElements.textContent.trim()
					let url = new URL(ulList.href)
					
					return { title, subtitle, text, website: url.protocol + '//' + url.hostname }
				})
				await browser.close()
				// console.log('jsonFile', jsonFile)
				data.categoryName = jsonFile.categoryName;
				// console.log('data :>> ', data)
				finalRecord.push(data)
				
			}

			const jsonData = JSON.stringify(finalRecord, null, 2)
			fs.writeFileSync('shopify-alternatives.json', jsonData, 'utf8')
			console.log('Data saved to shopify-alternatives.json')
		} catch (err) {
			console.error(`Error parsing JSON in file ${file}:`, err)
		}
	}

	const jsonData = JSON.stringify(finalRecord, null, 2)
	fs.writeFileSync('all-services.json', jsonData, 'utf8')
	console.log('Data saved to all-services.json')
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
