class ServiceCarousel {
  constructor() {
    this.serviceItems = document.querySelectorAll(
      '.service__item--default, .service__item--active'
    );
    this.currentIndex = 0;
    this.intervalTime = 5000;
    this.interval = null;

    this.backgroundSources = [
      { type: 'video', src: 'images/Angel_bg2.mp4' },
      { type: 'image', src: 'images/image2.jpg' },
      { type: 'image', src: 'images/image3.jpg' },
      { type: 'image', src: 'images/image4.jpg' },
      { type: 'image', src: 'images/image5.jpg' },
      { type: 'image', src: 'images/image6.jpg' },
    ];

    this.cardBackgrounds = [
      'images/image1.jpg',
      'images/image2.jpg',
      'images/image3.jpg',
      'images/image4.jpg',
      'images/image5.jpg',
      'images/image6.jpg',
    ];

    this.videoElement = document.querySelector('.video-background video');
    this.videoBackground = document.querySelector('.video-background');

    this.createImageLayers();

    this.currentBackgroundType = null;
    this.activeImageLayer = 0;

    this.init();
  }

  init() {
    this.startCarousel();
  }

  setActiveService(index) {
    this.changeBackground(index);
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
          loading.style.width = '144px';
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
          loading.style.width = '144px';
          loading.style.transition = 'width 0.3s ease';
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
        transition: opacity 0.8s ease-in-out;
        z-index: ${1 + i};
      `;

      this.imageLayers.push(layer);
      this.videoBackground.insertBefore(
        layer,
        this.videoBackground.querySelector('.video-overlay')
      );
    }
  }

  changeBackground(index) {
    const background = this.backgroundSources[index];
    const transitionDuration = 800;

    if (background.type === 'video') {
      this.transitionToVideo(background.src, transitionDuration);
    } else {
      this.transitionToImage(background.src, transitionDuration);
    }
  }

  transitionToVideo(videoSrc, duration) {
    this.imageLayers.forEach((layer) => {
      layer.style.opacity = '0';
    });

    this.videoElement.src = videoSrc;
    this.videoElement.load();

    setTimeout(() => {
      this.videoElement.style.opacity = '1';
      this.videoElement.play();
    }, duration / 2);

    this.currentBackgroundType = 'video';
  }

  transitionToImage(imageSrc, duration) {
    const newLayer = this.imageLayers[this.activeImageLayer];
    const oldLayer = this.imageLayers[1 - this.activeImageLayer];

    const img = new Image();
    img.onload = () => {
      newLayer.style.backgroundImage = `url('${imageSrc}')`;

      if (this.currentBackgroundType === 'video') {
        this.videoElement.style.opacity = '0';
      } else {
        oldLayer.style.opacity = '0';
      }

      setTimeout(() => {
        newLayer.style.opacity = '1';
      }, duration / 2);

      this.activeImageLayer = 1 - this.activeImageLayer;
      this.currentBackgroundType = 'image';
    };

    img.src = imageSrc;
  }

  animateLoadingBar(loadingElement) {
    loadingElement.style.width = '144px';
    loadingElement.style.transition = 'width 5s linear';

    loadingElement.offsetHeight;

    setTimeout(() => {
      loadingElement.style.width = '260px';
    }, 50);
  }

  nextService() {
    this.currentIndex = (this.currentIndex + 1) % this.serviceItems.length;
    this.setActiveService(this.currentIndex);
  }

  startCarousel() {
    this.setActiveService(this.currentIndex);

    this.interval = setInterval(() => {
      this.nextService();
    }, this.intervalTime);
  }

  stopCarousel() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const carousel = new ServiceCarousel();
});
