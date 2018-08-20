var axios = require("axios");
var cheerio = require("cheerio");

var scrape = function() {
    return axios.get("http://www.nhl.com").then(function(res) {
        var $ = cheerio.load(res.data);
        var articles = [];
        $(".description").each(function(i, element) {

            var head = $(this)
                .children(".storyTitle")
                .text()
                .trim();

            var sum = $(this)
                .children(".summary")
                .text()
                .trim();

            var url = $(this)
                .children(".storyTitle")
                .children("a")
                .attr("href");

            

        if (head && sum && url) {

            var headCap = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
            var sumCap = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

            var dataResult = {
                headline: headCap,
                summary: sumCap,
                url: url
            };

            articles.push(dataResults);
        }
        });
        return articles;
    });
};