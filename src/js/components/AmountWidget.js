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
    thisWidget.dom.inputHourPicker = document.querySelector('input[type="range"]');
    thisWidget.dom.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);


  }

  isValid(value) {
    const thisWidget = this;

    if (thisWidget.dom.inputHourPicker.value == 23) {

      return !isNaN(value) && value <= 1 && value >= 0.5;
    }

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
      if (thisWidget.dom.input.classList.contains('hours')) {

        thisWidget.setValue(thisWidget.value - 0.5);

      } else {
        thisWidget.setValue(thisWidget.value - 1);
      }
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      if (thisWidget.dom.input.classList.contains('hours')) {

        thisWidget.setValue(thisWidget.value + 0.5);

      } else {
        thisWidget.setValue(thisWidget.value + 1);
      }
    });
  }
}

export default AmountWidget;
