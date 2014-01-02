$( document ).ready(function() {
	var searchField = getURLParameter('query');
	if (searchField===null) {
		//console.log("Is null");
	}
	else {
		var client = $.es.Client({
			hosts: ['http://localhost:9200']
		});
		client.search(getQueryTbl(searchField), processResponse);
	};
});
function getQueryTbl(searchField){
	return {
		index: 'mydocs',
		body: {
			query: {
				match: {
					_all: searchField
				}
			},
			facets: {
				tags: {
					terms: {
						field: 'tags'
					}
				}
			},
		highlight: {
			pre_tags: '<b>',
			post_tags: '</b>',
			fields: {
				_all: {}
				//message: {number_of_fragments: 20}
			}
		} 
		} 
	}
}
function processResponse(error, response){
	if (error === null){
		$( "div.results-container" ).html("Unexpected error");
		//console.log(error);
	}
	var nbResults = response['hits']['total'];
	if (nbResults>0) {
		var strHtmlOut = getHtmlResponseInfos(response);
		strHtmlOut += parseResults(response['hits']['hits'],nbResults);
		$( "div.results-container" ).html(strHtmlOut);
	}
}
function getHtmlResponseInfos(response){
	var strHtmlOut = "<div class=\"result-infos\">";
	strHtmlOut += "<a>took: "+response['took']+"ms</a>";
	strHtmlOut += "<a>Nbr of results: "+response['hits']['total']+"</a>"
	strHtmlOut += "</div>";
	return strHtmlOut;
}
function parseResults(objHits, nbResults){
	var strHtmlOut = "";
	for (index = 0; index < nbResults; ++index) {
		strHtmlOut += parseResult(objHits[index]);
	}
	return strHtmlOut;
}
function parseResult(objHit){
	var strHtmlOut = "<div class=\"result-container\">";
	if (objHit['_type']=='doc'){
		strHtmlOut += parseDoc(objHit);
	}else if (objHit['_type']=='tweet'){
		strHtmlOut += parseTweet(objHit);
	}
	strHtmlOut += "</div>";
	return strHtmlOut;
}
function parseTweet(objHit){

}
function parseDoc(objHit){
	var strHtmlOut = "";
	strHtmlOut += "<h3>"+objHit['_source']['file']['filename']+"</h3>";
	strHtmlOut += "<h3>"+objHit['_source']['meta']['title']+"</h3>";
	strHtmlOut += "<p>"+objHit['_source']['content']+"</p>";
	return strHtmlOut;
}
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}