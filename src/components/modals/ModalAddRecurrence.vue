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
              v-model="newEvent.recurrence.repeatTimes.times"
            />

            <select class="form_control" style="width: 110px" v-model="newEvent.recurrence.repeatTimes.type">
              <option value="diary">días</option>
              <option value="weekly">semanas</option>
              <option value="monthly">meses</option>
              <option value="annual">años</option>
            </select>
          </div>

          <div style="margin-bottom: 20px">
            <label class="form_label_control" style="margin-bottom: 20px">Repetir el</label>

            <input type="checkbox" id="checkMonday" class="recurrence_checkbox" value="monday" v-model="newEvent.recurrence.repeatDays"/>
            <label for="checkMonday" class="recurrence_label">L</label>

            <input type="checkbox" id="checkTuesday" class="recurrence_checkbox" value="tuesday" v-model="newEvent.recurrence.repeatDays"/>
            <label for="checkTuesday" class="recurrence_label">M</label>

            <input type="checkbox" id="checkWednesday" class="recurrence_checkbox" value="wednesday" v-model="newEvent.recurrence.repeatDays"/>
            <label for="checkWednesday" class="recurrence_label">M</label>

            <input type="checkbox" id="checkThursday" class="recurrence_checkbox" value="thursday" v-model="newEvent.recurrence.repeatDays"/>
            <label for="checkThursday" class="recurrence_label">J</label>

            <input type="checkbox" id="checkFriday" class="recurrence_checkbox" value="friday" v-model="newEvent.recurrence.repeatDays"/>
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
                v-model="newEvent.recurrence.finishAt.type"
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
                v-model="newEvent.recurrence.finishAt.type"
              />

              <label for="radioEndThe" style="margin-right: 80px">El</label>

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
                style="margin-right: 10px"
                class="recurrence_radio"
                name="recurrenceRadio"
                v-model="newEvent.recurrence.finishAt.type"
              />
              <label
                for="radioEndAfter"
                style="margin-right: 12.5px; min-width: 80px"
                >Después de</label
              >

              <input
                type="number"
                min="1"
                class="form_control align_center"
                style="width: 70px; margin-right: 10px; margin-bottom: 0"
                :readonly="newEvent.recurrence.finishAt.type != 'times'"
                v-model="newEvent.recurrence.finishAt.value"
              />
              <label>ocurrencias</label>
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
