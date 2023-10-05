<template>
  <section class="modal_wrap">
    <div class="modal">
      <div class="modal_header">
        <i class="fa-solid fa-xmark" @click="$emit('hideModalAddEvent')"></i>
      </div>

      <div class="modal_body">
        <h4 class="modal_title">Agregando la disponibilidad del asesor</h4>
        <h5 class="modal_subtitle">{{ adviserSelected.name }}</h5>

        <div class="d_flex items_start">
          <i class="fa-regular fa-clock" style="margin-top: 1px; margin-right: 20px"></i>

          <div class="form_control_container">
            <div style="margin-bottom: 20px">
              <VueDatePicker
                :teleport="true"
                :format="dateFormat"
                v-model="newEvent.date"
                :enable-time-picker="false"
              />
            </div>

            <div class="d_flex items_center" style="margin-bottom: 20px">
              <label style="margin-right: 10px">De</label>
              <VueDatePicker
                time-picker
                v-model="newEvent.extendedProps.timeStart"
                :teleport="true"
                :minutesIncrement="30"
                :minutes-grid-increment="30"
                :min-time="newEvent.minTimeStart"
                :max-time="newEvent.maxTimeStart"
              />

              <label style="margin: 0 10px">a</label>
              <VueDatePicker
                time-picker
                v-model="newEvent.extendedProps.timeEnd"
                :teleport="true"
                :minutesIncrement="30"
                :minutes-grid-increment="30"
                :min-time="{
                  hours: newEvent.minTimeStart.hours + 1,
                  minutes: newEvent.minTimeStart.minutes,
                }"
                :max-time="{
                  hours: newEvent.maxTimeStart.hours + 1,
                  minutes: newEvent.maxTimeStart.minutes,
                }"
              />
            </div>

            <select
              class="form_control"
              style="margin-bottom: 0px"
              @change="recurrenceTypeChanged"
              v-model="newEvent.extendedProps.recurrenceType"
            >
              <option value="never">No se repite</option>
              <option value="weekly">Cada semana, el {{ moment(newEvent.date).format("dddd") }}</option>
              <option value="monthly">Cada mes, el día {{ moment(newEvent.date).format("D") }}</option>
              <option value="yearly">Anualmente, el {{ moment(newEvent.date).format("D") }} de {{ moment(newEvent.date).format("MMMM") }}</option>
              <option value="daily">Todos los días hábiles (de lunes a viernes)</option>
              <option value="personalized">Personalizado...</option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal_footer">
        <button class="btn bg_red" @click="$emit('hideModalAddEvent')">Cancelar</button>
        <button class="btn" @click="saveNewEvent">Guardar</button>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { storeToRefs } from "pinia";
  import { watch, inject } from "vue";
  import { useAdviserStore } from "../../stores/AdviserStore";
  import { useCalendarStore } from "../../stores/CalendarStore";

  const moment = inject("moment");

  const adviserStore = useAdviserStore();
  const { adviserSelected } = storeToRefs(adviserStore);

  const calendarStore = useCalendarStore();
  const { newEvent } = storeToRefs(calendarStore);

  const emit = defineEmits(['saveNewEvent', 'showModalAddRecurrence']);

  newEvent.value.title = adviserSelected.value.name;
  newEvent.value.extendedProps.advisor.id = adviserSelected.value.id;

  const recurrenceTypeChanged = () => {
    if (newEvent.value.extendedProps.recurrenceType == 'personalized') {
      emit('showModalAddRecurrence');
    }
  };

  const saveNewEvent = async () => {
    if (newEvent.value.extendedProps.timeStart.minutes != newEvent.value.extendedProps.timeEnd.minutes) {
      alert("No se puede crear un evento en fracciones de 30 minutos.");
      return;
    }

    await calendarStore.storeEvent();
    calendarStore.clearNewEvent();
    emit('saveNewEvent');
  };

  const dateFormat = (date) => {
    const dayName = moment(date).format("dddd")[0].toUpperCase() + moment(date).format("dddd").substring(1);
    const dayNumber = moment(date).format("D");
    const monthName = moment(date).format("MMMM");

    return `${dayName} ${dayNumber} de ${monthName}`;
  };

  watch(
    () => newEvent.value.timeStart,
    (timeStart) => {
      newEvent.value.timeEnd = {
        hours: parseInt(timeStart.hours) + 1,
        minutes: parseInt(timeStart.minutes),
        seconds: parseInt(timeStart.seconds)
      };
    }
  );
</script>

<style lang="scss">
  @import "../../assets/styles/components/modal.scss";
</style>
