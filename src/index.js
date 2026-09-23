// @ts-check

import { whenOdysseyLoaded } from '@abcnews/env-utils';
import { getMountValue, isMount, selectMounts } from '@abcnews/mount-utils';
import styles from './styles.css';
import { scrollToEl } from './utils';
import { proxy } from '@abcnews/dev-proxy';
import { track } from './analytics';

const DEFAULT_PROMPT_TEXT = 'Tell me another…';
const NON_LETTERS_PATTERN = /[^a-zA-Z]+/g;

/**
 * @param {string} mountValue
 */
const getCustomPromptText = mountValue => {
  return mountValue.replace(/^(endtellmeanother|buttontext):?/, '').replaceAll('.', ' ');
};

/**
 *
 * @param {Element} el
 */
const getSectionButtonText = el => {
  let next = el.nextElementSibling;
  while (next && !(next instanceof HTMLHeadingElement)) {
    if (isMount(next, 'buttontext')) {
      return getCustomPromptText(getMountValue(next));
    }
    next = next.nextElementSibling;
  }
};

Promise.all([whenOdysseyLoaded, proxy('interactive-tell-me-another')]).then(() => {
  const storyEl = document.querySelector('.Main');
  if (!storyEl) return;
  const childEls = [...Array.from(storyEl.children)];
  const [endEl] = selectMounts('endtellmeanother');

  if (endEl === null || endEl.parentElement !== storyEl) {
    return;
  }

  const customPromptText = getCustomPromptText(getMountValue(endEl));

  const promptText = customPromptText || DEFAULT_PROMPT_TEXT;
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
  const targetElIndex = targetEl !== null && targetEl.parentElement === storyEl ? childEls.indexOf(targetEl) : -1;

  headingEls.slice(1).forEach((el, i) => {
    const buttonText = getSectionButtonText(el) || promptText;
    const buttonEl = document.createElement('button');

    buttonEl.className = styles.prompt;

    if (childEls.indexOf(el) > targetElIndex) {
      buttonEl.classList.add(styles.isUnused);
    }

    buttonEl.textContent = buttonText;

    buttonEl.onclick = () => {
      buttonEl.classList.remove(styles.isUnused);
      history.replaceState(null, '', `#${el.id}`);
      // This could be swapped out for el.scrollIntoView({ behavior: 'smooth' });
      // But our custom function puts some easing on it which is slightly nicer.
      scrollToEl(el);
      track('tell-me-another', String(i + 1));
    };

    storyEl.insertBefore(buttonEl, el);
  });
});
