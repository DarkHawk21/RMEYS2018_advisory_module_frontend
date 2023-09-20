<template>
  <section class="cards_container">
    <div class="card" v-for="day in days" :key="day.id">
      <div class="card_head interactable d_flex items_center justify_between" @click="showHideEvents(`advisory-${day.id}`)" :id="`advisory-${day.id}`">
        <h3>{{ getCompleteDateName(day.date) }}</h3>
        <i class="fa-solid fa-sort-down"></i>
      </div>

      <div class="card_body">
        <div class="table_container" v-for="advisory in day.advisories" :key="advisory.id">
          <table class="adviser_table">
            <thead @click="showHideStudents(`advisory-table-${advisory.id}`)" :id="`advisory-table-${advisory.id}`">
              <tr>
                <th colspan="2">{{ getCompleteIntervalTime(day, advisory) }} <i class="fa-solid fa-sort-down"></i></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="student in advisory.students" :key="student.id">
                <td class="align_left mw-300">{{ student.name }}</td>
                <td class="align_center">{{ student.group }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card" v-if="days.length === 0">
      <h3>Sin asesorías agendadas</h3>
    </div>
  </section>
</template>

<script setup>
  import { inject } from "vue";
  import { storeToRefs } from "pinia";

  import { useAdviserStore } from "../../stores/AdviserStore";

  const advicerStore = useAdviserStore();
  const { days } = storeToRefs(advicerStore);

  const moment = inject("moment");

  const showHideStudents = (elementId) => {
    const tbody = document.querySelector(`#${elementId} + tbody`);
    tbody.style.height = tbody.style.height ? '' : 'auto';

    const i = document.querySelector(`#${elementId} .fa-solid`);
    i.style.transform = i.style.transform ? '' : 'rotate(180deg)';
  };

  const showHideEvents = (elementId) => {
    const cardBody = document.querySelector(`#${elementId} + .card_body`);
    cardBody.style.display = cardBody.style.display === 'none' ? 'block' : 'none';

    const i = document.querySelector(`#${elementId} .fa-solid`);
    i.style.transform = cardBody.style.display === 'none' ? '' : 'rotate(180deg)';
  };

  const getCompleteDateName = (date) => {
    const dayName = moment(date).format("dddd")[0].toUpperCase() + moment(date).format("dddd").substring(1);
    const dayNumber = moment(date).format("D");
    const monthName = moment(date).format("MMMM");

    return `${dayName} ${dayNumber} de ${monthName}`;
  };

  const getCompleteIntervalTime = ({ date }, { start_time, end_time }) => {
    const startHourFormated = moment(date+'T'+start_time).format('HH:mm');
    const endHourFormated = moment(date+'T'+end_time).format('HH:mm');

    return `De ${startHourFormated} a ${endHourFormated}`;
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/views/adviserHome.scss';
</style>
