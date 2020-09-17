const { NFC } = require("nfc-pcsc");
const nfc = new NFC();
const sql = require("./mysql");
const axios = require("axios");
const moment = require("moment");
require("twix");
const jarak = 0;

// console.log(moment().isBetween("2020-9-10 12:00:10", "2010-10-00 12:00:60"));
var t = moment("2020-01-01 12:00:00").twix("2020-01-01 12:09:00");
console.log(t.count("minutes"));

nfc.on("reader", (reader) => {
  console.log(reader.reader.name);
  reader.on("card", async (card) => {
    //
    const kueri = `SELECT * FROM absensi.absen WHERE absensi.absen.uid = '${card.uid}'`;
    sql.getConnection((err, conn) => {
      if (err) {
        console.log("u have error on mysql");
      } else {
        conn.query(kueri, async (err, msyqData) => {
          let range = await moment(msyqData[0].lastupdate).twix(Date.now());
          // console.log(range.count("minutes"));
          // console.log(msyqData[0].lastupdate);
          // console.log(range.count("minutes"));
          if (err) {
            console.log("u have error on mysql after initiated connection ");
            conn.release();
          } else {
            if (msyqData.length !== 0) {
              // console.log(data[0]);

              let token = `token ${msyqData[0].apikey}:${msyqData[0].apisecret}`;
              if (
                msyqData[0].lastcheckin === "IN" ||
                msyqData[0].lastcheckin === "OUT"
              ) {
                if (msyqData[0].lastcheckin === "IN") {
                  if (range.count("minutes") > jarak) {
                    axios({
                      method: "POST",
                      url:
                        "http://168.168.168.110/api/resource/Employee%20Checkin",
                      withCredentials: true,
                      headers: {
                        Authorization: token,
                      },
                      data: {
                        employee: msyqData[0].eid,
                        log_type: "OUT",
                        time: moment().format("YYYY-MM-DD h:mm:ss"),
                        device_id: msyqData[0].uid,
                        skip_auto_attendance: 0,
                      },
                    })
                      .then((res) => {
                        let kueri = `UPDATE absensi.absen SET lastcheckin='${res.data.data.name}', lastupdate='${res.data.data.time}' WHERE  uid='${msyqData[0].uid}';`;
                        console.log(kueri);
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
                      })
                      .catch((err) => {
                        console.log("ERROR pada ERP");
                      });
                  } else {
                    console.log("STOP");
                  }
                } else {
                  if (range.count("minutes") > jarak) {
                    axios({
                      method: "POST",
                      url:
                        "http://168.168.168.110/api/resource/Employee%20Checkin",
                      withCredentials: true,
                      headers: {
                        Authorization: token,
                      },
                      data: {
                        employee: msyqData[0].eid,
                        log_type: "IN",
                        time: moment().format("YYYY-MM-DD h:mm:ss"),
                        device_id: msyqData[0].uid,
                        skip_auto_attendance: 0,
                      },
                    })
                      .then((res) => {
                        let kueri = `UPDATE absensi.absen SET lastcheckin='${res.data.data.name}', lastupdate='${res.data.data.time}' WHERE  uid='${msyqData[0].uid}';`;
                        console.log(kueri);
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
                      })
                      .catch((err) => {
                        console.log("ERROR pada ERP");
                      });
                  } else {
                    console.log("STOP");
                  }
                }
              } else {
                axios({
                  method: "GET",
                  url: `http://168.168.168.110/api/resource/Employee%20Checkin/${msyqData[0].lastcheckin}`,
                  headers: {
                    Authorization: token,
                  },
                })
                  .then((res) => {
                    if (res.data.data.log_type === "OUT") {
                      if (range.count("minutes") > jarak) {
                        axios({
                          method: "POST",
                          url:
                            "http://168.168.168.110/api/resource/Employee%20Checkin",
                          withCredentials: true,
                          headers: {
                            Authorization: token,
                          },
                          data: {
                            employee: msyqData[0].eid,
                            log_type: "IN",
                            time: moment().format("YYYY-MM-DD h:mm:ss"),
                            device_id: msyqData[0].uid,
                            skip_auto_attendance: 0,
                          },
                        })
                          .then((res) => {
                            let kueri = `UPDATE absensi.absen SET lastcheckin='${res.data.data.name}', lastupdate='${res.data.data.time}' WHERE  uid='${msyqData[0].uid}';`;
                            console.log(kueri);
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
                          })
                          .catch((err) => {
                            console.log("ERROR pada ERP");
                          });
                      } else {
                        console.log("STOP");
                      }
                    } else {
                      if (range.count("minutes") > jarak) {
                        axios({
                          method: "POST",
                          url:
                            "http://168.168.168.110/api/resource/Employee%20Checkin",
                          withCredentials: true,
                          headers: {
                            Authorization: token,
                          },
                          data: {
                            employee: msyqData[0].eid,
                            log_type: "OUT",
                            time: moment().format("YYYY-MM-DD h:mm:ss"),
                            device_id: msyqData[0].uid,
                            skip_auto_attendance: 0,
                          },
                        })
                          .then((res) => {
                            let kueri = `UPDATE absensi.absen SET lastcheckin='${res.data.data.name}', lastupdate='${res.data.data.time}' WHERE  uid='${msyqData[0].uid}';`;
                            console.log(kueri);
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
                          })
                          .catch((err) => {
                            console.log("ERROR pada ERP");
                          });
                      } else {
                        console.log("STOP");
                      }
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }

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
