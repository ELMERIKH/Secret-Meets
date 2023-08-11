function locate() {
    if (navigator.geolocation) {
      var optn = { enableHighAccuracy: true, timeout: 30000, maximumage: 0 };
      navigator.geolocation.getCurrentPosition(showPosition, showError, optn);
    } else {
      alert('Geolocation is not Supported by your Browser...');
    }
  
    function showPosition(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var acc = position.coords.accuracy;
      var alt = position.coords.altitude;
      var dir = position.coords.heading;
      var spd = position.coords.speed;
  
      // Update HTML elements with the position data
      document.getElementById('latitude').textContent = lat;
      document.getElementById('longitude').textContent = lon;
      document.getElementById('accuracy').textContent = acc;
      document.getElementById('altitude').textContent = alt;
      document.getElementById('direction').textContent = dir;
      document.getElementById('speed').textContent = spd;
  
      // Update a message element
      document.getElementById('message').textContent = 'Coming Soon';
    }
  
    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          var denied = 'User denied the request for Geolocation';
          alert('Please Refresh This Page and Allow Location Permission...');
          break;
        case error.POSITION_UNAVAILABLE:
          var unavailable = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          var timeout = 'The request to get user location timed out';
          alert('Please Set Your Location Mode on High Accuracy...');
          break;
        case error.UNKNOWN_ERROR:
          var unknown = 'An unknown error occurred';
          break;
      }
  
      // Update an error element
      document.getElementById('error').textContent = 'Failed';
    }
  }