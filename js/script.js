// I created an array to store the carousel items and their details. 
document.addEventListener('DOMContentLoaded', () => {
    const currentItems = [
        {
            name: 'Jack',
            genre: 'Country/Folk',
            detailsId: 'jacks-details',
            id: 'jacks-card',
            className: 'jack',
            detailPage: 'jack.html'
        },
        {
            name: 'Luke',
            genre: 'Hip Hop/RnB',
            detailsId: 'lukes-details',
            id: 'lukes-card',
            className: 'luke',
            detailPage: 'luke.html'
        },
        {
            name: 'Liv',
            genre: 'EDM',
            detailsId: 'livs-details',
            id: 'livs-card',
            className: 'liv',
            detailPage: 'liv.html'
        }
    ];

    // I created a function to create a carousel card for each item in the array.
    //I made these all const because they are not going to change and I used querySelector to select the elements by their class name.
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const cardDetailsSection = document.getElementById('card-details-section');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const stylesheetCountry = document.getElementById('country-stylesheet');
    const stylesheetRnb = document.getElementById('rnb-stylesheet');
    const stylesheetDefault = document.getElementById('default-stylesheet');
    //the currentIndex variable is used to keep track of the current card in focus.
    let currentIndex = 1;

    //I created a function to create a carousel card for each item in the array.
    //It takes the item object, the position class and the index of the item in the array as arguments and returns a div element with the card details.
    function createCarouselCard(item, positionClass, index) {
        const card = document.createElement('div');
        card.classList.add('carousel-card', positionClass);
        card.id = item.id;
        card.innerHTML = `
            <h2>${item.name}</h2>
            <p>${item.genre}</p>
            <div class="artist-snippet" id="${item.id}-snippet"></div>
            <button class="explore-more" onclick="window.location.href='${item.detailPage}'"> Explore More</button>
        `;
        card.addEventListener('click', () => changeFocusToCard(index));
        return card;
    }


    async function updateArtistSnippet(item) {
        const snippetId = `${item.id}-snippet`;
        const artistSnippet = document.getElementById(snippetId);
        if (artistSnippet) {
            try {
                const response = await fetch(item.detailPage);
                const data = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const artists = Array.from(doc.querySelectorAll('.artist')).map(artist => ({
                    name: artist.querySelector('h3').innerText,
                    image: artist.querySelector('img').src
                }));
                if (artists.length > 0) {
                    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
                    artistSnippet.innerHTML = `
                        <img src="${randomArtist.image}" alt="${randomArtist.name}" />
                        <p>${item.name}'s Top Artist: ${randomArtist.name}</p>
                    `;
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    function updateCarousel() {
        carouselWrapper.innerHTML = '';
        const totalItems = currentItems.length;

        const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        const nextIndex = (currentIndex + 1) % totalItems;

        carouselWrapper.appendChild(createCarouselCard(currentItems[prevIndex], 'prev', prevIndex));
        carouselWrapper.appendChild(createCarouselCard(currentItems[currentIndex], 'active', currentIndex));
        carouselWrapper.appendChild(createCarouselCard(currentItems[nextIndex], 'next', nextIndex));

        showCardDetails(currentItems[currentIndex]);
        updateStylesheet(currentItems[currentIndex].className);
        
        // Update artist snippets for all carousel cards
        [currentItems[prevIndex], currentItems[currentIndex], currentItems[nextIndex]].forEach(item => {
            updateArtistSnippet(item);
        });
    }

    function changeFocusToCard(index) {
        currentIndex = index;
        updateCarousel();
    }

    function showCardDetails(item) {
        document.querySelectorAll('.card-details .details').forEach(detail => detail.classList.remove('active'));
        document.getElementById(item.detailsId).classList.add('active');
        cardDetailsSection.classList.remove('jack', 'luke', 'liv');
        cardDetailsSection.classList.add(item.className);
    }

    function updateStylesheet(className) {
        stylesheetCountry.disabled = true;
        stylesheetRnb.disabled = true;
        stylesheetDefault.disabled = true;

        if (className === 'jack') {
            stylesheetCountry.disabled = false;
        } else if (className === 'luke') {
            stylesheetRnb.disabled = false;
        } else {
            stylesheetDefault.disabled = false;
        }
    }

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % currentItems.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
        updateCarousel();
    });

    // Initial call to set up the carousel
    updateCarousel();
});