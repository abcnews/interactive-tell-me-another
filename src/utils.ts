// @ts-check

const SCROLL_DURATION = 1000;
const SCROLL_EL_Y_OFFSET = 64;

/**
 * An easing function
 * @param {number} t
 * @param {number} b
 * @param {number} _c
 * @param {number} d
 * @returns {number}
 */
const easeInOutQuint = (t: number, b: number, _c: number, d: number): number => {
  const c = _c - b;

  if ((t /= d / 2) < 1) {
    return (c / 2) * t * t * t * t * t + b;
  }

  return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
};

/**
 *
 * @param {Element} el
 */
export const scrollToEl = (el: Element) => {
  const begin = window.pageYOffset;
  const diff = el.getBoundingClientRect().top - SCROLL_EL_Y_OFFSET;
  const end = begin + diff;
  const startTime = Date.now();

  const scroll = () => {
    const now = Date.now();
    const time = now - startTime;

    if (time < SCROLL_DURATION) {
      window.scrollTo(0, easeInOutQuint(time, begin, end, SCROLL_DURATION));
      requestAnimationFrame(scroll);
    } else {
      window.scrollTo(0, end);
    }
  };

  requestAnimationFrame(scroll);
};
