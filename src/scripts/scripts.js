const breakpoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280
}

const $wrapper = document.querySelector('.wrapper');

//animation duration
const animation_duration_1 = parseInt(getComputedStyle(document.documentElement)
  .getPropertyValue('--animation-duration-1')
  .replace(/[^\d.-]/g, ''));
const animation_duration_2 = parseInt(getComputedStyle(document.documentElement)
  .getPropertyValue('--animation-duration-2')
  .replace(/[^\d.-]/g, ''));
const animation_duration_3 = parseInt(getComputedStyle(document.documentElement)
  .getPropertyValue('--animation-duration-3')
  .replace(/[^\d.-]/g, ''));

gsap.defaults({
  ease: "power2.inOut",
  duration: animation_duration_1 / 1000
});

//animations
gsap.registerEffect({
  name: "fadeIn",
  effect: ($element, config) => {
    return gsap.fromTo($element, {autoAlpha: 0}, {immediateRender: false, autoAlpha: 1, duration: config.duration || animation_duration_1 / 1000,
      onStart: () => {
        $element.forEach($this => {
          $this.classList.add('d-block');
        })
      },
      onReverseComplete: () => {
        $element.forEach($this => {
          gsap.set($this, {clearProps: "all"});
          $this.classList.remove('d-block');
        })
      }
    })
  },
  extendTimeline: true
});
gsap.registerEffect({
  name: "slide",
  effect: ($element, config) => {
    return gsap.fromTo($element, {css: {height:'0px'}}, {css: {height:'auto'}, duration: config.duration || animation_duration_1 / 1000})
  },
  extendTimeline: true
});

document.addEventListener("DOMContentLoaded", function() {
  check_anchor();

  //set scrollbar width
  document.documentElement.style.setProperty('--scrollbar-width', `${getScrollBarWidth()}px`);

  //mask
  Inputmask({
    mask: "+7 (999) 999-99-99",
    showMaskOnHover: false,
    clearIncomplete: false
  }).mask('[data-validate="phone"]');

  CustomInteractionEvents.init();
  Header.init();
  CatalogModal.init();
  MobileSearch.init();
  Modals.init();
  SideModals.init();
  ScrollTop.init();
  ScrollAnchors.init();
  inputs();
  collapse();
  password_visibility_toggle();
  calculator();
  rating();
  

  document.querySelectorAll('.main-banner').forEach($this => {
    new MainBanner($this).init();
  })

  document.querySelectorAll('.slider-constructor').forEach($this => {
    new SliderConstructor($this).init();
  })

  document.querySelectorAll('.product-slider').forEach($this => {
    new ProductSlider($this).init();
  })

  document.querySelectorAll('.select').forEach($this => {
    new Select($this).init();
  })

  document.querySelectorAll('.links-select').forEach($this => {
    new LinksSelect($this).init();
  })

  document.querySelectorAll('.tab-head').forEach($this => {
    new TabHead($this).init();
  })

  if (!mobile()) {
    document.querySelectorAll('[data-image-zoom]').forEach($this => {
      new ImageZoom($this).init();
    })
  }
});

function mobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}

function getScrollBarWidth() {
  let $test = document.createElement('div');
  
  $test.style.cssText = 'position:fixed;width:100%;';
  document.body.insertAdjacentElement('afterbegin', $test);

  let test_width = $test.getBoundingClientRect().width,
      window_width = window.innerWidth,
      value = window_width - test_width;

  $test.remove();

  return value;
}

