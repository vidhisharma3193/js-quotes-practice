document.addEventListener("DOMContentLoaded", () => {
    function qs(selector){
        return document.querySelector(selector)
    }
    
    function ce(element){
        return document.createElement(element)
    }

    const ul = qs("#quote-list")
    const form = qs("#new-quote-form")

    const sortBtn = ce("button")
    sortBtn.className = "btn-primary"
    document.body.children[1].prepend(sortBtn)

    function getQuotes(){
        ul.innerHTML = ""
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(res => res.json())
        .then(quotes => {
            showQuotes(quotes)
            sortBtn.innerText = "Sort by Author Name"
            // what this sortBtn.dataset.sort doing?
            // why is the sortbyid not returning resorted list
            //ortBtn.dataset.sort = "authors"
        })
    }
    
    function showQuotes(quotes){
        quotes.forEach(quote => {
            addQuote(quote)
        })
    }
    
    function addQuote(quote){

        const li = document.createElement("li")
        li.className =  "quote-card"

        const bq = ce("blockquote")
        bq.className = "blockquote"

        const q = ce("p")
        q.className = "mb-0"
        q.innerText = quote.quote
        
        const a = ce("footer")
        a.className = "blockquote-footer"
        a.innerText = quote.author

        const btnlike = ce("button")
        btnlike.className = "btn-success"
        btnlike.innerText = "Likes: 0"

        const span = document.createElement("span")
        if(quote.likes){
            span.innerText = quote.likes.length
        }else{
            span.innerText = 0
        }
        btnlike.addEventListener("click", ()=> { 
            fetch("http://localhost:3000/likes",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "quoteId": quote.id,
                    "createdAt": Date.now()
                })
            })
            .then(() => {
                let likes = parseInt(span.innerText)
                span.innerText = ++likes
            })
        })

        btnlike.append(span)

        const btndelete = ce("button")
        btndelete.className = "btn-danger"
        btndelete.innerText = "Delete"
        btndelete.addEventListener("click", () => {

            fetch("http://localhost:3000/quotes/" + quote.id, {
                method: "DELETE"
            })
            .then(() => li.remove())
        })

        bq.append(q, a, btnlike, btndelete)
        li.append(bq)
        ul.append(li)
    }

    getQuotes()

    form.addEventListener("submit", function(){
        event.preventDefault()
        const quote = qs("input#new-quote").value
        const author = qs("input#author").value

        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quote: quote,
                author: author
            })
        }

        fetch("http://localhost:3000/quotes", configObj)
        .then(res => res.json())
        .then(newQuote => {
            //newQuote.likes = []
            addQuote(newQuote)
            form.reset()
        })
    })
    
    sortBtn.addEventListener("click", () => {
        // event.preventDefault()
        if(sortBtn.innerText == "Sort by Author Name"){
            sortAuthor()
        }else{
            getQuotes()
        }
    })
    
    function sortAuthor(){
        ul.innerHTML = ""
    
        fetch("http://localhost:3000/quotes?_embed=likes&&_sort=author")
        .then(res => res.json())
        .then(quotes => {
            quotes.forEach(quote => addQuote(quote))
            sortBtn.innerText = "Sort by QuoteIDs"
            //sortBtn.dataset.sort = "ids"
        })
    }

})
