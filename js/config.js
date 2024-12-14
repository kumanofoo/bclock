const bclockConfig = {
  bClock: {},
  bCalendar: {},
};

const baseURL = window.location.origin + window.location.pathname.replace(/\/+$/, '')
bclockConfig.bClock.air = {}
bclockConfig.bClock.air.url =  baseURL + "/air_quality.json";

bclockConfig.bClock.peak = {};
bclockConfig.bClock.peak.url = baseURL + "/peak.json";
bclockConfig.bClock.peak.highest = 30.0;
bclockConfig.bClock.peak.lowest = -4.0;

