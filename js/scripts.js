/*!
* Start Bootstrap - Freelancer v7.0.7 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/


document.addEventListener('DOMContentLoaded', () => {
    const projectLinks = document.querySelectorAll('.project-link');

    projectLinks.forEach(link => {
        const video = link.querySelector('.project-video');

        if (video) {
            link.addEventListener('mouseenter', () => {
                video.play();
            });

            link.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0; // Optionally reset video to start
            });
        }
    });
});

// -- ABOUT PAGE MEDIA CAROUSEL -- //
document.addEventListener('DOMContentLoaded', function() {

    // Select carousel elements.
    const mediaItems = document.querySelectorAll('.media-display img');
    const thumbnailsContainer = document.querySelector('.thumbnail-nav');
    const dotsContainer = document.querySelector('.pagination-dots');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    let currentIndex = 0; // Current slide index
    let autoSlideInterval; // Variable to hold the auto-slide timer
    const slideDuration = 5000; // 5 seconds per slide

    let generatedThumbnails = []; // Will store references to dynamically created thumbnail elements
    let generatedDots = []; // Will store references to dynamically created dot elements

    // Function to set up carousel elements (thumbnails and dots)
    function setupCarouselElements() {
        // Only proceed if all necessary containers and media items are found
        if (!thumbnailsContainer || !dotsContainer || mediaItems.length === 0) {
            console.warn("Carousel elements not found (thumbnail container, dots container, or no media items). Skipping carousel setup.");
            return; // Exit function if elements are missing
        }

        // Clear any existing static/old dynamic elements from containers
        thumbnailsContainer.innerHTML = '';
        dotsContainer.innerHTML = '';

        // Reset arrays before populating
        generatedThumbnails = [];
        generatedDots = [];

        // Loop through each main media item to create corresponding thumbnails and dots
        mediaItems.forEach((item, index) => {
            // Create and append thumbnail
            const thumbDiv = document.createElement('div');
            thumbDiv.classList.add('thumbnail');
            thumbDiv.dataset.index = index;
            const img = document.createElement('img');
            img.src = item.src; // Use the main image's source for thumbnail (adjust if using separate thumb images)
            img.alt = `Thumbnail ${index + 1}`;
            thumbDiv.appendChild(img);
            thumbnailsContainer.appendChild(thumbDiv);
            generatedThumbnails.push(thumbDiv);

            // Create and append dot
            const dotSpan = document.createElement('span');
            dotSpan.classList.add('dot');
            dotSpan.dataset.index = index;
            dotsContainer.appendChild(dotSpan);
            generatedDots.push(dotSpan);

            // Attach click listeners to the *newly created* elements
            thumbDiv.addEventListener('click', () => {
                showMedia(index);
                startAutoSlide(); // Restart auto-slide on manual navigation
            });
            dotSpan.addEventListener('click', () => {
                showMedia(index);
                startAutoSlide(); // Restart auto-slide on manual navigation
            });
        });
    }

    // Function to display a specific media item and update active states
    function showMedia(index) {
        // Validate index and loop if out of bounds
        if (index < 0) {
            index = mediaItems.length - 1;
        } else if (index >= mediaItems.length) {
            index = 0;
        }

        // Critical Check: Ensure generated arrays are populated before accessing
        if (generatedThumbnails.length === 0 || generatedDots.length === 0) {
             console.error("Carousel elements (thumbnails/dots) not generated. Cannot update active states.");
             return;
        }

        // Remove 'active' class from all elements
        mediaItems.forEach(item => item.classList.remove('active-media'));
        generatedThumbnails.forEach(thumb => thumb.classList.remove('active-thumbnail'));
        generatedDots.forEach(dot => dot.classList.remove('active-dot'));

        // Add 'active' class to the current elements
        mediaItems[index].classList.add('active-media');
        generatedThumbnails[index].classList.add('active-thumbnail');
        generatedDots[index].classList.add('active-dot');

        currentIndex = index; // Update current index

        // Optional: Scroll thumbnail nav to center the active thumbnail
        const activeThumbnail = generatedThumbnails[index];
        if (activeThumbnail && activeThumbnail.parentElement && activeThumbnail.parentElement.scrollLeft !== undefined) {
            activeThumbnail.parentElement.scrollLeft = activeThumbnail.offsetLeft - (activeThumbnail.parentElement.offsetWidth / 2) + (activeThumbnail.offsetWidth / 2);
        }
    }

    // Function to start or restart the automatic slide timer
    function startAutoSlide() {
        clearInterval(autoSlideInterval); // Clear any existing interval
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % mediaItems.length;
            showMedia(currentIndex);
        }, slideDuration);
    }

    // Attach event listeners for navigation arrows (check if they exist)
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            showMedia(currentIndex - 1);
            startAutoSlide(); // Restart auto-slide on manual navigation
        });
    }
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            showMedia(currentIndex + 1);
            startAutoSlide(); // Restart auto-slide on manual navigation
        });
    }

    setupCarouselElements();
    showMedia(0);
    startAutoSlide();
});


// -- LOADING CODE SNIPPETS SECTION -- //
document.addEventListener('DOMContentLoaded', function() {
    
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
        const playerCodePreElement = playerControllerDetails.querySelector('pre'); // Use specific variable name
        playerControllerDetails.addEventListener('toggle', function() {
            if (this.open) {
                playerCodePreElement.classList.add('code-scrollable');
            } else {
                playerCodePreElement.classList.remove('code-scrollable');
            }
        });
        loadCodeSnippet('playerControllerCode', 'assets/code/PlayerController.cs.txt');
    }

    const triggerPointDetails = document.querySelector('details:has(#triggerPointCode)'); // Select the new details element
    if (triggerPointDetails) {
        const triggerPointCodePreElement = triggerPointDetails.querySelector('pre'); // Get its corresponding pre element
        triggerPointDetails.addEventListener('toggle', function() {
            if (this.open) {
                triggerPointCodePreElement.classList.add('code-scrollable');
            } else {
                triggerPointCodePreElement.classList.remove('code-scrollable');
            }
        });
        loadCodeSnippet('triggerPointCode', 'assets/code/TriggerPoint.cs.txt'); // Load the new script
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- Carousel Class/Function ---
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

        // Function to update the carousel position
        const updateCarousel = () => {
            // Recalculate slideWidth in case of resize
            if (carouselSlides.length > 0) {
                slideWidth = carouselSlides[0].getBoundingClientRect().width;
            } else {
                slideWidth = 0; // Handle case with no slides
            }

            carouselTrack.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
            updateDots();
        };

        // Function to update the active dot
        const updateDots = () => {
            carouselDotsContainer.innerHTML = ''; // Clear existing dots
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

        // Initialize carousel
        updateCarousel(); // Initial render

        // Event listener for window resize
        window.addEventListener('resize', updateCarousel);
    }


    const currentPage = window.location.pathname;

    // Example 1: Run on a specific page (e.g., your project detail page)
    if (currentPage.includes('/neila.html')) {
        Carousel('neilaAnimationCarousel');
        Carousel('neilaScientistCarousel');
        Carousel('enemyAnimationCarousel');
    }

    // Carousel('neilaAnimationCarousel');
    // Carousel('neilaScientistCarousel');
    // Carousel('enemyAnimationCarousel');
});

document.addEventListener('DOMContentLoaded', function() {
    const projectEntries = document.querySelectorAll('.project-entry');

    projectEntries.forEach(entry => {
        const mainMediaContainer = entry.querySelector('.project-hero-media');
        const mainImage = mainMediaContainer.querySelector('img');
        const hoverVideo = mainMediaContainer.querySelector('.hover-video');
        const thumbnails = entry.querySelectorAll('.thumbnail-item');

        let currentMainMediaElement = mainImage; // Keep track of what's currently displayed
        const originalMainSrc = mainImage.src; // Original image for fallback
        const originalMainTag = 'IMG';

        // --- Thumbnail Hover Functionality ---
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('mouseenter', function() {
                const newMainSrc = this.dataset.mainSrc;
                const newMainType = this.dataset.mainType || 'image'; // Default to image if not specified

                // Pause and hide the general hover video if it's playing
                if (hoverVideo) {
                    hoverVideo.pause();
                    hoverVideo.style.opacity = '0';
                }

                if (newMainSrc) {
                    // Check what's currently in the main media container
                    const mediaToReplace = mainMediaContainer.querySelector('img, video');

                    if (newMainType === 'video') {
                        if (mediaToReplace.tagName !== 'VIDEO') {
                            const newVideo = document.createElement('video');
                            newVideo.src = newMainSrc;
                            newVideo.autoplay = true;
                            newVideo.loop = true;
                            newVideo.muted = true;
                            newVideo.playsInline = true;
                            mediaToReplace.classList.forEach(cls => newVideo.classList.add(cls));
                            mainMediaContainer.replaceChild(newVideo, mediaToReplace);
                            currentMainMediaElement = newVideo; // Update current element
                        } else {
                            mediaToReplace.src = newMainSrc;
                            mediaToReplace.play(); // Ensure it plays if just source changed
                            currentMainMediaElement = mediaToReplace;
                        }
                    } else { // newMainType === 'image'
                        if (mediaToReplace.tagName !== 'IMG') {
                            const newImage = document.createElement('img');
                            newImage.src = newMainSrc;
                            mediaToReplace.classList.forEach(cls => newImage.classList.add(cls));
                            mainMediaContainer.replaceChild(newImage, mediaToReplace);
                            currentMainMediaElement = newImage; // Update current element
                        } else {
                            mediaToReplace.src = newMainSrc;
                            currentMainMediaElement = mediaToReplace;
                        }
                    }
                    // Ensure the swapped thumbnail media is visible
                    currentMainMediaElement.style.opacity = '1';
                }
            });
        });

        const thumbnailGrid = entry.querySelector('.project-thumbnail-grid');
        if (thumbnailGrid) {
            thumbnailGrid.addEventListener('mouseleave', function() {
                // Revert to the original main image and hide the general hover video
                const mediaToReplace = mainMediaContainer.querySelector('img, video');

                if (mediaToReplace.tagName !== 'IMG') {
                    const originalImg = document.createElement('img');
                    originalImg.src = originalMainSrc;
                    mediaToReplace.classList.forEach(cls => originalImg.classList.add(cls));
                    mainMediaContainer.replaceChild(originalImg, mediaToReplace);
                    currentMainMediaElement = originalImg;
                } else {
                    mediaToReplace.src = originalMainSrc;
                    currentMainMediaElement = mediaToReplace;
                }
                currentMainMediaElement.style.opacity = '1';

                if (hoverVideo) {
                    hoverVideo.pause();
                    hoverVideo.currentTime = 0; // Reset video to beginning
                    hoverVideo.style.opacity = '0';
                }
            });
        }

        // --- NEW: Project Entry Hover for Video/GIF Playback ---
        let isThumbnailHovered = false; // Flag to track if a thumbnail is currently hovered

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('mouseenter', () => isThumbnailHovered = true);
            thumbnail.addEventListener('mouseleave', () => isThumbnailHovered = false);
        });

        entry.addEventListener('mouseenter', function() {
            // Only play the video if no thumbnail is currently hovered
            // And if the current main media is the *original* image (not a thumbnail-swapped one)
            // This prevents video from playing when a thumbnail image is already active
            if (hoverVideo && !isThumbnailHovered && currentMainMediaElement === mainImage) {
                hoverVideo.currentTime = 0; // Reset to start
                hoverVideo.play();
                mainImage.style.opacity = '0'; // Hide the image
                hoverVideo.style.opacity = '1'; // Show the video
            }
        });

        entry.addEventListener('mouseleave', function() {
            // Only pause/hide the video if a thumbnail is NOT currently hovered
            // (The thumbnail leave event handles reverting its own state)
            if (hoverVideo && !isThumbnailHovered) {
                hoverVideo.pause();
                hoverVideo.currentTime = 0; // Reset for next time
                hoverVideo.style.opacity = '0'; // Hide the video
                mainImage.style.opacity = '1'; // Show the image again
            }
        });

        // --- Click functionality for the whole project entry (Keep this) ---
        entry.addEventListener('click', function(event) {
            if (event.target.closest('.thumbnail-item')) {
                return;
            }
            const projectUrl = this.dataset.projectUrl;
            if (projectUrl) {
                window.location.href = projectUrl;
            }
        });
        entry.style.cursor = 'pointer'; // Ensure cursor is still pointer
    });
});

// update current year for footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});