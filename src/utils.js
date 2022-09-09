const SCROLL_DURATION = 1000;
const SCROLL_EL_Y_OFFSET = 64;

const easeInOutQuint = (t, b, _c, d) => {
  const c = _c - b;

  if ((t /= d / 2) < 1) {
    return (c / 2) * t * t * t * t * t + b;
  }

  return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
};

export const scrollToEl = (el) => {
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
