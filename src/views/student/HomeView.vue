<template>
  <section class="calendar_container">
    <FullCalendar :options="calendarOptions" />
  </section>

  <section class="data_container" v-if="adviserSelected.id">
    <div class="data_container_head">
      <h4>Has seleccionado:</h4>

      <button @click="advicerStore.clearSelection">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="adviser_img_container">
      <img :src="'/images/' + adviserSelected.img" alt="Foto de perfil del asesor"/>
    </div>

    <h2 class="adviser_name">{{ adviserSelected.name }}</h2>
    <h3 class="adviser_language">Asesor de {{ adviserSelected.language }}</h3>

    <div class="data_selected_container">
      <h5 class="day_selected">{{ adviserSelected.day }}</h5>

      <label>De:</label>
      <VueDatePicker
        v-model="adviserSelected.timeSelected"
        time-picker
        :min-time="adviserSelected.minTime"
        :max-time="adviserSelected.maxTime"
        :minutesIncrement="60"
        :minutes-grid-increment="60"
      ></VueDatePicker>

      <label>A:</label>
      <VueDatePicker
        v-model="adviserSelected.timeFinishBasedOnTime"
        time-picker
        readonly
      ></VueDatePicker>

      <h5 class="max_selected">Quedan {{ adviserSelected.availablePlaces }} lugares disponibles</h5>

      <label>No. de cuenta:</label>
      <input type="text" placeholder="número de cuenta" v-model="adviserSelected.studentAccount" v-if="adviserSelected.timeSelected.hours"/>
      <button class="btn btn-green" @click="buttonReserveClicked" v-if="adviserSelected.studentAccount">Reservar</button>
    </div>
  </section>
</template>

<script setup>
  import FullCalendar from "@fullcalendar/vue3";

  import { watch, inject } from "vue";

  import { storeToRefs } from "pinia";
  import { useAdviserStore } from "../../stores/AdviserStore";
  import { useCalendarStore } from "../../stores/CalendarStore";

  const moment = inject("moment");

  const advicerStore = useAdviserStore();
  const { adviserSelected } = storeToRefs(advicerStore);

  const calendarStore = useCalendarStore();
  const { calendarEvents, advicesOnSelectedEvent, options } = storeToRefs(calendarStore);

  const calendarOptions = {
    ...options.value,
    events: calendarEvents.value,
    eventClick: ({event}) => {
      advicerStore.setAdviserSelected(event, moment);
    },
  };

  const buttonReserveClicked = () => {
    console.log(adviserSelected.value);
  };

  watch(
    () => advicerStore.adviserSelected.timeSelected,
    ({ hours }) => {
      const existedAdvice = advicesOnSelectedEvent.value.find(
        (advice) => advice.hour_start == `0${hours}:00:00`
      );

      adviserSelected.value.timeFinishBasedOnTime = {
        hours: hours + 1,
        minutes: 0,
      };

      if (existedAdvice) {
        adviserSelected.value.availablePlaces = existedAdvice.max_places - existedAdvice.total_enrolled_students;
      }
    }
  );
</script>
