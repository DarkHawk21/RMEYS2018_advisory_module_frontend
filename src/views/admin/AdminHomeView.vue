<template>
  <!-- Modal para Añadir un evento -->
  <ModalAddEvent
    v-if="showModalAddEvent"
    @save-new-event="saveNewEvent"
    @hide-modal-add-event="hideModalAddEvent"
  />

  <!-- Modal para Editar un evento -->
  <ModalEditEvent
    v-if="showModalEditEvent && eventSelected.id"
    @save-edited-event="saveEditedEvent"
    @hide-modal-edit-event="hideModalEditEvent"
  />


  <!-- Modal para Añadir recurrencia a un evento -->
  <section class="modal_wrap" v-if="showModalAddRecurrence">
    <div class="modal">
      <div class="modal_header">
        <i class="fa-solid fa-xmark" @click="hideModalAddRecurrence"></i>
      </div>

      <div class="modal_body">
        <h4 class="modal_title" style="margin-bottom:20px;">Recurrencia personalizada</h4>

        <div class="form_control_container">
          <div style="margin-bottom:10px;">
            <label style="margin-right:10px;">Repetir cada</label>
            <input
              type="number"
              min="1"
              class="form_control align_center"
              style="width:70px;margin-right:10px;"
              v-model="newEvent.recurrence.repeatTimes.times"
            >

            <select class="form_control" style="width:110px;" v-model="newEvent.recurrence.repeatTimes.type">
              <option value="diary">días</option>
              <option value="weekly">semanas</option>
              <option value="monthly">meses</option>
              <option value="annual">años</option>
            </select>
          </div>

          <div style="margin-bottom:20px;">
            <label class="form_label_control" style="margin-bottom:20px;">Repetir el</label>

            <input type="checkbox" id="checkMonday" class="recurrence_checkbox" value="monday" v-model="newEvent.recurrence.repeatDays">
            <label for="checkMonday" class="recurrence_label">L</label>

            <input type="checkbox" id="checkTuesday" class="recurrence_checkbox" value="tuesday" v-model="newEvent.recurrence.repeatDays">
            <label for="checkTuesday" class="recurrence_label">M</label>

            <input type="checkbox" id="checkWednesday" class="recurrence_checkbox" value="wednesday" v-model="newEvent.recurrence.repeatDays">
            <label for="checkWednesday" class="recurrence_label">M</label>

            <input type="checkbox" id="checkThursday" class="recurrence_checkbox" value="thursday" v-model="newEvent.recurrence.repeatDays">
            <label for="checkThursday" class="recurrence_label">J</label>

            <input type="checkbox" id="checkFriday" class="recurrence_checkbox" value="friday" v-model="newEvent.recurrence.repeatDays">
            <label for="checkFriday" class="recurrence_label">V</label>
          </div>

          <div>
            <label class="form_label_control" style="margin-bottom:20px;">Finaliza</label>

            <div class="d_flex items_center" style="margin-bottom:10px;">
              <input
                type="radio"
                id="radioEndNever"
                value="never"
                style="margin-right:10px;"
                class="recurrence_radio"
                name="recurrenceRadio"
                v-model="newEvent.recurrence.finishAt.type"
              >
              <label for="radioEndNever">Nunca</label>
            </div>

            <div class="d_flex items_center" style="margin-bottom:10px;">
              <input
                type="radio"
                id="radioEndThe"
                value="date"
                style="margin-right:10px;"
                class="recurrence_radio"
                name="recurrenceRadio"
                v-model="newEvent.recurrence.finishAt.type"
              >
              <label for="radioEndThe" style="margin-right:80px;">El</label>
              <VueDatePicker
                :readonly="newEvent.recurrence.finishAt.type != 'date'"
                v-model="newEvent.recurrence.finishAt.value"
              />
            </div>

            <div class="d_flex items_center">
              <input
                type="radio"
                id="radioEndAfter"
                value="times"
                style="margin-right:10px;"
                class="recurrence_radio"
                name="recurrenceRadio"
                v-model="newEvent.recurrence.finishAt.type"
              >
              <label for="radioEndAfter" style="margin-right:12.5px;min-width:80px;">Después de</label>

              <input
                type="number"
                min="1"
                class="form_control align_center"
                style="width:70px;margin-right:10px;margin-bottom:0;"
                :readonly="newEvent.recurrence.finishAt.type != 'times'"
                v-model="newEvent.recurrence.finishAt.value"
              >
              <label>ocurrencias</label>
            </div>
          </div>
        </div>
      </div>

      <div class="modal_footer">
        <button class="btn bg_red" @click="hideModalAddRecurrence">Cancelar</button>
        <button class="btn" @click="saveEventRecurrence">Guardar</button>
      </div>
    </div>
  </section>

  <!-- Modal para Editar la recurrencia de un evento -->
  <ModalEditRecurrence
    v-if="showModalEditRecurrence"
    @save-event-edit-recurrence="saveEventEditRecurrence"
    @hide-modal-edit-recurrence="hideModalEditRecurrence"
  />

  <!-- Sección para seleccionar un asesor -->
  <section class="d_flex flex_column w_60">
    <div class="card w_100 d_flex items_end justify_between">
      <div class="form_control_container">
        <label class="form_label_control">Selecciona un asesor:</label>
        <select class="form_control" style="margin-bottom:0;" v-model="filters.adviser">
          <option :value="null">...</option>
          <option v-for="adviser in advisers" :key="adviser.id" :value="adviser">{{ adviser.user_detail.name }}</option>
        </select>
      </div>

      <button class="btn" @click="searchAdviserEvents" v-if="filters.adviser">Buscar</button>
    </div>

    <section class="calendar_container w_100">
      <FullCalendar :options="calendarOptions" />
    </section>
  </section>

  <!-- Sección para mostrar los datos del asesor -->
  <section class="card data_container" v-if="adviserSelected.id">
    <div class="card_head">
      <div class="w_100 d_flex flex_row justify_between items_center">
        <h4>Has seleccionado:</h4>

        <button @click="adviserStore.clearSelection" class="btn bg_red">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="adviser_img_container">
        <img :src="'/images/' + adviserSelected.img" alt="Foto de perfil del asesor"/>
      </div>

      <h5 class="adviser_name align_center">{{ adviserSelected.name }}</h5>
      <h5 class="align_center">Asesor de {{ adviserSelected.language }}</h5>
    </div>
  </section>
