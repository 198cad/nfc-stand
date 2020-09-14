const { NFC } = require("nfc-pcsc");
const nfc = new NFC();
const sql = require("./mysql");
const axios = require("axios");
const moment = require("moment");
require("twix");

// console.log(moment().isBetween("2020-9-10 12:00:10", "2010-10-00 12:00:60"));
var t = moment("2020-01-01 12:00:00").twix("2020-01-01 12:09:00");
console.log(t.count("minutes"));

nfc.on("reader", (reader) => {
  console.log(reader.reader.name);
  reader.on("card", (card) => {
    const kueri = `SELECT * FROM absensi.absen WHERE absensi.absen.uid = '${card.uid}'`;
    sql.getConnection((err, conn) => {
      if (err) {
        console.log("u have error on mysql");
      } else {
        conn.query(kueri, (err, data) => {
          if (err) {
            console.log("u have error on mysql after initiated connection ");
            conn.release();
          } else {
            if (data.length !== 0) {
              let token = `token ${data[0].apikey}:${data[0].apisecret}`;
              function check(lastcheckin) {
                if (data[0].lastcheckin === "IN") {
                  return "OUT";
                } else {
                  return "IN";
                }
              }

              let range = moment(data[0].lastupdate).twix(Date.now());
              // console.log(range.count("minutes"));
              // console.log(data[0].lastupdate);
              console.log(range.count("minutes"));

              if (range.count("minutes") > 30) {
                axios({
                  method: "POST",
                  url: "http://168.168.168.110/api/resource/Employee%20Checkin",
                  withCredentials: true,
                  headers: {
                    Authorization: token,
                  },
                  data: {
                    employee: data[0].eid,
                    log_type: check(data[0].lastcheckin),
                    time: moment().format("YYYY-MM-DD h:mm:ss"),
                    device_id: data[0].uid,
                    skip_auto_attendance: 0,
                  },
                })
                  .then((res) => {
                    let kueri = `UPDATE absensi.absen SET lastcheckin='${check(
                      data[0].lastcheckin
                    )}', lastupdate='${res.data.data.time}' WHERE  uid='${
                      data[0].uid
                    }';`;
                    // console.log(kueri);
                    sql.getConnection((err, conn) => {
                      if (err) {
                        console.log(err.message);
                      } else {
                        conn.query(kueri, (err, res) => {
                          if (err) {
                            console.log(err.message);
                            conn.release();
                          } else {
                            console.log(res);
                            conn.release();
                          }
                        });
                      }
                    });
                    // console.log(res.data.data.time);
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });
              } else {
                console.log("STOP");
              }

              // console.log(token);

              conn.release();
            } else {
              console.log("record not found");
              conn.release();
            }
          }
        });
      }
    });
  });

  reader.on("error", (err) => {
    console.log(err.message);
  });
});
