


async function main(){

    let currentSong= new Audio();
    let songs;
    let currfolder;

    async function getSongs(folder){
        currfolder=folder;
        // console.log(currfolder)
        let a= await fetch(`http://127.0.0.1:5500/${folder}/`)
        let response = await a.text();
        // console.log(response)
        let div =document.createElement("div")
        div.innerHTML=response;
        let as =div.getElementsByTagName("a")
        songs= []
        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if(element.href.endsWith(".mp3")){
                songs.push(element.href.split(`/${folder}/`)[1])
            }
            
        }
        return songs
    }

    const playMusic=(track)=>{
        currentSong.src=`/${currfolder}/`+track
        // console.log(currentSong.src)
        currentSong.play()
        play.src="pause.svg"
        document.querySelector(".songtime").firstElementChild.innerHTML=""
        document.querySelector(".songtime").lastElementChild.innerHTML=""
    }
    
            //Adding event listner to play
            const setupPlayEventListeners = () => {
                Array.from(document.querySelectorAll(".play")).forEach(e=>{
                    
                    e.addEventListener("click",async element=>{
                        let v= e.parentElement.dataset.folder;
                        getSongs(`song/${v}`).then(playMusic(songs[0]))
                        // console.log(songs[0].replaceAll("%20"," "));
                        let songInfoElement = document.querySelector(".songinfo");
                        if (songInfoElement) {
                            songInfoElement.innerHTML = `
                                <span class="songkaname">${songs[0].replaceAll("%20"," ")}</span>
                                <div class="currentSongBar">
                                    <img class="invert" src="music.svg" alt="">
                                    <div class="info">
                                        <div class="songname">${songs[0].replaceAll("%20"," ")}</div>
                                    </div>
                                </div>`;
                        } else {
                            console.error("Element with class 'songinfo' not found");
                        }
                        
                    })
                })
            };

    function formatTime(seconds) {
        if(isNaN(seconds) || seconds<0){
            return "00:00";
        }

        // Calculate the minutes and seconds
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60); // Use Math.floor to remove decimal places
    
        // Format minutes and seconds to two digits
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
        // Return the formatted time
        return `${formattedMinutes}:${formattedSeconds}`;
    }



    //code to display dianamically albums
    const displayAlbums = async () => {
        let a = await fetch(`song/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let anchors = Array.from(div.getElementsByTagName("a"));
        let cardcontainer = document.querySelector(".cardcontainer");
        cardcontainer.innerHTML = ""; // Clear any existing content

        for (let i=0; i<anchors.length; i++) {
            if (anchors[i].href.includes("/song/")) {
                let folder = anchors[i].href.split("/").slice(-1)[0];
                // Get meta data of the folder  
                let a = await fetch(`/song/${folder}/info.json`);
                let response = await a.json();
                // console.log(response);

                cardcontainer.innerHTML += `
                    <div data-folder="${response.folderName}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                <path fill="#000" d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/song/${folder}/cover.jpeg" alt="">
                        <h2>${response.name}</h2>
                        <p>${response.kaam}</p>
                    </div>`;
            }
        }

        setupCardEventListeners(); // Set up event listeners for the new album cards
    };

    const setupCardEventListeners = () => {
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                currfolder = item.currentTarget.dataset.folder; // Set the current folder
                await getSongs(`song/${currfolder}`);

                // Show all the songs in playlist
                let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
                songUL.innerHTML = "";
                for (const song of songs) {
                    songUL.innerHTML += `
                        <li> 
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div class="songname">${song.replaceAll("%20", " ")}</div>
                                <div class="songartist">Song Artist</div>   
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
                        </li>`;
                }

                // Add event listeners to the new list items
                Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
                    e.addEventListener("click", element => {
                        let ni = e.querySelector(".info").firstElementChild.innerHTML;
                        // console.log(ni);
                        playMusic(ni);
                        document.querySelector(".songkaname").innerHTML = ni;

                        // Assuming there is only one element with class "songinfo"
                        let songInfoElement = document.querySelector(".songinfo");
                        if (songInfoElement) {
                            songInfoElement.innerHTML = `
                                <span class="songkaname">${ni}</span>
                                <div class="currentSongBar">
                                    <img class="invert" src="music.svg" alt="">
                                    <div class="info">
                                        <div class="songname">${ni}</div>
                                    </div>
                                </div>`;
                        } else {
                            console.error("Element with class 'songinfo' not found");
                        }
                    });
                });
                
            });
        });
        setupPlayEventListeners(); // Set up play event listeners after displaying albums
    };

    document.addEventListener("DOMContentLoaded", () => {
        displayAlbums(); // Call displayAlbums when the DOM is fully loaded
    });

            
                //attach an event to play next previous
                play.addEventListener("click", ()=>{
                    if(currentSong.paused){
                        currentSong.play()
                        play.src="pause.svg"
                    }
                    else{
                        currentSong.pause()
                        play.src="play.svg"
                    }
                })

                //listen for timeupdate event
                currentSong.addEventListener("timeupdate", () => {
                    // console.log(currentSong.currentTime, currentSong.duration);
                    
                    // Correctly access the elements using class selectors
                    document.querySelector(".currentime").innerHTML = formatTime(currentSong.currentTime);
                    document.querySelector(".totalTime").innerHTML = formatTime(currentSong.duration);
                    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";

                });

                //add event listner  to seekbar
                document.querySelector(".seekbar").addEventListener("click", e=>{
                  let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
                  document.querySelector(".circle").style.left=percent + "%";
                  currentSong.currentTime=((currentSong.duration)*percent)/100  
                })

        //Add an event Listner to Hamburger
        document.querySelector(".hamburger").addEventListener("click", ()=>{
            document.querySelector(".left").style.left="0";
        })
            
        //Add an event Listner to clos
        document.querySelector(".close").addEventListener("click", ()=>{
            document.querySelector(".left").style.left="-120%";
        })

        //Add event listner to previous and next
        previous.addEventListener("click",()=>{
            // console.log("previous clicked")

            let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            // console.log(songs.length)
            if(index-1 >= 0){
                playMusic(songs[index-1])
            }

            //changing playbar's song
            let songInfoElement = document.querySelector(".songinfo");
                        if (songInfoElement) {
                            songInfoElement.innerHTML = `
                                <span class="songkaname">${currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," " )}</span>
                                <div class="currentSongBar">
                                    <img class="invert" src="music.svg" alt="">
                                    <div class="info">
                                        <div class="songname">${currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," " )}</div>
                                    </div>
                                </div>
                            `;
                        } else {
                            console.error("Element with class 'songinfo' not found");
                        }
        } )

        //Add event listner to previous and next
        next.addEventListener("click",()=>{
            // console.log("next clicked")
            
            let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            // console.log(songs.length)
            if(index+1 < songs.length){
                playMusic(songs[index+1])
            }
            else{
                index=0
                playMusic(songs[index])
            }

            //changing playbar's song card
            let songInfoElement = document.querySelector(".songinfo");
                        if (songInfoElement) {
                            songInfoElement.innerHTML = `
                                <span class="songkaname">${currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," " )}</span>
                                <div class="currentSongBar">
                                    <img class="invert" src="music.svg" alt="">
                                    <div class="info">
                                        <div class="songname">${currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," " )}</div>
                                    </div>
                                </div>
                            `;
                        } else {
                            console.error("Element with class 'songinfo' not found");
                        }
            } )


        // Function to update the volume icon and reattach the event listener
const updateVolumeIcon = (src) => {
    const volumeBarImgContainer = document.querySelector(".volumebarimg");
    volumeBarImgContainer.innerHTML = `<img class="invert" src="${src}" alt="">`;

    // Reattach event listener to the new image element
    document.querySelector(".volumebarimg > img").addEventListener("click", e => {
        console.log(e.target);
        if (e.target.src.includes("somevolume.svg") || e.target.src.includes("morevolume.svg")) {
            updateVolumeIcon("novolume.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            updateVolumeIcon("somevolume.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });
};

// Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    // console.log(e, e.target, e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume === 0) {
        updateVolumeIcon("novolume.svg");
    } else if (currentSong.volume > 0 && currentSong.volume < 0.8) {
        updateVolumeIcon("somevolume.svg");
    } else if (currentSong.volume >= 0.8) {
        updateVolumeIcon("morevolume.svg");
    }
});

// Initial setup of the volume icon event listener
updateVolumeIcon("somevolume.svg"); // You can set the initial icon based on your requirements




            
            
        }
main()