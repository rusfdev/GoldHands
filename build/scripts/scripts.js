gsap.defaults({
  duration: +getComputedStyle(document.documentElement).getPropertyValue('--default-animation-duration').replace(/[^\d.-]/g, ''),
  ease: 'power1.inOut'
});

gsap.registerEffect({
  name: "fadeIn",
  effect: ($element) => {
    return gsap.fromTo($element, {autoAlpha: 0}, {immediateRender: false, autoAlpha:1})
  },
  extendTimeline: true
});


const breakpoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280
}
const $wrapper = document.querySelector('.wrapper');


document.addEventListener("DOMContentLoaded", function() {
  //set scrollbar width
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollLock.getPageScrollBarWidth()}px`);
  
  //mask
  Inputmask({
    mask: "+7 (999) 999-99-99",
    showMaskOnHover: false,
    clearIncomplete: false
  }).mask('[data-validate="phone"]');

  CustomInteractionEvents.init();
  Header.init();
  Catalog.init();
  MobileSearch.init();
  Modals.init();
  SideModals.init();
  ScrollTop.init();
  inputs();
});

function inputs() {

  let events = (event) => {
    let $input = event.target.parentNode,
        $input__element = event.target,
        input_value = $input__element.value,
        input_empty = validate.single(input_value, {presence: {allowEmpty: false}}) !== undefined;

    if(!$input.classList.contains('input')) return;

    if(event.type=='focus') {
      $input.classList.add('input_focused');
      console.log('!')
    } 
    
    else if(event.type=='input') {
      if(!input_empty) {
        $input.classList.add('input_filled');
      } else {
        $input.classList.remove('input_filled');
      }
    }

    else if(event.type=='blur') {
      $input.classList.remove('input_focused');
      if(input_empty) {
        $input.classList.remove('input_filled');
        $input__element.value = '';
      }
    } 
  }

  
  
  document.addEventListener('focus', events, true);
  document.addEventListener('input', events, true);
  document.addEventListener('blur', events, true);
}

const CustomInteractionEvents = Object.create({
  targets: {
    value: 'a, button, [data-custom-interaction]'
  },
  touchEndDelay: {
    value: 100
  }, 
  init() {
    this.events = (event) => {
      let $targets = [];
      $targets[0] = event.target!==document?event.target.closest(this.targets.value):null;
      let $element = $targets[0], i = 0;
  
      while($targets[0]) {
        $element = $element.parentNode;
        if($element!==document) {
          if($element.matches(this.targets.value)) {
            i++;
            $targets[i] = $element;
          }
        } 
        else {
          break;
        }
      }
  
      //touchstart
      if(event.type=='touchstart') {
        this.touched = true;
        if(this.timeout) clearTimeout(this.timeout);
        if($targets[0]) {
          for(let $target of $targets) $target.setAttribute('data-touch', '');
        }
      } 
      //touchend
      else if(event.type=='touchend' || (event.type=='contextmenu' && this.touched)) {
        this.timeout = setTimeout(() => {this.touched = false}, 500);
        if($targets[0]) {
          setTimeout(()=>{
            for(let $target of $targets) {
              $target.removeAttribute('data-touch');
            }
          }, this.touchEndDelay.value)
        }
      } 
      //mouseenter
      if(event.type=='mouseenter' && !this.touched && $targets[0] && $targets[0]==event.target) {
        $targets[0].setAttribute('data-hover', '');
      }
      //mouseleave
      else if(event.type=='mouseleave' && !this.touched && $targets[0] && $targets[0]==event.target) {
        $targets[0].removeAttribute('data-click');
        $targets[0].removeAttribute('data-hover');
      }
      //mousedown
      if(event.type=='mousedown' && !this.touched && $targets[0]) {
        $targets[0].setAttribute('data-click', '');
      } 
      //mouseup
      else if(event.type=='mouseup' && !this.touched  && $targets[0]) {
        $targets[0].removeAttribute('data-click');
      }
    }
    document.addEventListener('touchstart',  this.events);
    document.addEventListener('touchend',    this.events);
    document.addEventListener('mouseenter',  this.events, true);
    document.addEventListener('mouseleave',  this.events, true);
    document.addEventListener('mousedown',   this.events);
    document.addEventListener('mouseup',     this.events);
    document.addEventListener('contextmenu', this.events);
  }
})

const Header = {
  init: function () {
    this.$element = document.querySelector('.header');

    this.animation = gsap.timeline({paused:true})
      .fadeIn(this.$element)
      .fromTo(this.$element, {yPercent:-100}, {immediateRender: false, yPercent:0, ease:'power1.out'}, '<')

    this.getHeight = () => {
      return +getComputedStyle($wrapper).getPropertyValue('--header-height').replace(/[^\d.-]/g, '');
    } 

    this.isFixed = () => {
      return this.$element.classList.contains('header_fixed');
    }

    this.checkState = () => {
      if(window.innerWidth < breakpoints.xl) return;

      if (window.pageYOffset > this.getHeight() && !this.isFixed()) {
        this.animation.play(0).eventCallback('onStart', () => {
          this.$element.classList.add('header_fixed');
        })
      } else if (window.pageYOffset <= this.getHeight() && this.isFixed()) {
        this.$element.classList.remove('header_fixed');
      }
    }

    window.addEventListener('scroll', this.checkState);
    this.checkState();
  }
}

const MobileSearch = {
  init: function() {
    this.$element = document.querySelector('.header__search');
    this.$toggle = document.querySelectorAll('[data-mobile-search="toggle"]');

    this.animation = gsap.timeline({paused:true})
      .fadeIn(this.$element);

    this.state = () => {
      return this.$element.classList.contains('is-active');
    }

    this.open = () => {
      if(this.animation.isActive()) return;

      this.animation.play().eventCallback('onStart', () => {
        this.$element.classList.add('is-active');
      });
      this.$toggle.forEach($this => { $this.classList.add('is-active'); });
    }

    this.close = () => {
      if(this.animation.isActive()) return;

      this.animation.reverse().eventCallback('onReverseComplete', () => {
        this.$element.classList.remove('is-active');
        gsap.set(this.$element, {clearProps: "all"});
      });
      this.$toggle.forEach($this => { $this.classList.remove('is-active'); });
    }

    this.$toggle.forEach($this => {
      $this.addEventListener('click', () => {
        if(!this.state()) this.open();
        else this.close();
      })
    })

  }
}

const Catalog = {
  init: function() {
    this.$element = document.querySelector('.catalog');
    this.$open = document.querySelectorAll('[data-catalog="open"]');
    this.$close = document.querySelectorAll('[data-catalog="close"]');

    this.$category_triggers = this.$element.querySelectorAll('[data-catalog="trigger"]');
    this.$active_category = this.$element.querySelector('.is-active');

    this.animation = gsap.timeline({paused:true})
      .fadeIn(this.$element);

    this.state = () => {
      return this.$element.classList.contains('is-active');
    }

    this.open = () => {
      this.animation.play().eventCallback('onStart', () => {
        this.$element.classList.add('is-active');
        this.$element.scrollTop = '0';
        scrollLock.disablePageScroll(); 
      }); 
    }

    this.close = () => {
      this.animation.reverse().eventCallback('onReverseComplete', () => {
        this.$element.classList.remove('is-active');
        scrollLock.enablePageScroll();
      });
    }

    this.$open.forEach($this => {
      $this.addEventListener('click', () => {
        if(!this.state()) this.open();
      })
    })

    this.$close.forEach($this => {
      $this.addEventListener('click', () => {
        if(this.state()) this.close();
      })
    })


    this.$category_triggers.forEach($this => {
      $this.addEventListener('click', (event) => {
        event.preventDefault();

        let target = $this.getAttribute('href'),
            $target = this.$element.querySelector(target);

        if($target) {
          this.$active_category.classList.remove('is-active');
          gsap.effects.fadeIn($target).eventCallback('onStart', () => {
            $target.classList.add('is-active');
            this.$element.scrollTop = '0';
            this.$active_category = $target;
          });
        }
      })
    })

  }
}

const Modals = {
  init: function () {

    this.open = ($modal) => {
      if($modal == this.$active || (this.animation && this.animation.isActive())) return;

      let event = ()=> {
        let $block = $modal.querySelector('.modal-block');

        this.animation = gsap.timeline()
          .fadeIn($modal)
          .fromTo($block, {y:20}, {y:0, ease:'power1.out'}, '<')
        .eventCallback('onStart', () => {
          $modal.classList.add('is-active');
          $modal.scrollTop = '0';
          scrollLock.disablePageScroll();
        });

        this.$active = $modal;
      }
      
      if(this.$active) this.close(event);
      else event();
    }

    this.close = (callback) => {
      if(!this.$active || (this.animation && this.animation.isActive())) return;

      this.animation.reverse().eventCallback('onReverseComplete', () => {
        this.$active.classList.remove('is-active');
        scrollLock.enablePageScroll();
        delete this.$active;
        if(callback) callback();
      })
    }

    document.addEventListener('click', (event) => {
      let $open = event.target.closest('[data-modal="open"]'),
          $close = event.target.closest('[data-modal="close"]'),
          $parent = event.target.closest('.modal'),
          $block = event.target.closest('.modal-block');

      if ($open) {
        event.preventDefault();
        this.open( document.querySelector(`${$open.getAttribute('href')}`) );
      } else if ($close || (!$block && $parent)) {
        this.close();
      }
    })

    //this.open(document.querySelector('#location-modal'))
  }
}

const SideModals = {
  init: function () {

    this.open = ($modal) => {
      if($modal == this.$active || (this.animation && this.animation.isActive())) return;
      
      let event = ()=> {
        let $block = $modal.querySelector('.side-modal__container');

        this.animation = gsap.timeline()
          .fadeIn($modal)
          .fromTo($block, {x:-50}, {x:0, ease:'power1.out'}, '<')
        .eventCallback('onStart', () => {
          $modal.classList.add('is-active');
          scrollLock.disablePageScroll();
        });;

        this.$active = $modal;
      }
      
      if(this.$active) this.close(event);
      else event();
    }

    this.close = (callback) => {
      if(!this.$active || (this.animation && this.animation.isActive())) return;

      this.animation.reverse().eventCallback('onReverseComplete', () => {
        this.$active.classList.remove('is-active');
        scrollLock.enablePageScroll();
        delete this.$active;
        if(callback) callback();
      })
    }

    document.addEventListener('click', (event) => {
      let $open = event.target.closest('[data-side-modal="open"]'),
          $close = event.target.closest('[data-side-modal="close"]'),
          $parent = event.target.closest('.side-modal'),
          $block = event.target.closest('.side-modal__container');

      if ($open) {
        event.preventDefault();
        this.open( document.querySelector(`${$open.getAttribute('href')}`) );
      } else if ($close || ($parent && !$block)) {
        this.close();
      }
    })

    //this.open(document.querySelector('#mobile-nav'))
  }
}

const ScrollTop = {
  init: function() {
    this.$element = document.querySelector('.scroll-top');
    this.$button = this.$element.querySelector('.button');

    this.animation = gsap.timeline({paused:true})
      .fadeIn(this.$element);
    
    this.state = () => {
      return this.$element.classList.contains('is-active');
    }

    this.show = () => {
      this.animation.play().eventCallback('onStart', () => {
        this.$element.classList.add('is-active');
      });
    }

    this.hide = () => {
      this.animation.reverse().eventCallback('onReverseComplete', () => {
        this.$element.classList.remove('is-active');
      });
    }

    this.check = () => {
      if(this.inScroll) return;

      let h = window.innerWidth > breakpoints.xl ? Header.getHeight() : 300;

      if(window.pageYOffset > h && !this.state()) {
        this.show();
      } else if(window.pageYOffset <= h && this.state()) {
        this.hide();
      }
    }

    this.$button.addEventListener('click', () => {
      if(this.inScroll) return;

      this.hide();
      this.inScroll = true;
      gsap.to(window, {scrollTo:0, duration:0.5, onComplete: () => {
        this.inScroll = false;
      }});
    })

    this.check();
    window.addEventListener('scroll', this.check);
  }
}