const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function isPoneAvailable(str) {
  var myreg=/^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}

function deepCopy(obj){
  if(typeof obj != 'object'){
    return obj;
  }
  if (obj instanceof Array) {
    var newobj = [];
  } else {
    var newobj = {};
  }
  for ( var attr in obj) {
    newobj[attr] = deepCopy(obj[attr]);
  }
  return newobj;
}

module.exports = {
  formatTime: formatTime,
  isPoneAvailable:isPoneAvailable,
  deepCopy:deepCopy
}
