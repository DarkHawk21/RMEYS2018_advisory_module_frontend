import { defineStore } from 'pinia';

export const useAdviserStore = defineStore('adviser', {
  state: () => ({
    adviserSelected: {
      id: undefined,
      img: '',
      name: '',
      language: '',
      day: '',
      timeSelected: {
        hours: undefined,
        minutes: undefined
      },
      minTime: {
        hours: undefined,
        minutes: undefined
      },
      maxTime: {
        hours: undefined,
        minutes: undefined
      },
      timeFinishBasedOnTime: undefined,
      availablePlaces: 5,
      studentAccount: ''
    },
    days: [
      {
        id: 1,
        date: '2023-09-19',
        advisories: [
          {
            id: 1,
            start_time: '13:00:00',
            end_time: '14:00:00',
            students: [
              {
                id: 1,
                name: 'Enrique Carranza Balderas',
                group: '602'
              }
            ]
          }
        ]
      }
    ]
  }),
  actions: {
    setAdviserSelected(event, moment) {
      const { id, title, start, end, extendedProps } = event;
      const { language, img } = extendedProps;
      const dayName = moment(start).format("dddd")[0].toUpperCase() + moment(start).format("dddd").substring(1);
      const dayNumber = moment(start).format("D");
      const monthName = moment(start).format("MMMM");

      this.adviserSelected = {
        id,
        name: title,
        img: img,
        language: language,
        day: `${dayName} ${dayNumber} de ${monthName}`,
        timeSelected: {
          hours: parseInt(moment(start).format("HH")),
          minutes: parseInt(moment(start).format("mm")),
        },
        minTime: {
          hours: parseInt(moment(start).format("HH")),
          minutes: parseInt(moment(start).format("mm")),
        },
        maxTime: {
          hours: parseInt(moment(end).format("HH")) - 1,
          minutes: parseInt(moment(end).format("mm")),
        },
        timeFinishBasedOnTime: {
          hours: parseInt(moment(start).format("HH")) + 1,
          minutes: parseInt(moment(start).format("mm")),
        },
        availablePlaces: 5,
        studentAccount: ''
      };
    },
    clearSelection() {
      this.adviserSelected = {
        id: undefined,
        img: '',
        name: '',
        language: '',
        day: '',
        timeSelected: {
          hours: undefined,
          minutes: undefined
        },
        minTime: {
          hours: undefined,
          minutes: undefined
        },
        maxTime: {
          hours: undefined,
          minutes: undefined
        },
        timeFinishBasedOnTime: undefined,
        availablePlaces: 5,
        studentAccount: ''
      };
    }
  }
});
