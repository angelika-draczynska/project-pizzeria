import { settings, select } from '/js/settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.initActions();
  }

  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.dom.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value) {
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin
      && value <= settings.amountWidget.defaultMax;
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;

  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.dom.input.value);
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      if (thisWidget.dom.input.type === 'number') {
        var n = Math.round(0.5 * 100) / 100;
        thisWidget.setValue(thisWidget.value - n);
        console.log(thisWidget.value);
      } else {
        thisWidget.setValue(thisWidget.value - 1);
      }
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      if (thisWidget.dom.input.type === 'number') {
        var n = Math.round(0.5 * 100) / 100;
        thisWidget.setValue(thisWidget.value + n);
        console.log(thisWidget.value);
      } else {
        thisWidget.setValue(thisWidget.value + 1);
      }
    });
  }
}

export default AmountWidget;
