<template>
    <section class="calendar_container">
        <FullCalendar :options="calendarOptions" />
    </section>

    <section class="data_container" v-if="adviserSelected.id">
        <div class="data_container_head">
        <h4>Has seleccionado:</h4>

        <button @click="advicerStore.clearSelection">
            <i class="fa-solid fa-xmark"></i>
        </button>
        </div>

        <div class="adviser_img_container">
        <img
            :src="'/images/' + adviserSelected.img"
            alt="Foto de perfil del asesor"
        />
        </div>

        <h2 class="adviser_name">{{ adviserSelected.name }}</h2>
        <h3 class="adviser_language">Asesor de {{ adviserSelected.language }}</h3>

        <div class="data_selected_container">
            <h5 class="day_selected">{{ adviserSelected.day }}</h5>

            <label>De:</label>
            <VueDatePicker
                v-model="adviserSelected.timeSelected"
                time-picker
                :min-time="adviserSelected.minTime"
                :max-time="adviserSelected.maxTime"
                :minutesIncrement="60"
                :minutes-grid-increment="60"
            ></VueDatePicker>

            <label>A:</label>
            <VueDatePicker
                v-model="adviserSelected.timeFinishBasedOnTime"
                time-picker
                readonly
            ></VueDatePicker>

            <h5 class="max_selected">
                Quedan {{ adviserSelected.availablePlaces }} lugares disponibles
            </h5>
            <label>No. de cuenta:</label>
            <input
                type="text"
                placeholder="número de cuenta"
                v-model="adviserSelected.studentAccount"
                v-if="adviserSelected.timeSelected.hours"
            />
            <button
                class="btn btn-green"
                @click="buttonReserveClicked"
                v-if="adviserSelected.studentAccount"
            >
                Reservar
            </button>
        </div>
    </section>
</template>

<script setup>
    import FullCalendar from "@fullcalendar/vue3";
    import dayGridPlugin from "@fullcalendar/daygrid";
    import timeGridPlugin from "@fullcalendar/timegrid";
    import interactionPlugin from "@fullcalendar/interaction";

    import { watch, inject } from "vue";

    import { storeToRefs } from "pinia";
    import { useAdviserStore } from "../stores/AdviserStore";

    const moment = inject("moment");

    const advicerStore = useAdviserStore();
    const { adviserSelected, calendarEvents, advicesOnSelectedEvent } = storeToRefs(advicerStore);

    const eventClick = (eventClickInfo) => {
        const { id, title, start, end, extendedProps } = eventClickInfo.event;
        const { language, img } = extendedProps;

        adviserSelected.value.id = id;
        adviserSelected.value.name = title;
        adviserSelected.value.language = language;

        adviserSelected.value.day =
            moment(start).format("dddd")[0].toUpperCase() +
            moment(start).format("dddd").substring(1) +
            " " +
            moment(start).format("D") +
            " de " +
            moment(start).format("MMMM");

        adviserSelected.value.img = img;

        advicerStore.setMinTime({
            hours: parseInt(moment(start).format("HH")),
            minutes: parseInt(moment(start).format("mm")),
        });

        advicerStore.setMaxTime({
            hours: parseInt(moment(end).format("HH")) - 1,
            minutes: parseInt(moment(end).format("mm")),
        });

        advicerStore.setTimeSelected({
            hours: parseInt(moment(start).format("HH")),
            minutes: parseInt(moment(start).format("mm")),
        });
    };

    watch(
        () => advicerStore.adviserSelected.timeSelected,
        ({ hours }) => {
            const existedAdvice = advicesOnSelectedEvent.value.find((advice) => advice.hour_start == `0${hours}:00:00`);

            adviserSelected.value.timeFinishBasedOnTime = {
                hours: hours + 1,
                minutes: 0,
            };

            if (existedAdvice) {
                adviserSelected.value.availablePlaces = existedAdvice.max_places - existedAdvice.total_enrolled_students;
            }
        }
    );

    const calendarOptions = {
        plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
        initialView: "timeGridWeek",
        themeSystem: "standard",
        headerToolbar: {
            start: "today,prev,next",
            center: "title",
            end: "timeGridDay,timeGridWeek",
        },
        buttonText: {
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
        },
        titleFormat: {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
        weekends: false,
        locale: "es",
        firstDay: "1",
        slotDuration: "00:30:00",
        timeZone: "local",
        events: calendarEvents.value,
        eventClick,
        nowIndicator: true,
        allDaySlot: false,
        slotMinTime: "07:00:00",
        slotMaxTime: "21:00:00",
    };

    const buttonReserveClicked = () => {
        console.log(adviserSelected.value);
    };
</script>
