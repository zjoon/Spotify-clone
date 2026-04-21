console.log("Lets write some javascript")
let currentsong = new Audio;
let songs;
let currentfolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currentfolder = folder;

    //   Phelay url say songs ko fetch kiya yani hasil kiya 

    let a = await fetch(`/songs/${folder}/`)

    // Then un ko text main karwaya tabdil
    let response = await a.text();
    // Then console.log kiya us kay results ko


    // Jab humain result aik string main mila to hum nay us ko aik div bana kar us main dal diya response wali string ko 

    let div = document.createElement("div")
    div.innerHTML = response;
    // div ki inner html ko response kiya ab humain dom mila

    // us ko console.log kiya to humain aik dom mila


    // ab dom kay andar search karnay kay liye a's yani links ko songs kay hum nay tds walay var ki madad say a's ko find kiya hymain aik a's ki 13 lists mili jitni songs main thi links

    let as = div.getElementsByTagName("a")

    // ab humain a yani links console.log kar kay mil gaye to ab hymain un kay bhin andar kay links find karnay hain 

    // aik emtpy araay banany jis main bad main links aik sath store ho sakain 
    songs = [];

    // Then loop lagaya jo kay as kay index say lay kay length jahantak wo hain wahan tak jaye and href kay end pay jahan jahan mood wala lafaz hay wo hred lay aye songs aray main endswith ka use kiya and kuch syntax erroes fixes kiye then hows and one slash mistake

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp4")) {
            songs.push(element.innerHTML);
        }
    }



    PlayMusic(songs[0], true);


    let musicContainer = document.querySelector(".music");

    // Clear container first
    musicContainer.innerHTML = '';

    // Loop through each song
    for (const song of songs) {
        // Create a NEW span for EACH song
        let span = document.createElement("span");

        // Add music icon INSIDE span
        span.innerHTML = `<i class="ri-music-2-line"></i>&nbsp;&nbsp;&nbsp; ${song}`;
        // Add to container
        musicContainer.appendChild(span);
    }


    // After adding all songs, now we can add event listeners to the spans
    let musicDiv = document.querySelector(".music");
    let allSpans = musicDiv.getElementsByTagName("span");

    Array.from(allSpans).forEach(e => {


        e.addEventListener("click", () => {

            playbtn.classList.add("ri-pause-circle-line");
            playbtn.classList.remove("ri-play-circle-line");
            console.log(e.innerText.trim());
            PlayMusic(e.innerText.trim());

        })

    })

    return songs;




}


// here



//finally songs a gaye after 3 hours of patience and work and some help of ai for syntax fixes




// all things were gone so we started form scratch form 3 hours of work consistently and crying 
let PlayMusic = (track, pause = false) => {

    currentsong.src = `/songs/${currentfolder}/${track}`;

    if (!pause) {
        currentsong.play();
        // ✅ Update button to pause icon when playing
        let playbtn = document.querySelector("#playbtn");
        playbtn.classList.add("ri-pause-circle-line");
        playbtn.classList.remove("ri-play-circle-line");
    } else {
        // If pause = true, show play icon
        let playbtn = document.querySelector("#playbtn");
        playbtn.classList.add("ri-play-circle-line");
        playbtn.classList.remove("ri-pause-circle-line");
    }

    currentsong.onended = () => {
        playbtn.classList.add("ri-play-circle-line");
        playbtn.classList.remove("ri-pause-circle-line");
    }
    let songinfo = document.querySelector(".songinfo").innerHTML = track
    let songtime = document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}
