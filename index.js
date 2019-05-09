const readline = require('readline-sync')
const robots ={
	text: require('./robots/text.js')
}

async function start(){
	const content = {}

	/** ---------------------------------------- 
	*  CONTENT PROPERTY DEFINITIONS
	* ------------------------------------------ **/

	//Atributing a new property to content that receive the search term asked to user
	content.searchTerm = askAndReturnSearchTerm()
	//Atributing a new property to content that receive the prefix to make a more human content, taking into account the language
	content.prefix = askAndReturnPrefix()
	//
	await robots.text(content)


	/** ---------------------------------------
	* INTERACTION FUNCTIONS WITH USER
	* -----------------------------------------**/

	function askAndReturnSearchTerm(){
		//return the deadline method who shows a defined string as question and capture the input response
		return readline.question("Type what you'll like to search: ")
	}

	function askAndReturnPrefix(){
		//array of options
		const prefixes = ['Who is', 'What is', 'The history of']
		//const that receives the return of deadline method who create a select with 'prefixes' array
		const selectedPrefixIndex = readline.keyInSelect(prefixes,'Choose one option: ')
		//const that receives the value of array position selected by user
		const selectedPrefixText = prefixes[selectedPrefixIndex]
		
		return selectedPrefixText
	}

	console.log(content)
}

start()