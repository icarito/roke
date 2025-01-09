export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export function addPermission() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    alert("El soporte de sensor de movimiento es experimental. Debes otorgar permiso para activar.");
    DeviceMotionEvent.requestPermission()
      .then((response) => {
          console.log("Permission status:", response);
      })
      .catch(console.error);
  } else {
      // do nothing
  }
}
