import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { gettext } from "i18n";
import { battery } from "power";

// Update the clock every minute
clock.granularity = "minutes";

/*
* CLOCK
*/
const clock_time = document.getElementById("clock_time"),
      clock_ampm = document.getElementById("clock_ampm"),
      date = document.getElementById("date"),
      energy = document.getElementById("battery");

clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  let month_day = today.getUTCDate(),
      week_day = today.getDay(),
      am_pm = hours >= 12 ? 'pm' : 'am';
  
  if (preferences.clockDisplay === "12h") { 
    hours = hours % 12 || 12;
    clock_ampm.text = ` ${am_pm}`;
  } else { 
    hours = util.zeroPad(hours);
    clock_ampm.text = '';
  }
  
  let mins = util.zeroPad(today.getMinutes());
  
  clock_time.text = `${hours}:${mins}`;
  date.text = `${gettext(week_day)} ${month_day}`;
  
  energy.text = `${Math.floor(battery.chargeLevel)}%`;
}


/*
* HRM
*/
if (HeartRateSensor) {
   const hrm = new HeartRateSensor(),
         hrm_dom = document.getElementById("hrm");
   hrm.addEventListener("reading", () => {
      hrm_dom.text = hrm.heartRate;
   });
   hrm.start();
}

/*
* STEPS
*/
if (appbit.permissions.granted("access_activity")) {
   const steps = document.getElementById("steps");
   const update_steps = () => {
     steps.text = today.adjusted.steps;
   };
   update_steps();
   setInterval(update_steps, 10000);
}