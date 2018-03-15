var fs = require("fs");
var content = fs.readFileSync("myTop50.json");
var jsonContent = JSON.parse(content);

let genres = {};
jsonContent.nodes = jsonContent.items.map(item => {
    let image = item.images[0];
    item.genres.forEach(genre =>{
        if(!genres[genre]){
            genres[genre] = [];
        }
        genres[genre].push(item.id);
    });
    return {
        "genres": item.genres,
        "img" : image ? image.url : "",
        "name": item.name,
        "id" : item.id,
        "url" : item.uri,
        "popularity" : item.popularity
    };
});

generateEdge = (artist1, artist2, genre) => ({"source": artist1,"target": artist2, "type": genre});

const edges = [];

Object.keys(genres).forEach(genre => {
    const artists = genres[genre];
    artists.forEach(artist => {
        for (artist2 of artists) {
            if (artist2 !== artist) {
                edges.push(generateEdge(artist, artist2, genre));
            }
        }
    });
});

jsonContent.edges = edges;

fs.writeFileSync('myTop50Real.json', JSON.stringify(jsonContent));
