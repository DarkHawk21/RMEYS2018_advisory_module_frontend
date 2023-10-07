<template>
  <section class="calendar_container">
    <FullCalendar :options="calendarOptions" />
  </section>

  <section class="card data_container" v-if="eventSelected.id">
    <div class="card_head">
      <div class="w_100 d_flex flex_row justify_between items_center">
        <h4>Has seleccionado:</h4>

        <button @click="clearEventSelected" class="btn bg_red">
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

      <label class="form_label_control">Selecciona una hora:</label>

      <select class="form_control" v-model="newAdvisory.selectedHour">
        <option v-for="hour in possibleHoursToRegister" :key="hour" :value="hour.value">{{ hour.text }}</option>
      </select>

      <!-- <h5 class="max_selected align_center">Quedan {{ eventSelected.extendedProps.availablePlaces }} lugares disponibles</h5> -->

      <label class="form_label_control">No. de cuenta:</label>
      <input
        type="text"
        class="form_control"
        placeholder="número de cuenta"
        v-model="newAdvisory.studentAccount"
      />

      <div class="student_container" v-if="studentSelected.id">
        <p>{{ `${studentSelected.nombre} ${studentSelected.appat} ${studentSelected.apmat}` }}</p>
        <p>Grupo {{ `${studentSelected.grupo}` }}</p>
      </div>

      <div class="student_container" v-if="newAdvisory.studentAccount && !studentSelected.id">
        <p>Alumno no encontrado.</p>
      </div>
    </div>

    <div class="card_footer">
      <button
        class="btn w_100"
        v-if="studentSelected.id"
        @click="buttonReserveClicked"
      >Inscribirse</button>
    </div>
  </section>
</template>

<script setup>
  import { storeToRefs } from "pinia";
  import FullCalendar from "@fullcalendar/vue3";
  import Swal from 'sweetalert2/dist/sweetalert2';
  import { ref, inject, computed, onMounted, watch } from "vue";
  import { useCalendarStore } from "../../stores/CalendarStore";
  import { useAdvisoryStore } from "../../stores/AdvisoryStore";

  const moment = inject("moment");

  const calendarStore = useCalendarStore();
  const { options, eventSelected, workshopsFetched } = storeToRefs(calendarStore);

  const advisoryStore = useAdvisoryStore();
  const { newAdvisory, studentSelected } = storeToRefs(advisoryStore);

  const possibleHoursToRegister = ref([]);

  onMounted(async () => {
    await calendarStore.getAllAdvisersDisponibility();
    await calendarStore.getAllWorkshops();
    calendarStore.buildArrayOfEventsToCalendar();
  });

  const buttonReserveClicked = async () => {
    await advisoryStore.enrollStudent();

    Swal.fire({
      icon: 'success',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: '¡Excelente, gracias!',
      confirmButtonColor: 'green',
      title: '¡Te has inscrito correctamente!',
      text: ''
    });
  };

  const clearEventSelected = () => {
    calendarStore.clearEventSelected();
    advisoryStore.clearNewAdvisory();
    advisoryStore.clearStudentSelected();
    possibleHoursToRegister.value = [];
  };

  const selectedDay = computed(() => {
    const dayName = moment(eventSelected.value.start).format("dddd")[0].toUpperCase() + moment(eventSelected.value.start).format("dddd").substring(1);
    const dayNumber = moment(eventSelected.value.start).format("D");
    const monthName = moment(eventSelected.value.start).format("MMMM");

    return `${dayName} ${dayNumber} de ${monthName}`;
  });

  watch(
    () => newAdvisory.value.studentAccount,
    (studentAccount) => {
      if (studentAccount) {
        advisoryStore.getStudent(studentAccount);
      }
    }
  );

  const calendarOptions = computed(() => {
    return {
      ...options.value,
      eventClick: async ({ event }) => {
        await calendarStore.getEventData(event.id, moment);

        possibleHoursToRegister.value = [];
        newAdvisory.value.event = eventSelected.value;
        const eventDateStart = moment(event._instance.range.start).format('Y-MM-DD');
        const eventDateEnd = moment(event._instance.range.end).format('Y-MM-DD');
        const eventTimeStart = moment.utc(event._instance.range.start).format('HH:mm:ss');
        const eventTimeEnd = moment.utc(event._instance.range.end).format('HH:mm:ss');
        const eventSelectedTimeEndHours = eventSelected.value.extendedProps.timeEnd.hours;
        const eventSelectedTimeStartHours = eventSelected.value.extendedProps.timeStart.hours;
        const eventSelectedTimeStartMinutes = eventSelected.value.extendedProps.timeStart.minutes;
        const eventSelectedTimeEndMinutes = eventSelected.value.extendedProps.timeEnd.minutes;
        const eventSelectedAdvisorId = eventSelected.value.extendedProps.advisor.id;

        eventSelected.value.start = `${eventDateStart}T${eventTimeStart}`;
        eventSelected.value.end = `${eventDateEnd}T${eventTimeEnd}`;

        const eventSelectedTotalHours = eventSelectedTimeEndHours - eventSelectedTimeStartHours;

        for(let i = 0; i < eventSelectedTotalHours; i++) {
          const workshopInHourSchedule = workshopsFetched.value.find(
            workshop => workshop.start == `${eventDateStart} ${eventSelectedTimeStartHours + i}:${eventSelectedTimeStartMinutes == 0 ? '00' : eventSelectedTimeStartMinutes}:00`
              && workshop.userId == eventSelectedAdvisorId
          );

          if (!workshopInHourSchedule) {
            const option = {
              text: `
                De ${eventSelectedTimeStartHours + i}:${eventSelectedTimeStartMinutes == 0 ? '00' : '30'}
                a ${eventSelectedTimeEndHours - (eventSelectedTotalHours - (i + 1))}:${eventSelectedTimeEndMinutes == 0 ? '00' : eventSelectedTimeEndMinutes}
              `,
              value: {
                timeStart: {
                  hours: moment(`${eventDateStart} ${(eventSelectedTimeStartHours + i)}:00:00`).format('HH'),
                  minutes: eventSelectedTimeStartMinutes == 0
                    ? '00'
                    : eventSelectedTimeStartMinutes
                },
                timeEnd: {
                  hours: moment(`${eventDateEnd} ${(eventSelectedTimeEndHours - (eventSelectedTotalHours - (i + 1)))}:00:00`).format('HH'),
                  minutes: eventSelectedTimeEndMinutes == 0
                    ? '00'
                    : eventSelectedTimeEndMinutes
                }
              },
            };

            if (i === 0) {
              newAdvisory.value.selectedHour = option.value;
            }

            possibleHoursToRegister.value.push(option);
          }
        }
      }
    };
  });
</script>

<style lang="scss">
  @import "../../assets/styles/components/calendar.scss";
  @import "../../assets/styles/views/studentHome.scss";
</style>
