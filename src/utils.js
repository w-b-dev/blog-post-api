exports.getDataDeHoje = () =>
  new Date(Date.now()).toLocaleDateString("en-ca", {
    timeZone: "America/Halifax",
  });
