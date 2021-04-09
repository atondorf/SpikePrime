/**
 * Benutzerdefinierte Blöcke
 */
//% weight=100 color=#0fbc11 icon="?"
namespace Joystick {
    
    //% block   
    export let joyX: number;
    //% block
    export let joyY: number;

    let dead = 4;
    let x_min = 0;
    let x_max = 1023;
    let x_center = 522;
    let y_min = 0;
    let y_max = 1023;
    let y_center = 506;

    //% block
    export function joy_x(): number {
        let x = pins.analogReadPin(AnalogPin.P1);
        if ( x < x_center - dead ) {
            x = Math.map(x, x_min, x_center - dead, 0, 127);
        } else if ( x > x_center + dead ) {
            x = Math.map(x, x_center + dead, x_max, 129, 255);
        } else {
            x = 128;
        }
        return Math.round( x );
    }
    
    //% block
    export function joy_y(): number {
        let y = pins.analogReadPin(AnalogPin.P2);
        if ( y < y_center - dead ) {
            y = Math.map(y, y_min, y_center - dead, 0, 127);
        } else if ( y > y_center + dead ) {
            y = Math.map(y, y_center + dead, y_max, 129, 255);
        } else {
            y = 128;
        }
        return Math.round( y );
    }

    //% block
    export function joy_calibrate_center(n: number) : void {
        let x = 0;
        let y = 0;
        for(let i = 0; i < n; i++) {
            x += pins.analogReadPin(AnalogPin.P1);
            y += pins.analogReadPin(AnalogPin.P2);
            basic.pause(10);
        }
        x_center = x / n;
        y_center = y / n;
    }

    //% block
    export function joy_calibrate_range() : void {
       let x = pins.analogReadPin(AnalogPin.P1);
       let y = pins.analogReadPin(AnalogPin.P2);
    
        x_min = Math.min(x_min, x);
        y_min = Math.min(y_min, y);
        x_max = Math.max(x_max, x);
        y_max = Math.max(y_max, y);
    }

    //% block
    export function joy_calibrate() : void {
        x_center = 512;
        y_center = 512;
        x_min = 512;
        y_min = 512;
        x_max = 512;
        y_max = 512;

        // display ...
        basic.showString("Joy Calib");
        // 
        basic.clearScreen();
        led.plot(2, 2);
        joy_calibrate_center(100);
        while( !input.buttonIsPressed(Button.B) ) {
            basic.pause(100);
        }
        basic.pause(1000);
        // 
        basic.clearScreen();
        basic.showIcon(IconNames.Square);
        while( !input.buttonIsPressed(Button.B) ) {
            joy_calibrate_range();
        }
        basic.showIcon(IconNames.Yes);
        basic.pause(1000);
    }
}
