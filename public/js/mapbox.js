/* eslint-disable */
const locations= JSON.parse(document.getElementById('map').dataset.locations)
console.log(locations)

mapboxgl.accessToken =
'pk.eyJ1Ijoiam9uYXNzY2htZWR0bWFubiIsImEiOiJjam54ZmM5N3gwNjAzM3dtZDNxYTVlMnd2In0.ytpI7V7w7cyT1Kq5rT9Z1A';

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/jonasschmedtmann/cjvi9q8jd04mi1cpgmg7ev3dy',
scrollZoom: false
// center: [-118.113491, 34.111745],
// zoom: 10,
// interactive: false
});