function inputs() {

  let events = (event) => {
    let $input = event.target.parentNode,
        $input__element = event.target,
        input_value = $input__element.value,
        input_empty = validate.single(input_value, {presence: {allowEmpty: false}}) !== undefined;

    if(!$input.classList.contains('input')) return;

    if(event.type=='focus') {
      $input.classList.add('input_focused');
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

function collapse() {
  let _toggle = '[data-collapse="toggle"]',
      _parent = '[data-collapse="parent"]',
      _content = '[data-collapse="content"]';

  document.addEventListener('click', function(event) {
    let $toggle = event.target.closest(_toggle);

    if (!$toggle) return;

    let $parent = $toggle.closest(_parent),
        $content = $parent.querySelector(_content);

    let state = () => {
      return $content.classList.contains('active');
    }

    if (state()) {
      gsap.effects.slide($content).reverse(0);
      $content.classList.remove('active');
      $toggle.classList.remove('active');
      $toggle.querySelector('span').textContent = 'Развернуть';
    } else {
      gsap.effects.slide($content);
      $content.classList.add('active');
      $toggle.classList.add('active');
      $toggle.querySelector('span').textContent = 'Свернуть';
    }
  })
}

function calculator() {
  let _button_ = '.product-calculator__button',
      _input_ = '.product-calculator__input',
      _minus_ = '.product-calculator__button_minus',
      _plus_ = '.product-calculator__button_plus';

  let click_buttons = (event) => {
    let $button = event.target.closest(_button_);

    if ($button) {
      let $parent = $button.parentNode,
          $input = $parent.querySelector(_input_),
          $minus = event.target.closest(_minus_),
          $plus = event.target.closest(_plus_);

      if ($minus) $input.value = parseInt($input.value) - 1;
      else if ($plus) $input.value = parseInt($input.value) + 1;

      $input.dispatchEvent(new Event("change", {bubbles: true}));
    }
  }

  let input_change = (event) => {
    let $input = event.target.closest(_input_);

    if($input) {
      let min = $input.getAttribute('data-min') || 1;
      $input.value = Math.max(min, $input.value.replace(/[^\d.]/g, ''));
    }
  }

  document.addEventListener('click', click_buttons);
  document.addEventListener('input', input_change);
  document.addEventListener('change', input_change);
}

function password_visibility_toggle() {
  document.addEventListener('click', (event) => {
    let $toggle = event.target.closest('.password-toggle');

    if($toggle) {
      let $input_element = $toggle.parentNode.querySelector('input'),
          type = $input_element.getAttribute('type') === 'password' ? 'text' : 'password';
      
      $input_element.setAttribute('type', type);
    }
  });
}

function rating() {
  let _rating_ = '.rating-selection',
      _input_ = '.rating-selection__input',
      _star_ = '.rating-selection__star';

  let rating_events = (event) => {
    let $target = event.target !== document ? event.target.closest(`${_input_}, ${_star_}`) : false;

    if ($target) {
      let $rating = {};
      $rating.$parent = $target.closest(_rating_);
      $rating.$input = $rating.$parent.querySelector(_input_);
      $rating.$stars = $rating.$parent.querySelectorAll(_star_);

      if ($target.closest(_star_) && $target == event.target && event.type=='mouseenter' && !CustomInteractionEvents.touched) {
        rating_mouseenter($target, $rating, event);
      } else if ($target.closest(_rating_) && $target == event.target  && event.type=='mouseleave' && !CustomInteractionEvents.touched) {
        rating_check_view($rating, parseInt($rating.$input.value) || 0);
      } else if ($target.closest(_star_) && event.type=='click') {
        rating_click($target, $rating, event);
        rating_check_view($rating, parseInt($rating.$input.value) || 0);
      }
    }
  }

  let rating_click = ($target, $rating, event) => {
    for (let i in [...$rating.$stars]) {
      if ($target == $rating.$stars[i]) {
        $rating.$input.value = parseInt(i) + 1;
        break;
      }
    }
  }

  let rating_check_view = ($rating, value) => {
    $rating.$stars.forEach(($this, index) => {
      if (index + 1 <= value) {
        $this.classList.add('active');
      } else {
        $this.classList.remove('active');
      }
    })
  }

  let rating_mouseenter = ($target, $rating, event) => {
    let value;
    $rating.$stars.forEach(($this, index) => {
      if ($this == $target) value = index + 1;
    })
    rating_check_view($rating, value);
  }

  document.addEventListener('mouseenter', rating_events, true);
  document.addEventListener('mouseleave', rating_events, true);
  document.addEventListener('click', rating_events);
}

function check_anchor() {
  let anchor = new URLSearchParams(location.search).get('anchor');

  if (anchor) {
    let $target = document.querySelector(`#${anchor}`);

    if (!$target) return;

    setTimeout(() => {
      let ty = $target.getBoundingClientRect().top + window.pageYOffset,
          gap = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--scroll-to-content-gap')
            .replace(/[^\d.-]/g, '')),
          y = ty - gap;

      window.scrollTo(0, y);
    }, 0);

  }
}

function addParameter(url, param, value) {
  // Using a positive lookahead (?=\=) to find the
  // given parameter, preceded by a ? or &, and followed
  // by a = with a value after than (using a non-greedy selector)
  // and then followed by a & or the end of the string
  var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'),
      parts = url.toString().split('#'),
      url = parts[0],
      hash = parts[1]
      qstring = /\?.+$/,
      newURL = url;

  // Check if the parameter exists
  if (val.test(url))
  {
      // if it does, replace it, using the captured group
      // to determine & or ? at the beginning
      newURL = url.replace(val, '$1' + param + '=' + value);
  }
  else if (qstring.test(url))
  {
      // otherwise, if there is a query string at all
      // add the param to the end of it
      newURL = url + '&' + param + '=' + value;
  }
  else
  {
      // if there's no query string, add one
      newURL = url + '?' + param + '=' + value;
  }

  if (hash)
  {
      newURL += '#' + hash;
  }

  return newURL;
}

const CustomInteractionEvents = Object.create({
  targets: {
    value: 'a, button, label, .ss-option, [data-custom-interaction]'
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

const ScrollAnchors = {
  init: function() {
    let _scroll_ = '[data-action="scroll_to_anchor"]';

    let click_event = (event) => {
      let $link = event.target.closest(`${_scroll_}`);

      if (!$link) return;

      event.preventDefault();

      let attr = $link.getAttribute('href'),
          $target = document.querySelector(`${attr}`);

      if (!$target) return;

      scroll_event($target, $link);
    }

    let scroll_event = ($target, $link) => {
      let ty = $target.getBoundingClientRect().top + window.pageYOffset,
          gap = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--scroll-to-content-gap')
            .replace(/[^\d.-]/g, '')),
          y = ty - gap;

      this.inScroll = true;
        
      window.dispatchEvent(new CustomEvent("scroll_to_anchor_start", {
        detail:{
          $target: $target,
          $link: $link
        }
      }));

      if (this.animation && this.animation.isActive()) this.animation.pause(); 

      this.animation = gsap.to(window, {scrollTo: y, duration: animation_duration_3 / 1000, onComplete: () => {
        window.dispatchEvent(new CustomEvent("scroll_to_anchor_end"));
        this.inScroll = false;
      }});
    }

    document.addEventListener('click', click_event);
  }
}

const Header = {
  init: function() {
    this.$element = document.querySelector('.header');

    this.checkState = () => {
      let fixed = this.$element.classList.contains('header_fixed'),
          visible = this.$element.classList.contains('header_visible'),
          scrollTop = window.pageYOffset < this.oldScroll,
          scrollEnough = window.pageYOffset > this.getHeight(),
          visibleEnough = window.pageYOffset > window.innerHeight;

      if (scrollEnough && !fixed) {
        this.$element.classList.add('header_fixed');
      } else if (!scrollEnough && fixed) {
        this.$element.classList.remove('header_fixed');
      }

      if (!visible && visibleEnough && scrollTop && !ScrollAnchors.inScroll) {
        this.$element.classList.add('header_visible');
        document.documentElement.style.setProperty('--sticky-elements-safe-top', 'var(--fixed-header-height)');
      } else if (visible && (!visibleEnough || !scrollTop || ScrollAnchors.inScroll)) {
        this.$element.classList.remove('header_visible');
        document.documentElement.style.setProperty('--sticky-elements-safe-top', '0px');

        document.dispatchEvent(new CustomEvent("Header:hide"));
      }

      this.oldScroll = window.pageYOffset;
    }

    window.addEventListener('scroll', this.checkState);
    this.checkState();
  },
  getHeight: function() {
    return +getComputedStyle($wrapper).getPropertyValue('--header-height').replace(/[^\d.-]/g, '');
  }
}

const MobileSearch = {
  init: function() {
    this.$element = document.querySelector('.header__search');
    this.$toggle = document.querySelectorAll('[data-action="mobile-search_toggle"]');

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

    document.addEventListener('Header:hide', () => {
      if (this.state()) this.close();
    });

  }
}

const CatalogModal = {
  init: function() {
    this.$element = document.querySelector('.catalog-modal');
    this.$open = document.querySelectorAll('[data-action="catalog-modal_open"]');
    this.$close = document.querySelectorAll('[data-action="catalog-modal_close"]');

    this.$category_triggers = this.$element.querySelectorAll('[data-action="catalog-modal_trigger"]');
    this.$active_category = this.$element.querySelector('.d-block');

    this.animation = gsap.timeline({paused: true})
      .fadeIn(this.$element);

    this.state = () => {
      return this.$element.classList.contains('d-block');
    }

    this.open = () => {
      this.animation.play().eventCallback('onStart', () => {
        this.$element.scrollTop = '0';
        scrollLock.disablePageScroll(); 
      }); 
    }

    this.close = () => {
      this.animation.reverse().eventCallback('onReverseComplete', () => {
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
          this.$active_category.classList.remove('d-block');
          gsap.timeline()
            .fadeIn($target)
          .eventCallback('onStart', () => {
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
        scrollLock.enablePageScroll();
        delete this.$active;
        if(callback) callback();
      })
    }

    document.addEventListener('click', (event) => {
      let $open = event.target.closest('[data-action="modal_open"]'),
          $close = event.target.closest('[data-action="modal_close"]'),
          $parent = event.target.closest('.modal'),
          $block = event.target.closest('.modal-block');

      if ($open) {
        event.preventDefault();
        this.open( document.querySelector(`${$open.getAttribute('href')}`) );
      } else if ($close || (!$block && $parent)) {
        this.close();
      }
    })
    
    /* this.open(document.querySelector('#success-review-modal')); */
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
        let $block = this.$active.querySelector('.side-modal__container');
        gsap.set($block, {clearProps: "all"});

        scrollLock.enablePageScroll();
        delete this.$active;
        if(callback) callback();
      })
    }

    document.addEventListener('click', (event) => {
      let $open = event.target.closest('[data-action="side_modal_open"]'),
          $close = event.target.closest('[data-action="side_modal_close"]'),
          $parent = event.target.closest('.side-modal'),
          $block = event.target.closest('.side-modal__container');

      if ($open) {
        event.preventDefault();
        this.open( document.querySelector(`${$open.getAttribute('href')}`) );
      } else if ($close || ($parent && !$block)) {
        this.close();
      }
    })

    window.addEventListener('resize', () => {
      if(window.innerWidth > breakpoints.xl && this.$active) this.close();
    })

  }
}

const ScrollTop = {
  init: function() {
    this.$element = document.querySelector('.scroll-top');
    this.$triggers = document.querySelectorAll('[data-action="scroll-top"]');

    this.animation = gsap.timeline({paused:true})
      .fadeIn(this.$element);
    
    this.state = () => {
      return this.$element.classList.contains('d-block');
    }

    this.show = () => {
      this.animation.play();
    }

    this.hide = () => {
      this.animation.reverse();
    }

    this.check = () => {
      if(this.inScroll) return;

      let h = window.innerHeight / 2;

      if(window.pageYOffset > h && !this.state()) {
        this.show();
      } else if(window.pageYOffset <= h && this.state()) {
        this.hide();
      }
    }

    this.$triggers.forEach($trigger => {
      $trigger.addEventListener('click', () => {
        if(this.inScroll) return;
        this.hide();
        this.inScroll = true;
        gsap.to(window, {scrollTo: 0, duration: animation_duration_3 / 1000, onComplete: () => {
          this.inScroll = false;
        }});
      })
    })

    this.check();
    window.addEventListener('scroll', this.check);
  }
}

class MainBanner {
  constructor($parent) {
    this.$parent = $parent
  }

  init() {
    this.$slider = this.$parent.querySelector('.swiper-container');
    this.$pagination = this.$parent.querySelector('.swiper-pagination');

    this.swiper = new Swiper(this.$slider, {
      touchStartPreventDefault: false,
      slidesPerView: 1,
      speed: animation_duration_3,
      loop: true,
      lazy: {
        loadOnTransitionStart: true,
        loadPrevNext: true
      },
      pagination: {
        el: this.$pagination,
        clickable: true,
        bulletElement: 'button'
      }
    });


  }
}

class SliderConstructor {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$slider = this.$parent.querySelector('.swiper-container');
    this.$pagination = this.$parent.querySelector('.swiper-pagination');
    this.$prev = this.$parent.querySelector('.swiper-button-prev');
    this.$next = this.$parent.querySelector('.swiper-button-next');

    let slides_count = this.$parent.getAttribute('data-slides') || 1,
        slides_sm_count = this.$parent.getAttribute('data-sm-slides') || slides_count,
        slides_md_count = this.$parent.getAttribute('data-md-slides') || slides_sm_count,
        slides_lg_count = this.$parent.getAttribute('data-lg-slides') || slides_md_count,
        slides_xl_count = this.$parent.getAttribute('data-xl-slides') || slides_lg_count,
        free_mode = this.$parent.getAttribute('data-free-mode') || false;

    this.swiper = new Swiper(this.$slider, {
      touchStartPreventDefault: false,
      slidesPerView: slides_count,
      freeMode: free_mode,
      speed: animation_duration_3,
      autoHeight: true,
      pagination: {
        el: this.$pagination,
        clickable: true,
        bulletElement: 'button'
      },
      navigation: {
        prevEl: this.$prev,
        nextEl: this.$next
      },
      lazy: {
        loadOnTransitionStart: true,
        loadPrevNext: true
      },
      breakpoints: {
        [breakpoints.xl]: {
          slidesPerView: slides_xl_count
        },
        [breakpoints.lg]: {
          slidesPerView: slides_lg_count
        },
        [breakpoints.md]: {
          slidesPerView: slides_md_count
        },
        [breakpoints.sm]: {
          slidesPerView: slides_sm_count
        }
      }
    });

  }
}

class Select {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$select = this.$parent.querySelector('select');

    this.select = new SlimSelect({
      select: this.$select,
      showSearch: false,
      showContent: 'down'
    })

    let $arrow = this.select.slim.container.querySelector('.ss-arrow span');

    //add custom arrow
    $arrow.insertAdjacentHTML('afterbegin', `
      <svg class="icon" fill="none" stroke='currentColor' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="caret-bottom">
        <path vector-effect="non-scaling-stroke" d="M16.3,6.9L10,13.1L3.8,6.9" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `);
  }
}

class LinksSelect {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this._toggle_ = '.links-select-selected';
    this._list_ = '.links-select-list';
    this.$toggle = this.$parent.querySelector(this._toggle_);
    this.$list = this.$parent.querySelector(this._list_);

    this.open = () => {
      this.opened = true;
      this.$toggle.classList.add('active');
      this.$list.classList.add('opened');
    }

    this.close = () => {
      this.opened = false;
      this.$toggle.classList.remove('active');
      this.$list.classList.remove('opened');
    }

    document.addEventListener('click', (event) => {
      const $toggle = event.target.closest(this._toggle_);
      const $list = event.target.closest(this._list_);

      if (($toggle || !$list) && this.opened) {
        this.close();
      } else if ($toggle && !this.opened) {
        this.open();
      }
    })

  }
}

