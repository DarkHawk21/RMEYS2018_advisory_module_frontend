<template>
  <!-- Modal para Añadir un evento -->
  <ModalAddEvent
    v-if="showModalAddEvent"
    @save-new-event="showModalAddEvent = false"
    @hide-modal-add-event="showModalAddEvent = false"
    @show-modal-add-recurrence="showModalAddRecurrence = true"
  />

  <!-- Modal para Añadir recurrencia a un evento -->
  <ModalAddRecurrence
    v-if="showModalAddRecurrence"
    @save-event-recurrence="showModalAddRecurrence = false"
    @hide-modal-add-recurrence="showModalAddRecurrence = false"
  />

  <!-- Modal para Editar un evento -->
  <ModalEditEvent
    v-if="showModalEditEvent && eventSelected.id"
    @save-edited-event="saveEditedEvent"
    @hide-modal-edit-event="showModalEditEvent = false"
  />

  <!-- Modal para Editar la recurrencia de un evento -->
  <ModalEditRecurrence
    v-if="showModalEditRecurrence"
    @save-event-edit-recurrence="saveEventEditRecurrence"
    @hide-modal-edit-recurrence="showModalEditRecurrence = false"
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
  import { ref, inject, computed } from "vue";
  import { useAdviserStore } from "../../stores/AdviserStore";
  import { useCalendarStore } from "../../stores/CalendarStore";
  import ModalAddEvent from '../../components/modals/ModalAddEvent.vue';
  import ModalEditEvent from '../../components/modals/ModalEditEvent.vue';
  import ModalAddRecurrence from "../../components/modals/ModalAddRecurrence.vue";
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

  const saveEditedEvent = () => {};

  const saveEventEditRecurrence = () => {
    showModalEditRecurrence.value = false;
  }

  options.value.headerToolbar.end = "timeGridDay,timeGridWeek,dayGridMonth";

  const calendarOptions = computed(() => {
    return {
      ...options.value,
      dateClick: ({ date }) => {
        if (adviserSelected) {
          newEvent.value.date = date;

          newEvent.value.extendedProps.timeStart = {
            hours: parseInt(moment(date).format('HH')),
            minutes: parseInt(moment(date).format('mm')),
          };

          newEvent.value.extendedProps.timeEnd = {
            hours: parseInt(newEvent.value.extendedProps.timeStart.hours) + 1,
            minutes: parseInt(newEvent.value.extendedProps.timeStart.minutes),
          };

          showModalAddEvent.value = true;
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
