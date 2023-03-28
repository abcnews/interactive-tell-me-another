import { whenOdysseyLoaded } from '@abcnews/env-utils';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import styles from './styles.css';
import { scrollToEl } from './utils';

const DEFAULT_PROMPT_TEXT = 'Tell me another…';
const NON_LETTERS_PATTERN = /[^a-zA-Z]+/g;

whenOdysseyLoaded.then(() => {
  const storyEl = document.querySelector('.Main');
  const childEls = [...Array.from(storyEl.children)];
  const [endEl] = selectMounts('endtellmeanother');

  if (endEl === null || endEl.parentElement !== storyEl) {
    return;
  }

  const customPromptText = getMountValue(endEl)
    .replace(/^endtellmeanother:?/, '')
    .replaceAll('.', ' ');
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

  headingEls.slice(1).forEach(el => {
    const buttonEl = document.createElement('button');

    buttonEl.className = styles.prompt;

    if (childEls.indexOf(el) > targetElIndex) {
      buttonEl.classList.add(styles.isUnused);
    }

    buttonEl.textContent = promptText;

    buttonEl.onclick = () => {
      buttonEl.classList.remove(styles.isUnused);
      history.replaceState(null, null, `#${el.id}`);
      scrollToEl(el);
    };

    storyEl.insertBefore(buttonEl, el);
  });
});
