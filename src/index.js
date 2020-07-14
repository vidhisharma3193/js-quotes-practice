document.addEventListener("DOMContentLoaded", function() {

    function qs(selector){
        return document.querySelector(selector)
    }
    function ce(element){
        return document.createElement(element)
    }
    const list = qs("#quote-list")
    const form = qs("#new-quote-form")

    list.innerHTML = ""
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(quotes => quotes.forEach(quote => addQuote(quote)))

    function addQuote(quote){
        const li = ce("li")
        li.className = "quote-card"
        
        const blockquote = ce("blockquote")
        blockquote.className = "blockquote"
    
        const p = ce("p")
        p.className = "mb-0"
        p.innerText = quote.quote
    
        const footer = ce("footer")
        footer.className = "blockquote-footer"
        footer.innerText = quote.author
    
        const br = ce('br')
    
        const likeBtn = ce("button")
        likeBtn.className = "btn-success"
        likeBtn.innerText = "Likes: "
        likeBtn.addEventListener("click", () => {
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
    
        const span = ce("span")
        if(quote.likes){
            span.innerText = quote.likes.length
        }else{
            span.innerText = 0
        }
        likeBtn.append(span)

        const deleteBtn = ce("button")
        deleteBtn.className = "btn-danger"
        deleteBtn.innerText = "Delete"
        deleteBtn.addEventListener("click", () => {
            fetch(`http://localhost:3000/quotes/${quote.id}`,{
                method: "DELETE"
            })
            .then(() => li.remove())
        })

        blockquote.append(p, footer, br, likeBtn, deleteBtn)
        li.append(blockquote)
        list.append(li)
    }

    form.addEventListener("submit", () => {
        event.preventDefault()
        fetch("http://localhost:3000/quotes",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "quote": event.target[0].value,
                "author": event.target[1].value
            })
        })
        .then(res => res.json())
        .then(newQuote => {
            addQuote(newQuote)
            form.reset()
        })
    })
})