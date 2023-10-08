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
      timeZone: "utc",
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
      exdate: [],
      extendedProps: {
        timeStart: {},
        timeEnd: {},
        advisor: {
          id: null
        },
        recurrenceType: 'never',
        recurrence: {
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
    },
    eventsFetched: [],
    workshopsFetched: []
  }),
  actions: {
    async getAllAdvisersDisponibility() {
      useLoaderStore().loading = true;
      this.options.events = [];

      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/advisors/schedule`);
        this.eventsFetched = data;
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    async getAdvisersDisponibility(advisorId) {
      useLoaderStore().loading = true;
      this.options.events = [];

      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/advisors/${advisorId}/schedule`);
        this.eventsFetched = data;
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
          minTimeStart: {
            hours: 7,
            minutes: 0
          },
          maxTimeStart: {
            hours: 20,
            minutes: 0
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
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    async updateEvent() {
      useLoaderStore().loading = true;

      try {
        await axios.put(`http://localhost:8000/api/v1/schedule/${this.eventSelected.id}`, this.eventSelected);
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    async deleteEvent() {
      useLoaderStore().loading = true;

      try {
        await axios.delete(`http://localhost:8000/api/v1/schedule/${this.eventSelected.id}`);
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    async getAllWorkshops() {
      useLoaderStore().loading = true;
      this.options.events = [];

      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/workshops`);
        this.workshopsFetched = data;
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    async getWorkshopsByAdvisor(advisorId) {
      useLoaderStore().loading = true;
      this.options.events = [];

      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/advisors/${advisorId}/workshops`);
        this.workshopsFetched = data;
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    buildArrayOfEventsToCalendar() {
      this.options.events = [
        ...this.eventsFetched,
        ...this.workshopsFetched
      ];
    },
    clearEventSelected() {
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
    },
  }
});