class ProductSlider {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$slider = this.$parent.querySelector('.swiper-container');
    this.$miniature = this.$parent.querySelectorAll('.product-slider__miniature');

    this.slider = new Swiper(this.$slider, {
      touchStartPreventDefault: false,
      speed: animation_duration_3,
      allowTouchMove: mobile() ? true : false
    });

    this.$miniature[0].classList.add('active');
    this.slider.on('slideChange', (event) => {
      this.$miniature.forEach($this => {
        $this.classList.remove('active')
      })
      this.$miniature[event.realIndex].classList.add('active');
    })

    this.$miniature.forEach(($this, index) => {
      $this.addEventListener('mouseenter', () => {
        this.slider.slideTo(index);
      })
      $this.addEventListener('click', () => {
        this.slider.slideTo(index);
      })
    })
  }
}

class TabHead {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this._link_ = '.tab-head__link';
    this.$links = this.$parent.querySelectorAll(`${this._link_}`);

    let is_fixed = () => {
      return this.$parent.classList.contains('fixed');
    }
    
    let check_postion = () => {
      if (window.innerWidth < breakpoints.md) return;

      let top = this.$parent.getBoundingClientRect().top,
          outer_top = this.$parent.parentNode.getBoundingClientRect().top,
          sticky = top > outer_top;

      

      if (sticky && !is_fixed()) {
        this.$parent.classList.add('fixed');
      } else if (!sticky && is_fixed()) {
        this.$parent.classList.remove('fixed');
      }
    }

