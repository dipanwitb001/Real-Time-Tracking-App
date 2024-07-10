const socket =io();

//console.log("heyy")

//navigator is present in the browser, so we are checking if geolocation is available in the navigator or not
if(navigator.geolocation)
    {
    navigator.geolocation.watchPosition((position) =>{

        // storing the position coordinates int the const
        const{latitude, longitude} = position.coords;
        socket.emit("send-location",{latitude,longitude})
    },
    (error) => {
        console.error(error);
    },
    {
        enableHighAccuracy: true, 
        timeout:5000, //5000 miliseconds
        maximumAge:0
    }
);
}


// using the property of leaflet
const map=L.map("map").setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribut:"OpenStreetMap"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) =>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);

    // checking if the received id is present in the marker object ,then updating it latitude and longitude
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }

    // if the id is not present in the marker object, then add it to the list of markers
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected",(id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})