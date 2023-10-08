<template>
  <section class="cards_container">
    <div class="card" v-for="schedule in advisoriesArray" :key="schedule.id">
      <div class="card_head interactable d_flex items_center justify_between" @click="showHideEvents(`advisory-${schedule.id}`)" :id="`advisory-${schedule.id}`">
        <h3>{{ getCompleteDateName(schedule.date) }}</h3>
        <i class="fa-solid fa-sort-down"></i>
      </div>

      <div class="card_body">
        <div class="table_container" v-for="advisory in schedule.asesorias" :key="advisory.id">
          <table class="adviser_table">
            <thead @click="showHideStudents(`advisory-table-${advisory.id}`)" :id="`advisory-table-${advisory.id}`">
              <tr>
                <th colspan="2">{{ getCompleteIntervalTime(schedule, advisory) }} <i class="fa-solid fa-sort-down"></i></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="student in advisory.students" :key="student.id">
                <td class="align_left mw-300">{{ student.nombre }}</td>
                <td class="align_center">{{ student.grupo }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card" v-if="advisoriesArray.length === 0">
      <h3>Sin asesorías agendadas</h3>
    </div>
  </section>
</template>

<script setup>
  import { inject, computed, onMounted } from "vue";
  import jwtDecode from 'jwt-decode';
  import { storeToRefs } from "pinia";
  import { _TOKEN } from '../../config';
  import { useAdvisoryStore } from "../../stores/AdvisoryStore";

  const moment = inject("moment");
  const { id } = jwtDecode(localStorage.getItem(_TOKEN));

  const advisoryStore = useAdvisoryStore();
  const { advisories } = storeToRefs(advisoryStore);

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

  const showHideStudents = (elementId) => {
    const tbody = document.querySelector(`#${elementId} + tbody`);
    tbody.style.height = tbody.style.height ? '' : 'auto';

    const i = document.querySelector(`#${elementId} .fa-solid`);
    i.style.transform = i.style.transform ? '' : 'rotate(180deg)';
  };

  const getCompleteIntervalTime = ({ date }, { start_time, end_time }) => {
    const startHourFormated = moment(date+'T'+start_time).format('HH:mm');
    const endHourFormated = moment(date+'T'+end_time).format('HH:mm');

    return `De ${startHourFormated} a ${endHourFormated}`;
  };

  onMounted(async () => {
    await advisoryStore.getAllByAdvisor(id);
  });

  const advisoriesArray = computed(() => {
    let daysInFirstReduce = advisories.value.reduce((arregloAcumulado, asesoria) => {
      const index = arregloAcumulado.findIndex(item => item.date == asesoria.selected_date);

      if (index > -1) {
        arregloAcumulado[index].asesorias.push({
          id: `${moment.utc(asesoria.selected_date + ' ' + asesoria.selected_time_start).format('YYYYMMDDHHmm')}`,
          start_time: asesoria.selected_time_start,
          end_time: asesoria.selected_time_end,
          student: {
            nombre: `${asesoria.student.nombre} ${asesoria.student.appat} ${asesoria.student.apmat}`,
            grupo: asesoria.student.grupo,
            id: `${asesoria.selected_date}${asesoria.selected_time_start}${asesoria.student.ncuenta}`
          }
        });

        return arregloAcumulado;
      } else {
        return [
          ...arregloAcumulado,
          {
            id: `${asesoria.selected_date}${asesoria.id}`,
            date: asesoria.selected_date,
            asesorias: [
              {
                id: `${moment.utc(asesoria.selected_date + ' ' + asesoria.selected_time_start).format('YYYYMMDDHHmm')}`,
                start_time: asesoria.selected_time_start,
                end_time: asesoria.selected_time_end,
                student: {
                  nombre: `${asesoria.student.nombre} ${asesoria.student.appat} ${asesoria.student.apmat}`,
                  grupo: asesoria.student.grupo,
                  id: `${asesoria.selected_date}${asesoria.selected_time_start}${asesoria.student.ncuenta}`
                }
              }
            ]
          }
        ];
      }
    }, []);

    const days = [...daysInFirstReduce];

    days.forEach(dia => {
      const asesorias = [...dia.asesorias];

      dia.asesorias = asesorias.reduce((acumulado, item) => {
        const index = acumulado.findIndex(acumuladoItem => acumuladoItem.start_time == item.start_time);

        if (index > -1) {
          acumulado[index].students.push({
            nombre: item.student.nombre,
            grupo: item.student.grupo,
            id: item.student.id
          });

          return acumulado;
        } else {
          return [
            ...acumulado,
            {
              id: item.id,
              start_time: item.start_time,
              end_time: item.end_time,
              students: [
                {
                  nombre: item.student.nombre,
                  grupo: item.student.grupo,
                  id: item.student.id
                }
              ]
            }
          ];
        }
      }, []);

      dia.asesorias.sort((a, b) => {
        if (a.start_time < b.start_time) {
          return -1;
        }

        if (a.start_time > b.start_time) {
          return 1;
        }

        return 0;
      });
    });

    return days;
  });
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/views/adviserHome.scss';
</style>
