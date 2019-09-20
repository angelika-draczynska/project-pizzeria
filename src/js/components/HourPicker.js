import { select, settings } from '/js/settings.js';
import BaseWidget from "./BaseWidget.js";
import utils from '/js/utils.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.initPlugin();
    thisWidget.value = settings.hours.open;


  }

  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function(event) {
      thisWidget.value = event.target.value;
    });
  }

  parseValue(value) {

    const newValue = utils.numberToHour(value);
    return newValue;
  }

  isValid(value) {
    return true;
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}
export default HourPicker;
