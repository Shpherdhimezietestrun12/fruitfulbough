// For first page email loading

const Subbutton = document.querySelector('.but-first');
const ColEmail = document.querySelector('.ipt-first');
const ShowLod = document.querySelector('.lod-img');
const WrongEmail = document.querySelector('.wrong-email');
const NotSaved = document.querySelector('.not-saved');
const RemoveUI = document.querySelector('.Signing-cont');
const ChangeOne = document.querySelector('.test-par-5');
const ChangeTwo = document.querySelector('.sp-t22');

Subbutton.addEventListener('click', () => {
    const EmailValue = ColEmail.value.trim();
    const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!EmailRegex.test(EmailValue)) {
        // Show message if email wrong
        WrongEmail.style.display = 'block';
        ShowLod.style.display = 'none'; // Hide loader
    } else {
        // Email is correct show loader
        WrongEmail.style.display = 'none';
        ShowLod.style.display = 'block';
        // Fetch the email and save the records
        fetch('https://localhost:5000/save-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: EmailValue
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Handle response from the server
                if (data.message) {
                    // Email saved successfully
                    console.log('Email saved successfully!');
                    RemoveUI.style.display = 'none';
                    updateElements(ColEmail);
                } else {
                    // Error saving the email
                    console.error('Error saving the email:', data.error);
                    // code to show error to the user
                    NotSaved.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});

function updateElements(element) {
    if (!element || !element.value) return '';
    const text = element.value;
    const regex = /@\S+$/;
    const name = text.replace(regex, '');
    const words = name.split(' ');
    const firstName = words[0];
    if (ChangeOne && ChangeTwo) {
        ChangeOne.textContent = firstName;
        ChangeTwo.textContent = firstName;
    }
}

// for only email registery


// for all UI's 

// Force the page to always reload
window.onload = function() {
    // Check if the page is being loaded from the server (like pressing back)
    if (performance.navigation.type != performance.navigation.TYPE_RELOAD) {
        // Force the reload 
        location.reload(true);
    }
};


// preventing caching 
// This is to ensure that the browser request the load each time
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
            registration.unregister();
            console.log('Service worker unregistered:', registration);
        }
    }).catch(function(error) {
        console.error('Service worker unregister failed:', error);
    });
}
// end...

// for Phone Home page....

document.getElementById('french-lan').addEventListener('click', () => {
    translateElements('p', 'fr');
});


// for the live stream...

const MenuImg = document.querySelector('.img_bnt_10');
const LagDiv = document.querySelector('.div-two-102');
const LagReg = document.querySelector('.Laugh-sel');
const FirstBox = document.querySelector('.img_bnt_4');

function MenuCont() {
    var menu_cont_1 = document.querySelector(".menu_cont");
    menu_cont_1.style.display = menu_cont_1.style.display == "block" ? "none" : "block";
}
// Add event lstening for this image
MenuImg.addEventListener('click', () => {
    var menu_cont_2 = document.querySelector(".menu_cont");
    menu_cont_2.style.display = menu_cont_2.style.display == "block" ? "none" : "block";

});

function LaugDiv() {
    LagDiv.addEventListener('click', () => {
        if (FirstBox.src.includes('icons8-down-arrow-1xxx00.png')) {
            FirstBox.src = './icons/icons8-collapse-arrow-100.png';
            LagReg.style.display = "block"
        } else {
            FirstBox.src = './icons/icons8-down-arrow-1xxx00.png';
            LagReg.style.display = "none"
        }
    });
}


document.body.addEventListener('click', (event) => {
    if (!event.target.closest('.div-two-102')) { // If not clicking img-4000 or its children
        FirstBox.src = './icons/icons8-down-arrow-1xxx00.png';
        LagReg.style.display = "none"
    }
});


// for the live stream...
const LoadSh = document.querySelector('.bnt_102');


function LoadShow() {
    var pop_cont_5 = document.querySelector(".dis_here");
    pop_cont_5.style.display = pop_cont_5.style.display == "block" ? "none" : "block";
}
LoadSh.addEventListener('click', () => {
    pop_cont_5.style.display = pop_cont_5.style.display == "block" ? "none" : "block";
});



const textElement2 = document.querySelector('.sp_2101');
const texts2 = ['auto-expand!', 'enlarge itself!', 'increase in size!', 'auto-resize!'];
let index2 = 0;
let isBlack2 = true;

