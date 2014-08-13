Utils = 
  getUrlParameter: (variable) ->
    query = window.location.search.substring(1)
    vars = query.split("&")
    i = 0

    while i < vars.length
      pair = vars[i].split("=")
      return pair[1]  if pair[0] is variable
      i++
    false

module.exports = Utils