# Retrieve Exp table

Code for retrieving exp table for [here](http://wikiwiki.jp/kancolle/?%B7%D0%B8%B3%C3%CD)

```javascript

var process = outputArr => function() {
    const jq = $("td", this)
    const [a,b,c] = [0,1,2].map(ind => jq.get(ind))
    const getInt = a => Number($(a).text().replace(/\,/g,''))
    const ret = [getInt(a),getInt(b),getInt(c)]
    outputArr.push(ret)
}


$("td > div.ie5").each((_i,x) => {
    const jq = $(x)
    let found = false
    $("table > thead > tr td", jq).each((_i1, y) => {
        if ($(y).text() === 'LV') {
            found = true
        }
    })
    if (found) {
        var expTable = []
        $("tbody tr", jq).each( process(expTable) )
        console.log(JSON.stringify(expTable))
    }
})

```
