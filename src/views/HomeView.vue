<template>
  <main>
    <div class="principal_container">
      <section class="calendar_container">
        <FullCalendar :options="calendarOptions" />
      </section>

      <section class="data_container">
        <div class="adviser_img_container">
          <img src="/images/profile.png" alt="Foto de perfil del asesor">
        </div>

        <h2 class="adviser_name">{{ adviserSelected.name }}</h2>
        <h3 class="adviser_language">Asesor de {{ adviserSelected.language }}</h3>

        <div class="data_selected_container">
          <h4>Has seleccionado:</h4>
          <h5 class="day_selected">{{ adviserSelected.day }}</h5>
          <VueDatePicker v-model="time" time-picker :min-time="minTime" :max-time="maxTime"></VueDatePicker>
          <h5 class="max_selected">Quedan 5 lugares disponibles</h5>
          <label>No. de cuenta:</label>
          <input type="text" placeholder="número de cuenta">
          <button class="btn btn-green">Reservar</button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
  import FullCalendar from '@fullcalendar/vue3';
  import '@vuepic/vue-datepicker/dist/main.css';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import moment from 'moment';

  const minTime = { hours: 8, minutes: 0 };
  const maxTime = { hours: 14, minutes: 0 };

  import { ref, reactive } from 'vue';

  const time = ref(minTime);
  const adviserSelected = reactive({
    name: '',
    language: '',
    day: ''
  });

  const calendarOptions = {
    plugins: [ timeGridPlugin, dayGridPlugin, interactionPlugin ],
    initialView: 'timeGridWeek',
    themeSystem: 'standard',
    headerToolbar: {
      start: 'today,prev,next',
      center: 'title',
      end: 'timeGridDay,timeGridWeek'
    },
    buttonText: {
      today:    'Hoy',
      month:    'Mes',
      week:     'Semana',
      day:      'Día'
    },
    titleFormat: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    weekends: false,
    locale: 'es',
    firstDay: '1',
    slotDuration: '00:30:00',
    timeZone: 'local',
    events: [
      {
        id: 1,
        groupId: 1,
        title: 'Marco Antonio Hernández Rodríguez',
        start: '2023-09-11T08:00:00',
        end: '2023-09-11T14:00:00',
        backgroundColor: '#cf142b',
        borderColor: '#cf142b',
        textColor: "#fff",
        extendedProps: {
          max_places: 5,
          users_inscribed: 2,
          language: 'Inglés'
        }
      },
      {
        id: 2,
        groupId: 1,
        title: 'Edalid Analía Romero Jiménez',
        start: '2023-09-11T09:00:00',
        end: '2023-09-11T14:00:00',
        backgroundColor: '#002b7f',
        borderColor: '#002b7f',
        textColor: "#fff",
        extendedProps: {
          max_places: 5,
          users_inscribed: 1,
          language: 'Francés'
        }
      }
    ],
    eventClick: function(eventClickInfo) {
      const { title, start, end, extendedProps } = eventClickInfo.event;
      const { max_places, users_inscribed, language } = extendedProps;

      adviserSelected.name = title;
      adviserSelected.language = language;
      moment.locale('es');
      adviserSelected.day = moment(start).format('dddd D MMMM');
    },
    nowIndicator: true,
    allDaySlot: false,
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00'
  }
</script>