<template>
  <section class="calendar_container">
    <FullCalendar :options="calendarOptions" />
  </section>

  <section class="card data_container" v-if="adviserSelected.id">
    <div class="card_head">
      <div class="w_100 d_flex flex_row justify_between items_center">
        <h4>Has seleccionado:</h4>

        <button @click="advicerStore.clearSelection" class="btn bg_red">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="adviser_img_container">
        <img :src="'/images/' + adviserSelected.img" alt="Foto de perfil del asesor"/>
      </div>

      <h5 class="adviser_name align_center">{{ adviserSelected.name }}</h5>
      <h5 class="align_center">Asesor de {{ adviserSelected.language }}</h5>
    </div>

    <div class="card_body">
      <h6 class="day_selected align_center">{{ adviserSelected.day }}</h6>

      <label class="form_label_control">De:</label>
      <VueDatePicker
        v-model="adviserSelected.timeSelected"
        time-picker
        :min-time="adviserSelected.minTime"
        :max-time="adviserSelected.maxTime"
        :minutesIncrement="60"
        :minutes-grid-increment="60"
      ></VueDatePicker>

      <label class="form_label_control">A:</label>
      <VueDatePicker
        v-model="adviserSelected.timeFinishBasedOnTime"
        time-picker
        readonly
      ></VueDatePicker>

      <h6 class="max_selected align_center">Quedan {{ adviserSelected.availablePlaces }} lugares disponibles</h6>

      <label class="form_label_control">No. de cuenta:</label>
      <input
        type="text"
        class="form_control"
        placeholder="número de cuenta"
        v-model="adviserSelected.studentAccount"
        v-if="adviserSelected.timeSelected.hours"
      />
    </div>

    <div class="card_footer">
      <button class="btn w_100" @click="buttonReserveClicked" v-if="adviserSelected.studentAccount">Reservar</button>
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

<style lang="scss">
  @import "../../assets/styles/components/calendar.scss";
  @import "../../assets/styles/views/studentHome.scss";
</style>
