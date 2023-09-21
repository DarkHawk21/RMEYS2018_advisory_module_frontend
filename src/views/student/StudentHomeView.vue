<template>
  <section class="calendar_container">
    <FullCalendar :options="calendarOptions" />
  </section>

  <section class="card data_container" v-if="eventSelected.id">
    <div class="card_head">
      <div class="w_100 d_flex flex_row justify_between items_center">
        <h4>Has seleccionado:</h4>

        <button @click="advicerStore.clearSelection" class="btn bg_red">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="adviser_img_container">
        <img :src="'/images/' + eventSelected.extendedProps.advisor.img" alt="Foto de perfil del asesor"/>
      </div>

      <h5 class="adviser_name align_center">{{ eventSelected.extendedProps.advisor.name }}</h5>
      <h5 class="align_center">Asesor de {{ eventSelected.extendedProps.advisor.language }}</h5>
    </div>

    <div class="card_body">
      <h5 class="day_selected align_center">{{ selectedDay }}</h5>

      <label class="form_label_control">De:</label>
      <VueDatePicker
        v-model="newAdvisory.startTime"
        time-picker
        :min-time="eventSelected.minTime"
        :max-time="eventSelected.maxTime"
        :minutesIncrement="60"
        :minutes-grid-increment="60"
      ></VueDatePicker>

      <label class="form_label_control">A:</label>
      <VueDatePicker
        v-model="newAdvisory.endTime"
        time-picker
        readonly
      ></VueDatePicker>

      <h5 class="max_selected align_center">Quedan {{ eventSelected.extendedProps.availablePlaces }} lugares disponibles</h5>

      <label class="form_label_control">No. de cuenta:</label>
      <input
        type="text"
        class="form_control"
        placeholder="número de cuenta"
        v-model="newAdvisory.studentAccount"
        v-if="newAdvisory.startTime"
      />
    </div>

    <div class="card_footer">
      <button
        class="btn w_100"
        @click="buttonReserveClicked"
        v-if="newAdvisory.studentAccount"
      >Reservar</button>
    </div>
  </section>
</template>

<script setup>
  import FullCalendar from "@fullcalendar/vue3";
  import { watch, inject, computed } from "vue";
  import { storeToRefs } from "pinia";
  import { useAdvisoryStore } from '../../stores/AdvisoryStore';
  import { useCalendarStore } from "../../stores/CalendarStore";

  const moment = inject("moment");

  const calendarStore = useCalendarStore();
  const { options, eventSelected } = storeToRefs(calendarStore);

  const advisoryStore = useAdvisoryStore();
  const { newAdvisory } = storeToRefs(advisoryStore);

  calendarStore.getAdvisersDisponibility();

  const buttonReserveClicked = () => {};

  const selectedDay = computed(() => {
    const dayName = moment(eventSelected.value.start).format("dddd")[0].toUpperCase() + moment(eventSelected.value.start).format("dddd").substring(1);
    const dayNumber = moment(eventSelected.value.start).format("D");
    const monthName = moment(eventSelected.value.start).format("MMMM");

    return `${dayName} ${dayNumber} de ${monthName}`;
  });

  const calendarOptions = {
    ...options.value,
    eventClick: ({event}) => {
      calendarStore.getAdvicesOnEvent();
      calendarStore.getEventData(event.id, moment);
    }
  };

  watch(
    () => advisoryStore.newAdvisory.startTime,
    (startTime) => {
      if (startTime) {
        newAdvisory.value.endTime = {
          hours: startTime.hours + 1,
          minutes: 0,
        };
      }
    }
  );
</script>

<style lang="scss">
  @import "../../assets/styles/components/calendar.scss";
  @import "../../assets/styles/views/studentHome.scss";
</style>
