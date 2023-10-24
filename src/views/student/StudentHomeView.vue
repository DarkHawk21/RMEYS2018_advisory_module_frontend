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
        <img :src="'/images/advisers/' + (eventSelected.extendedProps.advisor.img ? eventSelected.extendedProps.advisor.img : 'profile.png')" alt="Foto de perfil del asesor"/>
      </div>

      <h5 class="adviser_name align_center">{{ eventSelected.extendedProps.advisor.name }}</h5>
      <h5 class="align_center">Asesor de {{ eventSelected.extendedProps.advisor.language }}</h5>
    </div>

    <div class="card_body">
      <h5 class="day_selected align_center">{{ selectedDay }}</h5>

      <label class="form_label_control">Hora seleccionada:</label>

      <input type="text" class="form_control" :value="newAdvisory.selectedHour.text" readonly>

      <template v-if="!workshopInHourSchedule">
        <template v-if="selectedHourQuote">
          <h5 class="max_selected align_center">Quedan {{ selectedHourQuote }} lugares disponibles</h5>

          <label class="form_label_control">No. de cuenta:</label>

          <input
            type="text"
            class="form_control"
            placeholder="número de cuenta"
            v-model="newAdvisory.studentAccount"
          />
        </template>

        <template v-else>
          <h5 class="max_selected align_center">¡Ups! El horario que elegiste está lleno, por favor intenta con uno diferente.</h5>
        </template>

        <div class="student_container" v-if="studentSelected.id">
          <p>{{ `${studentSelected.nombre} ${studentSelected.appat} ${studentSelected.apmat}` }}</p>
          <p>Grupo {{ `${studentSelected.grupo}` }}</p>
        </div>

        <div class="student_container" v-if="newAdvisory.studentAccount && !studentSelected.id">
          <p>Alumno no encontrado.</p>
        </div>
      </template>

      <template v-else>
        <h5 class="max_selected align_left">El profesor se encuentra impartiendo el taller:</h5>
        <h5 class="max_selected align_center" style="background:#033b6b;color:#e89f15;padding: 10px 20px;">{{ workshopInHourSchedule.workshop_name }}</h5>
        <h5 class="max_selected align_left">Por favor intenta con un horario diferente.</h5>
      </template>
    </div>

    <div class="card_footer">
      <button
        class="btn w_100"
        v-if="studentSelected.id && !studentIsEnrolledAtThisHour"
        @click="buttonReserveClicked"
      >Inscribirse</button>

      <button
        class="btn w_100"
        v-if="studentSelected.id && studentIsEnrolledAtThisHour && !studentHasCheckInAtThisHour"
        @click="buttonCheckInClicked"
      >Registrar Entrada</button>
    </div>
  </section>

  <a href="http://132.248.99.56/PlataformaRMEYS2018" id="btnBackToRMEYS">Regresar</a>
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
  const {
    newAdvisory,
    studentSelected,
    selectedHourQuote,
    studentIsEnrolledAtThisHour,
    studentHasCheckInAtThisHour
  } = storeToRefs(advisoryStore);

  const workshopInHourSchedule = ref(null);

  onMounted(async () => {
    await calendarStore.getAllAdvisersDisponibility();
    await calendarStore.getAllWorkshops();
    calendarStore.buildArrayOfEventsToCalendar();
  });

  const buttonReserveClicked = async () => {
    await advisoryStore.enrollStudent();

    await Swal.fire({
      icon: 'success',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: '¡Excelente, gracias!',
      confirmButtonColor: 'green',
      title: '¡Te has inscrito correctamente!',
      text: ''
    });

    clearEventSelected();
  };

  const buttonCheckInClicked = async () => {
    newAdvisory.value.checkIn = {
      date: moment().format('Y-MM-DD'),
      timeStart: moment().format('HH:mm:ss')
    };

    await advisoryStore.checkInStudent();

    await Swal.fire({
      timer: 5000,
      icon: 'success',
      timerProgressBar: true,
      showCancelButton: false,
      showConfirmButton: false,
      title: '¡Adelante!',
      text: 'No olvides registrar tu salida cuando termines tu estancia en la Mediateca.'
    });

    clearEventSelected();
  };

  const clearEventSelected = () => {
    calendarStore.clearEventSelected();
    advisoryStore.clearNewAdvisory();
    advisoryStore.clearStudentSelected();
  };

  const selectedDay = computed(() => {
    const dayName = moment(eventSelected.value.start).format("dddd")[0].toUpperCase() + moment(eventSelected.value.start).format("dddd").substring(1);
    const dayNumber = moment(eventSelected.value.start).format("D");
    const monthName = moment(eventSelected.value.start).format("MMMM");

    return `${dayName} ${dayNumber} de ${monthName}`;
  });

  watch(
    () => newAdvisory.value.selectedHour,
    async (selectedHour) => {
      if (selectedHour.timeStart) {
        const scheduleEventId = eventSelected.value.id;
        const selectedDate = moment(eventSelected.value.start).format('Y-MM-DD');
        const selectedTimeStart = `${selectedHour.timeStart.hours}:${selectedHour.timeStart.minutes}:00`;
        advisoryStore.getAdvisoryDisponibility(scheduleEventId, selectedDate, selectedTimeStart);

        if (studentSelected.value.id) {
          advisoryStore.getIfStudentIsEnrolledAtThisHour(scheduleEventId, selectedDate, selectedTimeStart, newAdvisory.value.studentAccount);
          await advisoryStore.getIfStudentHasCheckInAtThisHour(scheduleEventId, selectedDate, selectedTimeStart, newAdvisory.value.studentAccount);

          if (studentHasCheckInAtThisHour.value) {
            Swal.fire({
              timer: 5000,
              icon: 'success',
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
              title: '¡Adelante!',
              text: 'Ya tenemos registrada tu entrada a esta asesoría.\nNo olvides registrar tu salida cuando termines tu estancia en la Mediateca.'
            });
          }
        }
      }
    }
  );

  watch(
    () => newAdvisory.value.studentAccount,
    async (studentAccount) => {
      if (studentAccount && studentAccount.length == 9) {
        const scheduleEventId = eventSelected.value.id;
        const selectedDate = moment(eventSelected.value.start).format('Y-MM-DD');
        const selectedTimeStart = `${newAdvisory.value.selectedHour.timeStart.hours}:${newAdvisory.value.selectedHour.timeStart.minutes}:00`;
        advisoryStore.getIfStudentIsEnrolledAtThisHour(scheduleEventId, selectedDate, selectedTimeStart, studentAccount);
        advisoryStore.getStudent(studentAccount);
        await advisoryStore.getIfStudentHasCheckInAtThisHour(scheduleEventId, selectedDate, selectedTimeStart, studentAccount);

        if (studentHasCheckInAtThisHour.value) {
          Swal.fire({
            timer: 5000,
            icon: 'success',
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
            title: '¡Adelante!',
            text: 'Ya tenemos registrada tu entrada a esta asesoría.\nNo olvides registrar tu salida cuando termines tu estancia en la Mediateca.'
          });
        }
      }
    }
  );

  const calendarOptions = computed(() => {
    return {
      ...options.value,
      eventClick: async ({ event }) => {
        if (!event.extendedProps.type) {
          await calendarStore.getEventData(event.id, moment);
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

          const advisorWorkshops = workshopsFetched.value.filter(workshop => workshop.userId == eventSelectedAdvisorId);

          const formatedHourStart = eventSelectedTimeStartHours < 10
            ? `0${eventSelectedTimeStartHours}`
            : eventSelectedTimeStartHours;

          const formatedMinutesStart = eventSelectedTimeStartMinutes < 10
            ? `0${eventSelectedTimeStartMinutes}`
            : eventSelectedTimeStartMinutes;

          const formatedHourEnd = eventSelectedTimeEndHours < 10
            ? `0${eventSelectedTimeEndHours}`
            : eventSelectedTimeEndHours;

          const formatedMinutesEnd = eventSelectedTimeEndMinutes < 10
            ? `0${eventSelectedTimeEndMinutes}`
            : eventSelectedTimeEndMinutes;

          workshopInHourSchedule.value = advisorWorkshops.find(
            workshop => {
              const dateStart = `${eventDateStart} ${formatedHourStart}:${formatedMinutesStart}:00`;
              const dateEnd = `${eventDateEnd} ${formatedHourEnd}:${formatedMinutesEnd}:00`;
              const workshopStart = moment(workshop.start);
              const workshopEnd = moment(workshop.end);
              const startIsBetweenWorkshop = moment(dateStart).isBetween(workshopStart, workshopEnd);
              const endIsBetweenWorkshop = moment(dateEnd).isBetween(workshopStart, workshopEnd);

              return startIsBetweenWorkshop || endIsBetweenWorkshop;
            }
          );

          newAdvisory.value.selectedHour = {
            text: `De ${formatedHourStart}:${formatedMinutesStart} a ${formatedHourEnd}:${formatedMinutesEnd}`,
            timeStart: {
              hours: parseInt(formatedHourStart),
              minutes: parseInt(formatedMinutesStart)
            },
            timeEnd: {
              hours: parseInt(formatedHourEnd),
              minutes: parseInt(formatedMinutesEnd)
            }
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
