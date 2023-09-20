import { defineStore } from "pinia";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    calendarEvents: [
      {
        id: 1,
        groupId: 1,
        title: 'Marco Antonio Hernández Rodríguez',
        start: '2023-09-22T08:00:00',
        end: '2023-09-22T15:00:00',
        backgroundColor: '#cf142b',
        borderColor: '#cf142b',
        textColor: "#fff",
        extendedProps: {
          language: 'Inglés',
          img: 'profile.png'
        }
      },
      {
        id: 2,
        groupId: 2,
        title: 'Jessica Guadalupe Hernández Rodriguez',
        start: '2023-09-21T10:00:00',
        end: '2023-09-21T14:00:00',
        backgroundColor: '#cf142b',
        borderColor: '#cf142b',
        textColor: "#fff",
        extendedProps: {
          language: 'Inglés',
          img: 'profile.png'
        }
      }
    ],
    advicesOnSelectedEvent: [
      {
        id: 1,
        event_id: 1,
        max_places: 5,
        total_enrolled_students: 1,
        hour_start: '09:00:00',
        hour_end: '10:00:00',
        date: '2023-09-11',
        enrolled_students: [
          {
            id: 1,
            advice_id: 1,
            name: 'Enrique',
            last_name: 'Carranza',
            account: '316304034'
          }
        ]
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
      }
    }
  })
});
