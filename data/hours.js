const HOURS = {
  timezone: "America/New_York",
  week: {
    mon: {
      coffee: { open: "08:00", close: "23:00" },
      kitchen: { open: "09:00", close: "22:00" }
    },
    tue: null,
    wed: {
      coffee: { open: "08:00", close: "23:00" },
      kitchen: { open: "09:00", close: "22:00" }
    },
    thu: {
      coffee: { open: "08:00", close: "23:00" },
      kitchen: { open: "09:00", close: "22:00" }
    },
    fri: {
      coffee: { open: "08:00", close: "01:00" },
      kitchen: { open: "09:00", close: "23:30" }
    },
    sat: {
      coffee: { open: "09:00", close: "01:00" },
      kitchen: { open: "09:00", close: "23:30" }
    },
    sun: {
      coffee: { open: "09:00", close: "22:00" },
      kitchen: { open: "09:00", close: "21:00" }
    }
  },
  closedDays: ["tue"],
  exceptions: [
    {
      date: "2026-12-25",
      label: "Christmas Day",
      closed: true,
      note: "Closed for the holiday — back December 26"
    },
    {
      date: "2026-12-31",
      label: "New Year's Eve",
      coffee: { open: "10:00", close: "02:00" },
      kitchen: { open: "10:00", close: "23:00" },
      note: "Late night — coffee bar until 2:00, kitchen closes early"
    },
    {
      date: "2027-01-01",
      label: "New Year's Day",
      coffee: { open: "10:00", close: "16:00" },
      kitchen: null,
      note: "Coffee service only — no kitchen today"
    }
  ]
};

const BUSYNESS = {
  weekday: [
    { from: "08:00", to: "10:00", level: "steady" },
    { from: "10:00", to: "12:00", level: "quiet" },
    { from: "12:00", to: "14:00", level: "lively" },
    { from: "14:00", to: "17:00", level: "quiet" },
    { from: "17:00", to: "19:30", level: "steady" },
    { from: "19:30", to: "23:00", level: "quiet" },
    { from: "23:00", to: "24:00", level: "steady" }
  ],
  weekend: [
    { from: "09:00", to: "11:00", level: "lively" },
    { from: "11:00", to: "13:00", level: "lively" },
    { from: "13:00", to: "15:00", level: "steady" },
    { from: "15:00", to: "17:00", level: "quiet" },
    { from: "17:00", to: "20:00", level: "steady" },
    { from: "20:00", to: "24:00", level: "quiet" }
  ]
};
