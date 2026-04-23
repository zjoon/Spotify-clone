console.log("Lets write some javascript");
let currentsong = new Audio();
let songs;
let currentfolder;
let playbtn;

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

    let songsList = [];

    try {
        // songs.json fetch karo
        let jsonResponse = await fetch(`/${folder}/songs.json`);
        if (jsonResponse.ok) {
            songsList = await jsonResponse.json();

        } else {
            console.error("songs.json not found in", folder);
            songsList = [];
        }
    } catch (e) {
        console.error("Error loading songs.json:", e);
        songsList = [];
    }

    songs = songsList;

    let musicContainer = document.querySelector(".music");
    if (musicContainer) {
        musicContainer.innerHTML = '';

        for (const song of songs) {
            let span = document.createElement("span");
            span.innerHTML = `<i class="ri-music-2-line"></i>&nbsp;&nbsp;&nbsp; ${song}`;
            musicContainer.appendChild(span);
        }

        let allSpans = document.querySelectorAll(".music span");
        Array.from(allSpans).forEach(e => {
            e.addEventListener("click", () => {
                if (playbtn) {
                    playbtn.classList.add("ri-pause-circle-line");
                    playbtn.classList.remove("ri-play-circle-line");
                }
                console.log(e.innerText.trim());
                PlayMusic(e.innerText.trim());
            });
        });
    }

    return songs;
}

