class ServiceCarousel {
  constructor() {
    this.serviceItems = document.querySelectorAll(
      '.service__item--default, .service__item--active'
    );
    this.currentIndex = 0;
    this.intervalTime = 5000;
    this.interval = null;
    this.cycleCount = 0;

    this.backgroundSources = [
      { type: 'video', src: 'images/Angel_bg2.mp4' },
      { type: 'image', src: 'images/image2.jpg' },
      { type: 'image', src: 'images/image3.jpg' },
      { type: 'image', src: 'images/image4.jpg' },
      { type: 'image', src: 'images/image5.jpg' },
      { type: 'image', src: 'images/image6.jpg' },
    ];

    this.cardBackgrounds = [
      'images/image2.jpg',
      'images/image3.jpg',
      'images/image4.jpg',
      'images/image5.jpg',
      'images/image6.jpg',
      'images/image7.jpg',
    ];

    this.mainTitles = [
      'Ангел Concept —<br/>центр премиального ухода<br/>и косметологии в Ставрополе',
      'Косметология:<br/>уходы, инъекции, лифтинг',
      'Коррекция фигуры<br/>и силуэта',
      'SPA и европейские<br/>массажи',
      'Велнес-программы<br/>и флоатация',
      'Beauty-услуги:<br/>волосы, ногти, макияж',
      'Тайские и балийские<br/>массажи',
    ];

    this.buttonTitles = [
      'подробнее об услугах',
      'Выбрать процедуру',
      'Выбрать процедуру',
      'Выбрать процедуру',
      'Выбрать процедуру',
      'Выбрать процедуру',
      'Выбрать процедуру',
    ];

    this.videoElement = document.querySelector('.video-background video');
    this.videoBackground = document.querySelector('.video-background');
    this.mainTitle = document.querySelector('.content__main');
    this.buttonTitle = document.querySelector('.content__button--title');
    this.contentLine = document.querySelector('.content__line');

    this.createImageLayers();

    this.currentBackgroundType = null;
    this.activeImageLayer = 0;

    this.init();
  }

  init() {
    this.addClickListeners();
    this.startCarousel();
  }

