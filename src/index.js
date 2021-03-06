const ns = require('util-news-selectors');
const raf = require('raf');

const easeInOutQuint = (t, b, _c, d) => {
  const c = _c - b;

  if ((t /= d / 2) < 1) {
    return c / 2 * t * t * t * t * t + b;
  }

  return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};

const scrollToEl = el => {
  const begin = window.pageYOffset;
  const diff = el.getBoundingClientRect().top - SCROLL_EL_Y_OFFSET;
  const absDiff = Math.abs(diff);
  const end = begin + diff;
  const startTime = Date.now();

  const scroll = () => {
    const now = Date.now();
    const time = now - startTime;

    if (time < SCROLL_DURATION) {
      window.scrollTo(0, easeInOutQuint(time, begin, end, SCROLL_DURATION));
      raf(scroll);
    } else {
      window.scrollTo(0, end);
    }
  };

  raf(scroll);
};

const slice = Array.prototype.slice;

const SCROLL_DURATION = 1000;
const SCROLL_EL_Y_OFFSET = 64;
const NON_LETTERS_PATTERN = /[^a-zA-Z]+/g;

const storyEl = document.querySelector(`.Main, ${ns('story')}`);
const childEls = slice.call(storyEl.children);
const endEl = storyEl.querySelector('a[name="endtellmeanother"]');

if (endEl !== null && endEl.parentElement === storyEl) {
  const endElIndex = childEls.indexOf(endEl);
  const headingEls = childEls
  .filter((el, index) => {
    return el.tagName === 'H2' && index < endElIndex;
  })
  .map(el => {
    el.id = el.textContent.replace(NON_LETTERS_PATTERN, '').toLowerCase();
    return el;
  });

  const targetEl = document.getElementById(window.location.hash.slice(1));
  const targetElIndex = (
    targetEl !== null &&
    targetEl.parentElement === storyEl
  ) ? childEls.indexOf(targetEl) : -1;

  headingEls
  .slice(1)
  .forEach(el => {
    const buttonEl = document.createElement('button');

    buttonEl.className = 'TellMeAnotherButton'

    if (childEls.indexOf(el) > targetElIndex) {
      buttonEl.classList.add('is-unused');
    }

    buttonEl.textContent = 'Tell me another…';

    buttonEl.onclick = () => {
      buttonEl.classList.remove('is-unused'); 
      history.replaceState(null, null, `#${el.id}`);
      scrollToEl(el);
    };

    storyEl.insertBefore(buttonEl, el);
  });
}
