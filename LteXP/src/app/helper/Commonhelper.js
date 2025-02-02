export default class Commonhelper {
    static checklogout(err_code){
      // console.log('common checklogout')
      console.log(err_code)
      if(err_code.toString()==='500' || err_code.toString()==='401' ) {
         console.log('logout')
        return false;
      }
        return true;
    }

    static geterrorcode(err){
      console.log(err)
        return err.code?err.code:err.status;
    }

    static geterrormsg(err){
      console.log(err)
      return err.message?err.message:err.error;
  }

    static formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
  
      return [year, month, day].join('-');
  }

  static formatDateTime(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hh = '' + d.getHours(),
        mm = '' + d.getMinutes(),
        ss = '' + d.getSeconds();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if(hh.length <2) 
       hh = '0' + hh;

    if(mm.length <2) 
      mm = '0' + mm;

    if(ss.length <2) 
     ss = '0' + ss;

    return [year, month, day].join('-')+" "+hh+":"+mm+":"+ss;
}


static getLocalDateTime() {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  localISOTime = localISOTime.substr(0,10)+' '+localISOTime.substr(11,8);

  return localISOTime;
}
    
}
  

