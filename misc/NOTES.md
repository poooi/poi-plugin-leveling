# Retrieve Exp table

Code for retrieving exp table for [here](http://wikiwiki.jp/kancolle/?%B7%D0%B8%B3%C3%CD)

```javascript

  const process = outputArr => function() {
    const jq = $("td", this)
    const [a,b,c] = [0,1,2].map( ind => jq.get(ind) )
    const getInt = a => parseInt($(a).text().replace(/\,/g,''),10)
    outputArr.push([getInt(a),getInt(b),getInt(c)])
  }

  const expTable1 = []
  const expTable2 = []

  $("#rgn_content2 div.ie5 tbody tr")
    .each( process(expTable1) )

  $("#rgn_content3 div.ie5 tbody tr")
    .each( process(expTable2) )

  console.log( JSON.stringify(expTable1) )
  console.log( JSON.stringify(expTable2) )

```
