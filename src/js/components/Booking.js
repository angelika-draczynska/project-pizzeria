import { select, templates, settings, classNames } from '/js/settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import utils from '/js/utils.js';


class Booking {
  constructor(container) {
    const thisBooking = this;

    thisBooking.render(container);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.uuid();
    thisBooking.pickTable();
    thisBooking.initActions();


  }

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],

      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],

      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });

  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.tables.map(it => parseInt(it)));
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, [item.table]);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {

          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, [item.table]);
        }
      }
    }
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, tableIds) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock] = thisBooking.booked[date][hourBlock].concat(tableIds);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);


    let allAvaliable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvaliable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        (!allAvaliable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId))
        || this.isDateOverlaping(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
        table.classList.remove(classNames.booking.tableReserved);
      }
    }
  }

  isDateOverlaping(tableId) {
    const startHour = +this.hoursAmount.dom.inputHourPicker.value;
    const amountOfHours = +this.hoursAmount.value;
    const endHour = startHour + amountOfHours;

    return Object.keys(this.booked[this.date])
      .reduce((acc, hour) => utils.includes(+hour, startHour, endHour) ? acc.concat(this.booked[this.date][hour]) : acc, [])
      .includes(tableId);
  }

  render(bookingContainer) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};

    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.starters = document.getElementsByName('starter');
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);

    bookingContainer.appendChild(thisBooking.dom.wrapper);

  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });
  }

  pickTable() {
    const thisBooking = this;

    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', function () {
        if (!(table.classList.contains(classNames.booking.tableBooked))) {
          table.classList.toggle(classNames.booking.tableReserved);
        }
      });
    }
  }

  initActions() {
    const thisBooking = this;

    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });

  }

  sendBooking() {
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      tables: [],
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      duration: thisBooking.hoursAmount.value,
      people: thisBooking.peopleAmount.value,
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
      starters: [],
      uuid: thisBooking.uuid(),
    };

    // const editUrl = settings.db.url + '/' + settings.db.booking + '/' + payload.uuid;
    // console.log(editUrl);

    for (let starter of thisBooking.dom.starters) {
      if (starter.checked === true) {
        payload.starters.push(starter.value);
      }
    }

    for (let table of thisBooking.dom.tables) {
      if (table.classList.contains(classNames.booking.tableReserved)) {
        let tableId = table.getAttribute(settings.booking.tableIdAttribute);
        if (!isNaN(tableId)) {
          tableId = parseInt(tableId);
        }
        payload.tables.push(tableId);
        table.classList.remove(classNames.booking.tableReserved);
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      }).then(function (parsedResponse) {
        console.log(parsedResponse);
      });

    thisBooking.editLinkBooking = document.querySelector('.edit-link-booking');

    const editUrl = window.location + '/' + payload.uuid;

    thisBooking.editLinkBooking.setAttribute('href', editUrl);

    thisBooking.editLinkBooking.innerHTML = 'Edit your booking';

  }

  editBooking() {
    const thisBooking = this;

    fetch('https://api.github.com/users/chriscoyier/repos');

  }

  uuid() {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;

      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += "-";
      }
      uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }

}

export default Booking;
