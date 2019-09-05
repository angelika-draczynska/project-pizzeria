import { select, templates } from '/js/settings.js';
import AmountWidget from './AmountWidget.js';
import utils from '/js/utils.js';


class Booking {
  constructor() {
    const thisBooking = this;

    thisBooking.render(thisBooking.initBooking);
    thisBooking.initWidgets();

  }
  render() {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};

    thisBooking.dom.wrapper = generatedHTML;
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);

    const bookingContainer = document.querySelector(select.containerOf.booking);

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    bookingContainer.appendChild(thisBooking.dom.wrapper);

  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;