async function displayAlbums() {

    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cards");


    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("%5Csongs%5C") ) {
            let folder = e.href.split("%5Csongs%5C")[1].split("/")[0]
            // now get the meta data of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();

            cardcontainer.innerHTML = cardcontainer.innerHTML + `
                <div data-folder="${folder}" class="card">
                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24">
                        <path
                            d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z"
                            fill="#22C55E" />
                        <path
                            d="M10.6219 8.41459C10.5562 8.37078 10.479 8.34741 10.4 8.34741C10.1791 8.34741 10 8.52649 10 8.74741V15.2526C10 15.3316 10.0234 15.4088 10.0672 15.4745C10.1897 15.6583 10.4381 15.708 10.6219 15.5854L15.5008 12.3328C15.5447 12.3035 15.5824 12.2658 15.6117 12.2219C15.7343 12.0381 15.6846 11.7897 15.5008 11.6672L10.6219 8.41459Z"
                            fill="#000000" />
                    </svg>
                    <img src="/songs/${folder}/cover.jpg.jpg" class="cardinner" alt="">
                    <h4>${response.title}</h4>
                    <p>${response.description}</p>
                </div>
`

        }
    }

    Array.from(document.querySelectorAll(".card")).forEach(e => {
        e.addEventListener("click", async item => {

            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

            PlayMusic(songs[0], false)
        })
    })


}

async function main() {


    await getsongs("songs/CrystallineDrive");
    //now display albums
    displayAlbums();

    //now a evnet listener is added to each span and when we click on it and it changes the button play and pause

    let playbtn = document.querySelector("  #playbtn");
    playbtn.addEventListener("click", () => {
        if (currentsong.src) {
            if (currentsong.paused) {
                currentsong.play();
                playbtn.classList.add("ri-pause-circle-line");
                playbtn.classList.remove("ri-play-circle-line");
            }
            else {
                currentsong.pause();
                playbtn.classList.add("ri-play-circle-line");
                playbtn.classList.remove("ri-pause-circle-line");
            }

        }




    })


    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector("#circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })


    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector("#circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    //Add an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".box1").style.left = "0"
    })
    //Add an event listener to close button
    document.querySelector(".ri-close-line").addEventListener("click", () => {
        document.querySelector(".box1").style.left = "-120%"
    })


    // Add event listeners to previous and next buttons



    document.querySelector("#next").addEventListener("click", () => {
        let allSpans = document.querySelectorAll(".music span");
        let currentSng = document.querySelector(".songinfo").innerHTML;
        let currentIndex = 0;

        for (let i = 0; i < allSpans.length; i++) {
            if (allSpans[i].innerText.trim() === currentSng) {  // ✅ innerText
                currentIndex = i;
                break;
            }
        }

        let nextIndex = currentIndex + 1;
        if (nextIndex >= allSpans.length) {
            nextIndex = 0;
        }

        let nextSong = allSpans[nextIndex].innerText.trim();  // ✅ innerText
        PlayMusic(nextSong);
        playbtn.classList.add("ri-pause-circle-line");
        playbtn.classList.remove("ri-play-circle-line");
    });

    document.querySelector("#prev").addEventListener("click", () => {
        let allSpans = document.querySelectorAll(".music span");
        let currentSng = document.querySelector(".songinfo").innerHTML;
        let currentIndex = 0;

        for (let i = 0; i < allSpans.length; i++) {
            if (allSpans[i].innerText.trim() === currentSng) {  // ✅ innerText
                currentIndex = i;
                break;
            }
        }

        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = allSpans.length - 1;
        }

        let prevSong = allSpans[prevIndex].innerText.trim();  // ✅ innerText
        PlayMusic(prevSong);
        playbtn.classList.add("ri-pause-circle-line");
        playbtn.classList.remove("ri-play-circle-line");
    });


    //add event to volume button
    document.querySelector(".range").addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100

    })





    let muted = false;
    let lastVolume = 70;

    const volumeIcon = document.querySelector(".range i");
    const volumeInput = document.querySelector(".range input");

    volumeIcon.addEventListener("click", () => {
        if (!muted) {
            lastVolume = volumeInput.value;
            currentsong.volume = 0;
            volumeInput.value = 0;
            volumeIcon.className = "ri-volume-mute-line";
            muted = true;
        } else {
            currentsong.volume = lastVolume / 100;
            volumeInput.value = lastVolume;
            volumeIcon.className = "ri-volume-up-line";
            muted = false;
        }
    });

    // Volume slider change
    volumeInput.addEventListener("input", (e) => {
        currentsong.volume = e.target.value / 100;

        if (e.target.value == 0) {
            volumeIcon.className = "ri-volume-mute-line";
            muted = true;
        } else {
            volumeIcon.className = "ri-volume-up-line";
            muted = false;
        }
    });
}
main()
