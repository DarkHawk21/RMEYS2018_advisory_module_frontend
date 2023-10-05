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
                v-model="eventSelected.date"
                :teleport="true"
                :format="dateFormat"
                :enable-time-picker="false"
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
                :min-time="eventSelected.minTimeStart"
                :max-time="eventSelected.maxTimeStart"
              />

              <label style="margin: 0 10px">a</label>
              <VueDatePicker
                time-picker
                v-model="eventSelected.extendedProps.timeEnd"
                :teleport="true"
                :minutesIncrement="30"
                :minutes-grid-increment="30"
                :min-time="{
                  hours: eventSelected.minTimeStart.hours + 1,
                  minutes: eventSelected.minTimeStart.minutes,
                }"
                :max-time="{
                  hours: eventSelected.maxTimeStart.hours + 1,
                  minutes: eventSelected.maxTimeStart.minutes,
                }"
              />
            </div>

            <select class="form_control" style="margin-bottom: 20px" @change="recurrenceTypeChanged" v-model="eventSelected.extendedProps.recurrenceType">
              <option value="never">No se repite</option>
              <option value="weekly">Cada semana, el {{ moment(eventSelected.date).format("dddd") }}</option>
              <option value="monthly">Cada mes, el día {{ moment(eventSelected.date).format("D") }}</option>
              <option value="yearly">Anualmente, el {{ moment(eventSelected.date).format("D") }} de {{ moment(eventSelected.date).format("MMMM") }}</option>
              <option value="daily">Todos los días hábiles (de lunes a viernes)</option>
              <option value="personalized">Personalizado...</option>
            </select>

            <div style="margin-bottom: 0px" v-if="eventSelected.extendedProps.recurrenceType != 'never'">
              <label style="margin-bottom: 10px;display: block;">Excepto los días:</label>

              <VueDatePicker
                multi-dates
                timezone="UTC"
                format="dd/MM/yyyy"
                v-model="eventSelected.exdate"
                :teleport="true"
                :enable-time-picker="false"
                :start-time="{
                  hours: parseInt(moment(eventSelected.date).format('h')),
                  minutes: parseInt(moment(eventSelected.date).format('mm'))
                }"
              />

              <label v-for="exdate in eventSelected.exdate" :key="exdate" style="margin: 10px 10px 0 0;display: inline-block;">{{ moment(exdate).format('D/M/Y') }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="modal_footer">
        <button class="btn bg_red" @click="$emit('hideModalEditEvent')">Cancelar</button>
        <button class="btn bg_red" @click="deleteEvent">Eliminar</button>
        <button class="btn" @click="updateEvent">Actualizar</button>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { inject } from "vue";
  import { storeToRefs } from "pinia";
  import Swal from 'sweetalert2/dist/sweetalert2';
  import { useAdviserStore } from "../../stores/AdviserStore";
  import { useCalendarStore } from "../../stores/CalendarStore";

  const moment = inject("moment");

  const adviserStore = useAdviserStore();
  const { adviserSelected } = storeToRefs(adviserStore);

  const calendarStore = useCalendarStore();
  const { eventSelected } = storeToRefs(calendarStore);

  const emit = defineEmits(['updateEvent', 'showModalEditRecurrence', 'deleteEvent']);

  const recurrenceTypeChanged = () => {
    if (eventSelected.value.extendedProps.recurrenceType == 'personalized') {
      emit('showModalEditRecurrence');
    }
  };

  const updateEvent = async () => {
    if (eventSelected.value.extendedProps.timeStart.minutes != eventSelected.value.extendedProps.timeEnd.minutes) {
      alert("No se puede editar un evento en fracciones de 30 minutos.");
      return;
    }

    await calendarStore.updateEvent();
    await calendarStore.getAdvisersDisponibility(adviserSelected.value.id);
    calendarStore.clearEventSelected();
    emit('updateEvent');
  };

  const deleteEvent = async () => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Ok, Eliminar',
      confirmButtonColor: 'green',
      cancelButtonColor: '#d33',
      title: '¡Atención!',
      text: 'Ten en cuenta que se eliminará toda la información relacionada, incluyendo las inscripciones de los alumnos a asesorías dentro del horario que concuerda con este evento (si es que hay).'
    });

    if (isConfirmed) {
      await calendarStore.deleteEvent();
      await calendarStore.getAdvisersDisponibility(adviserSelected.value.id);
      calendarStore.clearEventSelected();
      emit('deleteEvent');
    }
  };

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
