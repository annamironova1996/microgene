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

            const options = selectElement.options;
            const urls = {};
            for (let i = 0; i < options.length; i++) {
                urls[options[i].value] = options[i].getAttribute('data-url');
            }

            selectElement.addEventListener('change', function (e) {
                const url = urls[this.value];
                if (url && url !== '#!') {
                    window.location.href = url;
                }
            });
        }

        // Кастомный селект для инпутов в форме
        if (selectElement.closest('.page-form__inner select')) {
            new Choices(selectElement, {
                searchEnabled: false,
                itemSelectText: '',
                placeholder: true,
                placeholderValue: 'Выберите из списка',
                shouldSort: false,
            });
        }

        // Кастомный селект для кол-ва новостей на странице
        if(selectElement.closest('.show-select')) {
             new Choices(selectElement, {
                searchEnabled: false,
                itemSelectText: '',
                placeholder: false,
                placeholderValue: '',
                shouldSort: false,
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

    // Слайдер (авто)
    const swipers_auto = document.querySelectorAll('.swiper-auto');
    if (swipers_auto) {
        swipers_auto.forEach((swiper) => {
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
                        slidesPerView: 'auto',
                    },
                    1440: {
                        spaceBetween: 18,
                        slidesPerView: 'auto',
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

    // Загрузка файлов в форме
    const fileInputs = document.querySelectorAll('.page-form__files input[type="file"]');
    if (fileInputs) {
        fileInputs.forEach((input) => {
            input.addEventListener('change', function () {
                const files = Array.from(this.files);
                const parent = this.closest('.page-form__files');
                const infoElement = parent.querySelector('.page-form__files-name span');

                if (files.length === 0) {
                    infoElement.textContent = 'Файл не выбран';
                    return;
                }

                const names = files.map((file) => file.name);
                infoElement.textContent = names.join(', ');
            });
        });
    }

    // Валидация дат в инпутах формы дд/мм/гг
    const dateInputs = document.querySelectorAll('[data-date-input]');
    if (dateInputs) {
        dateInputs.forEach((input) => {
            let previousLength = 0;
            let previousRawValue = '';

            input.addEventListener('input', function () {
                const currentLength = this.value.length;
                const isDeleting = currentLength < previousLength;

                let value = this.value.replace(/\D/g, '');

                if (value.length > 6) {
                    value = value.slice(0, 6);
                }

                if (!isDeleting && value.length > 0) {
                    value = autoCorrectDate(value, previousRawValue);
                }

                let formatted = '';
                for (let i = 0; i < value.length; i++) {
                    if (i === 2 || i === 4) {
                        formatted += '/';
                    }
                    formatted += value[i];
                }

                this.value = formatted;
                previousLength = formatted.length;
                previousRawValue = value;
            });

            input.addEventListener('paste', function () {
                setTimeout(() => {
                    this.dispatchEvent(new Event('input'));
                }, 0);
            });

            input.addEventListener('blur', function () {
                const value = this.value.replace(/\D/g, '');
                if (value.length === 6) {
                    const day = value.slice(0, 2);
                    const month = value.slice(2, 4);
                    let year = value.slice(4, 6);

                    const currentYear = new Date().getFullYear();
                    const currentYearShort = currentYear % 100;

                    let yearNum = parseInt(year);
                    if (yearNum > currentYearShort) yearNum = currentYearShort;
                    if (yearNum < 0) yearNum = 0;
                    year = String(yearNum).padStart(2, '0');

                    const corrected = day + month + year;
                    let formatted = '';
                    for (let i = 0; i < corrected.length; i++) {
                        if (i === 2 || i === 4) formatted += '/';
                        formatted += corrected[i];
                    }
                    this.value = formatted;
                }
            });
        });
    }

    function autoCorrectDate(value, previousValue = '') {
        if (value.length === 0) return value;

        const currentYear = new Date().getFullYear();
        const currentYearShort = currentYear % 100;

        let day = '';
        let month = '';
        let year = '';

        if (value.length <= 2) {
            day = value;
            const dayNum = parseInt(day);
            if (dayNum > 31) {
                day = '31';
            }
            if (dayNum < 1 && day.length === 2) {
                day = '01';
            }
            return day;
        } else if (value.length <= 4) {
            day = value.slice(0, 2);
            month = value.slice(2);

            let dayNum = parseInt(day);
            if (dayNum > 31) dayNum = 31;
            if (dayNum < 1) dayNum = 1;
            day = String(dayNum).padStart(2, '0');

            let monthNum = parseInt(month);
            if (monthNum > 12) monthNum = 12;
            if (monthNum < 1) monthNum = 1;
            month = String(monthNum).padStart(2, '0');

            return day + month;
        } else {
            day = value.slice(0, 2);
            month = value.slice(2, 4);
            year = value.slice(4, 6);

            let dayNum = parseInt(day);
            if (dayNum > 31) dayNum = 31;
            if (dayNum < 1) dayNum = 1;
            day = String(dayNum).padStart(2, '0');

            let monthNum = parseInt(month);
            if (monthNum > 12) monthNum = 12;
            if (monthNum < 1) monthNum = 1;
            month = String(monthNum).padStart(2, '0');

            let yearNum = parseInt(year);
            if (year.length === 1) {
                return day + month + year;
            } else if (year.length === 2) {
                if (yearNum > currentYearShort) yearNum = currentYearShort;
                if (yearNum < 0) yearNum = 0;
                year = String(yearNum).padStart(2, '0');
            }

            return day + month + year;
        }
    }

    // Валидация возраста в инпутах формы
    const ageInputs = document.querySelectorAll('[data-age-input]');
    if (ageInputs) {
        ageInputs.forEach((input) => {
            input.addEventListener('input', function () {
                let value = this.value.replace(/[^0-9]/g, '');

                if (value.length > 1 && value.startsWith('0')) {
                    value = value.replace(/^0+/, '');
                }

                if (value.length > 3) {
                    value = value.slice(0, 3);
                }

                this.value = value;

                autoCorrectAge(this);
            });

            input.addEventListener('blur', function () {
                autoCorrectAge(this, true);
            });

            input.addEventListener('paste', function () {
                setTimeout(() => {
                    let value = this.value.replace(/[^0-9]/g, '');
                    if (value.length > 1 && value.startsWith('0')) {
                        value = value.replace(/^0+/, '');
                    }
                    if (value.length > 3) {
                        value = value.slice(0, 3);
                    }
                    this.value = value;
                    autoCorrectAge(this);
                }, 0);
            });
        });
    }

    function autoCorrectAge(input, onBlur = false) {
        const value = input.value.trim();

        if (!value) {
            return;
        }

        let age = parseInt(value);

        if (isNaN(age)) {
            input.value = '';
            return;
        }

        if (age < 0) {
            age = 0;
        } else if (age > 120) {
            age = 120;
        }

        input.value = age;
    }

    function autoCorrectDate(value, previousValue = '') {
        if (value.length === 0) return value;

        const currentYear = new Date().getFullYear();
        const currentYearShort = currentYear % 100;

        let day = '';
        let month = '';
        let year = '';

        if (value.length <= 2) {
            day = value;
            const dayNum = parseInt(day);
            if (dayNum > 31) {
                day = '31';
            }
            if (dayNum < 1 && day.length === 2) {
                day = '01';
            }
            return day;
        } else if (value.length <= 4) {
            day = value.slice(0, 2);
            month = value.slice(2);

            let dayNum = parseInt(day);
            if (dayNum > 31) dayNum = 31;
            if (dayNum < 1) dayNum = 1;
            day = String(dayNum).padStart(2, '0');

            let monthNum = parseInt(month);
            if (monthNum > 12) monthNum = 12;
            if (monthNum < 1) monthNum = 1;
            month = String(monthNum).padStart(2, '0');

            return day + month;
        } else {
            day = value.slice(0, 2);
            month = value.slice(2, 4);
            year = value.slice(4, 6);

            let dayNum = parseInt(day);
            if (dayNum > 31) dayNum = 31;
            if (dayNum < 1) dayNum = 1;
            day = String(dayNum).padStart(2, '0');

            let monthNum = parseInt(month);
            if (monthNum > 12) monthNum = 12;
            if (monthNum < 1) monthNum = 1;
            month = String(monthNum).padStart(2, '0');

            let yearNum = parseInt(year);
            if (year.length === 1) {
                return day + month + year;
            } else if (year.length === 2) {
                if (yearNum > currentYearShort) yearNum = currentYearShort;
                if (yearNum < 0) yearNum = 0;
                year = String(yearNum).padStart(2, '0');
            }

            return day + month + year;
        }
    }

    function validateDate(input) {
        const value = input.value;

        if (!value) {
            return;
        }

        if (value.length !== 8) {
            return;
        }

        const parts = value.split('/');
        if (parts.length !== 3) {
            return;
        }

        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return;
        }

        const currentYear = new Date().getFullYear();
        const currentYearShort = currentYear % 100;

        const isValidDay = day >= 1 && day <= 31;
        const isValidMonth = month >= 1 && month <= 12;
        const isValidYear = year >= 0 && year <= currentYearShort;

        let isValidDate = isValidDay && isValidMonth && isValidYear;

        if (isValidDate) {
            const fullYear = 2000 + year;
            const dateObj = new Date(fullYear, month - 1, day);
            const isValidRealDate = dateObj.getFullYear() === fullYear && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;

            isValidDate = isValidRealDate;
        }

        return isValidDate;
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
