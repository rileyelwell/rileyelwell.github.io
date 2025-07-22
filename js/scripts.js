document.addEventListener('DOMContentLoaded', function() {
    // ABOUT PAGE MEDIA CAROUSEL
    const mediaItems = document.querySelectorAll('.media-display img');
    const thumbnailsContainer = document.querySelector('.thumbnail-nav');
    const dotsContainer = document.querySelector('.pagination-dots');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    let currentIndex = 0;
    let autoSlideInterval;
    const slideDuration = 5000;

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
            img.src = item.src;
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
                startAutoSlide();
            });
            dotSpan.addEventListener('click', () => {
                showMedia(index);
                startAutoSlide();
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

        mediaItems.forEach(item => item.classList.remove('active-media'));
        generatedThumbnails.forEach(thumb => thumb.classList.remove('active-thumbnail'));
        generatedDots.forEach(dot => dot.classList.remove('active-dot'));

        mediaItems[index].classList.add('active-media');
        generatedThumbnails[index].classList.add('active-thumbnail');
        generatedDots[index].classList.add('active-dot');

        currentIndex = index;

        const activeThumbnail = generatedThumbnails[index];
        if (activeThumbnail && activeThumbnail.parentElement && activeThumbnail.parentElement.scrollLeft !== undefined) {
            activeThumbnail.parentElement.scrollLeft = activeThumbnail.offsetLeft - (activeThumbnail.parentElement.offsetWidth / 2) + (activeThumbnail.offsetWidth / 2);
        }
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % mediaItems.length;
            showMedia(currentIndex);
        }, slideDuration);
    }

    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            showMedia(currentIndex - 1);
            startAutoSlide();
        });
    }
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            showMedia(currentIndex + 1);
            startAutoSlide();
        });
    }

    setupCarouselElements();
    showMedia(0);
    startAutoSlide();

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

            carouselSlides.forEach((slide, index) => {
                const videoElement = slide;

                slide.classList.remove('active');
                if (index === slideIndex) {
                    slide.classList.add('active');
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

        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }

    const currentPage = window.location.pathname;
    if (currentPage.includes('/neila.html')) {
        Carousel('neilaAnimationCarousel');
        Carousel('neilaScientistCarousel');
        Carousel('enemyAnimationCarousel');
    }

    // PROJECT ENTRIES HOVER/CLICK LOGIC
    const projectEntries = document.querySelectorAll('.project-entry');

    projectEntries.forEach(entry => {
        const mainMediaContainer = entry.querySelector('.project-hero-media');
        const mainImage = mainMediaContainer.querySelector('img');
        const hoverVideo = mainMediaContainer.querySelector('.hover-video');
        const thumbnails = entry.querySelectorAll('.thumbnail-item');

        let currentMainMediaElement = mainImage;
        const originalMainSrc = mainImage.src;

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
                        if (mediaToReplace.tagName !== 'VIDEO') {
                            const newVideo = document.createElement('video');
                            newVideo.src = newMainSrc;
                            newVideo.autoplay = true;
                            newVideo.loop = true;
                            newVideo.muted = true;
                            newVideo.playsInline = true;
                            mediaToReplace.classList.forEach(cls => newVideo.classList.add(cls));
                            mainMediaContainer.replaceChild(newVideo, mediaToReplace);
                            currentMainMediaElement = newVideo;
                        } else {
                            mediaToReplace.src = newMainSrc;
                            mediaToReplace.play();
                            currentMainMediaElement = mediaToReplace;
                        }
                    } else {
                        if (mediaToReplace.tagName !== 'IMG') {
                            const newImage = document.createElement('img');
                            newImage.src = newMainSrc;
                            mediaToReplace.classList.forEach(cls => newImage.classList.add(cls));
                            mainMediaContainer.replaceChild(newImage, mediaToReplace);
                            currentMainMediaElement = newImage;
                        } else {
                            mediaToReplace.src = newMainSrc;
                            currentMainMediaElement = mediaToReplace;
                        }
                    }
                    currentMainMediaElement.style.opacity = '1';
                }
            });
        });

        const thumbnailGrid = entry.querySelector('.project-thumbnail-grid');
        if (thumbnailGrid) {
            thumbnailGrid.addEventListener('mouseleave', function() {
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
                    hoverVideo.currentTime = 0;
                    hoverVideo.style.opacity = '0';
                }
            });
        }

        let isThumbnailHovered = false;

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('mouseenter', () => isThumbnailHovered = true);
            thumbnail.addEventListener('mouseleave', () => isThumbnailHovered = false);
        });

        entry.addEventListener('mouseenter', function() {
            if (hoverVideo && !isThumbnailHovered && currentMainMediaElement === mainImage) {
                hoverVideo.currentTime = 0;
                hoverVideo.play();
                mainImage.style.opacity = '0';
                hoverVideo.style.opacity = '1';
            }
        });

        entry.addEventListener('mouseleave', function() {
            if (hoverVideo && !isThumbnailHovered) {
                hoverVideo.pause();
                hoverVideo.currentTime = 0;
                hoverVideo.style.opacity = '0';
                mainImage.style.opacity = '1';
            }
        });

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
});