</template>

<script setup>
  import { storeToRefs } from "pinia";
  import FullCalendar from "@fullcalendar/vue3";
  import { ref, watch, inject, computed } from "vue";
  import { useAdviserStore } from "../../stores/AdviserStore";
  import { useCalendarStore } from "../../stores/CalendarStore";
  import ModalAddEvent from '../../components/modals/ModalAddEvent.vue';
  import ModalEditEvent from '../../components/modals/ModalEditEvent.vue';
  import ModalEditRecurrence from '../../components/modals/ModalEditRecurrence.vue';

  const moment = inject("moment");

  const adviserStore = useAdviserStore();
  const { adviserSelected, advisers, filters } = storeToRefs(adviserStore);

  const calendarStore = useCalendarStore();
  const { options, newEvent, eventSelected } = storeToRefs(calendarStore);

  adviserStore.getAdvisers();

  let showModalAddEvent = ref(false);
  let showModalAddRecurrence = ref(false);
  let showModalEditEvent = ref(false);
  let showModalEditRecurrence = ref(false);

  const searchAdviserEvents = () => {
    adviserStore.getAdviser(filters.value.adviser.id);
    calendarStore.getAdvisersDisponibility(filters.value.adviser.id);
  };

  const saveNewEvent = () => {
    if (newEvent.value.timeStart.minutes != newEvent.value.timeEnd.minutes) {
      alert("No se puede crear un evento en fracciones de menos de una hora.");
      return;
    }

    showModalAddEvent.value = false;
  };

  const saveEditedEvent = () => {};

  const hideModalAddEvent = () => {
    showModalAddEvent.value = false;
  };

  const hideModalAddRecurrence = () => {
    showModalAddRecurrence.value = false;
  };

  const hideModalEditRecurrence = () => {
    showModalEditRecurrence.value = false;
  };

  const hideModalEditEvent = () => {
    showModalEditEvent.value = false;
  };

  const saveEventRecurrence = () => {
    showModalAddRecurrence.value = false;
  }

  const saveEventEditRecurrence = () => {
    showModalEditRecurrence.value = false;
  }

  const showModalRecurrenceEdit = (recurrenceType) => {
    switch(recurrenceType) {
      case 'personalized':
          showModalEditRecurrence.value = true;
        break;
    }
  };

  watch(
    () => newEvent.value.recurrenceType,
    (recurrence) => {
      switch(recurrence) {
        case 'personalized':
          showModalAddRecurrence.value = true;
          break;
      }
    }
  );

  options.value.headerToolbar.end = "timeGridDay,timeGridWeek,dayGridMonth";

  const calendarOptions = computed(() => {
    return {
      ...options.value,
      dateClick: ({ date }) => {
        if (adviserSelected) {
          showModalAddEvent.value = true;
          newEvent.value.date = date;

          newEvent.value.timeStart = {
            hours: parseInt(moment(date).format('hh')),
            minutes: parseInt(moment(date).format('mm')),
            seconds: parseInt(moment(date).format('ss'))
          };

          newEvent.value.timeEnd = {
            hours: parseInt(newEvent.value.timeStart.hours) + 1,
            minutes: parseInt(newEvent.value.timeStart.minutes),
            seconds: parseInt(newEvent.value.timeStart.seconds)
          };
        } else {
          alert("Selecciona un asesor.");
        }
      },
      eventClick: ({event}) => {
        calendarStore.getEventData(event.id, moment);
        showModalEditEvent.value = true;
      }
    };
  });
</script>

<style lang="scss">
  @import "../../assets/styles/components/calendar.scss";
</style>
