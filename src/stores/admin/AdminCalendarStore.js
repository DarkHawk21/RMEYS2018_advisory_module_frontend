import { defineStore } from "pinia";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export const useAdminCalendarStore = defineStore('adminCalendar', {
  state: () => ({
    calendarEvents: [
      {
        id: 1,
        groupId: 1,
        title: 'Marco Antonio Hernández Rodríguez',
        startTime: '08:00:00',
        endTime: '15:00:00',
        startRecur: '2023-09-14',
        endRecur: '2023-09-29',
        backgroundColor: '#cf142b',
        borderColor: '#cf142b',
        textColor: "#fff",
        daysOfWeek: [3,4],
        extendedProps: {
          language: 'Inglés',
          img: 'profile.png'
        }
      }
    ],
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
        end: "timeGridDay,timeGridWeek,dayGridMonth",
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
      }
    },
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
    filters: {
      adviser: ''
    }
  })
});
