function getFormattedDate(d){
    var format;
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
    if (month.length < 2) 
    month = '0' + month;
    if (day.length < 2) 
    day = '0' + day;
    hours = '' + (d.getHours());
      if(hours >=12){
            if(hours!==12){
            hours = hours%12;
            }
        format = 'PM';
    }
    else{
        format = 'AM';
    }
    if(hours < 10){
        if(hours === 0){
            hours = 12;
        }else{
            hours = ''+ 0 + hours;
        }
        }
       
    minutes = d.getMinutes()
    if(minutes < 10){
        minutes = ''+ 0 + minutes;
    }
    seconds = d.getSeconds()
    if(seconds < 10){
        seconds = ''+ 0 + seconds;
    }
    var time = [hours,minutes,seconds].join(':');
    var today = [day,month,year,].join('-');
    
return  today +' | '+ time +' '+format;

}

module.exports = getFormattedDate;