  addClickListeners() {
    this.serviceItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        const targetIndex = (index + 1) % this.serviceItems.length;

        if (targetIndex === this.currentIndex) {
          return;
        }

        this.stopCarousel();
        this.currentIndex = targetIndex;

        if (this.currentIndex === 0) {
          this.cycleCount++;
        }

        this.setActiveService(this.currentIndex);

        if (this.resumeTimeout) {
          clearTimeout(this.resumeTimeout);
        }

        this.resumeTimeout = setTimeout(() => {
          this.startCarousel();
        }, 100);
      });
    });
  }

  setActiveService(index) {
    this.changeBackground(index);
    this.updateMainContent(index);
    this.serviceItems.forEach((item, i) => {
      const card = item.querySelector(
        '.service__card, .service__card--default'
      );
      const loading = item.querySelector(
        '.service__loading--active, .service__loading--default'
      );

      if (i === index) {
        item.className = 'service__item--active';
        if (card) {
          card.className = 'service__card';
          card.style.backgroundImage = 'none';

          this.updateCardStructure(card, i, true);
        }
        if (loading) {
          loading.className = 'service__loading--active';
          this.animateLoadingBar(loading);
        }
      } else {
        item.className = 'service__item--default';
        if (card) {
          card.className = 'service__card--default';
          card.style.backgroundImage = 'none';

          this.updateCardStructure(card, i, false);
        }
        if (loading) {
          loading.className = 'service__loading--default';
          loading.style.removeProperty('--progress-width');
        }
      }
    });
  }

  updateCardStructure(card, index, isActive) {
    const serviceTexts = [
      'Косметология:<br/>уходы,<br/>инъекции,<br/>лифтинг',
      'Коррекция<br/>фигуры<br/>и силуэта',
      'SPA<br/>и европейские<br/>массажи',
      'Велнес-<br/>программы<br/>и флоатация',
      'Beauty-услуги:<br/>волосы, ногти,<br/>макияж',
      'Тайские<br/>и балийские<br/>массажи',
    ];

    if (isActive) {
      card.innerHTML = `
        <div class="card__left">
          <div class="card__left--number">${index + 1}</div>
          <div class="card__left--sub">${serviceTexts[index]}</div>
        </div>
        <div class="card__right">
          <img class="card__right--image" src="${
            this.cardBackgrounds[index]
          }" alt="Иллюстрация косметологических услуг" />
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="card__default">
          <div class="card__number">${index + 1}</div>
          <div class="card__sub">${serviceTexts[index]}</div>
        </div>
      `;
    }
  }

  createImageLayers() {
    this.imageLayers = [];

    for (let i = 0; i < 2; i++) {
      const layer = document.createElement('div');
      layer.className = `background-image-layer-${i}`;
      layer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0;
        transition: opacity 1.2s ease-in-out;
        z-index: ${1 + i};
      `;

      this.imageLayers.push(layer);
      this.videoBackground.insertBefore(
        layer,
        this.videoBackground.querySelector('.video-overlay')
      );
    }
  }

  resetTransitionState() {
    this.imageLayers.forEach((layer) => {
      layer.style.transition = 'opacity 1.2s ease-in-out';
    });
    this.videoElement.style.transition = 'opacity 1.2s ease-in-out';
  }

  changeBackground(index) {
    let background = this.backgroundSources[index];

    if (index === 0 && this.cycleCount === 0) {
      background = { type: 'video', src: 'images/Angel_bg2.mp4' };
    } else if (index === 0 && this.cycleCount > 0) {
      background = { type: 'image', src: 'images/image7.jpg' };
    }

    this.resetTransitionState();

    if (background.type === 'video') {
      this.transitionToVideo(background.src);
    } else {
      this.transitionToImage(background.src);
    }
  }

  transitionToVideo(videoSrc) {
    this.videoElement.src = videoSrc;
    this.videoElement.load();

    this.imageLayers.forEach((layer) => {
      layer.style.opacity = '0';
    });

    this.videoElement.style.opacity = '1';
    this.videoElement.play();

    this.currentBackgroundType = 'video';
  }

  transitionToImage(imageSrc) {
    const newLayer = this.imageLayers[this.activeImageLayer];
    const oldLayer = this.imageLayers[1 - this.activeImageLayer];

    const img = new Image();
    img.onload = () => {
      newLayer.style.backgroundImage = `url('${imageSrc}')`;

      newLayer.offsetHeight;

      if (this.currentBackgroundType === 'video') {
        this.videoElement.style.opacity = '0';
      } else {
        oldLayer.style.opacity = '0';
      }

      newLayer.style.opacity = '1';

      this.activeImageLayer = 1 - this.activeImageLayer;
      this.currentBackgroundType = 'image';
    };

    img.src = imageSrc;
  }

  updateMainContent(index) {
    let titleIndex = index;
    let buttonIndex = index;

    if (index === 0 && this.cycleCount > 0) {
      titleIndex = 6;
      buttonIndex = 6;
    }

    if (this.mainTitle && this.buttonTitle) {
      this.mainTitle.innerHTML = this.mainTitles[titleIndex];
      this.buttonTitle.textContent = this.buttonTitles[buttonIndex];
    }

    if (this.contentLine) {
      this.contentLine.style.display =
        index === 0 && this.cycleCount === 0 ? 'block' : 'none';
    }
  }

  animateLoadingBar(loadingElement) {
    const progressBar =
      loadingElement.querySelector('::after') || loadingElement;

    if (loadingElement.classList.contains('service__loading--active')) {
      loadingElement.style.setProperty('--progress-width', '0%');

      loadingElement.offsetHeight;

      setTimeout(() => {
        loadingElement.style.setProperty('--progress-width', '100%');
      }, 50);
    }
  }

  nextService() {
    this.currentIndex = (this.currentIndex + 1) % this.serviceItems.length;

    if (this.currentIndex === 0) {
      this.cycleCount++;
    }

    this.setActiveService(this.currentIndex);
  }

  startCarousel() {
    if (!this.interval && this.currentIndex === 0 && this.cycleCount === 0) {
      this.setActiveService(this.currentIndex);
    }

    this.interval = setInterval(() => {
      this.nextService();
    }, this.intervalTime);
  }

  stopCarousel() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
      this.resumeTimeout = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const carousel = new ServiceCarousel();
});
