const bclockConfig = {
  bClock: {},
  bCalendar: {},
};

bclockConfig.bClock.air = {}
bclockConfig.bClock.air.url = window.location + "/air_quality.json";

bclockConfig.bClock.peak = {};
bclockConfig.bClock.peak.url = window.location + "/peak.json";
bclockConfig.bClock.peak.highest = 30.0;
bclockConfig.bClock.peak.lowest = -4.0;