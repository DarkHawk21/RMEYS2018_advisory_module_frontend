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
    @save-event-add-recurrence="showModalAddRecurrence = false"
    @hide-modal-add-recurrence="showModalAddRecurrence = false"
  />

  <!-- Modal para Editar un evento -->
  <ModalEditEvent
    v-if="showModalEditEvent && eventSelected.id"
    @delete-event="showModalEditEvent = false"
    @update-event="showModalEditEvent = false"
    @hide-modal-edit-event="showModalEditEvent = false"
    @show-modal-edit-recurrence="showModalEditRecurrence = true"
  />

  <!-- Modal para Editar la recurrencia de un evento -->
  <ModalEditRecurrence
    v-if="showModalEditRecurrence"
    @save-event-edit-recurrence="showModalEditRecurrence = false"
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

      <div>
        <router-link class="btn" style="text-decoration:none;" to="/admin/advisors">Asesorias</router-link>
        <button class="btn" style="margin-left:10px;" @click="searchAdviserEvents" v-if="filters.adviser">Buscar</button>
      </div>
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
      </div>

      <div class="adviser_img_container">
        <img :src="'/asesorias/images/advisers/' + (adviserSelected.img ? adviserSelected.img : 'profile.png')" alt="Foto de perfil del asesor"/>
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

  const searchAdviserEvents = async () => {
    await adviserStore.getAdviser(filters.value.adviser.id);
    await calendarStore.getAdvisersDisponibility(filters.value.adviser.id);
    await calendarStore.getWorkshopsByAdvisor(filters.value.adviser.id);
    calendarStore.buildArrayOfEventsToCalendar();
  };

  options.value.headerToolbar.end = "timeGridDay,timeGridWeek,dayGridMonth";

  const calendarOptions = computed(() => {
    return {
      ...options.value,
      dateClick: ({ date }) => {
        if (adviserSelected.value.id) {
          newEvent.value.date = date;

          newEvent.value.extendedProps.timeStart = {
            hours: parseInt(moment.utc(date).format('HH')),
            minutes: parseInt(moment.utc(date).format('mm')),
          };

          newEvent.value.extendedProps.timeEnd = {
            hours: parseInt(moment.utc(date).add(moment.duration('00:50:00')).format('HH')),
            minutes: parseInt(moment.utc(date).add(moment.duration('00:50:00')).format('mm')),
          };

          showModalAddEvent.value = true;
        } else {
          alert("Selecciona un asesor.");
        }
      },
      eventClick: async ({ event }) => {
        if (!event.extendedProps.type) {
          await calendarStore.getEventData(event.id, moment);
          showModalEditEvent.value = true;
        }
      }
    };
  });
</script>

<style lang="scss">
  @import "../../assets/styles/components/calendar.scss";
</style>
