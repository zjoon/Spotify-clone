console.log("Lets write some javascript")

async function getsongs() {

    //   Phelay url say songs ko fetch kiya yani hasil kiya 

    let a = await fetch("http://127.0.0.1:3000/spotify-clone/songs/")

    // Then un ko text main karwaya tabdil
    let response = await a.text();
    // Then console.log kiya us kay results ko

    // console.log(response)
    // Jab humain result aik string main mila to hum nay us ko aik div bana kar us main dal diya response wali string ko 

    let div = document.createElement("div")
    div.innerHTML = response;
    // div ki inner html ko response kiya ab humain dom mila
    // console.log(div)
    // us ko console.log kiya to humain aik dom mila


    // ab dom kay andar search karnay kay liye a's yani links ko songs kay hum nay tds walay var ki madad say a's ko find kiya hymain aik a's ki 13 lists mili jitni songs main thi links

    let as = div.getElementsByTagName("a")
    // console.log(as)
    // ab humain a yani links console.log kar kay mil gaye to ab hymain un kay bhin andar kay links find karnay hain 

    // aik emtpy araay banany jis main bad main links aik sath store ho sakain 
    let songs = [];
    // Then loop lagaya jo kay as kay index say lay kay length jahantak wo hain wahan tak jaye and href kay end pay jahan jahan mood wala lafaz hay wo hred lay aye songs aray main endswith ka use kiya and kuch syntax erroes fixes kiye then hows and one slash mistake

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3/")) {
            songs.push(element.href.replaceAll("http://127.0.0.1:3000/spotify-clone/%5Cspotify-clone%5Csongs%5C", " "));
        }
    }

    return (songs)

    //finally songs a gaye after 3 hours of patience and work and some help of ai for syntax fixes



}

async function main() {


    let songs = await getsongs()
    // console.log(songs)


    const span = document.querySelector(".music span");
    span.innerHTML = "";

    for (const song of songs) {
        const h4 = document.createElement("h4");
        h4.textContent = song.replaceAll("/", " ");
        span.appendChild(h4);
    }

    let audio = new Audio(songs[0]);
    audio.play();



    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
    });

}
main()

