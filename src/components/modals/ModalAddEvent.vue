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
                :teleport="true"
                :minutesIncrement="10"
                :minutes-grid-increment="10"
                v-model="newEvent.extendedProps.timeStart"
                :min-time="newEvent.minTimeStart"
                :max-time="newEvent.maxTimeStart"
              />

              <label style="margin: 0 10px">a</label>
              <VueDatePicker
                readonly
                time-picker
                :teleport="true"
                :minutesIncrement="10"
                :minutes-grid-increment="10"
                v-model="newEvent.extendedProps.timeEnd"
                :min-time="newEvent.minTimeStart"
                :max-time="newEvent.maxTimeStart"
              />
            </div>

            <select
              class="form_control"
              style="margin-bottom: 20px"
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

            <div style="margin-bottom: 0px" v-if="newEvent.extendedProps.recurrenceType != 'never'">
              <label style="margin-bottom: 10px;display: block;">Excepto los días:</label>

              <VueDatePicker
                multi-dates
                timezone="UTC"
                format="dd/MM/yyyy"
                v-model="newEvent.exdate"
                :teleport="true"
                :enable-time-picker="false"
                :start-time="{
                  hours: parseInt(moment(newEvent.date).format('h')),
                  minutes: parseInt(moment(newEvent.date).format('mm'))
                }"
              />

              <label v-for="exdate in newEvent.exdate" :key="exdate" style="margin: 10px 10px 0 0;display: inline-block;">{{ moment(exdate).format('D/M/Y') }}</label>
            </div>
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
    const startHoursToMinutes = newEvent.value.extendedProps.timeStart.hours * 60;
    const startMinutes = newEvent.value.extendedProps.timeStart.minutes;
    const endHoursToMinutes = newEvent.value.extendedProps.timeEnd.hours * 60;
    const endMinutes = newEvent.value.extendedProps.timeEnd.minutes;
    const startTotalMinutes = startHoursToMinutes + startMinutes;
    const endTotalMinutes = endHoursToMinutes + endMinutes;

    if (startTotalMinutes >= endTotalMinutes) {
      alert("La hora de inicio debe ser menor a la hora de fin.");
      return;
    }

    if (endTotalMinutes - startTotalMinutes < 50) {
      alert("La duración mínima de una asesoría es de 50 minutos.");
      return;
    }

    await calendarStore.storeEvent();
    await calendarStore.getAdvisersDisponibility(adviserSelected.value.id);
    await calendarStore.getWorkshopsByAdvisor(adviserSelected.value.id);
    calendarStore.buildArrayOfEventsToCalendar();
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
    () => newEvent.value.extendedProps.timeStart,
    (timeStart) => {
      const minutes = timeStart.minutes + 50;

      if (minutes >= 60) {
        newEvent.value.extendedProps.timeEnd = {
          hours: timeStart.hours + 1,
          minutes: minutes - 60,
          seconds: timeStart.seconds
        };

        return;
      }

      newEvent.value.extendedProps.timeEnd = {
        hours: timeStart.hours,
        minutes: minutes,
        seconds: timeStart.seconds
      };
    }
  );
</script>

<style lang="scss">
  @import "../../assets/styles/components/modal.scss";
</style>
