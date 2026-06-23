document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const html = document.documentElement;

    //Кастомный селект
    const selectElements = document.querySelectorAll('[data-select]');

    selectElements.forEach((selectElement) => {
        // Кастомный селект для выбора языка в шапке
        if (selectElement.closest('.header-lang')) {
            new Choices(selectElement, {
                searchEnabled: false,
                itemSelectText: '',
                placeholder: false,
                placeholderValue: '',
                shouldSort: false,
            });

            // Сохраняем URL для каждого option
            const options = selectElement.options;
            const urls = {};
            for (let i = 0; i < options.length; i++) {
                urls[options[i].value] = options[i].getAttribute('data-url');
            }

            // Обработчик изменения
            selectElement.addEventListener('change', function (e) {
                const url = urls[this.value];
                if (url && url !== '#!') {
                    window.location.href = url;
                }
            });
        }
    });

    //Loading Lazy для фоновых изображений (комп и мобильная версия)
    const lazyBackgrounds = document.querySelectorAll('[data-lazy-desktop]');

    if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const isMobile = window.innerWidth <= 540;
                        const bgUrl = isMobile ? element.dataset.lazyMobile : element.dataset.lazyDesktop;

                        if (bgUrl) {
                            element.style.backgroundImage = `url(${bgUrl})`;
                            element.classList.add('bg-loaded');
                        }

                        bgObserver.unobserve(element);
                    }
                });
            },
            {
                rootMargin: '200px',
            }
        );

        lazyBackgrounds.forEach((element) => {
            bgObserver.observe(element);
        });
    } else {
        lazyBackgrounds.forEach((element) => {
            const isMobile = window.innerWidth <= 540;
            const bgUrl = isMobile ? element.dataset.lazyMobile : element.dataset.lazyDesktop;

            if (bgUrl) {
                element.style.backgroundImage = `url(${bgUrl})`;
            }
        });
    }

    //Loading Lazy для фоновых изображений
    const lazyBg = document.querySelectorAll('[data-lazy-bg]');
    if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const bgUrl = element.dataset.lazyBg;

                        if (bgUrl) {
                            element.style.backgroundImage = `url(${bgUrl})`;
                            element.classList.add('bg-loaded');
                        }

                        bgObserver.unobserve(element);
                    }
                });
            },
            {
                rootMargin: '200px',
            }
        );

        lazyBg.forEach((element) => {
            bgObserver.observe(element);
        });
    } else {
        lazyBg.forEach((element) => {
            const bgUrl = element.dataset.lazyBg;

            if (bgUrl) {
                element.style.backgroundImage = `url(${bgUrl})`;
            }
        });
    }

    // Панель поиска в шапке
    const headerSearchButton = document.querySelector('.header-search__button');
    const headerSearchModal = document.querySelector('.header-search__modal');

    function openSearchModal() {
        headerSearchModal.removeAttribute('hidden');
        headerSearchModal.setAttribute('aria-label', 'Скрыть поиск');
        setTimeout(() => {
            headerSearchModal.classList.add('active');
            document.addEventListener('click', handleClickOutside);
        }, 0);

        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    function closeSearchModal() {
        headerSearchModal.setAttribute('hidden', true);
        headerSearchModal.setAttribute('aria-label', 'Открыть поиск');
        setTimeout(() => {
            headerSearchModal.classList.remove('active');
            document.removeEventListener('click', handleClickOutside);
        }, 0);
    }

    if (headerSearchButton && headerSearchModal) {
        function handleClickOutside(e) {
            if (!headerSearchButton.contains(e.target) && !headerSearchModal.contains(e.target)) {
                closeSearchModal();
            }
        }

        headerSearchButton.addEventListener('click', function () {
            if (!headerSearchModal.classList.contains('active')) {
                openSearchModal();
            } else {
                closeSearchModal();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && headerSearchModal.classList.contains('active')) {
                closeSearchModal();
            }
        });
    }

    // Слайдер (4 слайда на комп версии)
    const swipers_4 = document.querySelectorAll('.swiper-4');
    if (swipers_4) {
        swipers_4.forEach((swiper) => {
            const parent = swiper.closest('section');
            const previousButton = parent.querySelector('.slider-button--prev');
            const nextButton = parent.querySelector('.slider-button--next');

            new Swiper(swiper, {
                slidesPerView: 'auto',
                spaceBetween: 14,
                navigation: {
                    nextEl: nextButton,
                    prevEl: previousButton,
                },
                breakpoints: {
                    1640: {
                        spaceBetween: 20,
                        slidesPerView: 4,
                    },
                    1440: {
                        spaceBetween: 18,
                        slidesPerView: 4,
                    },
                    768: {
                        spaceBetween: 16,
                        slidesPerView: 'auto',
                    },
                },
            });
        });
    }

    // Слайдер (3 слайда на главной)
    const swipers_3 = document.querySelectorAll('.swiper-3');
    if (swipers_3) {
        swipers_3.forEach((swiper) => {
            const parent = swiper.closest('section');
            const previousButton = parent.querySelector('.slider-button--prev') || null;
            const nextButton = parent.querySelector('.slider-button--next') || null;

            new Swiper(swiper, {
                spaceBetween: 14,
                slidesPerView: 'auto',
                navigation: {
                    nextEl: nextButton,
                    prevEl: previousButton,
                },
                breakpoints: {
                    1440: {
                        spaceBetween: 20,
                        slidesPerView: 3,
                    },
                },
            });
        });
    }

    //Активный слайд/ кол-во слайдов
    const swiperBullets = document.querySelectorAll('.swiper-bullet');
    if (swiperBullets) {
        swiperBullets.forEach((element) => {
            const swiperSlides = element.querySelectorAll('.swiper-slide');
            swiperSlides.forEach((slide) => {
                const numbersSlide = slide.getAttribute('aria-label');
                const [current, total] = numbersSlide.split(' / ');

                const parentHeader = slide.querySelector('.statistic-item__header');
                const bullet = document.createElement('div');
                bullet.classList.add('swiper-bullet__items');

                for (let i = 1; i <= Number(total); i++) {
                    const bulletItem = document.createElement('span');
                    bulletItem.classList.add('swiper-bullet__item');
                    if (i <= Number(current)) {
                        bulletItem.classList.add('active');
                    }

                    bullet.appendChild(bulletItem);
                }

                parentHeader.appendChild(bullet);
            });
        });
    }

    // Слайдер на размерах экрана <= 1024
    const swipers_tablet = document.querySelectorAll('.swiper-tablet');
    let swiperInstances = [];

    function initSwiperTablet() {
        const isTablet = window.innerWidth <= 1024;

        if (isTablet && swiperInstances.length === 0) {
            swipers_tablet.forEach((swiper) => {
                swiperInstances.push(
                    new Swiper(swiper, {
                        slidesPerView: 'auto',
                        spaceBetween: 12,
                    })
                );
            });
        } else if (!isTablet && swiperInstances.length > 1) {
            swiperInstances.forEach((instance) => {
                instance.destroy(true, true);
            });
            swiperInstances = [];
        }
    }
    initSwiperTablet();

    // Слайдер на экранах <= 1045
    const grid_swipers = document.querySelectorAll('.grid-swiper');
    let gridSwipersInstances = [];

    function initSwiperGridSwiper() {
        const isTablet = window.innerWidth <= 1045;

        if (isTablet && grid_swipers.length > 0) {
            if (gridSwipersInstances.length === 0) {
                grid_swipers.forEach((swiper) => {
                    gridSwipersInstances.push(
                        new Swiper(swiper, {
                            slidesPerView: 'auto',
                            spaceBetween: 14,
                        })
                    );
                });
            }
        } else if (!isTablet && gridSwipersInstances.length > 0) {
            gridSwipersInstances.forEach((instance) => {
                instance.destroy(true, true);
            });
            gridSwipersInstances = [];
        }
    }

    initSwiperGridSwiper();

    // Слайдер изображений на странице товара
    const simpleProductImagesSwiper = document.querySelectorAll('.simple-product__images-swiper .swiper');
    if (simpleProductImagesSwiper) {
        simpleProductImagesSwiper.forEach((swiper) => {
            const parent = swiper.closest('section');
            const previousButton = parent.querySelector('.simple-product__images-button--prev') || null;
            const nextButton = parent.querySelector('.simple-product__images-button--next') || null;

            new Swiper(swiper, {
                slidesPerView: 'auto',
                spaceBetween: 14,
                direction: 'horizontal',
                navigation: {
                    nextEl: nextButton,
                    prevEl: previousButton,
                },
                breakpoints: {
                    992: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                        direction: 'vertical',
                    },
                },
            });
        });
    }

    // Изображение слайдера на странице товара
    const simpleProductImages = document.querySelector('.simple-product__images');
    if (simpleProductImages) {
        simpleProductImages.addEventListener('click', function (e) {
            const item = e.target.closest('.simple-product__images-item');
            if (!item) return;

            if (window.innerWidth >= 991) {
                const src = item.querySelector('img').getAttribute('src');
                const previewImage = document.querySelector('.simple-product__images-preview img');

                if (!previewImage) return;

                const currentSrc = previewImage.getAttribute('src');

                this.querySelectorAll('.simple-product__images-item').forEach((el) => {
                    el.classList.remove('active');
                });

                if (src === currentSrc) {
                    item.classList.add('active');
                    return;
                }

                previewImage.setAttribute('src', src);
                item.classList.add('active');
            }
        });
    }

    // Открытие / закрытие модального окна
    const dataOpenModal = document.querySelectorAll('[data-open-modal]');
    const dataCloseModal = document.querySelectorAll('[data-close-modal]');

    if (dataOpenModal && dataCloseModal) {
        dataOpenModal.forEach((element) => {
            element.addEventListener('click', function () {
                const attr = element.getAttribute('data-open-modal');
                const modal = document.querySelector(`[data-modal="${attr}"]`);
                if (modal) {
                    html.classList.add('no-scroll');
                    body.classList.add('no-scroll');
                    modal.removeAttribute('hidden');
                    setTimeout(() => {
                        modal.classList.add('active');
                    }, 0);
                }
            });
        });

        dataCloseModal.forEach((element) => {
            element.addEventListener('click', function (e) {
                const modal = e.target.closest('.modal');
                closeModal(modal);
            });
        });

        document.addEventListener('click', function (e) {
            const modal = e.target.closest('.modal');
            if (modal && e.target === modal) {
                closeModal(modal);
            }
        });
    }

    function closeModal(modal) {
        if (!modal) return;
        html.classList.remove('no-scroll');
        body.classList.remove('no-scroll');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.setAttribute('hidden', true);
        }, 100);
    }

    // Мобильное меню
    const headerMobileButton = document.querySelector('.header-mobile__button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMainMenu = document.querySelector('.header-mobile__main-menu');

    function mobileMenuHiddenOnDesktop() {
        if (!mobileMenu) return;
        if (window.innerWidth >= 1251) {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
            if (!mobileMenu.hasAttribute('hidden')) {
                mobileMenu.setAttribute('hidden', true);
            }

            if (body.classList.contains('no-scroll')) {
                body.classList.remove('no-scroll');
            }

            if (html.classList.contains('no-scroll')) {
                html.classList.remove('no-scroll');
            }
        }
    }

    mobileMenuHiddenOnDesktop();

    function openMobileMenu() {
        headerMobileButton.setAttribute('aria-label', 'Закрыть мобильное меню');
        mobileMenu.classList.add('active');
        mobileMenu.removeAttribute('hidden');

        body.classList.add('no-scroll');
        html.classList.add('no-scroll');

        if (headerSearchModal.classList.contains('active')) {
            closeSearchModal();
        }
    }

    function closeMobileMenu() {
        headerMobileButton.setAttribute('aria-label', 'Открыть мобильное меню');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('hidden', true);

        body.classList.remove('no-scroll');
        html.classList.remove('no-scroll');
    }

    if (headerMobileButton && mobileMenu) {
        headerMobileButton.addEventListener('click', function () {
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        mobileMenu.addEventListener('click', function (e) {
            if (e.target.classList.contains('header-mobile__open-btn')) {
                const openButton = e.target;
                const id = openButton.getAttribute('aria-controls');
                const subMenu = document.getElementById(id);
                if (!subMenu.classList.contains('active') && subMenu.hasAttribute('hidden')) {
                    if (mobileMainMenu && !mobileMainMenu.hasAttribute('hidden')) {
                        mobileMainMenu.setAttribute('hidden', true);
                    }

                    subMenu.removeAttribute('hidden');
                }
            }
            if (e.target.classList.contains('header-mobile__back-btn')) {
                const backButton = e.target;
                const parent = backButton.closest('.header-mobile__submenu-nav');
                if (parent && !parent.hasAttribute('hidden')) {
                    parent.setAttribute('hidden', true);
                }
                if (mobileMainMenu && mobileMainMenu.hasAttribute('hidden')) {
                    mobileMainMenu.removeAttribute('hidden');
                }
            }
        });
    }

    // переключатель toggle
    const dataToggleParents = document.querySelectorAll('[data-toggle-parent]');
    if (dataToggleParents) {
        dataToggleParents.forEach((element) => {
            element.addEventListener('click', function (e) {
                if (e.target.closest('[data-toggle-button]')) {
                    const content = e.target.closest('[data-toggle-content]');
                    const body = content.querySelector('[data-toggle-hidden]');
                    if (content && body) {
                        if (content.classList.contains('active')) {
                            body.style.maxHeight = '0';
                            body.style.opacity = '0';
                            setTimeout(() => {
                                body.setAttribute('hidden', true);
                            }, 300);
                            content.classList.remove('active');
                        } else {
                            body.removeAttribute('hidden');

                            requestAnimationFrame(() => {
                                body.style.maxHeight = body.scrollHeight + 'px';
                                body.style.opacity = '1';
                            });
                            content.classList.add('active');
                        }
                    }
                }
            });
        });
    }

    // Изменения при изменении размера экрана
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            //Loading Lazy для фоновых изображений
            lazyBackgrounds.forEach((element) => {
                if (element.style.backgroundImage) {
                    const isMobile = window.innerWidth <= 540;
                    const bgUrl = isMobile ? element.dataset.lazyMobile : element.dataset.lazyDesktop;

                    if (bgUrl) {
                        element.style.backgroundImage = `url(${bgUrl})`;
                    }
                }
            });

            // Слайдер на размерах экрана <= 1024
            initSwiperTablet();

            // Мобильное меню
            mobileMenuHiddenOnDesktop();

            // Слайдер на экранах <= 1045
            initSwiperGridSwiper();
        }, 0);
    });
});
