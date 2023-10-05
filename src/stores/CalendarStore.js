import axios from 'axios';
import { defineStore } from "pinia";
import rrulePlugin from '@fullcalendar/rrule';
import { useLoaderStore } from './LoaderStore';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

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
      plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin, rrulePlugin],
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
      title: '',
      exdate: null,
      extendedProps: {
        timeStart: {},
        timeEnd: {},
        advisor: {
          id: null
        },
        recurrenceType: 'never',
        recurrence: {
          startAt: '',
          repeatTimes: {
            times: 1,
            type: "weekly"
          },
          repeatDays: [],
          finishAt: {
            type: "never",
            value: ""
          }
        }
      },
      minTimeStart: {
        hours: 7,
        minutes: 0
      },
      maxTimeStart: {
        hours: 20,
        minutes: 0
      }
    }
  }),
  actions: {
    async getAdvisersDisponibility(advisorId) {
      useLoaderStore().loading = true;

      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/advisors/${advisorId}/schedule`);
        this.options.events = data;
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    async getEventData(eventId, moment) {
      useLoaderStore().loading = true;

      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/schedule/${eventId}`);

        this.eventSelected = {
          ...data,
          minTime: {
            hours: parseInt(moment(data.start).format("HH")),
            minutes: parseInt(moment(data.start).format("mm")),
          },
          maxTime: {
            hours: parseInt(moment(data.end).format("HH")) - 1,
            minutes: parseInt(moment(data.end).format("mm")),
          }
        };

        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    async storeEvent() {
      useLoaderStore().loading = true;

      try {
        await axios.post(`http://localhost:8000/api/v1/schedule`, this.newEvent);
        const { data } = await axios.get(`http://localhost:8000/api/v1/advisors/${this.newEvent.extendedProps.advisor.id}/schedule`);
        this.options.events = data;
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    clearSelection() {
      this.eventSelected = {};
    },
    clearNewEvent() {
      this.newEvent = {
        date: '',
        title: '',
        exdate: null,
        extendedProps: {
          timeStart: {},
          timeEnd: {},
          advisor: {
            id: null
          },
          recurrenceType: 'never',
          recurrence: {
            startAt: '',
            repeatTimes: {
              times: 1,
              type: "weekly"
            },
            repeatDays: [],
            finishAt: {
              type: "never",
              value: ""
            },
          }
        },
        minTimeStart: {
          hours: 7,
          minutes: 0
        },
        maxTimeStart: {
          hours: 20,
          minutes: 0
        }
      };
    }
  }
});
