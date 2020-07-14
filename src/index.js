const quote_list = document.querySelector("#quote-list")
const quote_form = document.querySelector("#new-quote-form")
const sort_btn = document.querySelector("#sort")

load_quotes()
function load_quotes(){
    
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(res => {
        quote_list.innerHTML = ""
        res.forEach(quote => add_quote(quote))
    })
}


function load_quotes_sorted(){
    
    fetch("http://localhost:3000/quotes?_sort=author&_embed=likes")
    .then(res => res.json())
    .then(res => {
        quote_list.innerHTML = ""
        res.forEach(quote => add_quote(quote))
    })
}


function add_quote(quote){
    const li = document.createElement("li")
    li.className = "quote-card"
    const blockquote = document.createElement("blockquote")
    blockquote.className = "blockquote"
    const p = document.createElement("p")
    p.innerText = quote.quote
    p.className = "mb-0"
    const footer = document.createElement("footer")
    footer.innerText = quote.author
    footer.className = "blockquote-footer"
    const br = document.createElement("br")
    const btn_like = document.createElement("botton")
    btn_like.className = "btn-success"
    btn_like.innerHTML = `Likes: <span>${quote.likes.length}</span>`

    btn_like.addEventListener("click", function(){
        let configObj = {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quoteId: parseInt(quote.id, 10),
                createdAt: Date.now()
            })
            
        }
        fetch("http://localhost:3000/likes", configObj)
        .then(res => res.json())
        .then(load_quotes())

    })

    const btn_delete = document.createElement("botton")
    btn_delete.className = "btn-danger"
    btn_delete.innerHTML = "Delete"
    btn_delete.addEventListener("click", function(){

        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "DELETE"
        }).then(li.remove())
    })
    li.append(blockquote, p, footer, br, btn_like, btn_delete)
    quote_list.append(li)    

}



quote_form.addEventListener("submit", function(){
    event.preventDefault()
    const quote = quote_form[0].value
    const author = quote_form[1].value
    if (quote != "" && author != ""){
        let configObj = {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            quote,
            author,
            likes: []
            })
        }
        fetch("http://localhost:3000/quotes", configObj)
        .then(res => res.json())
        .then(quote => add_quote(quote))
        quote_form.reset()
    }
})

sort_btn.addEventListener("click", function(){

    if (sort_btn.innerText == "Sort"){
        load_quotes_sorted()
        sort_btn.innerText = "Revert"
    } else {
        load_quotes()
        sort_btn.innerText = "Sort"
    }

})