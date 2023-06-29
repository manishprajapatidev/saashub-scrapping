const puppeteer = require('puppeteer')
const fs = require('fs')
;(async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.goto('https://www.saashub.com/categories')

	const data = await page.evaluate(() => {
		const categories = []

		const categoryElements = Array.from(document.querySelectorAll('h4.title > a'))
		for (const categoryElement of categoryElements) {
			const category = {
				name: categoryElement.textContent.trim(),
				link: categoryElement.href.trim(),
				// subcategories: [],
			}

			// const tableRows = Array.from(categoryElement.parentElement.nextElementSibling.querySelectorAll('tbody tr'))

			// for (const row of tableRows) {
			// 	const subcategory = {
			// 		text: row.querySelector('td a').textContent.trim(),
			// 		link: row.querySelector('td a').href.trim(),
			// 	}
			// 	category.subcategories.push(subcategory)
			// }

			categories.push(category)
		}

		return categories
	})

	const jsonData = JSON.stringify(data, null, 2)
	fs.writeFileSync('data.json', jsonData, 'utf8')
	console.log('Data saved to data.json')

	await browser.close()
})()
