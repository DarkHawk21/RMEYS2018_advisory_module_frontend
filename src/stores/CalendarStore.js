import { defineStore } from "pinia";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import advisersDisponibility from './db/advisersDisponibility.json';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    options: {
      locale: "es",
      firstDay: "1",
      weekends: false,
      allDaySlot: false,
      timeZone: "local",
      nowIndicator: true,
      themeSystem: "standard",
      slotMinTime: "07:00:00",
      slotMaxTime: "21:00:00",
      slotDuration: "00:30:00",
      initialView: "timeGridWeek",
      plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
      headerToolbar: {
        start: "today,prev,next",
        center: "title",
        end: "timeGridDay,timeGridWeek",
      },
      buttonText: {
        today: "Hoy",
        month: "Mes",
        week: "Semana",
        day: "Día",
      },
      titleFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
      events: []
    },
    eventSelected: {},
    newEvent: {
      date: '',
      timeStart: {},
      timeEnd: {},
      recurrenceType: '',
      recurrence: {
        repeatTimes: {
          times: 1,
          type: 'diary'
        },
        repeatDays: [],
        finishAt: {
          type: '',
          value: ''
        }
      },
      minTimeStart: {
        hours: 7,
        minutes: 0,
        seconds: 0
      },
      maxTimeStart: {
        hours: 21,
        minutes: 0,
        seconds: 0
      },
    },
  }),
  actions: {
    getAdvisersDisponibility() {
      this.options.events = advisersDisponibility;
    },
    getEventData(eventId, moment) {
      const eventFromDB = advisersDisponibility.find(adviserDisponibility => adviserDisponibility.id == eventId);

      this.eventSelected = {
        ...eventFromDB,
        minTime: {
          hours: parseInt(moment(eventFromDB.start).format("HH")),
          minutes: parseInt(moment(eventFromDB.start).format("mm")),
        },
        maxTime: {
          hours: parseInt(moment(eventFromDB.end).format("HH")) - 1,
          minutes: parseInt(moment(eventFromDB.end).format("mm")),
        }
      };
    }
  }
});