let PlayMusic = (track, pause = false) => {
    if (!currentfolder || !track) {
        console.log("Error: currentfolder or track missing");
        return;
    }

    currentsong.src = `/${currentfolder}/${track}`;

    if (!pause) {
        currentsong.play();
        if (playbtn) {
            playbtn.classList.add("ri-pause-circle-line");
            playbtn.classList.remove("ri-play-circle-line");
        }
    } else {
        if (playbtn) {
            playbtn.classList.add("ri-play-circle-line");
            playbtn.classList.remove("ri-pause-circle-line");
        }
    }

    currentsong.onended = () => {
        if (playbtn) {
            playbtn.classList.add("ri-play-circle-line");
            playbtn.classList.remove("ri-pause-circle-line");
        }
    };

    let songinfo = document.querySelector(".songinfo");
    let songtime = document.querySelector(".songtime");
    if (songinfo) songinfo.innerHTML = track;
    if (songtime) songtime.innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {


    let albumsList = [];

    try {
        // Sirf albums.json se fetch karo
        let albumsResponse = await fetch(`/songs/albums.json`);
        if (albumsResponse.ok) {
            albumsList = await albumsResponse.json();

        } else {
            console.error("albums.json not found!");
            return;
        }
    } catch (error) {
        console.error("Error loading albums.json:", error);
        return;
    }

    let cardcontainer = document.querySelector(".cards");
    if (!cardcontainer) return;

    cardcontainer.innerHTML = '';

    for (let index = 0; index < albumsList.length; index++) {
        const folder = albumsList[index];

        try {
            let a = await fetch(`/songs/${folder}/info.json`);
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
            `;
        } catch (e) {
            console.log(`No info.json found for ${folder}, using default`);
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
                    <h4>${folder}</h4>
                    <p>Click to play songs</p>
                </div>
            `;
        }
    }

    Array.from(document.querySelectorAll(".card")).forEach(card => {
        card.addEventListener("click", async item => {
            const folderName = item.currentTarget.dataset.folder;
            if (folderName) {
                songs = await getsongs(`songs/${folderName}`);
                if (songs && songs.length > 0) {
                    PlayMusic(songs[0], false);
                } else {
                    console.log("No songs found in", folderName);
                }
            }
        });
    });
}

async function main() {
    playbtn = document.querySelector("#playbtn");

    // Pehle displayAlbums call karo (albums.json se albums load honge)
    await displayAlbums();

    // Default album load karo (albums.json ka pehla album)
    try {
        let albumsResponse = await fetch(`/songs/albums.json`);
        if (albumsResponse.ok) {
            let albumsList = await albumsResponse.json();
            if (albumsList && albumsList.length > 0) {
                currentfolder = `songs/${albumsList[0]}`;
                let defaultSongs = await getsongs(currentfolder);
                songs = defaultSongs;
                if (songs && songs.length > 0) {
                    PlayMusic(songs[0], true);
                }
            }
        }
    } catch (e) {
        console.log("No default album found");
    }

    if (playbtn) {
        playbtn.addEventListener("click", () => {
            if (currentsong.src) {
                if (currentsong.paused) {
                    currentsong.play();
                    playbtn.classList.add("ri-pause-circle-line");
                    playbtn.classList.remove("ri-play-circle-line");
                } else {
                    currentsong.pause();
                    playbtn.classList.add("ri-play-circle-line");
                    playbtn.classList.remove("ri-pause-circle-line");
                }
            }
        });
    }

    currentsong.addEventListener("timeupdate", () => {
        let songtime = document.querySelector(".songtime");
        let circle = document.querySelector("#circle");
        if (songtime) {
            songtime.innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        }
        if (circle && currentsong.duration) {
            circle.style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        }
    });

    let seekbar = document.querySelector(".seekbar");
    if (seekbar) {
        seekbar.addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            let circle = document.querySelector("#circle");
            if (circle) circle.style.left = percent + "%";
            if (currentsong.duration) {
                currentsong.currentTime = (currentsong.duration * percent) / 100;
            }
        });
    }

    let hamburger = document.querySelector(".hamburger");
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            let box1 = document.querySelector(".box1");
            if (box1) box1.style.left = "0";
        });
    }

    let closeBtn = document.querySelector(".ri-close-line");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            let box1 = document.querySelector(".box1");
            if (box1) box1.style.left = "-120%";
        });
    }

    let nextBtn = document.querySelector("#next");
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            let allSpans = document.querySelectorAll(".music span");
            let currentSng = document.querySelector(".songinfo")?.innerHTML || "";
            let currentIndex = 0;

            for (let i = 0; i < allSpans.length; i++) {
                if (allSpans[i].innerText.trim() === currentSng) {
                    currentIndex = i;
                    break;
                }
            }

            let nextIndex = currentIndex + 1;
            if (nextIndex >= allSpans.length) {
                nextIndex = 0;
            }

            let nextSong = allSpans[nextIndex]?.innerText.trim();
            if (nextSong) {
                PlayMusic(nextSong);
                if (playbtn) {
                    playbtn.classList.add("ri-pause-circle-line");
                    playbtn.classList.remove("ri-play-circle-line");
                }
            }
        });
    }

    let prevBtn = document.querySelector("#prev");
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            let allSpans = document.querySelectorAll(".music span");
            let currentSng = document.querySelector(".songinfo")?.innerHTML || "";
            let currentIndex = 0;

            for (let i = 0; i < allSpans.length; i++) {
                if (allSpans[i].innerText.trim() === currentSng) {
                    currentIndex = i;
                    break;
                }
            }

            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = allSpans.length - 1;
            }

            let prevSong = allSpans[prevIndex]?.innerText.trim();
            if (prevSong) {
                PlayMusic(prevSong);
                if (playbtn) {
                    playbtn.classList.add("ri-pause-circle-line");
                    playbtn.classList.remove("ri-play-circle-line");
                }
            }
        });
    }

    let rangeInput = document.querySelector(".range input");
    if (rangeInput) {
        rangeInput.addEventListener("change", (e) => {
            console.log("Setting volume to", e.target.value, "/ 100");
            currentsong.volume = parseInt(e.target.value) / 100;
        });
    }

    let muted = false;
    let lastVolume = 70;

    const volumeIcon = document.querySelector(".range i");
    const volumeInput = document.querySelector(".range input");

    if (volumeIcon && volumeInput) {
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
}

main();