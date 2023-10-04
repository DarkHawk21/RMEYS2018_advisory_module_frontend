<template>
  <section class="modal_wrap">
    <div class="modal">
      <div class="modal_header">
        <i class="fa-solid fa-xmark" @click="$emit('hideModalEditEvent')"></i>
      </div>

      <div class="modal_body">
        <h4 class="modal_title">Editando la disponibilidad del asesor</h4>
        <h5 class="modal_subtitle">{{ adviserSelected.name }}</h5>

        <div class="d_flex items_start">
          <i class="fa-regular fa-clock" style="margin-top: 1px; margin-right: 20px"></i>

          <div class="form_control_container">
            <div style="margin-bottom: 20px">
              <VueDatePicker
                v-model="eventSelected.recurrence.startAt"
                :teleport="true"
                :format="dateFormat"
                :enable-time-picker="false"
                v-if="eventSelected.recurrence"
              />

              <VueDatePicker
                v-model="eventSelected.start"
                :teleport="true"
                :format="dateFormat"
                :enable-time-picker="false"
                v-else
              />
            </div>

            <div class="d_flex items_center" style="margin-bottom: 20px">
              <label style="margin-right: 10px">De</label>
              <VueDatePicker
                time-picker
                v-model="eventSelected.extendedProps.timeStart"
                :teleport="true"
                :minutesIncrement="30"
                :minutes-grid-increment="30"
              />

              <label style="margin: 0 10px">a</label>
              <VueDatePicker
                time-picker
                v-model="eventSelected.extendedProps.timeEnd"
                :teleport="true"
                :minutesIncrement="30"
                :minutes-grid-increment="30"
              />
            </div>

            <select class="form_control" style="margin-bottom: 0px" v-model="eventSelected.extendedProps.recurrenceType">
              <option value="">No se repite</option>
              <option value="weekly">Cada semana, el {{ moment(eventSelected.recurrence.startAt).format("dddd") }}</option>
              <option value="monthly">Cada mes, el día {{ moment(eventSelected.recurrence.startAt).format("D") }}</option>
              <option value="yearly">Anualmente, el {{ moment(eventSelected.recurrence.startAt).format("D") }} de {{ moment(eventSelected.recurrence.startAt).format("MMMM") }}</option>
              <option value="daily">Todos los días hábiles (de lunes a viernes)</option>
              <option value="personalized">Personalizado...</option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal_footer">
        <button class="btn bg_red" @click="$emit('hideModalEditEvent')">Cancelar</button>
        <button class="btn" @click="$emit('saveEditedEvent')">Guardar</button>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { inject } from "vue";
  import { storeToRefs } from "pinia";
  import { useAdviserStore } from "../../stores/AdviserStore";
  import { useCalendarStore } from "../../stores/CalendarStore";

  const moment = inject("moment");

  const adviserStore = useAdviserStore();
  const { adviserSelected } = storeToRefs(adviserStore);

  const calendarStore = useCalendarStore();
  const { eventSelected } = storeToRefs(calendarStore);

  const dateFormat = (date) => {
    const dayName = moment(date).format("dddd")[0].toUpperCase() + moment(date).format("dddd").substring(1);
    const dayNumber = moment(date).format("D");
    const monthName = moment(date).format("MMMM");

    return `${dayName} ${dayNumber} de ${monthName}`;
  };
</script>

<style lang="scss">
  @import "../../assets/styles/components/modal.scss";
</style>
