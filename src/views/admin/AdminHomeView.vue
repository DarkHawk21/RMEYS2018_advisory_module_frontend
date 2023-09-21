<template>
  <section class="modal_wrap" v-if="showModalAddEvent">
    <div class="modal">
      <div class="modal_header">
        <i class="fa-solid fa-xmark" @click="hideModalAddEvent"></i>
      </div>

      <div class="modal_body">
        <h4 class="modal_title">Agregando la disponibilidad del asesor</h4>
        <h5 class="modal_subtitle">{{ adviserSelected.name }}</h5>

        <div class="d_flex items_start">
          <i class="fa-regular fa-clock" style="margin-top:1px;margin-right:20px;"></i>

          <div class="form_control_container">
            <div style="margin-bottom:20px;">
              <VueDatePicker
                v-model="newEvent.date"
                :teleport="true"
                :format="dateFormat"
                :enable-time-picker="false"
              />
            </div>

            <div class="d_flex items_center" style="margin-bottom:20px;">
              <label style="margin-right:10px;">De</label>
              <VueDatePicker
                time-picker
                v-model="newEvent.timeStart"
                :teleport="true"
                :minutesIncrement="30"
                :minutes-grid-increment="30"
                :min-time="newEvent.minTimeStart"
                :max-time="newEvent.maxTimeStart"
              />

              <label style="margin:0 10px;">a</label>
              <VueDatePicker
                time-picker
                v-model="newEvent.timeEnd"
                :teleport="true"
                :minutesIncrement="30"
                :minutes-grid-increment="30"
                :min-time="{ hours: newEvent.minTimeStart.hours + 1, minutes: newEvent.minTimeStart.minutes }"
                :max-time="{ hours: newEvent.maxTimeStart.hours + 1, minutes: newEvent.maxTimeStart.minutes }"
              />
            </div>

            <select class="form_control" style="margin-bottom:0px;" v-model="newEvent.recurrenceType">
              <option value="">No se repite</option>
              <option value="each-week">Cada semana, el {{ moment(newEvent.date).format("dddd") }}</option>
              <option value="each-month">Cada mes, el día {{ moment(newEvent.date).format("D") }}</option>
              <option value="each-year">Anualmente, el {{ moment(newEvent.date).format("D") }} de {{ moment(newEvent.date).format("MMMM") }}</option>
              <option value="every-business-day">Todos los días hábiles (de lunes a viernes)</option>
              <option value="personalized">Personalizado...</option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal_footer">
        <button class="btn bg_red" @click="hideModalAddEvent">Cancelar</button>
        <button class="btn" @click="saveNewEvent">Guardar</button>
      </div>
    </div>
  </section>

  <section class="modal_wrap" v-if="showModalEditRecurrence">
    <div class="modal">
      <div class="modal_header">
        <i class="fa-solid fa-xmark" @click="hideModalEditRecurrence"></i>
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
        <button class="btn bg_red" @click="hideModalEditRecurrence">Cancelar</button>
        <button class="btn" @click="saveEventRecurrence">Guardar</button>
      </div>
    </div>
  </section>

  <section class="d_flex flex_column w_60">
    <div class="card w_100 d_flex items_end justify_between">
      <div class="form_control_container">
        <label class="form_label_control">Selecciona un asesor:</label>
        <select class="form_control" style="margin-bottom:0;" v-model="filters.adviser">
          <option :value="null">...</option>
          <option v-for="adviser in advisers" :key="adviser.id" :value="adviser">{{ adviser.name }}</option>
        </select>
      </div>

      <button class="btn" @click="searchAdviserEvents">Buscar</button>
    </div>

    <section class="calendar_container w_100">
      <FullCalendar :options="calendarOptions" />
    </section>
  </section>

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
  import FullCalendar from "@fullcalendar/vue3";

  import { ref, watch, inject, computed } from "vue";

  import { storeToRefs } from "pinia";
  import { useAdviserStore } from "../../stores/AdviserStore";
  import { useCalendarStore } from "../../stores/CalendarStore";

  const moment = inject("moment");

  const adviserStore = useAdviserStore();
  const { adviserSelected, advisers, filters } = storeToRefs(adviserStore);

  const calendarStore = useCalendarStore();
  const { options, newEvent } = storeToRefs(calendarStore);

  adviserStore.getAdvisers();

  let showModalAddEvent = ref(false);
  let showModalEditRecurrence = ref(false);

  const searchAdviserEvents = () => {
    adviserStore.getAdviser(filters.value.adviser.id);
    calendarStore.getAdvisersDisponibility();
  };

  const saveNewEvent = () => {
    if (newEvent.value.timeStart.minutes != newEvent.value.timeEnd.minutes) {
      alert("No se puede crear un evento en fracciones de menos de una hora.");
      return;
    }

    console.log(newEvent.value);
    showModalAddEvent.value = false;
  };

  const hideModalAddEvent = () => {
    showModalAddEvent.value = false;
  };

  const hideModalEditRecurrence = () => {
    showModalEditRecurrence.value = false;
  };

  const saveEventRecurrence = () => {
    console.log(newEvent.value.recurrence);
    showModalEditRecurrence.value = false;
  }

  const dateFormat = (date) => {
    const dayName = moment(date).format("dddd")[0].toUpperCase() + moment(date).format("dddd").substring(1);
    const dayNumber = moment(date).format("D");
    const monthName = moment(date).format("MMMM");

    return `${dayName} ${dayNumber} de ${monthName}`;
  };

  watch(
    () => newEvent.value.recurrenceType,
    (recurrence) => {
      switch(recurrence) {
        case 'personalized':
          showModalEditRecurrence.value = true;
          break;
      }
    }
  );

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

  options.value.headerToolbar.end = "timeGridDay,timeGridWeek,dayGridMonth";

  const calendarOptions = computed(() => {
    return {
      ...options.value,
      dateClick: ({ date }) => {
        showModalAddEvent.value = true;
        newEvent.value.date = date;
        newEvent.value.timeStart = {
          hours: parseInt(moment(date).format('hh')),
          minutes: parseInt(moment(date).format('mm')),
          seconds: parseInt(moment(date).format('ss'))
        };
      }
    };
  });
</script>

<style lang="scss">
  @import "../../assets/styles/components/calendar.scss";
  @import "../../assets/styles/components/modal.scss";
</style>
