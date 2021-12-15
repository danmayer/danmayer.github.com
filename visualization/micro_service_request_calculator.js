  // attach function
  const calulatorButton = document.querySelector('#service_calculator');
  calulatorButton.addEventListener('click', calculate);

  // calculate function
  // TODO: add input validation
  function calculate(event) {
    const serviceValue = document.querySelector('#service_count').value;
    // default to 10
    const serviceCount = parseInt( serviceValue == "" ? "10" : serviceValue);

    const serviceAvailValue = document.querySelector('#service_avail').value;
    // default to 99.9%
    const serviceAvail = parseFloat( serviceAvailValue == "" ? "99.9" : serviceAvailValue) / 100.0;
    var serviceResult = Math.pow(serviceAvail,serviceCount) * 100.0;
    document.querySelector('#avail_result').value = serviceResult.toFixed(8) + '%';
  }