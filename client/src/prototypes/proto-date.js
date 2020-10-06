
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.prevWeek = function() {
    return this.addDays(-7);
}

Date.prototype.nextWeek = function() {
    return this.addDays(7);
}

Date.prototype.sow = function() {
    if(this.getDay() == 1)
        return this;

    if(this.getDay() == 0)
        return this.addDays(1-7);

    return this.addDays(1-this.getDay());
};

Date.prototype.isDateMatch = function(date) {
    return (this.getFullYear() == date.getFullYear() && this.getMonth() == date.getMonth() && this.getDate() == date.getDate());
}

Date.compareDateSK = function(datesk1, datesk2)
{
    if(datesk1 === datesk2)
        return 0;

    let d1 = Date.fromDateSK(datesk1);
    let d2 = Date.fromDateSK(datesk2);

    if(d1 > d2) return -1;
    if(d2 > d1) return 1;

    return 0;
}

Date.fromDateSK = function(datesk) { 
    if(Number.isInteger(datesk))
        datesk = datesk.toString();

    return new Date(
        Number(datesk.substr(0,4)),
        Number(datesk.substr(4,2))-1,
        Number(datesk.substr(6,2)));
}

Date.prototype.yyyymmdd = function() {
    let mm = this.getMonth() + 1; // getMonth() is zero-based
    let dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('');
  };