    let set_active_link = ($link) => {
      if ($link !== this.$active) {
        if (this.$active) this.$active.classList.remove('active');
        $link.classList.add('active');
        this.$active = $link;
      }
    }

    let check_active_link = () => {
      if (window.innerWidth < breakpoints.md || this.inScroll) return;

      for (let $link of this.$links) {
        let $target = document.querySelector(`${$link.getAttribute('href')}`);
        
        if ($target) {
          let ht = this.$parent.getBoundingClientRect().top + this.$parent.getBoundingClientRect().height;

          let th = $target.getBoundingClientRect().height,
              tt = $target.getBoundingClientRect().top,
              tb = tt + th;

          if (ht < tb) {
            set_active_link($link);
            break;
          }
        }
      }
    }

    window.addEventListener('scroll_to_anchor_start', (event) => {
      for (let $link of this.$links) {
        if ($link == event.detail.$link) {
          set_active_link($link);
          this.inScroll = true;
          break;
        }
      }
    })

    window.addEventListener('scroll_to_anchor_end', (event) => {
      if (this.inScroll) this.inScroll = false;
    })

    check_postion();
    check_active_link();
    window.addEventListener('scroll', check_postion);
    window.addEventListener('resize', check_postion);
    window.addEventListener('scroll', check_active_link);
    window.addEventListener('resize', check_active_link);
  }
}

class ImageZoom {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$image = this.$parent.querySelector('img');
    this.zoom = 2;

    this.$parent.addEventListener('mouseleave', () => {
      if (CustomInteractionEvents.touched) return;
      this.$image.style.transform = 'none';
    })

    this.$parent.addEventListener('mousemove', (event) => {
      if (CustomInteractionEvents.touched) return;

      let x1 = this.$parent.getBoundingClientRect().left,
          y1 = this.$parent.getBoundingClientRect().top,
          h = this.$parent.getBoundingClientRect().height,
          w = this.$parent.getBoundingClientRect().width,
          x2 = event.clientX,
          y2 = event.clientY,
          top = y1 - y2,
          left = x1 - x2,
          valY = (top + (h / 2)) / (h / 2),
          valX = (left + (w / 2)) / (w / 2),
          translateY = ((h * this.zoom - h) / 2) * valY,
          translateX = ((w * this.zoom - w) / 2) * valX;

      this.$image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${this.zoom})`;
    })
  }
}