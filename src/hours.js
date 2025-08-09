export default function hour(record) {
    
    if (!record.checkIn || !record.checkOut) return "0 hours";

    const time24 = (strtime) => {
        const [time, AP] = strtime.split(' ')
        let [h, m, s] = time.split(':').map(Number);

        if (AP === "PM" && h !== 12) h += 12;
        if (AP === "AM" && h === 12) h = 0;


        return new Date(1970, 0, 1, h, m, s);
    };

    const timein = time24(record.checkIn)
    const timeout = time24(record.checkOut)

    let breaktime = 0;

    if (record.breakOut && record.breakIn) {
        const breakIn24 = time24(record.breakIn);
        const breakOut24 = time24(record.breakOut);
        breaktime = (breakIn24 - breakOut24) / (1000 * 60 * 60);;
    }

    let totalhour = (timeout - timein) / (1000 * 60 * 60) - breaktime

    return `${totalhour.toFixed(2)} `

}