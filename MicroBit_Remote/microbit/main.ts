bluetooth.onBluetoothConnected(function () {
    basic.showString("c")
    ble_connected = 1
    y = 128
    x = 128
    buttons = 63
    y_old = 128
    x_old = 128
    buttons_old = 63
    basic.pause(1000)
})
bluetooth.onBluetoothDisconnected(function () {
    ble_connected = 0
    basic.showString("d")
    y = 128
    x = 128
    buttons = 63
    y_old = 128
    x_old = 128
    buttons_old = 63
    basic.pause(1000)
})
function sendBLE () {
    if (x != x_old || y != y_old || buttons != buttons_old) {
        x_old = x
        y_old = y
        buttons_old = buttons
        bufr.setUint8(0, 4)
		bufr.setUint8(1, x)
		bufr.setUint8(2, y)
		bufr.setUint8(3, buttons)
		bluetooth.uartWriteBuffer(bufr)
    }
}
function readJoystick () {
    x = Joystick.joy_x()
    y = Joystick.joy_y()
    buttons = 0
    buttons += 1 * pins.digitalReadPin(DigitalPin.P5)
    buttons += 2 * pins.digitalReadPin(DigitalPin.P11)
    buttons += 4 * pins.digitalReadPin(DigitalPin.P15)
    buttons += 8 * pins.digitalReadPin(DigitalPin.P14)
    buttons += 16 * pins.digitalReadPin(DigitalPin.P13)
    buttons += 32 * pins.digitalReadPin(DigitalPin.P12)
    serial.writeValue("x", x)
    serial.writeValue("y", y)
    serial.writeValue("b", buttons)
}

let ble_connected = 0
let buttons_old = 0
let x_old = 0
let y_old = 0
let buttons = 0
let y = 0
let x = 0
y = 128
x = 128
buttons = 63
y_old = 128
x_old = 128
buttons_old = 63
if (input.buttonIsPressed(Button.B)) {
    Joystick.joy_calibrate()
}
let bufr = pins.createBuffer(4);
ble_connected = 0
bluetooth.advertiseUid(0,0,7,true)
bluetooth.startUartService()
basic.showIcon(IconNames.Happy)
// Main Loop
basic.forever(function () {
    readJoystick()
    if (ble_connected == 1) {
        sendBLE()
    }
    basic.clearScreen()
    led.plot(Math.round(x / 64), Math.round(4 - y / 64))
    basic.pause(100)
})
