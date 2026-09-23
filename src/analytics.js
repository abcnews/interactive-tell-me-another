// @ts-check

// This file re-implements the small subset of functions we need from @abcaustralia/analytics-datalayer
// We would utilise that package, but using it outside the PL ecosystem is painful and this is a simple
// solution. We should re-visit this at some point, particularly in light of the much better types the
// package offers.

/**
 * Push any general data into the datalayer
 * @param {unknown} data Data to push onto the anlytics layer
 */
const handlePush = data => {
  if (typeof window !== 'undefined') {
    if (typeof window.dataLayer === 'undefined') {
      window.dataLayer = [];
    }
    window.dataLayer.push(data);
    window.document.dispatchEvent(new CustomEvent('dataLayer.push', { detail: data }));
  }
};

/**
 * Push an unstructured event onto the datalayer
 * @param {{action: string; label: string; value?: string; property?: string}} event An event to push onto the data layer
 */
const handleUnstructuredEvent = event => {
  const { action, label, value, property } = event;
  handlePush({
    event: 'unstructuredEvent',
    eventAction: action,
    eventLabel: label,
    eventValue: value,
    eventProperty: property
  });
};

/**
 * Tracks user behaviour specifically related to Odyssey.
 * @summary Use ABC's Analytics DataLayer package to track user behaviour.
 * @param {string} name - The name of the behaviour we're tracking
 * @param {string} label - The label to apply to this event
 *
 */
export const track = async (name, label) => {
  if (name == null || label == null) {
    throw new Error('Behaviour tracking requires a name and label');
  }

  handleUnstructuredEvent({
    action: `storylab-${name}`,
    label
  });
};
