<template>
  <section class="modal_wrap">
    <div class="modal">
      <div class="modal_header">
        <i class="fa-solid fa-xmark" @click="$emit('hideModalAddRecurrence')"></i>
      </div>

      <div class="modal_body">
        <h4 class="modal_title" style="margin-bottom: 20px">Recurrencia personalizada</h4>

        <div class="form_control_container">
          <div style="margin-bottom: 10px">
            <label style="margin-right: 10px">Repetir cada</label>
            <input
              type="number"
              min="1"
              class="form_control align_center"
              style="width: 70px; margin-right: 10px"
              v-model="newEvent.extendedProps.recurrence.repeatTimes.times"
            />

            <select class="form_control" style="width: 110px" v-model="newEvent.extendedProps.recurrence.repeatTimes.type">
              <option value="daily">días</option>
              <option value="weekly">semanas</option>
              <option value="monthly">meses</option>
              <option value="yearly">años</option>
            </select>
          </div>

          <div style="margin-bottom: 20px">
            <label class="form_label_control" style="margin-bottom: 20px">Repetir el</label>

            <input type="checkbox" id="checkMonday" class="recurrence_checkbox" value="mo" v-model="newEvent.extendedProps.recurrence.repeatDays"/>
            <label for="checkMonday" class="recurrence_label">L</label>

            <input type="checkbox" id="checkTuesday" class="recurrence_checkbox" value="tu" v-model="newEvent.extendedProps.recurrence.repeatDays"/>
            <label for="checkTuesday" class="recurrence_label">M</label>

            <input type="checkbox" id="checkWednesday" class="recurrence_checkbox" value="we" v-model="newEvent.extendedProps.recurrence.repeatDays"/>
            <label for="checkWednesday" class="recurrence_label">M</label>

            <input type="checkbox" id="checkThursday" class="recurrence_checkbox" value="th" v-model="newEvent.extendedProps.recurrence.repeatDays"/>
            <label for="checkThursday" class="recurrence_label">J</label>

            <input type="checkbox" id="checkFriday" class="recurrence_checkbox" value="fr" v-model="newEvent.extendedProps.recurrence.repeatDays"/>
            <label for="checkFriday" class="recurrence_label">V</label>
          </div>

          <div>
            <label class="form_label_control" style="margin-bottom: 20px">Finaliza</label>

            <div class="d_flex items_center" style="margin-bottom: 10px">
              <input
                type="radio"
                id="radioEndNever"
                value="never"
                style="margin-right: 10px"
                class="recurrence_radio"
                name="recurrenceRadio"
                v-model="newEvent.extendedProps.recurrence.finishAt.type"
              />
              <label for="radioEndNever">Nunca</label>
            </div>

            <div class="d_flex items_center" style="margin-bottom: 10px">
              <input
                type="radio"
                id="radioEndThe"
                value="date"
                style="margin-right: 10px"
                class="recurrence_radio"
                name="recurrenceRadio"
                v-model="newEvent.extendedProps.recurrence.finishAt.type"
              />

              <label for="radioEndThe" style="margin-right: 80px">El</label>

              <VueDatePicker
                :enable-time-picker="false"
                :readonly="newEvent.extendedProps.recurrence.finishAt.type != 'date'"
                v-model="newEvent.extendedProps.recurrence.finishAt.value"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="modal_footer">
        <button class="btn bg_red" @click="$emit('hideModalAddRecurrence')">Cancelar</button>
        <button class="btn" @click="$emit('saveEventRecurrence')">Guardar</button>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { storeToRefs } from "pinia";
  import { useCalendarStore } from "../../stores/CalendarStore";

  const calendarStore = useCalendarStore();
  const { newEvent } = storeToRefs(calendarStore);
</script>

<style lang="scss">
  @import "../../assets/styles/components/modal.scss";
</style>
