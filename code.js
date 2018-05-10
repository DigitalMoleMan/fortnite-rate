// Ctx? What does all of this mean hello???  explain this isnt english.english
// henlo?.
// ok that's it.english
// we lost.english

// Im actually going to write an entire novel in here so brace yourselves.english
/* 
Ok so here we go.english
One day and whatever.
A man came over to the building, we was looking, strangely enough to get my attention. I had a weird feeling about this.englis
I was in this building, looking out the window, towards the strange black forest. The man started walking towards me. This actually worried me even more.english
Ususaly, people aren't attracted to me; and then when suddenly someone suddley was, it put me off. He opened the large blue almost broken door.
The door was so broken that both of the hinges broke and the door fell off. And when that thudder, that noise, that feeling when the door fell, shook
through my entire body.

And that got me thinking.

This isn't the body, this isn't my body. This is just an html page, with an empty body. A clear canvas, ready to be filled with all sorts of things.english
And that's when I awoke from my dream.
I sat there in my bed for a while. You know that feeling when you wake up, but you're not really woken up. You just sit there in your bed, not thinking.english
Almost sleeping. That's what I did, but i didn't sleep. I thought. And i thought hard. Who was this man? Why was he in my dream? Why was this door blue.english
So many questions.english
But this was all a dream. So I swiftly forgot about it and started my daily routine.

Today was the worst day of the week. Physics followed by Computer science. These subject weren't nessescarily boring, or even hard. But it was just the
time required to learn all of it that was so exausting. But i got on with my day,



*/
/* Javascript code: Connect to server*/




var socket = io.connect("localhost:25565");
var skins;
var thisRating = 0;
var myAccount;
var currentSkin = 0;

socket.on("skins", data => {
    skins = data;
    /* Load skins */
    for(let i = 0; i < skins.length; i++){
        skins[i].img = new Image();
        skins[i].img.src = skins[i].src;
        var rarityColors = ["legendary", "#aa5228", "epic", "#6b41a8", "rare", "#007dbc", "uncommon", "#488c2c", "common", "#9d9d9d"]
        var color = 1;
        for(let j = 0; j < rarityColors.length; j++) if(skins[i].rarity == rarityColors[j]) color = j+1;
        skins[i].img.style = 'background-color:' + rarityColors[color];
        skins[i].color = rarityColors[color];
        skins[i].img.draggable='false'
        skins[i].img.addEventListener("click", () => {
            inspect(i);
        })
        skins[i].img.className='preview' 
    }

    populateCollection();
    inspect(currentSkin);
 });

 socket.on("account", acc => {
    myAccount = acc;
    thisRating = myAccount.account[skins[currentSkin].code];
    updateStars(thisRating);

    console.log("Recived account: ", myAccount);
 })

 var rarities = ["common", "uncommon", "rare", "epic", "legendary"];
 function raritySort(a,b) {
    if (rarities.indexOf(a.rarity) > rarities.indexOf(b.rarity))
      return -1;
    if (rarities.indexOf(a.rarity) < rarities.indexOf(b.rarity))
      return 1;
    return 0;
  }
  
 // TODO: Rating sort
 function populateCollection(){
    var search = document.getElementById("search").value;
    document.getElementById("collection").innerHTML = "";
    
    for(let i = 0; i < skins.length; i++){
        var skin = skins[i];
        var skip = false;
        var searches = search.toLowerCase().split(" ");
        searches.forEach(s => {
            if(skin.name.toLowerCase().indexOf(s) == -1) skip = true;
        });
        if(!skip || search == false){
            document.getElementById("collection").appendChild(skin.img)
        }
    }
 }

 
 function inspect(skinIndex){
     currentSkin = skinIndex;
     try{
        thisRating = myAccount.account[skins[currentSkin].code];
        if(thisRating == undefined) thisRating = 0;
        updateStars(thisRating);
     } catch(e){}
     var rating = thisRating;
     document.getElementById("stars").innerHTML = "";
     document.getElementById("title").innerHTML = skins[skinIndex].name;
     document.getElementById("full").src = skins[skinIndex].src;
     document.getElementById("image-wrap").style.background = skins[skinIndex].color;
     document.getElementById("rating").innerHTML = skins[skinIndex].rating;
     updateStars(rating);
 }

 var starsRating = undefined;
 function updateStars(rating){
     if(starsRating == rating && document.getElementById("stars").innerHTML != "") return;
     starsRating = rating;
    document.getElementById("stars").innerHTML = "";
    for(let i = 0; i < 5; i++){
        var texture = "img/star_gold.png";
        if(i+1 > rating) texture = "img/star_grey.png";
        document.getElementById("stars").innerHTML += "<img src=" + texture + " class='star' onmouseout='resetStars()' onclick='rate(" + (i+1) + ")' onmouseover='updateStars(" + (i+1) + ")' >" 
    }
 }

 function rate(rating){
     socket.emit("rate", {skin: skins[currentSkin].code, rating: rating});
 }

 function resetStars(){
     updateStars(thisRating);
 }
    






/* Basic listener
socket.on("name", function(package){
    // Do something
}); */

/* Emit to server (example) */
/* var package = new Object();
socket.emit("name", package); */