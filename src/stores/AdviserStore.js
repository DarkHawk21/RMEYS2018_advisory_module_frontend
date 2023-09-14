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
        calendarEvents: [
            {
                id: 1,
                groupId: 1,
                title: 'Marco Antonio Hernández Rodríguez',
                start: '2023-09-14T08:00:00',
                end: '2023-09-14T15:00:00',
                backgroundColor: '#cf142b',
                borderColor: '#cf142b',
                textColor: "#fff",
                extendedProps: {
                    language: 'Inglés',
                    img: 'profile.png'
                }
            },
            {
                id: 2,
                groupId: 2,
                title: 'Jessica Guadalupe Hernández Rodriguez',
                start: '2023-09-14T10:00:00',
                end: '2023-09-14T14:00:00',
                backgroundColor: '#cf142b',
                borderColor: '#cf142b',
                textColor: "#fff",
                extendedProps: {
                    language: 'Inglés',
                    img: 'profile.png'
                }
            }
        ],
        advicesOnSelectedEvent: [
            {
                id: 1,
                event_id: 1,
                max_places: 5,
                total_enrolled_students: 1,
                hour_start: '09:00:00',
                hour_end: '10:00:00',
                date: '2023-09-11',
                enrolled_students: [
                    {
                        id: 1,
                        advice_id: 1,
                        name: 'Enrique',
                        last_name: 'Carranza',
                        account: '316304034'
                    }
                ]
            }
        ]
    }),
    actions: {
        setMinTime(minTime) {
            this.adviserSelected.minTime = minTime;
        },
        setMaxTime(maxTime) {
            this.adviserSelected.maxTime = maxTime;
        },
        setTimeSelected(timeSelected) {
            this.adviserSelected.timeSelected = timeSelected;
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