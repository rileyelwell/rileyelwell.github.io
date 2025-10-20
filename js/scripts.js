document.addEventListener('DOMContentLoaded', function() {
    // ABOUT PAGE MEDIA CAROUSEL
    const mediaItems = document.querySelectorAll('.media-display img, .media-display video');
    const thumbnailsContainer = document.querySelector('.thumbnail-nav');
    const dotsContainer = document.querySelector('.pagination-dots');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    let currentIndex = 0;
    // Removed autoSlideInterval and startAutoSlide for video-first functionality

    let generatedThumbnails = [];
    let generatedDots = [];

    function setupCarouselElements() {
        if (!thumbnailsContainer || !dotsContainer || mediaItems.length === 0) {
            console.warn("Carousel elements not found (thumbnail container, dots container, or no media items). Skipping carousel setup.");
            return;
        }

        thumbnailsContainer.innerHTML = '';
        dotsContainer.innerHTML = '';

        generatedThumbnails = [];
        generatedDots = [];

        mediaItems.forEach((item, index) => {
            const thumbDiv = document.createElement('div');
            thumbDiv.classList.add('thumbnail');
            thumbDiv.dataset.index = index;
            const img = document.createElement('img');
            // Check if the item is a video to use a poster image for the thumbnail
            if (item.tagName === 'VIDEO') {
                img.src = item.getAttribute('poster');
            } else {
                img.src = item.src;
            }
            img.alt = `Thumbnail ${index + 1}`;
            thumbDiv.appendChild(img);
            thumbnailsContainer.appendChild(thumbDiv);
            generatedThumbnails.push(thumbDiv);

            const dotSpan = document.createElement('span');
            dotSpan.classList.add('dot');
            dotSpan.dataset.index = index;
            dotsContainer.appendChild(dotSpan);
            generatedDots.push(dotSpan);

            thumbDiv.addEventListener('click', () => {
                showMedia(index);
            });
            dotSpan.addEventListener('click', () => {
                showMedia(index);
            });
        });
    }

    function showMedia(index) {
        if (index < 0) {
            index = mediaItems.length - 1;
        } else if (index >= mediaItems.length) {
            index = 0;
        }

        if (generatedThumbnails.length === 0 || generatedDots.length === 0) {
            console.error("Carousel elements (thumbnails/dots) not generated. Cannot update active states.");
            return;
        }

        // Pause all media and remove active classes
        mediaItems.forEach(item => {
            item.classList.remove('active-media');
            if (item.tagName === 'VIDEO') {
                item.pause();
                item.currentTime = 0;
            }
        });
        generatedThumbnails.forEach(thumb => thumb.classList.remove('active-thumbnail'));
        generatedDots.forEach(dot => dot.classList.remove('active-dot'));

        // Activate the selected media, thumbnail, and dot
        mediaItems[index].classList.add('active-media');
        generatedThumbnails[index].classList.add('active-thumbnail');
        generatedDots[index].classList.add('active-dot');

        // Play the video if the active item is a video
        const activeItem = mediaItems[index];
        if (activeItem.tagName === 'VIDEO') {
            const playPromise = activeItem.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Carousel video autoplay prevented:', error);
                });
            }
        }

        currentIndex = index;

        // Scroll thumbnails into view
        const activeThumbnail = generatedThumbnails[index];
        if (activeThumbnail && activeThumbnail.parentElement && activeThumbnail.parentElement.scrollLeft !== undefined) {
            activeThumbnail.parentElement.scrollLeft = activeThumbnail.offsetLeft - (activeThumbnail.parentElement.offsetWidth / 2) + (activeThumbnail.offsetWidth / 2);
        }
    }

    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            showMedia(currentIndex - 1);
        });
    }
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            showMedia(currentIndex + 1);
        });
    }

    setupCarouselElements();
    showMedia(0);

    // LOADING CODE SNIPPETS SECTION
    function loadCodeSnippet(elementId, filePath) {
        const codeElement = document.getElementById(elementId);
        if (codeElement) {
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status} for ${filePath}`);
                    }
                    return response.text();
                })
                .then(code => {
                    codeElement.textContent = code;
                    if (typeof Prism !== 'undefined') {
                        Prism.highlightElement(codeElement);
                    }
                })
                .catch(error => {
                    console.error('Failed to load code snippet:', error);
                    codeElement.textContent = `Error loading code: ${error.message}`;
                });
        }
    }

    const playerControllerDetails = document.querySelector('details:has(#playerControllerCode)');
    if (playerControllerDetails) {
        const playerCodePreElement = playerControllerDetails.querySelector('pre');
        playerControllerDetails.addEventListener('toggle', function() {
            if (this.open) {
                playerCodePreElement.classList.add('code-scrollable');
            } else {
                playerCodePreElement.classList.remove('code-scrollable');
            }
        });
        loadCodeSnippet('playerControllerCode', 'assets/code/PlayerController.cs.txt');
    }

    const triggerPointDetails = document.querySelector('details:has(#triggerPointCode)');
    if (triggerPointDetails) {
        const triggerPointCodePreElement = triggerPointDetails.querySelector('pre');
        triggerPointDetails.addEventListener('toggle', function() {
            if (this.open) {
                triggerPointCodePreElement.classList.add('code-scrollable');
            } else {
                triggerPointCodePreElement.classList.remove('code-scrollable');
            }
        });
        loadCodeSnippet('triggerPointCode', 'assets/code/TriggerPoint.cs.txt');
    }

    const weaponComponentDetails = document.querySelector('details:has(#weaponComponentCode)');
    if (weaponComponentDetails) {
        const weaponComponentCodePreElement = weaponComponentDetails.querySelector('pre');
        weaponComponentDetails.addEventListener('toggle', function() {
            if (this.open) {
                weaponComponentCodePreElement.classList.add('code-scrollable');
            } else {
                weaponComponentCodePreElement.classList.remove('code-scrollable');
            }
        });
        loadCodeSnippet('weaponComponentCode', 'assets/code/WeaponComponent.cpp.txt');
    }

    const combatComponentDetails = document.querySelector('details:has(#combatComponentCode)');
    if (combatComponentDetails) {
        const combatComponentCodePreElement = combatComponentDetails.querySelector('pre');
        combatComponentDetails.addEventListener('toggle', function() {
            if (this.open) {
                combatComponentCodePreElement.classList.add('code-scrollable');
            } else {
                combatComponentCodePreElement.classList.remove('code-scrollable');
            }
        });
        loadCodeSnippet('combatComponentCode', 'assets/code/CombatComponent.cpp.txt');
    }

    // CAROUSEL CLASS/FUNCTION
    function Carousel(containerId) {
        const carouselContainer = document.getElementById(containerId);
        if (!carouselContainer) {
            console.warn(`Carousel container with ID "${containerId}" not found.`);
            return;
        }

        const carouselTrack = carouselContainer.querySelector('.carousel-track');
        const carouselSlides = Array.from(carouselTrack.children);
        const carouselDotsContainer = carouselContainer.querySelector('.carousel-dots');

        let slideIndex = 0;
        let slideWidth = carouselSlides.length > 0 ? carouselSlides[0].getBoundingClientRect().width : 0;

        const updateCarousel = () => {
            if (carouselSlides.length > 0) {
                slideWidth = carouselSlides[0].getBoundingClientRect().width;
            } else {
                slideWidth = 0;
            }

            carouselTrack.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
            updateDots();

            const thumbnails = carouselContainer.querySelectorAll('.thumbnail-nav .thumbnail');

            carouselSlides.forEach((slide, index) => {
                const videoElement = slide;

                slide.classList.remove('active');
                if (index === slideIndex) {
                    slide.classList.add('active');

                    // Update thumbnail active class
                    if (thumbnails[index]) {
                        // Remove active class from all first, then add to current
                        thumbnails.forEach(thumb => thumb.classList.remove('active-thumbnail'));
                        thumbnails[index].classList.add('active-thumbnail');
                    }
                }

                if (videoElement && videoElement.tagName === 'VIDEO') {
                    if (index === slideIndex) {
                        if (!videoElement.dataset.loaded) {
                            const sources = videoElement.querySelectorAll('source[data-src]');
                            sources.forEach(source => {
                                source.src = source.dataset.src;
                                source.removeAttribute('data-src');
                            });
                            videoElement.load();
                            videoElement.dataset.loaded = 'true';
                        }

                        const playPromise = videoElement.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.warn('Carousel video autoplay prevented:', error);
                            });
                        }
                    } else {
                        videoElement.pause();
                        videoElement.currentTime = 0;
                    }
                }
            });
        };

        const updateDots = () => {
            if (!carouselDotsContainer) return;
            carouselDotsContainer.innerHTML = '';
            carouselSlides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === slideIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    slideIndex = index;
                    updateCarousel();
                });
                carouselDotsContainer.appendChild(dot);
            });
        };

        // 1. Get the new control elements
        const prevArrow = carouselContainer.querySelector('.prev-arrow');
        const nextArrow = carouselContainer.querySelector('.next-arrow');
        // Note: We select the thumbnail divs (your old carousel structure uses 'div.thumbnail')
        const thumbnails = Array.from(carouselContainer.querySelectorAll('.thumbnail-nav .thumbnail'));

        // 2. Add event listeners for arrows
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                // Your existing navigation logic
                slideIndex = (slideIndex - 1 + carouselSlides.length) % carouselSlides.length;
                updateCarousel();
            });
        }

        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                // Your existing navigation logic
                slideIndex = (slideIndex + 1) % carouselSlides.length;
                updateCarousel();
            });
        }

        // 3. Add event listeners for thumbnails
        thumbnails.forEach((thumbnail) => {
            const index = parseInt(thumbnail.dataset.index);
            if (!isNaN(index)) {
                thumbnail.addEventListener('click', () => {
                    slideIndex = index;
                    updateCarousel();
                });
            }
        });

        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }

    const currentPage = window.location.pathname;
    if (currentPage.includes('/neila.html')) {
        Carousel('neilaAnimationCarousel');
        Carousel('neilaScientistCarousel');
        Carousel('enemyAnimationCarousel');
    }
    if (currentPage.includes('/suboptimal.html')) {
        Carousel('submarineSolutionCarousel');
        Carousel('suboptimalProblemsCarousel');
        Carousel('suboptimalInteractionsCarousel');
        Carousel('suboptimalMultiplayerCarousel');
    }
    if (currentPage.includes('/squirrel-bros.html')) {
        Carousel('squirrelConceptsCarousel');
    }



    // PROJECT ENTRIES HOVER/CLICK LOGIC
    const projectEntries = document.querySelectorAll('.project-entry');

    projectEntries.forEach(entry => {
        const mainMediaContainer = entry.querySelector('.project-hero-media');
        const mainImage = mainMediaContainer.querySelector('img');
        const hoverVideo = mainMediaContainer.querySelector('.hover-video');
        const thumbnails = entry.querySelectorAll('.thumbnail-item');
        const thumbnailGrid = entry.querySelector('.project-thumbnail-grid');

        let currentMainMediaElement = mainImage;
        const originalMainSrc = mainImage.src;

        // Listener for thumbnails to switch the main media
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('mouseenter', function() {
                const newMainSrc = this.dataset.mainSrc;
                const newMainType = this.dataset.mainType || 'image';

                if (hoverVideo) {
                    hoverVideo.pause();
                    hoverVideo.style.opacity = '0';
                }

                if (newMainSrc) {
                    const mediaToReplace = mainMediaContainer.querySelector('img, video');

                    if (newMainType === 'video') {
                        if (mediaToReplace && mediaToReplace.tagName !== 'VIDEO') {
                            const newVideo = document.createElement('video');
                            newVideo.src = newMainSrc;
                            newVideo.autoplay = true;
                            newVideo.loop = true;
                            newVideo.muted = true;
                            newVideo.playsInline = true;
                            mediaToReplace.classList.forEach(cls => newVideo.classList.add(cls));
                            mainMediaContainer.replaceChild(newVideo, mediaToReplace);
                            currentMainMediaElement = newVideo;
                        } else if (mediaToReplace) {
                            mediaToReplace.src = newMainSrc;
                            mediaToReplace.play();
                            currentMainMediaElement = mediaToReplace;
                        }
                    } else {
                        if (mediaToReplace && mediaToReplace.tagName !== 'IMG') {
                            const newImage = document.createElement('img');
                            newImage.src = newMainSrc;
                            mediaToReplace.classList.forEach(cls => newImage.classList.add(cls));
                            mainMediaContainer.replaceChild(newImage, mediaToReplace);
                            currentMainMediaElement = newImage;
                        } else if (mediaToReplace) {
                            mediaToReplace.src = newMainSrc;
                            currentMainMediaElement = mediaToReplace;
                        }
                    }
                    currentMainMediaElement.style.opacity = '1';
                }
            });
        });

        // Listener for the main media container itself
        if (mainMediaContainer) {
            mainMediaContainer.addEventListener('mouseenter', () => {
                if (hoverVideo && currentMainMediaElement === mainImage) {
                    hoverVideo.currentTime = 0;
                    hoverVideo.play();
                    mainImage.style.opacity = '0';
                    hoverVideo.style.opacity = '1';
                }
            });

            mainMediaContainer.addEventListener('mouseleave', () => {
                if (hoverVideo && currentMainMediaElement === mainImage) {
                    hoverVideo.pause();
                    hoverVideo.currentTime = 0;
                    hoverVideo.style.opacity = '0';
                    mainImage.style.opacity = '1';
                }
            });
        }

        // Listener for the thumbnail grid to revert to the original image
        if (thumbnailGrid) {
            thumbnailGrid.addEventListener('mouseleave', function() {
                const mediaToReplace = mainMediaContainer.querySelector('img, video');

                if (mediaToReplace && mediaToReplace.tagName !== 'IMG') {
                    const originalImg = document.createElement('img');
                    originalImg.src = originalMainSrc;
                    mediaToReplace.classList.forEach(cls => originalImg.classList.add(cls));
                    mainMediaContainer.replaceChild(originalImg, mediaToReplace);
                    currentMainMediaElement = originalImg;
                } else if (mediaToReplace) {
                    mediaToReplace.src = originalMainSrc;
                    currentMainMediaElement = mediaToReplace;
                }
                if (currentMainMediaElement) {
                    currentMainMediaElement.style.opacity = '1';
                }
            });
        }

        // The project click logic remains the same
        entry.addEventListener('click', function(event) {
            if (event.target.closest('.thumbnail-item')) {
                return;
            }
            const projectUrl = this.dataset.projectUrl;
            if (projectUrl) {
                window.location.href = projectUrl;
            }
        });
        entry.style.cursor = 'pointer';
    });

    // FOOTER YEAR UPDATE
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // VIDEO DROPDOWN LAZY LOADING
    const detailElements = document.querySelectorAll('details.text-image-dropdown');

    detailElements.forEach(detail => {
        detail.addEventListener('toggle', () => {
            const videoElement = detail.querySelector('video.lazy-video');

            if (videoElement) {
                if (detail.open) {
                    if (!videoElement.dataset.loaded) {
                        const sources = videoElement.querySelectorAll('source[data-src]');
                        sources.forEach(source => {
                            source.src = source.dataset.src;
                            source.removeAttribute('data-src');
                        });
                        videoElement.load();
                        videoElement.dataset.loaded = 'true';
                    }

                    const playPromise = videoElement.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.warn('Video autoplay prevented:', error);
                        });
                    }
                } else {
                    videoElement.pause();
                    videoElement.currentTime = 0;
                }
            }
        });
    });



    // DROPDOWN FOR PROJECTS NAVBAR
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const gamesLink = document.getElementById('games-link');
    const gamesDropdown = document.getElementById('games-dropdown');

    // Toggle the dropdown on 'Games' link click
    gamesLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevents the link from navigating
        gamesDropdown.classList.toggle('active');
        dropdownToggle.classList.toggle('active');
    });

    // Close the dropdown when clicking outside of it
    document.addEventListener('click', function(event) {
        const isClickInsideDropdown = gamesDropdown.contains(event.target);
        const isClickOnLink = gamesLink.contains(event.target);

        if (!isClickInsideDropdown && !isClickOnLink && gamesDropdown.classList.contains('active')) {
            gamesDropdown.classList.remove('active');
            dropdownToggle.remove.toggle('active');
        }
    });
});