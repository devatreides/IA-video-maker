const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json')
const sentenceBoundaryDetection = require('sbd')

async function robot(content){
    //Capture wikipedia data
    await fetchContentFromWikipedia(content)
    //clear(sanitize) data
    sanitizeContent(content)
    //Create sentences
    breakContentIntoSentences(content)

    async function fetchContentFromWikipedia(content){
        //Generate key to authenticate in Algorithmia service
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey.paiKey)
        //Get the algorithm for wikipedia parsing
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/Wikipediaparser/0.1.2')
        //Execute the algorithm with user search term as parameter
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        //Get the result of algorithm
        const wikipediaContent = wikipediaResponse.get()
        //Save the result into content property 'sourceContentOriginal'
        content.sourceContentOriginal = wikipediaContent.content
    }

    function sanitizeContent(content){
        withoutBlankLinesAndMarkDown = removeBlankLinesAndMarkDown(content.sourceContentOriginal)
        withoutDataInParentheses = removeDateInParentheses(withoutBlankLinesAndMarkDown)

        content.sourceContentSanitized = withoutDataInParentheses

        function removeBlankLinesAndMarkDown(text){
            const allLines = text.split('\n')
            const withoutBlankLinesAndMarkDown = allLines.filter((line) => {
                if(line.trim().length === 0 || line.trim().startsWith('=')){
                    return  false
                }
                return true
            })

            return withoutBlankLinesAndMarkDown.join(' ')
        }

        function removeDateInParentheses(text){
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/ /g,' ')
        }
    }

    function breakContentIntoSentences(content){
        content.sentences = []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }

}

module.exports = robot