setInterval(() => {
    textElement2.textContent = texts2[index2];
    if (isBlack2) {
        textElement2.style.color = '#B68D05';
        textElement2.style.fontStyle = 'italic';
    } else {
        textElement2.style.color = 'black';
        textElement2.style.fontFamily = 'Cabri ", sans-serif';
    }
    isBlack2 = !isBlack;
    index2 = (index2 + 1) % texts2.length;
}, 2000);



const textElement1 = document.querySelector('.par-4100');
const texts = ['reading and editing', 'reviewing and revising', 'reading and refining', 'editing and revising'];
let index = 0;
let isBlack = true;

setInterval(() => {
    textElement1.textContent = texts[index];
    if (isBlack) {
        textElement1.style.color = 'black';
        textElement1.style.fontStyle = 'normal';
    } else {
        textElement1.style.color = '#B68D05';
        textElement1.style.fontFamily = 'Cambria, "Times New Roman", serif';
    }
    isBlack = !isBlack;
    index = (index + 1) % texts.length;
}, 2000);





// this is for the language sequence..
const LagDiv1 = document.querySelector('.div-two-103');
const LagReg1 = document.querySelector('.Laugh-sel1');
const FirstBox1 = document.querySelector('.img_bnt_41');

function LaugDiv1() {
    LagDiv1.addEventListener('click', () => {
        if (FirstBox1.src.includes('icons8-down-arrow-10bbbbbbbb0.png')) {
            FirstBox1.src = './icons/icons8-collapse-arrow-ssssss100.png';
            LagReg1.style.display = "block"
        } else {
            FirstBox1.src = './icons/icons8-down-arrow-10bbbbbbbb0.png';
            LagReg1.style.display = "none"
        }
    });
}
document.body.addEventListener('click', (event) => {
    if (!event.target.closest('.div-two-103')) { // If not clicking img-4000 or its children
        FirstBox1.src = './icons/icons8-down-arrow-10bbbbbbbb0.png';
        LagReg1.style.display = "none"
    }
});



//
const ExitContOne = document.querySelector('.dis_here');
const ImgPop = document.querySelector('.img_pop_21');


document.addEventListener('DOMContentLoaded', () => {


    if (ImgPop && ExitContOne) {
        ImgPop.addEventListener('click', () => {
            ExitContOne.style.display = 'none';
        });
    }
});
//





const ExitBntOne = document.querySelector('.bnt_pop_212');
const ChanBntOne = document.querySelector('.bnt_pop_213');
const ImageLoad = document.querySelector('.img_bttn_213');



// Add event listener to this button

if (ExitBntOne) {
    ExitBntOne.addEventListener('click', () => {
        ExitContOne.style.display = 'none';
    });
}

// Add event lstening for this image

// Add event lstening for this image
ChanBntOne.addEventListener('click', () => {
    if (ImageLoad.src.includes('qqqqqqqqqqqqqq.png')) {
        ImageLoad.src = './icons/icons8-love-100.png';
    } else {
        ImageLoad.src = './icons/qqqqqqqqqqqqqqq.png';
    }
});





const RemCont = document.querySelector('.menu_cont');
const ExitThree = document.querySelector('.exit-1');

function RemContOne() {
    RemCont.style.display = 'none';
}
// Add event lstening for this image
MenuImg.addEventListener('click', () => {
    RemCont.style.display = 'none';

});



const RemCoo = document.querySelector('.pra-0005');
const DivCoo = document.querySelector('.cookies-portal');
const BntCoo = document.querySelector('.bnt-0303');


// Using local storage to keep response of the user prefrence.. this should be corrected after to ensure users experience...
if (!localStorage.getItem('cookieNoticeDismissed')) {
    DivCoo.style.display = 'block';
}
RemCoo.addEventListener('click', () => {
    DivCoo.style.display = 'none';
    localStorage.setItem('cookieNoticeDismissed', true);
});
BntCoo.addEventListener('click', () => {
    DivCoo.style.display = 'none';
    localStorage.setItem('cookieNoticeDismissed', true);
});





const AdsCont = document.querySelector('.presentation-2');
const ExitAds1 = document.querySelector('.pres-2');


ExitAds1.addEventListener('click', () => {
    AdsCont.style.display = 'none';
});




const ExploreOne = document.querySelector('.but-test-1');
const ExitExplore = document.querySelector('.greetings-show');


ExploreOne.addEventListener('click', () => {
    ExitExplore.style.display = 'none';
});

// end....