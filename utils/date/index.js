const moment = require("moment");
/**
 * 根据星期获取日期
 * 1...7
 */
function getDateByDay(str) {
  const FORMAT = "YYYY-MM-DD";
  const current = new Date();
  const day = current.getDay();
  const date = current.getDate();
  const dayGap = str - day;
  if (dayGap < 0) {
    return moment(current)
      .subtract(dayGap, "day")
      .format(FORMAT);
  } else {
    return moment(current)
      .add(dayGap, "day")
      .format(FORMAT);
  }
}

/**
 * 倒计时
 */
function counter(startTime, endTime) {
  var d1,
    d2,
    day,
    h,
    m,
    s,
    ms,
    d1ms,
    d2ms,
    dms,
    hms,
    mms,
    dms = 1000 * 60 * 60 * 24,
    hms = 1000 * 60 * 60,
    mms = 1000 * 60;
  d1 = new Date(startTime);
  d2 = new Date(endTime);
  d1ms = d1.getTime();
  d2ms = d2.getTime();
  ms = d2ms - d1ms;
  // 结束时间早于开始时间
  if (ms <= 0) {
    day = "00";
    h = "00";
    m = "00";
    s = "00";
    ss = 0 % 1000;
  } else {
    day = Math.floor(ms / dms);
    h = Math.floor((ms % dms) / hms);
    m = Math.floor((ms % hms) / mms);
    s = Math.floor((ms % mms) / 1000);
  }
  if (day <= 9) {
    day = "0" + day;
  }
  if (h <= 9) {
    h = "0" + h;
  }
  if (m <= 9) {
    m = "0" + m;
  }

  if (s <= 9) {
    s = "0" + s;
  }

  return {
    day,
    hours: h,
    minutes: m,
    seconds: s
  };
}

/**
 * 获取当前时间
 */
function getCurrent() {
  const current = new Date();
  const year = current.getFullYear();
  let month = current.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let date = current.getDate();
  if (date < 10) {
    date = "0" + date;
  }
  const hour =
    current.getHours() < 10 ? "0" + current.getHours() : current.getHours();
  const minute =
    current.getMinutes() < 10
      ? "0" + current.getMinutes()
      : current.getMinutes();
  const second =
    current.getSeconds() < 10
      ? "0" + current.getSeconds()
      : current.getSeconds();
  return {
    year,
    month,
    date,
    hour,
    minute,
    second
  };
}

/**
 * 在某个时间之间
 */
function isBetweenTime(startTime, endTime) {
  const data = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  return moment(new Date()).isBetween(startTime, endTime);
}

/**
 * 早于某个时间点
 */
function isBefore(time) {
  return moment(new Date()).isBefore(time);
}

/**
 * 早于某个时间点
 */
function isAfter(time) {
  return moment(new Date()).isAfter(time);
}

/**
 * 将moment转化为特定format的日期字符串
 */
function moment2Str(mt,ft){
  return mt.format(ft);
}

/**
 * 将moment转化为timeStamp类型
 * isMiniSecond:是否是毫秒级的，如果是就需要乘以1000
 */
function moment2TimeStamp(timeStr,isMiniSecond=false){
  return isMiniSecond  ? 1000*moment(timeStr).format("X"):moment(timeStr).format("X")
}
/**
 * 2表示今日
 * 3表示本周
 * moment.locale('cs')设置时间格式为中国
 */
function getTimeStamp(type){
    moment.locale('cs');
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    const startWeek = moment()
      .startOf("week")
      .format("YYYY-MM-DD");
    const endWeek = moment()
      .endOf("week")
      .format("YYYY-MM-DD");
       const startMonth = moment().startOf('month').format("YYYY-MM-DD");
    const endMonth = moment().endOf("month")
        .format("YYYY-MM-DD");
    if (type == 2) {
      //今日
      const startDateString = `${year}-${month}-${day} 00:00:00`;
      const endDateString = `${year}-${month}-${day} 23:59:59`;
      return {
        startDate: startDateString,
        endDate: endDateString
      };
    } else if (type == 3) {
      //  本周
      return {
        startDate: `${startWeek} 00:00:00`,
        endDate: `${endWeek} 23:59:59`
      };
    }else if (type == 4) {
        // 本月
        return {
            startDate: `${startMonth} 00:00:00`,
            endDate: `${endMonth} 23:59:59`
        };
    }
  };

module.exports = {
  counter,
  getDateByDay,
  isBetweenTime,
  isBefore,
  isAfter,
  getCurrent: getCurrent,
  getTimeStamp,
  moment2TimeStamp,
  moment2Str
};
